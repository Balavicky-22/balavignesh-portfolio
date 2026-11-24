from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from app.database.database import get_db
from app.models.models import Admin, SocialLink
from app.schemas.schemas import (
    SocialLinkCreate, SocialLinkUpdate, SocialLinkResponse,
    BulkSocialLinkUpdate, MessageResponse
)
from app.auth.auth import get_current_admin

router = APIRouter(tags=["Social Links"])


@router.get("/api/social-links", response_model=List[SocialLinkResponse])
async def get_social_links(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(SocialLink).order_by(SocialLink.display_order.asc(), SocialLink.id.asc())
    )
    return result.scalars().all()


@router.post("/api/admin/social-links", response_model=SocialLinkResponse, status_code=status.HTTP_201_CREATED)
async def create_social_link(
    body: SocialLinkCreate,
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    link = SocialLink(**body.model_dump())
    db.add(link)
    await db.commit()
    await db.refresh(link)
    return link


@router.put("/api/admin/social-links/{link_id}", response_model=SocialLinkResponse)
async def update_social_link(
    link_id: int,
    body: SocialLinkUpdate,
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    result = await db.execute(select(SocialLink).where(SocialLink.id == link_id))
    link = result.scalars().first()
    if not link:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Social link not found")

    update_data = body.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(link, key, value)

    await db.commit()
    await db.refresh(link)
    return link


@router.put("/api/admin/social-links", response_model=List[SocialLinkResponse])
async def bulk_update_social_links(
    body: BulkSocialLinkUpdate,
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    # Clear existing and insert new
    await db.execute(delete(SocialLink))
    new_links = [SocialLink(**item.model_dump()) for item in body.links]
    db.add_all(new_links)
    await db.commit()

    result = await db.execute(
        select(SocialLink).order_by(SocialLink.display_order.asc(), SocialLink.id.asc())
    )
    return result.scalars().all()


@router.delete("/api/admin/social-links/{link_id}", response_model=MessageResponse)
async def delete_social_link(
    link_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    result = await db.execute(select(SocialLink).where(SocialLink.id == link_id))
    link = result.scalars().first()
    if not link:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Social link not found")

    await db.delete(link)
    await db.commit()
    return MessageResponse(message="Social link deleted successfully")
