import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.utils.utils import settings
from app.database.database import init_db

# Import all route modules
from app.routes.auth_routes import router as auth_router
from app.routes.profile_routes import router as profile_router
from app.routes.education_routes import router as education_router
from app.routes.skills_routes import router as skills_router
from app.routes.projects_routes import router as projects_router
from app.routes.certifications_routes import router as certifications_router
from app.routes.resume_routes import router as resume_router
from app.routes.social_routes import router as social_router
from app.routes.contact_routes import router as contact_router
from app.routes.media_routes import router as media_router
from app.routes.stats_routes import router as stats_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure upload subfolders exist
    for sub in ["profiles", "certificates", "projects", "resumes", "general"]:
        os.makedirs(os.path.join(settings.UPLOAD_DIR, sub), exist_ok=True)

    # Initialize and seed database
    await init_db()
    yield


app = FastAPI(
    title="Balavignesh B | Portfolio & Admin Management API",
    description="Production REST API powering the AI & Data Science Portfolio and Admin Panel",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS setup
origins = settings.CORS_ORIGINS if settings.CORS_ORIGINS else []
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ] + [o for o in origins if o != "*"],
    allow_origin_regex=r"^https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads directory for serving uploaded media
upload_dir = os.path.abspath(settings.UPLOAD_DIR)
os.makedirs(upload_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=upload_dir), name="uploads")


# Health check
@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "online",
        "service": "Balavignesh B Portfolio API",
        "version": "1.0.0",
        "identity": "AI & Data Science Enthusiast | Data Scientist Aspirant"
    }


# Include routers
app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(education_router)
app.include_router(skills_router)
app.include_router(projects_router)
app.include_router(certifications_router)
app.include_router(resume_router)
app.include_router(social_router)
app.include_router(contact_router)
app.include_router(media_router)
app.include_router(stats_router)
