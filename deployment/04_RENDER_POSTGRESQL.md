# Setting Up PostgreSQL & Data Migration

This guide explains how to attach a managed PostgreSQL database on Render and migrate your existing SQLite data into it.

---

## 📌 Why PostgreSQL for Production?
- SQLite works locally, but cloud hosting platforms like Render have ephemeral filesystems on their free tier unless a persistent disk is mounted.
- A managed PostgreSQL database provides 100% data persistence that survives restarts, rebuilds, and redeployments.
- Our FastAPI backend includes dual-engine support: it works with SQLite locally and automatically connects with PostgreSQL in production via asyncpg!

---

## Step 1: Create a PostgreSQL Database on Render

1. On the Render dashboard, click **"New +"** > **"PostgreSQL"**.
2. Configure:
   - **Name**: `balavignesh-portfolio-db`
   - **Database**: `portfolio_db`
   - **User**: `balavignesh`
   - **Region**: Choose the **same region** as your Web Service (e.g., Oregon).
   - **Plan**: Free
3. Click **"Create Database"**.
4. Once created, copy the **Internal Database URL** (if Web Service is on Render) or **External Database URL**.
   It looks like:
   `postgresql://balavignesh:password@dpg-xxxx.render.com/portfolio_db`

---

## Step 2: Connect the Database to Your Web Service

1. Go to your `balavignesh-portfolio-api` Web Service on Render.
2. Go to **"Environment"**.
3. Add or update the variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Paste the PostgreSQL connection URL copied in Step 1.
4. Save changes. Render will automatically redeploy the backend!
5. On startup, FastAPI automatically runs `init_db()`, creates all necessary tables in PostgreSQL, and seeds default records if empty!

---

## Step 3: Migrate Local SQLite Data to PostgreSQL (Optional One-Click Tool)

If you have custom projects or messages in your local `portfolio.db` that you want copied directly into Render PostgreSQL:

1. Open your terminal in `portfolio-system/backend`:
```powershell
# Activate venv
.\venv\Scripts\Activate.ps1

# Run the migration tool with your external PostgreSQL URL:
python migrate_to_postgres.py "postgresql://balavignesh:PASSWORD@dpg-xxxx.render.com/portfolio_db"
```

2. The migration tool will:
   - Verify connection to Render PostgreSQL.
   - Read all rows from local `portfolio.db`.
   - Transfer all records (admins, profile, education, skills, projects, certifications, messages, media).
   - Reset PostgreSQL autoincrement ID sequences.
   - Complete with: `✅ MIGRATION COMPLETED SUCCESSFULLY!`.
