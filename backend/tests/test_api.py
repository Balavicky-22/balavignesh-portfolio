"""
Comprehensive Automated Test Suite for Balavignesh B Portfolio System
Tests:
- API health and routing
- Public data hydration endpoints
- Contact form message persistence
- Admin JWT authentication (valid & invalid credentials)
- Protected CRUD operations on database
- Static file serving
"""

import sys
import os
import asyncio
from httpx import AsyncClient, ASGITransport

# Add backend directory to path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)

from app.main import app
from app.utils.utils import settings
from app.database.database import init_db

async def run_tests():
    print("=" * 65)
    print("🧪 EXECUTING COMPREHENSIVE PORTFOLIO SYSTEM TEST SUITE")
    print("=" * 65)

    await init_db()

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:

        # Test 1: Health Check
        print("\n[TEST 1] Checking API Health Endpoint (/health)...")
        res = await client.get("/health")
        assert res.status_code == 200, f"Expected 200, got {res.status_code}"
        data = res.json()
        assert data.get("status") == "online"
        print(f"  ✓ Pass: API status is online (Version: {data.get('version')})")

        # Test 2: Public Profile Endpoint
        print("\n[TEST 2] Checking Public Profile Endpoint (/api/profile)...")
        res = await client.get("/api/profile")
        assert res.status_code == 200
        p = res.json()
        assert "Balavignesh" in p.get("full_name", "")
        print(f"  ✓ Pass: Loaded profile for {p.get('full_name')} - {p.get('headline')}")

        # Test 3: Public Projects Endpoint
        print("\n[TEST 3] Checking Public Projects Endpoint (/api/projects)...")
        res = await client.get("/api/projects")
        assert res.status_code == 200
        projs = res.json()
        assert len(projs) >= 2, "Expected at least 2 projects"
        for prj in projs:
            print(f"  ✓ Project verified: '{prj.get('title')}' ({prj.get('category')})")

        # Test 4: Public Certifications Endpoint
        print("\n[TEST 4] Checking Public Certifications Endpoint (/api/certifications)...")
        res = await client.get("/api/certifications")
        assert res.status_code == 200
        certs = res.json()
        assert len(certs) >= 6, f"Expected 6 certs, got {len(certs)}"
        print(f"  ✓ Pass: Found {len(certs)} verified certifications in database.")

        # Test 5: Public Education Endpoint
        print("\n[TEST 5] Checking Public Education Endpoint (/api/education)...")
        res = await client.get("/api/education")
        assert res.status_code == 200
        edus = res.json()
        assert len(edus) >= 2
        for edu in edus:
            assert "Pursuing" not in edu.get("description", "")
            print(f"  ✓ Education: {edu.get('degree')} at {edu.get('institution')} ({edu.get('score')})")

        # Test 6: Public Skills Endpoint
        print("\n[TEST 6] Checking Public Skills Endpoint (/api/skills)...")
        res = await client.get("/api/skills")
        assert res.status_code == 200
        skills = res.json()
        assert len(skills) >= 15
        print(f"  ✓ Pass: Loaded {len(skills)} verified technical skills.")

        # Test 7: Contact Message Submission
        print("\n[TEST 7] Testing Visitor Contact Submission (/api/contact)...")
        contact_payload = {
            "name": "Recruiter Test",
            "email": "recruiter@ai-tech.com",
            "subject": "Interview for AI Engineer Role",
            "message": "We reviewed your portfolio projects and would like to schedule an interview."
        }
        res = await client.post("/api/contact", json=contact_payload)
        assert res.status_code in [200, 201], f"Expected 200/201, got {res.status_code}"
        print("  ✓ Pass: Contact message submitted and saved to database.")

        # Test 8: Admin Authentication - Invalid Credentials Rejected
        print("\n[TEST 8] Testing Admin Login Security (Invalid Password)...")
        invalid_login = {"email": settings.ADMIN_EMAIL, "password": "WrongPassword123"}
        res = await client.post("/api/auth/login", json=invalid_login)
        assert res.status_code == 401, f"Expected 401, got {res.status_code}"
        print("  ✓ Pass: Unauthorized login attempt properly rejected with 401.")

        # Test 9: Admin Authentication - Valid Credentials
        print("\n[TEST 9] Testing Admin Login (Valid Credentials)...")
        valid_login = {"email": settings.ADMIN_EMAIL, "password": settings.ADMIN_PASSWORD}
        res = await client.post("/api/auth/login", json=valid_login)
        assert res.status_code == 200, f"Expected 200, got {res.status_code}"
        auth_data = res.json()
        token = auth_data.get("access_token")
        assert token, "No JWT access_token returned"
        print("  ✓ Pass: Valid login accepted; JWT Bearer token issued.")

        auth_headers = {"Authorization": f"Bearer {token}"}

        # Test 10: Admin Dashboard Stats
        print("\n[TEST 10] Testing Admin Protected Stats Endpoint (/api/admin/stats)...")
        res = await client.get("/api/admin/stats", headers=auth_headers)
        assert res.status_code == 200
        stats = res.json()
        print(f"  ✓ Pass: Stats retrieved: Projects={stats.get('projects')}, Skills={stats.get('skills')}, Certs={stats.get('certifications')}, Messages={stats.get('messages')}")

        # Test 11: Admin Messages Inbox & Verify Our Contact Message
        print("\n[TEST 11] Verifying Contact Message in Admin Inbox (/api/admin/messages)...")
        res = await client.get("/api/admin/messages", headers=auth_headers)
        assert res.status_code == 200
        messages = res.json()
        matching = [m for m in messages if m.get("email") == "recruiter@ai-tech.com"]
        assert len(matching) > 0, "Submitted contact message not found in inbox"
        msg_id = matching[0]["id"]
        print(f"  ✓ Pass: Found submitted contact message #{msg_id} in Admin Inbox.")

        # Test 12: Admin Mark Message as Read & Delete Test Message
        print("\n[TEST 12] Testing Admin Message Management (Mark Read & Delete)...")
        patch_res = await client.patch(f"/api/admin/messages/{msg_id}", json={"read": True}, headers=auth_headers)
        assert patch_res.status_code == 200
        del_res = await client.delete(f"/api/admin/messages/{msg_id}", headers=auth_headers)
        assert del_res.status_code == 200
        print("  ✓ Pass: Message marked as read and deleted cleanly.")

        # Test 13: Verify Static Files Mount
        print("\n[TEST 13] Testing Static File Serving (/uploads)...")
        res = await client.get("/uploads/profiles/profile.jpg")
        assert res.status_code in [200, 304], f"Status: {res.status_code}"
        print(f"  ✓ Pass: Static profile picture loaded successfully ({len(res.content)} bytes).")

    print("\n" + "=" * 65)
    print("🎉 ALL 13 TEST SUITES PASSED FLAWLESSLY WITH ZERO ERRORS!")
    print("=" * 65)

if __name__ == "__main__":
    asyncio.run(run_tests())
