# Balavignesh B — Premium AI & Data Science Portfolio System
### 2026 Production Edition · Multi-Tier Architecture

A complete, enterprise-grade personal portfolio system for **Balavignesh B** (*Aspiring AI & Machine Learning Engineer | AI & Data Science Enthusiast*), engineered with **two completely independent frontend applications** connected via a high-throughput asynchronous REST API with dual SQLite / PostgreSQL persistence.

---

## 🏛️ System Architecture

```
portfolio-system/
│
├── public-portfolio/           # APPLICATION 1: Premium AI & Data Science Portfolio
│   ├── index.html              # Main Landing Page (Hero, 3D Core, Bento Matrix, etc.)
│   ├── vercel.json             # Vercel Production Deployment Configuration
│   └── assets/
│       ├── css/main.css        # 2026 Deep charcoal & emerald/cyan design system
│       ├── js/config.js        # Runtime API discovery (Auto-switch localhost / Render)
│       ├── js/main.js          # Three.js 3D Neural Core, Bento Grid, Lightbox & Sync
│       ├── images/             # Profile photo and verified certificate scans
│       └── resume/             # Official PDF Resume
│
├── admin-panel/                # APPLICATION 2: Standalone SaaS Management Dashboard
│   ├── index.html              # Secure Admin Login with dynamic API switcher
│   ├── dashboard.html          # Analytics Overview, Metric Counters & System Health
│   ├── profile.html            # Profile & About Me Management with photo upload
│   ├── education.html          # Education Timeline CRUD
│   ├── skills.html             # Categorized AI Capability Matrix CRUD
│   ├── projects.html           # Project Case Studies CRUD & Tech Tagging
│   ├── certifications.html     # Verified Credentials CRUD & Certificate Uploader
│   ├── resume.html             # Active Resume PDF Management
│   ├── messages.html           # Visitor Contact Messages Inbox with Read/Unread
│   ├── social.html             # Social & Professional Links Management
│   ├── media.html              # Centralized Media & Document Asset Library
│   ├── settings.html           # Admin Password & Live Backend API Switcher
│   ├── vercel.json             # Vercel Independent Deployment Configuration
│   └── assets/
│       ├── css/admin.css       # Clean, modern dark SaaS dashboard styling
│       ├── js/config.js        # Runtime API configuration & media URL helper
│       └── js/admin.js         # API client, JWT session handling, Toast & Modal engine
│
├── backend/                    # SHARED BACKEND: Asynchronous FastAPI REST API
│   ├── requirements.txt        # Python dependencies (FastAPI, SQLAlchemy, asyncpg, etc.)
│   ├── render.yaml             # Render Blueprint for Web Service & PostgreSQL
│   ├── migrate_to_postgres.py  # One-click SQLite -> PostgreSQL migration utility
│   ├── .env                    # Local environment variables & JWT configuration
│   ├── .env.example            # Production template for environment configuration
│   ├── portfolio.db            # SQLite database (auto-created & seeded)
│   ├── uploads/                # Managed uploads (profiles, certificates, resumes)
│   └── app/
│       ├── main.py             # FastAPI entrypoint, CORS & static file mounts
│       ├── database/           # Async SQLAlchemy dual engine (SQLite & PostgreSQL)
│       ├── models/             # Database ORM models
│       ├── schemas/            # Pydantic v2 validation schemas
│       ├── auth/               # JWT token generation & bcrypt password hashing
│       ├── routes/             # RESTful modular route handlers
│       ├── services/           # File storage & validation services
│       └── utils/              # Settings & configuration management
│
├── deployment/                 # PRODUCTION DEPLOYMENT GUIDES
│   ├── 01_VERCEL_PUBLIC_PORTFOLIO.md
│   ├── 02_VERCEL_ADMIN_PANEL.md
│   ├── 03_RENDER_BACKEND_API.md
│   ├── 04_RENDER_POSTGRESQL.md
│   ├── 05_ENV_CONFIG_AND_CORS.md
│   └── 06_TROUBLESHOOTING.md
│
├── start-all.bat               # One-click Windows startup script (All 3 services)
├── start-backend.bat           # Dedicated backend API launcher
└── README.md                   # System documentation & quickstart
```

---

## ⚡ Quick Start (Local Development)

### The Fastest Way: One-Click Startup
Double-click `start-all.bat` in the root folder.
It automatically launches:
1. **Backend REST API** on `http://localhost:8000`
2. **Public Portfolio** on `http://localhost:3000`
3. **Admin Dashboard** on `http://localhost:5500`
4. Automatically opens your default web browser to both portals!

---

### Manual Step-by-Step Startup

#### 1. Launch the Backend API
```powershell
cd portfolio-system/backend
# Activate virtual environment
.\venv\Scripts\Activate.ps1
# Start FastAPI with Uvicorn
uvicorn app.main:app --reload --port 8000
```
- **API Base URL**: `http://localhost:8000`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`
- **API Health Check**: `http://localhost:8000/health`

#### 2. Launch the Public Portfolio
Serve the `public-portfolio/` folder using Python's built-in HTTP server:
```powershell
cd portfolio-system/public-portfolio
python -m http.server 3000
```
- Open in browser: `http://localhost:3000`

