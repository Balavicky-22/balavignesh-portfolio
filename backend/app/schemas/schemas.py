from __future__ import annotations
from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, EmailStr, field_validator


# ─────────────────────────── Auth ────────────────────────────

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AdminResponse(BaseModel):
    id: int
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ─────────────────────────── Profile ────────────────────────────

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    headline: Optional[str] = None
    location: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    about_text: Optional[str] = None
    profile_image_url: Optional[str] = None


class ProfileResponse(BaseModel):
    id: int
    full_name: str
    headline: Optional[str] = None
    location: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    about_text: Optional[str] = None
    profile_image_url: Optional[str] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ─────────────────────────── Education ────────────────────────────

class EducationCreate(BaseModel):
    institution: str
    degree: str
    field: Optional[str] = None
    start_year: int
    end_year: Optional[int] = None
    score: Optional[str] = None
    score_type: Optional[str] = "cgpa"
    description: Optional[str] = None
    display_order: Optional[int] = 0


class EducationUpdate(BaseModel):
    institution: Optional[str] = None
    degree: Optional[str] = None
    field: Optional[str] = None
    start_year: Optional[int] = None
    end_year: Optional[int] = None
    score: Optional[str] = None
    score_type: Optional[str] = None
    description: Optional[str] = None
    display_order: Optional[int] = None


class EducationResponse(BaseModel):
    id: int
    institution: str
    degree: str
    field: Optional[str] = None
    start_year: int
    end_year: Optional[int] = None
    score: Optional[str] = None
    score_type: Optional[str] = None
    description: Optional[str] = None
    display_order: int
    created_at: datetime

    model_config = {"from_attributes": True}


# ─────────────────────────── Skill ────────────────────────────

class SkillCreate(BaseModel):
    category: str
    name: str
    display_order: Optional[int] = 0


class SkillUpdate(BaseModel):
    category: Optional[str] = None
    name: Optional[str] = None
    display_order: Optional[int] = None


class SkillResponse(BaseModel):
    id: int
    category: str
    name: str
    display_order: int
    created_at: datetime

    model_config = {"from_attributes": True}


class SkillGroupResponse(BaseModel):
    category: str
    skills: List[SkillResponse]


# ─────────────────────────── Project ────────────────────────────

class ProjectCreate(BaseModel):
    title: str
    description: Optional[str] = None
    brief: Optional[str] = None
    problem: Optional[str] = None
    approach: Optional[str] = None
    result: Optional[str] = None
    technologies: Optional[str] = None  # JSON string
    category: Optional[str] = None
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    is_featured: Optional[bool] = False
    display_order: Optional[int] = 0


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    brief: Optional[str] = None
    problem: Optional[str] = None
    approach: Optional[str] = None
    result: Optional[str] = None
    technologies: Optional[str] = None
    category: Optional[str] = None
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    is_featured: Optional[bool] = None
    display_order: Optional[int] = None


class ProjectResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    brief: Optional[str] = None
    problem: Optional[str] = None
    approach: Optional[str] = None
    result: Optional[str] = None
    technologies: Optional[str] = None
    category: Optional[str] = None
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    is_featured: bool
    display_order: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ─────────────────────────── Certification ────────────────────────────

class CertificationCreate(BaseModel):
    title: str
    organization: str
    date_obtained: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    display_order: Optional[int] = 0


class CertificationUpdate(BaseModel):
    title: Optional[str] = None
    organization: Optional[str] = None
    date_obtained: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    display_order: Optional[int] = None


class CertificationResponse(BaseModel):
    id: int
    title: str
    organization: str
    date_obtained: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    display_order: int
    created_at: datetime

    model_config = {"from_attributes": True}


class ReorderItem(BaseModel):
    id: int
    order: int


class ReorderRequest(BaseModel):
    items: List[ReorderItem]


# ─────────────────────────── Resume ────────────────────────────

class ResumeResponse(BaseModel):
    id: int
    filename: str
    url: str
    is_active: bool
    uploaded_at: datetime

    model_config = {"from_attributes": True}


class PublicResumeResponse(BaseModel):
    url: str
    filename: str

    model_config = {"from_attributes": True}


# ─────────────────────────── Social Link ────────────────────────────

class SocialLinkCreate(BaseModel):
    platform: str
    url: str
    icon: Optional[str] = None
    display_order: Optional[int] = 0


class SocialLinkUpdate(BaseModel):
    platform: Optional[str] = None
    url: Optional[str] = None
    icon: Optional[str] = None
    display_order: Optional[int] = None


class SocialLinkResponse(BaseModel):
    id: int
    platform: str
    url: str
    icon: Optional[str] = None
    display_order: int

    model_config = {"from_attributes": True}


class BulkSocialLinkUpdate(BaseModel):
    links: List[SocialLinkCreate]


# ─────────────────────────── Contact Message ────────────────────────────

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: Optional[str] = None
    message: str


class ContactMessageResponse(BaseModel):
    id: int
    name: str
    email: str
    subject: Optional[str] = None
    message: str
    is_read: bool
    created_at: datetime

    model_config = {"from_attributes": True}


# ─────────────────────────── Media ────────────────────────────

class MediaResponse(BaseModel):
    id: int
    filename: str
    url: str
    media_type: Optional[str] = None
    uploaded_at: datetime

    model_config = {"from_attributes": True}


# ─────────────────────────── Dashboard ────────────────────────────

class DashboardStats(BaseModel):
    projects_count: int
    skills_count: int
    certs_count: int
    messages_count: int
    unread_messages_count: int
    recent_messages: List[ContactMessageResponse]


# ─────────────────────────── Generic ────────────────────────────

class MessageResponse(BaseModel):
    message: str
