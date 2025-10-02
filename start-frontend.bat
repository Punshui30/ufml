@echo off
setlocal

echo Starting UFML Frontend...

REM Set environment variables
set NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
set NEXT_PUBLIC_USE_MOCKS=false

echo Environment variables set:
echo NEXT_PUBLIC_API_URL=%NEXT_PUBLIC_API_URL%
echo NEXT_PUBLIC_USE_MOCKS=%NEXT_PUBLIC_USE_MOCKS%
echo.

REM Change to web directory
cd apps\web

REM Install dependencies
echo Installing Node.js dependencies...
call npm install

REM Start the frontend
echo Starting frontend server...
echo Frontend will be available at: http://127.0.0.1:3000
echo.
call npm run dev

pause