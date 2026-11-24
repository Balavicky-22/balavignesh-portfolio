# Deploying Public Portfolio to Vercel

Follow these exact steps to deploy the `public-portfolio/` folder as a high-speed static website on Vercel.

---

## 📌 Architecture
- **Directory to deploy**: `portfolio-system/public-portfolio/`
- **Output**: Pure static web application (HTML5, CSS3, JavaScript, Three.js)
- **Free Tier Available**: Yes (Vercel Hobby plan is 100% free)

---

## Method A: Deploy via Vercel Web Dashboard (Recommended)

1. **Push your code to GitHub**:
   - Push your portfolio repository to your GitHub account (e.g., `https://github.com/Balavicky-22/portfolio-system`).

2. **Open Vercel**:
   - Go to [https://vercel.com](https://vercel.com) and log in with GitHub.

3. **Import Project**:
   - Click **"Add New..."** > **"Project"**.
   - Select your repository from the list.

4. **Configure Project Settings**:
   - **Project Name**: `balavignesh-portfolio` (or your choice)
   - **Framework Preset**: Select **"Other"**.
   - **Root Directory**: Click **Edit** and choose `public-portfolio` (or `portfolio-system/public-portfolio`).
   - **Build and Output Settings**: Leave blank (no build step needed).

5. **Deploy**:
   - Click **"Deploy"**.
   - Within 15-30 seconds, your site is live at: `https://balavignesh-portfolio.vercel.app`!

---

## Method B: Deploy via Vercel CLI

If you have Node.js and the Vercel CLI installed:

```bash
# Navigate to the public portfolio directory
cd portfolio-system/public-portfolio

# Log in to Vercel
npx vercel login

# Deploy to production
npx vercel --prod
```

Select:
- Set up and deploy: **Yes**
- Link to existing project: **No**
- Project name: `balavignesh-portfolio`
- Directory location: `./`

---

## Connecting with Deployed Backend API

1. Once your backend is deployed on Render (e.g., `https://balavignesh-portfolio-api.onrender.com`), the public portfolio will automatically connect to it!
2. You can also update `PRODUCTION_API_URL` in `public-portfolio/assets/js/config.js` to match your exact Render URL.
