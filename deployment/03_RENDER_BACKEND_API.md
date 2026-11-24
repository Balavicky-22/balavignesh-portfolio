# Deploying FastAPI Backend to Render

This guide explains how to deploy the FastAPI backend to Render as an independent Web Service.

---

## 📌 Architecture
- **Service Type**: Render Web Service
- **Environment**: Python 3.12
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

---

## Step-by-Step Deployment on Render

### Step 1: Create a Render Account
1. Visit [https://render.com](https://render.com).
2. Sign up or log in using your GitHub account.

### Step 2: Create a New Web Service
1. Click **"New +"** in the top navigation bar.
2. Select **"Web Service"**.
3. Choose your GitHub repository (`portfolio-system`).
4. Click **"Connect"**.

### Step 3: Configure Service Parameters
Fill in the following exact settings:

| Field | Value |
| :--- | :--- |
| **Name** | `balavignesh-portfolio-api` |
| **Region** | Oregon (US West) or Frankfurt |
| **Branch** | `main` |
| **Root Directory** | `backend` (or `portfolio-system/backend`) |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | Free |

---

### Step 4: Add Environment Variables
Under the **Environment Variables** section, add the following key-value pairs:

```env
PYTHON_VERSION=3.12.0
SECRET_KEY=balavignesh-ai-portfolio-jwt-secret-key-2026-production-grade
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
ADMIN_EMAIL=admin@balavignesh.dev
ADMIN_PASSWORD=Balavignesh@2026
CORS_ORIGINS=*
UPLOAD_DIR=uploads
```

*(If you are connecting PostgreSQL, set `DATABASE_URL` as explained in `04_RENDER_POSTGRESQL.md`).*

---

### Step 5: Persistent Storage for Uploads (Optional but Recommended)
To preserve uploaded photos and certificate files across backend redeployments:
1. Under **Disks** in your Render Web Service settings, click **"Add Disk"**.
2. **Name**: `portfolio-uploads`
3. **Mount Path**: `/opt/render/project/src/uploads` (or `uploads`)
4. **Size**: `1 GB` (standard free/low cost)

---

### Step 6: Deploy
1. Click **"Create Web Service"**.
2. Render will build the environment, install dependencies, and start the FastAPI server.
3. Once finished, test your API at:
   - `https://balavignesh-portfolio-api.onrender.com/health`
   - `https://balavignesh-portfolio-api.onrender.com/docs`
