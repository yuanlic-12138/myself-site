@echo off
chcp 65001 >nul 2>&1
echo ========================================
echo    LEGO Website - Quick Start
echo ========================================
echo.

where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found, please install Node.js first
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo [INFO] Dependencies not found, installing...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Dependencies install failed
        pause
        exit /b 1
    )
    echo.
)

echo [INFO] Starting frontend and backend...
echo.
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:3001
echo.
echo   Press Ctrl+C to stop
echo ========================================
echo.

start http://localhost:5173

timeout /t 2 /nobreak >nul

call npm start

pause