#### 3. Launch the Admin Panel
Serve the `admin-panel/` folder on its own independent port:
```powershell
cd portfolio-system/admin-panel
python -m http.server 5500
```
- Open in browser: `http://localhost:5500`

---

## 🔐 Default Admin Credentials

- **Email**: `admin@balavignesh.dev`
- **Password**: `Balavignesh@2026`

*(Admin credentials and passwords can be securely changed anytime via `Settings` in the Admin Dashboard).*

---

## 🚀 Easy Production Deployment

This project uses the exact recommended cloud deployment architecture:

| Component | Cloud Platform | Type | Configuration |
| :--- | :--- | :--- | :--- |
| **Public Portfolio** | **Vercel** | Static Web Application | `public-portfolio/vercel.json` |
| **Admin Panel** | **Vercel** | Standalone Static Dashboard | `admin-panel/vercel.json` |
| **Backend REST API** | **Render** | Python Web Service | `backend/render.yaml` |
| **Database** | **Render** | Managed Persistent PostgreSQL | Auto-migrated via `migrate_to_postgres.py` |

### Step 1: Deploy Backend API & PostgreSQL to Render
1. Push this project to your GitHub repository.
2. In Render ([https://render.com](https://render.com)), click **"New +"** > **"Web Service"** and select your repository.
3. Set **Root Directory** to `backend` (or `portfolio-system/backend`).
4. Set **Build Command**: `pip install -r requirements.txt`.
5. Set **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
6. Create a managed **PostgreSQL** database on Render and paste its connection URL into the `DATABASE_URL` environment variable of your Web Service.
7. Note down your live API URL (e.g. `https://balavignesh-portfolio-api.onrender.com`).

*(Optional)* Run `python migrate_to_postgres.py "<POSTGRES_URL>"` locally to transfer all SQLite records to PostgreSQL!

### Step 2: Deploy Public Portfolio to Vercel
1. In Vercel ([https://vercel.com](https://vercel.com)), click **"Add New..."** > **"Project"**.
2. Select your repository and choose `public-portfolio` as the **Root Directory**.
3. Framework Preset: **Other**.
4. Click **Deploy**. Your site is live!

### Step 3: Deploy Admin Panel to Vercel
1. In Vercel, click **"Add New..."** > **"Project"** again with the same repository.
2. Choose `admin-panel` as the **Root Directory**.
3. Framework Preset: **Other**.
4. Click **Deploy**. Your Admin Dashboard is live!

### Step 4: Configure Live Connection
- Log in to your live Admin Panel, go to **Settings**, paste your Render API URL into **Backend REST API Configuration**, click **Test Health**, and click **Save API URL**.
- Both portals will now communicate with your live Render backend and persistent PostgreSQL database!

For comprehensive walkthroughs, see the [`deployment/`](deployment/) folder:
- [01_VERCEL_PUBLIC_PORTFOLIO.md](deployment/01_VERCEL_PUBLIC_PORTFOLIO.md)
- [02_VERCEL_ADMIN_PANEL.md](deployment/02_VERCEL_ADMIN_PANEL.md)
- [03_RENDER_BACKEND_API.md](deployment/03_RENDER_BACKEND_API.md)
- [04_RENDER_POSTGRESQL.md](deployment/04_RENDER_POSTGRESQL.md)
- [05_ENV_CONFIG_AND_CORS.md](deployment/05_ENV_CONFIG_AND_CORS.md)
- [06_TROUBLESHOOTING.md](deployment/06_TROUBLESHOOTING.md)

---

## ✨ Upgraded 2026 Features & Highlights

### 1. Public Portfolio
- **3D Neural Intelligence Core**: Interactive Three.js particle network simulating mathematical layers, node pulses, synaptic signals, and cursor parallax.
- **AI Capability Matrix**: Modern Bento Grid layout categorizing verified skills across Python, Data Science, Machine Learning, Deep Learning, Computer Vision, NLP, and Generative AI.
- **Interactive Learning Journey**: Visual technology progression from Python through Generative AI.
- **Production Project Showcases**:
  1. *Automatic Student Smart Attendance Using Computer Vision* (OpenCV, Haar Cascade, LBPH, Flask, SQLite, Render).
  2. *Madurai College AI* (AI Information Assistant, Grounded Knowledge Base, FastAPI, REST API, Render).
- **Certificate Lightbox**: High-resolution, uncropped credential modal with verified certificates from Elysium Academy, HP/ICT Academy, HP/edX, and Besant Technologies.
- **Education Section**: Verified B.Sc. Computer Science degree from The American College, Madurai (2023–2026, CGPA: 6.6 / 10, Status: Completed).
- **Interactive Resume**: Embedded document preview, direct PDF download, and open-in-tab actions.
- **Connected Contact Engine**: Validated visitor contact submissions stored directly in the database.

### 2. Standalone SaaS Admin Panel
- **100% Separate Application**: Standalone deployment with dedicated UI and workflows.
- **Secure Authentication**: JWT bearer tokens with bcrypt password hashing.
- **Complete CRUD Suite**:
  - Profile & headline management with photo uploader.
  - Education history management.
  - Skills matrix customization.
  - Project case study editor with live URL management.
  - Certificate manager with image attachments.
  - PDF Resume management.
  - Real-time visitor message inbox with read/unread flags.
  - Centralized media asset manager with instant URL copying.
  - Live backend API switcher and health monitor.
