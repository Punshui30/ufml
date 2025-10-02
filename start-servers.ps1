# Kill any existing processes
Write-Host "Stopping existing servers..."
taskkill /f /im python.exe 2>$null
taskkill /f /im node.exe 2>$null

# Wait a moment
Start-Sleep -Seconds 2

# Start API server from correct directory
Write-Host "Starting API server..."
cd apps\api
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000"

# Wait a moment for API server to start
Start-Sleep -Seconds 3

# Start Web server from correct directory
Write-Host "Starting Web server..."
cd ..\web
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npx next dev -p 3000"

# Wait and check status
Start-Sleep -Seconds 5
Write-Host "Checking server status..."
netstat -an | findstr "8000\|3000"

Write-Host "Servers should now be running!"
Write-Host "API: http://localhost:8000"
Write-Host "Web: http://localhost:3000"
