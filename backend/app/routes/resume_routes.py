from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from app.database.database import get_db
from app.models.models import Admin, Resume
from app.schemas.schemas import ResumeResponse, PublicResumeResponse, MessageResponse
from app.auth.auth import get_current_admin
from app.services.file_service import save_file, delete_file

router = APIRouter(tags=["Resume"])


@router.get("/api/resume", response_model=PublicResumeResponse)
async def get_active_resume(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Resume).where(Resume.is_active == True))
    active_resume = result.scalars().first()
    if not active_resume:
        # Fallback to default
        return PublicResumeResponse(
            url="assets/resume/Balavignesh_Resume.pdf",
            filename="Balavignesh_Resume.pdf"
        )
    return PublicResumeResponse(url=active_resume.url, filename=active_resume.filename)


@router.get("/api/admin/resumes", response_model=List[ResumeResponse])
async def get_all_resumes(
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    result = await db.execute(select(Resume).order_by(Resume.uploaded_at.desc()))
    return result.scalars().all()


@router.post("/api/admin/resume/upload", response_model=ResumeResponse)
async def upload_resume(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    url = await save_file(file, "resumes")

    # Unset other active resumes
    await db.execute(update(Resume).values(is_active=False))

    resume = Resume(
        filename=file.filename or "resume.pdf",
        url=url,
        is_active=True,
    )
    db.add(resume)
    await db.commit()
    await db.refresh(resume)
    return resume


@router.put("/api/admin/resume/{resume_id}/set-active", response_model=ResumeResponse)
async def set_active_resume(
    resume_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    result = await db.execute(select(Resume).where(Resume.id == resume_id))
    resume = result.scalars().first()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

    await db.execute(update(Resume).values(is_active=False))
    resume.is_active = True
    await db.commit()
    await db.refresh(resume)
    return resume


@router.delete("/api/admin/resume/{resume_id}", response_model=MessageResponse)
async def delete_resume(
    resume_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    result = await db.execute(select(Resume).where(Resume.id == resume_id))
    resume = result.scalars().first()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

    delete_file(resume.url)
    await db.delete(resume)
    await db.commit()
    return MessageResponse(message="Resume deleted successfully")
