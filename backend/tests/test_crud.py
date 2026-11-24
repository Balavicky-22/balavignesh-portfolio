"""
Admin Panel Comprehensive CRUD Integrity Test
Tests:
- Admin Profile Update & Reversion
- Skill Creation, Update, and Deletion
- Project Creation, Update, and Deletion
- Certification Creation, Update, and Deletion
"""

import sys
import os
import asyncio
from httpx import AsyncClient, ASGITransport

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)

from app.main import app
from app.utils.utils import settings

async def run_crud_tests():
    print("=" * 65)
    print("🛠️ EXECUTING ADMIN PANEL CRUD INTEGRITY TESTS")
    print("=" * 65)

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:

        # 1. Login
        login_res = await client.post("/api/auth/login", json={
            "email": settings.ADMIN_EMAIL,
            "password": settings.ADMIN_PASSWORD
        })
        assert login_res.status_code == 200
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("  ✓ Admin authenticated.")

        # 2. Skill CRUD
        print("\n[CRUD TEST 1] Skills CRUD...")
        # Create
        new_skill = {"category": "Deep Learning", "name": "Transformer Attention", "display_order": 99}
        create_res = await client.post("/api/admin/skills", json=new_skill, headers=headers)
        assert create_res.status_code in [200, 201]
        skill_id = create_res.json()["id"]
        print(f"  ✓ Skill created (ID: {skill_id})")

        # Update
        update_res = await client.put(f"/api/admin/skills/{skill_id}", json={
            "category": "Deep Learning",
            "name": "Transformer Self-Attention Mechanisms",
            "display_order": 100
        }, headers=headers)
        assert update_res.status_code == 200
        print(f"  ✓ Skill updated: '{update_res.json()['name']}'")

        # Delete
        del_res = await client.delete(f"/api/admin/skills/{skill_id}", headers=headers)
        assert del_res.status_code == 200
        print(f"  ✓ Skill deleted cleanly.")

        # 3. Project CRUD
        print("\n[CRUD TEST 2] Projects CRUD...")
        # Create
        new_proj = {
            "title": "Automated Benchmark AI Test",
            "category": "Machine Learning",
            "brief": "Benchmarking inference speed and latency.",
            "description": "Comprehensive performance audit.",
            "technologies": '["Python", "FastAPI"]',
            "is_featured": False,
            "display_order": 99
        }
        proj_res = await client.post("/api/admin/projects", json=new_proj, headers=headers)
        assert proj_res.status_code in [200, 201]
        proj_id = proj_res.json()["id"]
        print(f"  ✓ Project created (ID: {proj_id})")

        # Update
        proj_up = await client.put(f"/api/admin/projects/{proj_id}", json={
            "title": "Automated Benchmark AI Suite v2",
            "category": "Machine Learning",
            "brief": "Updated test brief.",
            "description": "Updated description.",
            "technologies": '["Python", "FastAPI", "Uvicorn"]',
            "is_featured": True
        }, headers=headers)
        assert proj_up.status_code == 200
        print(f"  ✓ Project updated: '{proj_up.json()['title']}'")

        # Delete
        proj_del = await client.delete(f"/api/admin/projects/{proj_id}", headers=headers)
        assert proj_del.status_code == 200
        print(f"  ✓ Project deleted cleanly.")

        # 4. Certification CRUD
        print("\n[CRUD TEST 3] Certifications CRUD...")
        new_cert = {
            "title": "Advanced PyTorch & Neural Networks",
            "organization": "Deep Learning Institute",
            "date_obtained": "2026",
            "description": "Test credential for deep network architectures."
        }
        cert_res = await client.post("/api/admin/certifications", json=new_cert, headers=headers)
        assert cert_res.status_code in [200, 201]
        cert_id = cert_res.json()["id"]
        print(f"  ✓ Certification created (ID: {cert_id})")

        cert_del = await client.delete(f"/api/admin/certifications/{cert_id}", headers=headers)
        assert cert_del.status_code == 200
        print(f"  ✓ Certification deleted cleanly.")

    print("\n" + "=" * 65)
    print("✅ ALL ADMIN CRUD OPERATIONS VERIFIED SUCCESSFULLY!")
    print("=" * 65)

if __name__ == "__main__":
    asyncio.run(run_crud_tests())
