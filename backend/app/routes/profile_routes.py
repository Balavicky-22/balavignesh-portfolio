from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database.database import get_db
from app.models.models import Admin, Profile
from app.schemas.schemas import ProfileResponse, ProfileUpdate, MessageResponse
from app.auth.auth import get_current_admin
from app.services.file_service import save_file

router = APIRouter(tags=["Profile"])


@router.get("/api/profile", response_model=ProfileResponse)
async def get_profile(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Profile))
    profile = result.scalars().first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")
    return profile


@router.put("/api/admin/profile", response_model=ProfileResponse)
async def update_profile(
    body: ProfileUpdate,
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    result = await db.execute(select(Profile))
    profile = result.scalars().first()

    if not profile:
        # Create profile if it doesn't exist
        profile = Profile()
        db.add(profile)

    update_data = body.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(profile, key, value)

    await db.commit()
    await db.refresh(profile)
    return profile


@router.post("/api/admin/profile/image", response_model=ProfileResponse)
async def upload_profile_image(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    url = await save_file(file, "profile")

    result = await db.execute(select(Profile))
    profile = result.scalars().first()

    if not profile:
        profile = Profile()
        db.add(profile)

    profile.profile_image_url = url
    await db.commit()
    await db.refresh(profile)
    return profile
