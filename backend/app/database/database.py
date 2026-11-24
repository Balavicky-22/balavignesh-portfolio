import os
import json
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import select
from app.utils.utils import settings, BASE_DIR

# Determine database dialect & configure async engine
db_url = settings.DATABASE_URL.strip()

# Normalize PostgreSQL URLs (Render often provides postgres://)
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql+asyncpg://", 1)
elif db_url.startswith("postgresql://") and not db_url.startswith("postgresql+asyncpg://"):
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)
# Normalize SQLite URLs — resolve relative paths relative to BASE_DIR so it works anywhere
elif "sqlite" in db_url and ("./" in db_url or "portfolio.db" in db_url):
    clean_db_name = "portfolio.db"
    abs_db_path = os.path.join(BASE_DIR, clean_db_name).replace("\\", "/")
    db_url = f"sqlite+aiosqlite:///{abs_db_path}"
elif db_url.startswith("sqlite:///"):
    db_url = db_url.replace("sqlite:///", "sqlite+aiosqlite:///", 1)
elif db_url.startswith("sqlite://") and not db_url.startswith("sqlite+aiosqlite://"):
    db_url = db_url.replace("sqlite://", "sqlite+aiosqlite://", 1)

is_sqlite = "sqlite" in db_url

if is_sqlite:
    engine = create_async_engine(
        db_url,
        connect_args={"check_same_thread": False},
        echo=False,
    )
else:
    # Production PostgreSQL with asyncpg connection pooling & pre-ping
    engine = create_async_engine(
        db_url,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20,
        echo=False,
    )

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass


