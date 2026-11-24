@echo off
title Balavignesh B — Portfolio System Server
setlocal enabledelayedexpansion

echo ==========================================================
echo Starting Balavignesh B Portfolio System (All 3 Services)
echo ==========================================================
echo [1] Public Portfolio: http://localhost:3000 (http://127.0.0.1:3000)
echo [2] Admin Panel:      http://localhost:5500 (http://127.0.0.1:5500)
echo [3] Backend REST API: http://localhost:8000 (http://127.0.0.1:8000)
echo ==========================================================

:: Locate Python executable in backend venv
set "VENV_PY=%~dp0backend\venv\Scripts\python.exe"
if not exist "%VENV_PY%" set "VENV_PY=python"

:: Open browser windows after a brief delay
start "" http://localhost:3000
start "" http://localhost:5500

:: Run unified server
"%VENV_PY%" "%~dp0run_system.py"
pause
