import json
from typing import List, Optional, Any, Union
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database.database import get_db
from app.models.models import Admin, Project
from app.schemas.schemas import MessageResponse, ReorderRequest
from app.auth.auth import get_current_admin

router = APIRouter(tags=["Projects"])


def format_project(p: Project) -> dict:
    techs = []
    if p.technologies:
        try:
            parsed = json.loads(p.technologies)
            if isinstance(parsed, list):
                techs = parsed
            elif isinstance(parsed, str):
                techs = [s.strip() for s in parsed.split(",") if s.strip()]
        except Exception:
            techs = [s.strip() for s in p.technologies.split(",") if s.strip()]

    return {
        "id": p.id,
        "title": p.title,
        "name": p.title,  # alias for admin.js compatibility
        "description": p.description,
        "brief": p.brief,
        "problem": p.problem,
        "approach": p.approach,
        "result": p.result,
        "technologies": techs,
        "category": p.category,
        "live_url": p.live_url,
        "github_url": p.github_url,
        "thumbnail_url": p.thumbnail_url,
        "is_featured": bool(p.is_featured),
        "featured": bool(p.is_featured),  # alias for admin.js compatibility
        "display_order": p.display_order,
        "created_at": p.created_at.isoformat() if p.created_at else None,
        "updated_at": p.updated_at.isoformat() if p.updated_at else None,
    }


class ProjectPayload(BaseModel):
    title: Optional[str] = None
    name: Optional[str] = None  # alias
    description: Optional[str] = None
    brief: Optional[str] = None
    problem: Optional[str] = None
    approach: Optional[str] = None
    result: Optional[str] = None
    technologies: Optional[Union[List[str], str]] = None
    category: Optional[str] = None
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    is_featured: Optional[bool] = None
    featured: Optional[bool] = None  # alias
    display_order: Optional[int] = None


@router.get("/api/projects")
async def get_projects(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Project).order_by(Project.display_order.asc(), Project.id.asc())
    )
    projects = result.scalars().all()
    return [format_project(p) for p in projects]


@router.get("/api/projects/{project_id}")
async def get_project(project_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).where(Project.id == project_id))
    p = result.scalars().first()
    if not p:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return format_project(p)


@router.get("/api/admin/projects/{project_id}")
async def get_admin_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    result = await db.execute(select(Project).where(Project.id == project_id))
    p = result.scalars().first()
    if not p:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return format_project(p)


@router.post("/api/admin/projects", status_code=status.HTTP_201_CREATED)
async def create_project(
    body: ProjectPayload,
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    title = body.title or body.name
    if not title:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Project title/name is required")

    tech_str = None
    if body.technologies is not None:
        if isinstance(body.technologies, list):
            tech_str = json.dumps(body.technologies)
        else:
            tech_str = json.dumps([s.strip() for s in body.technologies.split(",") if s.strip()])

    is_feat = body.is_featured if body.is_featured is not None else (body.featured or False)

    project = Project(
        title=title,
        description=body.description,
        brief=body.brief,
        problem=body.problem,
        approach=body.approach,
        result=body.result,
        technologies=tech_str,
        category=body.category,
        live_url=body.live_url,
        github_url=body.github_url,
        thumbnail_url=body.thumbnail_url,
        is_featured=is_feat,
        display_order=body.display_order or 0,
    )
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return format_project(project)


@router.put("/api/admin/projects/{project_id}")
async def update_project(
    project_id: int,
    body: ProjectPayload,
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    if body.title is not None:
        project.title = body.title
    elif body.name is not None:
        project.title = body.name

    if body.description is not None:
        project.description = body.description
    if body.brief is not None:
        project.brief = body.brief
    if body.problem is not None:
        project.problem = body.problem
    if body.approach is not None:
        project.approach = body.approach
    if body.result is not None:
        project.result = body.result

    if body.technologies is not None:
        if isinstance(body.technologies, list):
            project.technologies = json.dumps(body.technologies)
        else:
            project.technologies = json.dumps([s.strip() for s in body.technologies.split(",") if s.strip()])

    if body.category is not None:
        project.category = body.category
    if body.live_url is not None:
        project.live_url = body.live_url
    if body.github_url is not None:
        project.github_url = body.github_url
    if body.thumbnail_url is not None:
        project.thumbnail_url = body.thumbnail_url

    if body.is_featured is not None:
        project.is_featured = body.is_featured
    elif body.featured is not None:
        project.is_featured = body.featured

    if body.display_order is not None:
        project.display_order = body.display_order

    await db.commit()
    await db.refresh(project)
    return format_project(project)


@router.delete("/api/admin/projects/{project_id}", response_model=MessageResponse)
async def delete_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    await db.delete(project)
    await db.commit()
    return MessageResponse(message="Project deleted successfully")