async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db():
    from app.models.models import (
        Admin, Profile, Education, Skill, Project, Certification, SocialLink, Resume
    )
    from app.auth.auth import hash_password

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # 1. Seed admin user
        result = await session.execute(select(Admin).where(Admin.email == settings.ADMIN_EMAIL))
        existing_admin = result.scalars().first()
        if not existing_admin:
            admin = Admin(
                email=settings.ADMIN_EMAIL,
                hashed_password=hash_password(settings.ADMIN_PASSWORD),
            )
            session.add(admin)

        # 2. Seed profile
        result = await session.execute(select(Profile))
        existing_profile = result.scalars().first()
        if not existing_profile:
            profile = Profile(
                full_name="Balavignesh B",
                headline="Aspiring AI & Machine Learning Engineer | AI & Data Science Enthusiast",
                location="Madurai, Tamil Nadu, India",
                email="balavicky3011@gmail.com",
                phone="+91 93459 30112",
                about_text=(
                    "Computer Science graduate passionate about Artificial Intelligence, "
                    "Data Science, Machine Learning, Deep Learning and Generative AI. "
                    "Focused on developing practical intelligent applications."
                ),
                profile_image_url="assets/images/profile.jpg"
            )
            session.add(profile)

        # 3. Seed education
        result = await session.execute(select(Education))
        existing_edu = result.scalars().first()
        if not existing_edu:
            edu1 = Education(
                institution="The American College, Madurai",
                degree="B.Sc. Computer Science",
                field="Computer Science",
                start_year=2023,
                end_year=2026,
                score="6.6 / 10",
                score_type="cgpa",
                description="Undergraduate study in Computer Science focusing on programming, algorithms, data structures, and foundational AI. Graduation status: Completed.",
                display_order=1,
            )
            edu2 = Education(
                institution="Mangayarkarasi Higher Secondary School, Madurai",
                degree="Higher Secondary Education",
                field="Computer Science & Science",
                start_year=2019,
                end_year=2023,
                score="62.03%",
                score_type="percentage",
                description="Higher secondary education with a strong base in science and mathematics.",
                display_order=2,
            )
            session.add_all([edu1, edu2])

        # 4. Seed social links
        result = await session.execute(select(SocialLink))
        existing_social = result.scalars().first()
        if not existing_social:
            socials = [
                SocialLink(
                    platform="GitHub",
                    url="https://github.com/Balavicky-22",
                    icon="github",
                    display_order=1,
                ),
                SocialLink(
                    platform="LinkedIn",
                    url="https://www.linkedin.com/in/balavignesh-b-836274302/",
                    icon="linkedin",
                    display_order=2,
                ),
                SocialLink(
                    platform="Email",
                    url="mailto:balavicky3011@gmail.com",
                    icon="mail",
                    display_order=3,
                ),
            ]
            session.add_all(socials)

        # 5. Seed skills
        result = await session.execute(select(Skill))
        existing_skill = result.scalars().first()
        if not existing_skill:
            skill_data = [
                ("Programming", ["Python"]),
                ("Data Science", ["NumPy", "Pandas", "Data Cleaning", "Exploratory Data Analysis", "Data Visualization"]),
                ("Visualization", ["Matplotlib", "Seaborn"]),
                ("Machine Learning", [
                    "Machine Learning", "Supervised Learning", "Unsupervised Learning",
                    "Linear Regression", "Logistic Regression", "Decision Tree",
                    "K-Nearest Neighbors", "K-Means Clustering", "PCA",
                    "Model Evaluation", "Train-Test Split", "Feature Scaling",
                    "Confusion Matrix", "Reinforcement Learning"
                ]),
                ("Deep Learning", ["Artificial Neural Networks", "Convolutional Neural Networks", "Deep Learning"]),
                ("Computer Vision", ["OpenCV", "Image Processing", "Face Detection", "Object Detection", "Haar Cascade"]),
                ("NLP", ["NLP"]),
                ("Generative AI", ["LLMs", "LLM Fine-Tuning", "LangChain"]),
                ("Dev Tools", ["Git", "GitHub", "VS Code", "Jupyter Notebook"]),
                ("Deployment", ["Vercel", "Render"]),
            ]
            skill_entities = []
            order = 1
            for cat, items in skill_data:
                for item in items:
                    skill_entities.append(Skill(category=cat, name=item, display_order=order))
                    order += 1
            session.add_all(skill_entities)

        # 6. Seed projects
        result = await session.execute(select(Project))
        existing_proj = result.scalars().first()
        if not existing_proj:
            p1 = Project(
                title="Automatic Student Smart Attendance Using Computer Vision",
                category="Computer Vision",
                brief="An intelligent computer-vision-based attendance management application designed to automate student attendance tracking. The system combines face-based identification with a structured web interface for student management, attendance records and attendance calculation.",
                description="A complete end-to-end computer-vision attendance pipeline utilizing OpenCV Haar Cascade classifiers to identify enrolled students and automatically calculate attendance percentages with SQLite storage.",
                technologies=json.dumps(["Python", "Flask", "OpenCV", "LBPH", "NumPy", "SQLite", "HTML", "CSS", "JavaScript", "Bootstrap"]),
                live_url="https://smart-attendance-cquj.onrender.com/",
                github_url="https://github.com/Balavicky-22",
                problem="Manual attendance is time-consuming, error-prone, and difficult to manage at scale in academic institutions.",
                approach="Utilized OpenCV Haar Cascade classifiers for real-time face detection, matching against enrolled student datasets, and recording timestamps into SQLite.",
                result="Fully functional real-time attendance system featuring student management, logging, and percentage calculation through an accessible web interface.",
                is_featured=True,
                display_order=1,
            )
            p2 = Project(
                title="Madurai College AI",
                category="AI Assistant",
                brief="An AI-powered college information assistant designed for students exploring higher education in Madurai, Tamil Nadu. The system provides structured, factual, and localized answers about courses, departments, admissions, and facilities from a curated college knowledge base.",
                description="Interactive guidance platform built to assist aspiring students with factual details on colleges, faculties, admission criteria, and academic opportunities across Madurai.",
                technologies=json.dumps(["Python", "FastAPI", "REST API", "HTML", "CSS", "JavaScript", "JSON", "Uvicorn"]),
                live_url="https://madurai-college-ai.onrender.com/index.html",
                github_url="https://github.com/Balavicky-22",
                problem="Prospective students in Madurai often lack a centralized, accurate, and interactive source of information about local colleges, courses, and cutoffs.",
                approach="Built a responsive AI chat interface powered by a curated, grounded knowledge base containing structured data for Madurai institutions.",
                result="An intuitive, responsive web application offering conversational exploration and immediate answers for college seekers.",
                is_featured=True,
                display_order=2,
            )
            session.add_all([p1, p2])

        # 7. Seed certifications
        result = await session.execute(select(Certification))
        existing_cert = result.scalars().first()
        if not existing_cert:
            certs = [
                Certification(
                    title="From Code to Creation: Mastering Game Programming",
                    organization="HP / edX",
                    date_obtained="2024",
                    description="Completion certificate from HP and edX covering foundational game programming concepts, creative coding, and logic design.",
                    image_url="assets/images/certs/hp_edx.jpg",
                    display_order=1,
                ),
                Certification(
                    title="Python Training Program",
                    organization="Besant Technologies",
                    date_obtained="2024",
                    description="Certified completion of an intensive Python programming training program covering core Python syntax, OOP, and data handling.",
                    image_url="assets/images/certs/besant_python.jpg",
                    display_order=2,
                ),
                Certification(
                    title="Certificate of Internship",
                    organization="Besant Technologies",
                    date_obtained="2024",
                    description="Internship certificate recognizing practical Python-related software training and hands-on project experience gained at Besant Technologies.",
                    image_url="assets/images/certs/besant_internship.jpg",
                    display_order=3,
                ),
                Certification(
                    title="HP Employability Skills Training",
                    organization="HP",
                    date_obtained="2024",
                    description="Completion certificate from HP's Employability Skills Training program covering essential professional and AI-era workplace competencies.",
                    image_url="assets/images/certs/hp_skills.jpg",
                    display_order=4,
                ),
                Certification(
                    title="Tech Harvest 2026 — EAPL Season 2",
                    organization="Elysium Academy",
                    date_obtained="2024",
                    description="Technical event participation certificate from Tech Harvest 2026 organized by Elysium Academy, showcasing technical skills.",
                    image_url="assets/images/certs/elysium_tech_harvest.jpg",
                    display_order=5,
                ),
                Certification(
                    title="AI With DataScience Course Completion Certificate",
                    organization="Elysium Academy",
                    date_obtained="Jun 2026 – Aug 2026",
                    description="Course completion certificate awarded for completing the AI With DataScience program conducted by Elysium Academy from June 2026 to August 2026 with an Excellent performance rating.",
                    image_url="assets/images/certs/elysium_ai_ds.jpg",
                    display_order=6,
                ),
            ]
            session.add_all(certs)

        await session.commit()
