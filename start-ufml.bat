@echo off
echo ========================================
echo   UFML - Un Fuck My Life Platform
echo   Starting Complete System...
echo ========================================

echo.
echo [1/3] Starting Backend Server...
start "UFML Backend" cmd /k "cd /d %~dp0apps\api && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

echo.
echo [2/3] Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo [3/3] Starting Frontend Server...
start "UFML Frontend" cmd /k "cd /d %~dp0apps\web && npm run dev"

echo.
echo ========================================
echo   UFML Platform Started Successfully!
echo ========================================
echo.
echo Backend:  http://127.0.0.1:8000
echo Frontend: http://localhost:3000
echo.
echo Both servers are running in separate windows.
echo Close those windows to stop the servers.
echo.
pause
