# Credit Hardar Development Startup Script
# This script starts both the API server and web application

Write-Host "Starting Credit Hardar Development Environment..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "apps/api/main.py")) {
    Write-Host "❌ Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Function to check if a command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check dependencies
Write-Host "Checking dependencies..." -ForegroundColor Yellow

if (-not (Test-Command "python")) {
    Write-Host "❌ Python not found. Please install Python 3.8+" -ForegroundColor Red
    exit 1
}

if (-not (Test-Command "npm")) {
    Write-Host "❌ npm not found. Please install Node.js" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencies found" -ForegroundColor Green

# Install Python dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
Set-Location "apps/api"
try {
    pip install -r requirements.txt
    Write-Host "✅ Python dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Warning: Could not install Python dependencies" -ForegroundColor Yellow
}
Set-Location "../.."

# Install Node.js dependencies
Write-Host "Installing Node.js dependencies..." -ForegroundColor Yellow
Set-Location "apps/web"
try {
    npm install
    Write-Host "✅ Node.js dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Warning: Could not install Node.js dependencies" -ForegroundColor Yellow
}
Set-Location "../.."

# Check if database is set up
Write-Host "Checking database setup..." -ForegroundColor Yellow
if (-not (Test-Path "apps/api/.env")) {
    Write-Host "⚠️  Database not set up. Please run setup-db.ps1 first" -ForegroundColor Yellow
    Write-Host "Or manually create apps/api/.env with DATABASE_URL" -ForegroundColor Yellow
}

Write-Host "`n🚀 Starting services..." -ForegroundColor Green

# Start API server in background
Write-Host "Starting API server on http://localhost:8000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps/api; python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

# Wait a moment for API to start
Start-Sleep -Seconds 3

# Start web application in background
Write-Host "Starting web application on http://localhost:3000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps/web; npm run dev"

Write-Host "`n✅ Development environment started!" -ForegroundColor Green
Write-Host "`n🌐 URLs:" -ForegroundColor Yellow
Write-Host "Web App: http://localhost:3000" -ForegroundColor Cyan
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "API Health: http://localhost:8000/healthz" -ForegroundColor Cyan

Write-Host "`n📝 Default Login:" -ForegroundColor Yellow
Write-Host "Email: admin@credithardar.com" -ForegroundColor Cyan
Write-Host "Note: Set password on first login" -ForegroundColor Cyan

Write-Host "`nPress Ctrl+C to stop all services" -ForegroundColor Yellow



