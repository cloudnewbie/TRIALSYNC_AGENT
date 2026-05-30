@echo off
title TrialSync Agent - Shutdown Console
echo ====================================================================
echo 🛑 SHUTTING DOWN TRIALSYNC AGENT PORT 3000
echo ====================================================================

set found=0

:: Look up port 3000 using netstat, find the PID, and kill the process
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    echo 🔍 Detected active TrialSync process PID [%%a] on port 3000.
    echo ⚡ Terminating process...
    taskkill /f /pid %%a
    set found=1
)

if %found%==0 (
    echo ℹ️ No active TrialSync processes detected on port 3000.
) else (
    echo.
    echo ✅ SHUTDOWN COMPLETE. TrialSync Agent has been deactivated.
)

echo ====================================================================
timeout /t 3
