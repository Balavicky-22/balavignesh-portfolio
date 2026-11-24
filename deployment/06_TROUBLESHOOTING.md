# Production Troubleshooting & Maintenance

Common questions, cold-start handling, password resets, and operational tips.

---

### 1. Render Free Tier Spin-Down (Cold Start)
- **Symptom**: On the free tier, if no requests have been made for 15 minutes, Render spins down the backend. The first request may take 30–50 seconds to warm up.
- **How our system handles this**:
  - The Public Portfolio uses graceful fallback: all verified projects, skills, education, and certificates render statically with 100% fidelity even if the backend is waking up!
  - The contact form displays a helpful notice if submission takes longer than usual.
- **Tip**: You can use a free uptime monitor (like UptimeRobot or Cron-job.org) to ping `https://balavignesh-portfolio-api.onrender.com/health` every 10 minutes to keep it awake during waking hours.

---

### 2. "CORS Error" in Browser Console
- **Symptom**: `Access to fetch at ... has been blocked by CORS policy`.
- **Solution**:
  1. Go to your Render Web Service dashboard.
  2. Under **Environment**, ensure `CORS_ORIGINS` is set to `*` or includes your exact Vercel frontend domains (e.g. `https://balavignesh.vercel.app,https://balavignesh-admin.vercel.app`).
  3. Save and redeploy.

---

### 3. Forgot Admin Password / Password Reset
- **How to reset password in local SQLite**:
  ```powershell
  cd portfolio-system/backend
  .\venv\Scripts\Activate.ps1
  python -c "import sqlite3, bcrypt; conn = sqlite3.connect('portfolio.db'); cur = conn.cursor(); hash_pwd = bcrypt.hashpw(b'NewPassword@2026', bcrypt.gensalt()).decode(); cur.execute('UPDATE admins SET hashed_password = ? WHERE email = ?', (hash_pwd, 'admin@balavignesh.dev')); conn.commit(); print('Password reset!')"
  ```
- **How to change password in the Admin Panel**:
  - Log in, navigate to **Settings** (`settings.html`), enter your current password, type your new password, and click **Update Password**.

---

### 4. Uploaded Files Disappear on Redeploy
- **Cause**: Render free tier Web Services have ephemeral filesystems.
- **Solution**:
  1. Attach a **Persistent Disk** on Render mounted at `/opt/render/project/src/uploads` with 1 GB storage.
  2. Alternatively, keep core project and certificate scans in `public-portfolio/assets/images/certs/`, which are committed to Git and permanently served by Vercel's global CDN!

---

### 5. Custom Domain Setup
- **Public Portfolio on Vercel**:
  Go to Vercel Project > **Settings** > **Domains** > Enter `balavignesh.dev` or `balavignesh.in`. Vercel provides free automatic SSL certificates.
- **Admin Panel on Vercel**:
  Set domain as `admin.balavignesh.dev`.
- **API on Render**:
  Go to Render Web Service > **Settings** > **Custom Domains** > Enter `api.balavignesh.dev`.
