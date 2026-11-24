# Deploying Admin Panel to Vercel (Completely Separate Project)

The Admin Panel must remain a **completely independent project** hosted on its own standalone URL.

---

## 📌 Architecture
- **Directory to deploy**: `portfolio-system/admin-panel/`
- **Output**: Independent SaaS Admin Dashboard
- **Security**: Protected with JWT token authentication, bcrypt passwords, and no public registration.

---

## Method A: Deploy via Vercel Web Dashboard (Recommended)

1. **Open Vercel Dashboard**:
   - Go to [https://vercel.com](https://vercel.com).

2. **Add a Second Independent Project**:
   - Click **"Add New..."** > **"Project"**.
   - Select the **same GitHub repository**.

3. **Configure Settings for the Admin Panel**:
   - **Project Name**: `balavignesh-admin` (e.g., `https://balavignesh-admin.vercel.app`)
   - **Framework Preset**: Select **"Other"**.
   - **Root Directory**: Click **Edit** and choose `admin-panel` (or `portfolio-system/admin-panel`).
   - **Build and Output Settings**: Leave blank.

4. **Deploy**:
   - Click **"Deploy"**.
   - Within 20 seconds, your Admin Dashboard is live at: `https://balavignesh-admin.vercel.app`!

---

## Method B: Deploy via Vercel CLI

```bash
# Navigate to the admin panel directory
cd portfolio-system/admin-panel

# Deploy to a new separate project
npx vercel --prod
```

Select:
- Project name: `balavignesh-admin`
- Directory location: `./`

---

## How the Admin Panel Connects to the Backend

1. **Automatic Routing**:
   - In `admin-panel/assets/js/config.js`, the default production URL is `https://balavignesh-portfolio-api.onrender.com`.
2. **Dynamic UI Setting**:
   - When you log in to the Admin Panel, go to **Settings** (`settings.html`).
   - You will see the **Backend REST API Configuration** card.
   - Enter your deployed Render API URL and click **"Test Health"** then **"Save API URL"**.
   - It will immediately connect to your live backend without needing any redeployment!
