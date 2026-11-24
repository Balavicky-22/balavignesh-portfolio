@echo off
title Portfolio Backend API (Port 8000)
cd /d "%~dp0backend"
echo ====================================================
echo Starting Balavignesh B Portfolio FastAPI Backend...
echo API URL: http://localhost:8000
echo Docs:    http://localhost:8000/docs
echo ====================================================

set "VENV_PY=%~dp0backend\venv\Scripts\python.exe"
if not exist "%VENV_PY%" set "VENV_PY=python"

"%VENV_PY%" -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
pause
