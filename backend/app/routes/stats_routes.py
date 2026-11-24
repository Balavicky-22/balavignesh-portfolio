from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database.database import get_db
from app.models.models import Admin, Project, Skill, Certification, ContactMessage
from app.auth.auth import get_current_admin

router = APIRouter(tags=["Stats"])


@router.get("/api/admin/stats")
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    proj_res = await db.execute(select(func.count(Project.id)))
    skills_res = await db.execute(select(func.count(Skill.id)))
    certs_res = await db.execute(select(func.count(Certification.id)))
    msgs_res = await db.execute(select(func.count(ContactMessage.id)))
    unread_res = await db.execute(
        select(func.count(ContactMessage.id)).where(ContactMessage.is_read == False)
    )

    projects_count = proj_res.scalar() or 0
    skills_count = skills_res.scalar() or 0
    certs_count = certs_res.scalar() or 0
    messages_count = msgs_res.scalar() or 0
    unread_count = unread_res.scalar() or 0

    return {
        "projects": projects_count,
        "skills": skills_count,
        "certs": certs_count,
        "certifications": certs_count,
        "messages": messages_count,
        "unread_messages": unread_count,
        # Aliases for different naming conventions
        "projects_count": projects_count,
        "skills_count": skills_count,
        "certs_count": certs_count,
        "messages_count": messages_count,
        "unread_messages_count": unread_count,
    }
