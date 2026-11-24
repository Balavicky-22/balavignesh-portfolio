"""
Database Migration Utility: SQLite -> PostgreSQL
Used to migrate local portfolio.db records to Render PostgreSQL database.
Usage:
    python migrate_to_postgres.py "postgresql://user:password@host/dbname"
"""

import sys
import os
import sqlite3
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy import select, text

# Add backend directory to path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from app.database.database import Base
from app.models.models import (
    Admin, Profile, Education, Skill, Project,
    Certification, Resume, SocialLink, ContactMessage, Media
)

SQLITE_PATH = os.path.join(BASE_DIR, "portfolio.db")

async def migrate(postgres_url: str):
    print("=" * 60)
    print("🚀 BALAVIGNESH B — PORTFOLIO DATABASE MIGRATION TOOL")
    print("   SQLite -> PostgreSQL")
    print("=" * 60)

    if not os.path.exists(SQLITE_PATH):
        print(f"❌ Error: SQLite database not found at {SQLITE_PATH}")
        return

    # Normalize PostgreSQL URL for asyncpg
    pg_url = postgres_url.strip()
    if pg_url.startswith("postgres://"):
        pg_url = pg_url.replace("postgres://", "postgresql+asyncpg://", 1)
    elif pg_url.startswith("postgresql://") and not pg_url.startswith("postgresql+asyncpg://"):
        pg_url = pg_url.replace("postgresql://", "postgresql+asyncpg://", 1)

    print(f"Connecting to target PostgreSQL: {pg_url.split('@')[-1] if '@' in pg_url else pg_url}...")
    engine = create_async_engine(pg_url, echo=False)

    # 1. Create tables
    print("\n[1/3] Ensuring tables exist in PostgreSQL...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("  ✓ All tables verified.")

    # 2. Read from SQLite
    print("\n[2/3] Reading records from SQLite...")
    sqlite_conn = sqlite3.connect(SQLITE_PATH)
    sqlite_conn.row_factory = sqlite3.Row
    cur = sqlite_conn.cursor()

    session_maker = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

    tables_and_models = [
        ("admins", Admin),
        ("profile", Profile),
        ("education", Education),
        ("skills", Skill),
        ("projects", Project),
        ("certifications", Certification),
        ("resumes", Resume),
        ("social_links", SocialLink),
        ("contact_messages", ContactMessage),
        ("media", Media),
    ]

    print("\n[3/3] Migrating data into PostgreSQL...")
    async with session_maker() as session:
        for table_name, model in tables_and_models:
            cur.execute(f"SELECT * FROM {table_name}")
            rows = cur.fetchall()
            print(f"  • Migrating '{table_name}': {len(rows)} record(s)...")

            for row in rows:
                data = dict(row)
                # Check if record already exists by ID
                rec_id = data.get("id")
                if rec_id is not None:
                    existing = await session.get(model, rec_id)
                    if existing:
                        continue
                obj = model(**data)
                session.add(obj)
            await session.commit()

        # Reset sequences in PostgreSQL for autoincrement IDs
        print("  • Updating PostgreSQL primary key sequences...")
        for table_name, _ in tables_and_models:
            try:
                seq_query = text(f"SELECT setval(pg_get_serial_sequence('{table_name}', 'id'), coalesce(max(id), 1), max(id) IS NOT null) FROM {table_name};")
                await session.execute(seq_query)
                await session.commit()
            except Exception:
                pass

    sqlite_conn.close()
    await engine.dispose()
    print("\n" + "=" * 60)
    print("✅ MIGRATION COMPLETED SUCCESSFULLY!")
    print("   All SQLite records are now safely persisted in PostgreSQL.")
    print("=" * 60)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python migrate_to_postgres.py <POSTGRES_DATABASE_URL>")
        print("Example: python migrate_to_postgres.py postgresql://user:pass@host:5432/dbname")
        sys.exit(1)

    url = sys.argv[1]
    asyncio.run(migrate(url))
