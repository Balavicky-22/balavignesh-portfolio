from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database.database import get_db
from app.models.models import Admin, Media
from app.schemas.schemas import MediaResponse, MessageResponse
from app.auth.auth import get_current_admin
from app.services.file_service import save_file, delete_file

router = APIRouter(tags=["Media"])


@router.get("/api/admin/media", response_model=List[MediaResponse])
async def get_all_media(
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    result = await db.execute(select(Media).order_by(Media.uploaded_at.desc()))
    return result.scalars().all()


@router.post("/api/admin/media/upload", response_model=MediaResponse)
async def upload_media(
    file: UploadFile = File(...),
    subfolder: Optional[str] = Form("general"),
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    valid_folders = {"profiles", "certificates", "projects", "resumes", "general"}
    folder = subfolder if subfolder in valid_folders else "general"

    url = await save_file(file, folder)
    media = Media(
        filename=file.filename or "media",
        url=url,
        media_type=file.content_type,
    )
    db.add(media)
    await db.commit()
    await db.refresh(media)
    return media


@router.delete("/api/admin/media/{media_id}", response_model=MessageResponse)
async def delete_media(
    media_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    result = await db.execute(select(Media).where(Media.id == media_id))
    media = result.scalars().first()
    if not media:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Media not found")

    delete_file(media.url)
    await db.delete(media)
    await db.commit()
    return MessageResponse(message="Media deleted successfully")
