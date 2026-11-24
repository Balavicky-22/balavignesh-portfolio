from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database.database import get_db
from app.models.models import Admin, ContactMessage
from app.schemas.schemas import ContactMessageCreate, MessageResponse
from app.auth.auth import get_current_admin

router = APIRouter(tags=["Contact"])


def format_message(m: ContactMessage) -> dict:
    return {
        "id": m.id,
        "name": m.name,
        "email": m.email,
        "subject": m.subject,
        "message": m.message,
        "is_read": bool(m.is_read),
        "read": bool(m.is_read),  # alias for admin.js compatibility
        "created_at": m.created_at.isoformat() if m.created_at else None,
    }


class MessageStatusUpdate(BaseModel):
    is_read: Optional[bool] = None
    read: Optional[bool] = None


@router.post("/api/contact", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def submit_contact(body: ContactMessageCreate, db: AsyncSession = Depends(get_db)):
    msg = ContactMessage(
        name=body.name,
        email=body.email,
        subject=body.subject,
        message=body.message,
    )
    db.add(msg)
    await db.commit()
    return MessageResponse(message="Message received successfully! Thank you for reaching out.")


@router.get("/api/admin/messages")
async def get_messages(
    limit: Optional[int] = Query(None),
    unread_only: bool = Query(False),
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    query = select(ContactMessage).order_by(ContactMessage.created_at.desc())
    if unread_only:
        query = query.where(ContactMessage.is_read == False)
    if limit:
        query = query.limit(limit)

    result = await db.execute(query)
    messages = result.scalars().all()
    return [format_message(m) for m in messages]


@router.get("/api/admin/messages/{msg_id}")
async def get_message(
    msg_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    result = await db.execute(select(ContactMessage).where(ContactMessage.id == msg_id))
    m = result.scalars().first()
    if not m:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    return format_message(m)


@router.patch("/api/admin/messages/{msg_id}")
async def update_message_status(
    msg_id: int,
    body: MessageStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    result = await db.execute(select(ContactMessage).where(ContactMessage.id == msg_id))
    m = result.scalars().first()
    if not m:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")

    new_val = body.is_read if body.is_read is not None else body.read
    if new_val is not None:
        m.is_read = new_val

    await db.commit()
    await db.refresh(m)
    return format_message(m)


@router.delete("/api/admin/messages/{msg_id}", response_model=MessageResponse)
async def delete_message(
    msg_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    result = await db.execute(select(ContactMessage).where(ContactMessage.id == msg_id))
    m = result.scalars().first()
    if not m:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")

    await db.delete(m)
    await db.commit()
    return MessageResponse(message="Message deleted successfully")
