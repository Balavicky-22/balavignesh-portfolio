from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database.database import get_db
from app.models.models import Admin, Education
from app.schemas.schemas import EducationCreate, EducationUpdate, EducationResponse, MessageResponse
from app.auth.auth import get_current_admin

router = APIRouter(tags=["Education"])


@router.get("/api/education", response_model=List[EducationResponse])
async def get_education(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Education).order_by(Education.display_order.asc(), Education.id.asc())
    )
    return result.scalars().all()


@router.post("/api/admin/education", response_model=EducationResponse, status_code=status.HTTP_201_CREATED)
async def create_education(
    body: EducationCreate,
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    edu = Education(**body.model_dump())
    db.add(edu)
    await db.commit()
    await db.refresh(edu)
    return edu


@router.put("/api/admin/education/{edu_id}", response_model=EducationResponse)
async def update_education(
    edu_id: int,
    body: EducationUpdate,
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    result = await db.execute(select(Education).where(Education.id == edu_id))
    edu = result.scalars().first()
    if not edu:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Education entry not found")

    update_data = body.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(edu, key, value)

    await db.commit()
    await db.refresh(edu)
    return edu


@router.delete("/api/admin/education/{edu_id}", response_model=MessageResponse)
async def delete_education(
    edu_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    result = await db.execute(select(Education).where(Education.id == edu_id))
    edu = result.scalars().first()
    if not edu:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Education entry not found")

    await db.delete(edu)
    await db.commit()
    return MessageResponse(message="Education entry deleted successfully")
