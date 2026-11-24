@echo off
title Public Portfolio (Port 3000)
cd /d "%~dp0public-portfolio"
echo ====================================================
echo Starting Balavignesh B Public Portfolio on Port 3000...
echo URL: http://localhost:3000
echo ====================================================

where py >nul 2>nul
if %errorlevel% equ 0 (
    py -m http.server 3000 --bind 0.0.0.0
) else (
    "%~dp0backend\venv\Scripts\python.exe" -m http.server 3000 --bind 0.0.0.0
)
pause
