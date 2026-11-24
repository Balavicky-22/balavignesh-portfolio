from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database.database import get_db
from app.models.models import Admin, Certification
from app.schemas.schemas import MessageResponse, ReorderRequest
from app.auth.auth import get_current_admin
from app.services.file_service import save_file, delete_file

router = APIRouter(tags=["Certifications"])


class CertificationPayload(BaseModel):
    title: Optional[str] = None
    organization: Optional[str] = None
    date: Optional[str] = None  # alias
    date_obtained: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    display_order: Optional[int] = None


def format_cert(c: Certification) -> dict:
    return {
        "id": c.id,
        "title": c.title,
        "organization": c.organization,
        "date": c.date_obtained,
        "date_obtained": c.date_obtained,
        "description": c.description,
        "image_url": c.image_url,
        "display_order": c.display_order,
        "created_at": c.created_at.isoformat() if c.created_at else None,
    }


@router.get("/api/certifications")
async def get_certifications(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Certification).order_by(Certification.display_order.asc(), Certification.id.asc())
    )
    certs = result.scalars().all()
    return [format_cert(c) for c in certs]


@router.get("/api/admin/certifications/{cert_id}")
async def get_certification(
    cert_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    result = await db.execute(select(Certification).where(Certification.id == cert_id))
    c = result.scalars().first()
    if not c:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Certification not found")
    return format_cert(c)


@router.post("/api/admin/certifications", status_code=status.HTTP_201_CREATED)
async def create_certification(
    body: CertificationPayload,
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    if not body.title or not body.organization:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title and Organization are required"
        )

    cert_date = body.date_obtained if body.date_obtained is not None else body.date

    cert = Certification(
        title=body.title,
        organization=body.organization,
        date_obtained=cert_date,
        description=body.description,
        image_url=body.image_url,
        display_order=body.display_order or 0,
    )
    db.add(cert)
    await db.commit()
    await db.refresh(cert)
    return format_cert(cert)


@router.put("/api/admin/certifications/{cert_id}")
async def update_certification(
    cert_id: int,
    body: CertificationPayload,
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    result = await db.execute(select(Certification).where(Certification.id == cert_id))
    cert = result.scalars().first()
    if not cert:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Certification not found")

    if body.title is not None:
        cert.title = body.title
    if body.organization is not None:
        cert.organization = body.organization
    if body.date_obtained is not None:
        cert.date_obtained = body.date_obtained
    elif body.date is not None:
        cert.date_obtained = body.date
    if body.description is not None:
        cert.description = body.description
    if body.image_url is not None:
        cert.image_url = body.image_url
    if body.display_order is not None:
        cert.display_order = body.display_order

    await db.commit()
    await db.refresh(cert)
    return format_cert(cert)


@router.delete("/api/admin/certifications/{cert_id}", response_model=MessageResponse)
async def delete_certification(
    cert_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    result = await db.execute(select(Certification).where(Certification.id == cert_id))
    cert = result.scalars().first()
    if not cert:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Certification not found")

    if cert.image_url:
        delete_file(cert.image_url)

    await db.delete(cert)
    await db.commit()
    return MessageResponse(message="Certification deleted successfully")


@router.post("/api/admin/certifications/{cert_id}/image")
async def upload_cert_image(
    cert_id: int,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    result = await db.execute(select(Certification).where(Certification.id == cert_id))
    cert = result.scalars().first()
    if not cert:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Certification not found")

    if cert.image_url:
        delete_file(cert.image_url)

    url = await save_file(file, "certificates")
    cert.image_url = url
    await db.commit()
    await db.refresh(cert)
    return format_cert(cert)
