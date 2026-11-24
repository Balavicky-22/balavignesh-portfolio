@echo off
title Admin Dashboard (Port 5500)
cd /d "%~dp0admin-panel"
echo ====================================================
echo Starting Balavignesh B Admin Panel Dashboard on Port 5500...
echo URL: http://localhost:5500
echo Default Login: admin@balavignesh.dev / Balavignesh@2026
echo ====================================================

where py >nul 2>nul
if %errorlevel% equ 0 (
    py -m http.server 5500 --bind 0.0.0.0
) else (
    "%~dp0backend\venv\Scripts\python.exe" -m http.server 5500 --bind 0.0.0.0
)
pause
