@echo off
title TrialSync Agent - Startup Console
echo ====================================================================
echo 🚀 STARTING TRIALSYNC AGENT ENGINE (Dual-Mode MongoDB Dashboard)
echo ====================================================================
echo Current Directory: %CD%

cd trialsync-app

:: Check if node_modules exists, install if missing
if not exist node_modules (
    echo 📦 Node packages not detected. Installing dependencies (this may take a moment)...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ ERROR: Failed to install npm packages.
        pause
        exit /b %errorlevel%
    )
)

:: Check if dist exists, compile if missing
if not exist dist (
    echo 🏗️ Production front-end bundle not detected. Compiling React UI...
    call npm run build
    if %errorlevel% neq 0 (
        echo ❌ ERROR: Failed to build React front-end.
        pause
        exit /b %errorlevel%
    )
)

echo.
echo ====================================================================
echo ✅ SETUP VERIFIED. ACTIVATING DUAL-MODE WEB PORTAL...
echo ====================================================================
echo.
echo 📡 UI Dashboard URL:     http://localhost:3000
echo 🔌 Agent Tool Webhooks:  http://localhost:3000/api/agent/...
echo.
echo 💡 TIP: Set 'MONGODB_URI' environment variable to connect to Atlas.
echo    If none is set, we fallback to our high-performance EHR JSON model.
echo ====================================================================
echo Press Ctrl+C in this console at any time to shut down the server.
echo ====================================================================
echo.

call npm run dev
