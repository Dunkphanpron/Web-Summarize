@echo off
setlocal
title Pentest Estimator - SQLite Version

echo ==========================================
echo      Starting MVC App (SQLite)
echo ==========================================

:: 1. Setup Node Path
set "NODE_DIR=%~dp0bin\node-v20.11.0-win-x64"
if exist "%NODE_DIR%\node.exe" (
    set "PATH=%NODE_DIR%;%PATH%"
)

:: 2. Install SQLite3 if missing
echo.
echo [CHECK] Installing SQLite3...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Installation failed.
    pause
    exit /b
)

:: 3. Start Server
echo.
echo [START] Starting Server...
echo Database: data/database.sqlite
echo Go to: http://localhost:3000
echo.

node index.js
pause
