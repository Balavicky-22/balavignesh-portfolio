@echo off
title Push Portfolio System to GitHub
cd /d "%~dp0"

echo ==========================================================
echo Push Balavignesh B Portfolio System to GitHub
echo GitHub Account: Balavicky-22
echo ==========================================================
echo.
set /p REPO_NAME="Enter your new GitHub Repository Name (e.g. portfolio-system): "

if "%REPO_NAME%"=="" (
    echo [ERROR] No repository name entered.
    pause
    exit /b
)

git remote remove origin 2>nul
git remote add origin https://github.com/Balavicky-22/%REPO_NAME%.git
git branch -M main

echo.
echo Connecting and pushing to https://github.com/Balavicky-22/%REPO_NAME%.git ...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ==========================================================
    echo [SUCCESS] Code successfully pushed to GitHub!
    echo Repository URL: https://github.com/Balavicky-22/%REPO_NAME%
    echo ==========================================================
) else (
    echo.
    echo [ERROR] Push failed. Make sure you have created the empty repository on https://github.com/new first!
)

echo.
pause
