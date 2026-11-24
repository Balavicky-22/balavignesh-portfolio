from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database.database import get_db
from app.models.models import Admin
from app.schemas.schemas import LoginRequest, TokenResponse, AdminResponse, MessageResponse
from app.auth.auth import verify_password, hash_password, create_access_token, get_current_admin

router = APIRouter(tags=["Auth"])


class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str


@router.post("/api/auth/login", response_model=TokenResponse)
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Admin).where(Admin.email == body.email))
    admin = result.scalars().first()

    if not admin or not verify_password(body.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(data={"sub": admin.email})
    return TokenResponse(access_token=token, token_type="bearer")


@router.post("/api/auth/logout", response_model=MessageResponse)
async def logout():
    return MessageResponse(message="Logged out successfully. Please clear your token on the client.")


@router.get("/api/auth/me", response_model=AdminResponse)
async def get_me(current_admin: Admin = Depends(get_current_admin)):
    return current_admin


@router.put("/api/admin/password", response_model=MessageResponse)
async def change_password(
    body: PasswordChangeRequest,
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    if not verify_password(body.current_password, current_admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )

    if len(body.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 6 characters long",
        )

    current_admin.hashed_password = hash_password(body.new_password)
    await db.commit()
    return MessageResponse(message="Password updated successfully")
