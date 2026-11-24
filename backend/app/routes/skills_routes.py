from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database.database import get_db
from app.models.models import Admin, Skill
from app.schemas.schemas import SkillCreate, SkillUpdate, SkillResponse, MessageResponse, ReorderRequest
from app.auth.auth import get_current_admin

router = APIRouter(tags=["Skills"])


@router.get("/api/skills", response_model=List[SkillResponse])
async def get_skills(
    category: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    query = select(Skill).order_by(Skill.display_order.asc(), Skill.id.asc())
    if category:
        query = query.where(Skill.category == category)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/api/admin/skills", response_model=SkillResponse, status_code=status.HTTP_201_CREATED)
async def create_skill(
    body: SkillCreate,
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    skill = Skill(**body.model_dump())
    db.add(skill)
    await db.commit()
    await db.refresh(skill)
    return skill


@router.put("/api/admin/skills/{skill_id}", response_model=SkillResponse)
async def update_skill(
    skill_id: int,
    body: SkillUpdate,
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    result = await db.execute(select(Skill).where(Skill.id == skill_id))
    skill = result.scalars().first()
    if not skill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found")

    update_data = body.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(skill, key, value)

    await db.commit()
    await db.refresh(skill)
    return skill


@router.delete("/api/admin/skills/{skill_id}", response_model=MessageResponse)
async def delete_skill(
    skill_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    result = await db.execute(select(Skill).where(Skill.id == skill_id))
    skill = result.scalars().first()
    if not skill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found")

    await db.delete(skill)
    await db.commit()
    return MessageResponse(message="Skill deleted successfully")


@router.post("/api/admin/skills/reorder", response_model=MessageResponse)
async def reorder_skills(
    body: ReorderRequest,
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    for item in body.items:
        result = await db.execute(select(Skill).where(Skill.id == item.id))
        skill = result.scalars().first()
        if skill:
            skill.display_order = item.order
    await db.commit()
    return MessageResponse(message="Skills reordered successfully")
