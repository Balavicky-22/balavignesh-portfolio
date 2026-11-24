# Environment Configuration & CORS Guide

Understanding how the three independent components securely communicate in production.

---

## 🏛️ Communication Map

```
Vercel: Public Portfolio (balavignesh.vercel.app)
                  │
                  ▼  (REST API calls: /api/profile, /api/contact, /health)
Render: FastAPI Backend (balavignesh-portfolio-api.onrender.com)
                  ▲
                  │  (REST API calls with JWT Bearer Token: /api/admin/...)
Vercel: Admin Panel (balavignesh-admin.vercel.app)
```

---

## 🔐 Environment Variables Reference

### Backend API (Render)

| Variable | Description | Example / Recommended Value |
| :--- | :--- | :--- |
| `DATABASE_URL` | Database connection string | `postgresql+asyncpg://user:pass@host/db` or `sqlite+aiosqlite:///./portfolio.db` |
| `SECRET_KEY` | Secret key for JWT token signing | `random-32-char-string-in-production` |
| `ALGORITHM` | JWT hashing algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Session validity duration | `10080` (7 days) |
| `ADMIN_EMAIL` | Default admin email login | `admin@balavignesh.dev` |
| `ADMIN_PASSWORD` | Default admin password | `Balavignesh@2026` |
| `CORS_ORIGINS` | Allowed frontend domains | `https://balavignesh.vercel.app,https://balavignesh-admin.vercel.app,*` |
| `UPLOAD_DIR` | Directory for file uploads | `uploads` |

---

## 🌐 Dynamic API Discovery (`config.js`)

In static websites hosted on Vercel, there is no server-side Python runtime. Instead, our system utilizes a runtime discovery mechanism in `assets/js/config.js`:

1. **Localhost Mode**:
   When visiting `http://localhost:3000` or `http://localhost:5500`, it immediately points to `http://localhost:8000`.

2. **Production Mode**:
   When hosted on Vercel, it points to `https://balavignesh-portfolio-api.onrender.com`.

3. **Dynamic Override via Admin Settings**:
   The admin user can go to the **Settings** page in the Admin Dashboard, paste their new Render API URL, click **"Test Health"**, and click **"Save API URL"**. The preference is stored in `localStorage` under `portfolio_api_base` and immediately takes effect!
