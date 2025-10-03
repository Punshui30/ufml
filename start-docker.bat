@echo off
echo Starting UFML Credit Platform with Docker...
echo.

echo Building and starting containers...
docker-compose build

echo.
echo Starting services...
docker-compose up

echo.
echo Services are running:
echo - Backend API: http://127.0.0.1:8000
echo - Frontend Web: http://127.0.0.1:3000
echo.
echo Press Ctrl+C to stop all services
pause

