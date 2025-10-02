# Credit Hardar Demo Package Creator
# Run this script to create a shareable demo package for partners

Write-Host "🚀 Creating Credit Hardar Demo Package for Partners..." -ForegroundColor Green

# Create demo directory
$demoDir = "credit-hardar-demo-package"
if (Test-Path $demoDir) {
    Remove-Item $demoDir -Recurse -Force
}
New-Item -ItemType Directory -Path $demoDir

Write-Host "📁 Creating demo directory: $demoDir" -ForegroundColor Yellow

# Copy essential files
Copy-Item "docker-compose.yml" "$demoDir/"
Copy-Item "README.md" "$demoDir/"
Copy-Item "MAIL_SERVICES_SETUP.md" "$demoDir/"
Copy-Item "PARTNER_SHARING_GUIDE.md" "$demoDir/"

# Copy policy pack
Copy-Item "policy-pack" "$demoDir/" -Recurse

# Create a demo .env file (without sensitive data)
@"
# Credit Hardar Demo Configuration
POSTGRES_USER=hardaruser
POSTGRES_PASSWORD=demo_password_123
POSTGRES_DB=credithardar
JWT_SECRET=demo_jwt_secret_key_for_demonstration_only
FERNET_KEY=ZmDfcTF7_60GrrY167zsiPd67pEvs0aGOv2oasOM1Pg=
REDIS_URL=redis://redis:6379/0
CORS_ORIGINS=http://localhost:3000
RATE_LIMIT_PER_MIN=200
MAIL_SERVICE=lob
LOB_API_KEY=demo_key_replace_with_real
CLICK2MAIL_USERNAME=demo_user
CLICK2MAIL_PASSWORD=demo_pass
"@ | Out-File -FilePath "$demoDir/.env" -Encoding UTF8

Write-Host "⚙️  Created demo configuration files" -ForegroundColor Yellow

# Export Docker images
Write-Host "🐳 Exporting Docker images (this may take a few minutes)..." -ForegroundColor Yellow

docker save credit-platform-secure-scaffold-with-policies-web -o "$demoDir/credit-hardar-web.tar"
docker save credit-platform-secure-scaffold-with-policies-api -o "$demoDir/credit-hardar-api.tar" 
docker save ankane/pgvector:latest -o "$demoDir/credit-hardar-db.tar"
docker save redis:7-alpine -o "$demoDir/credit-hardar-redis.tar"

# Create partner setup script
@"
@echo off
echo Loading Credit Hardar Demo...
docker load -i credit-hardar-web.tar
docker load -i credit-hardar-api.tar
docker load -i credit-hardar-db.tar
docker load -i credit-hardar-redis.tar

echo Starting Credit Hardar...
docker compose up -d

echo.
echo ✅ Credit Hardar Demo is now running!
echo.
echo 🌐 Website: http://localhost:3000
echo 📚 API Docs: http://localhost:8000/docs
echo.
echo Press any key to continue...
pause
"@ | Out-File -FilePath "$demoDir/start-demo.bat" -Encoding UTF8

# Create partner README
@"
# Credit Hardar Demo Package

## Quick Start for Partners

1. **Run the demo:**
   - Double-click `start-demo.bat` (Windows)
   - Wait for Docker containers to load and start
   
2. **Access the demo:**
   - Website: http://localhost:3000
   - API Documentation: http://localhost:8000/docs

3. **Explore features:**
   - Click the help icons (?) for explanations
   - Try the "Start Free Trial" button
   - Check out the API guide
   - View the interactive dashboard

## What's Included

- ✅ Complete Credit Hardar platform
- ✅ Interactive help system
- ✅ Professional UI with animations
- ✅ Full API documentation
- ✅ Policy and compliance documentation
- ✅ Mail service integration guides

## System Requirements

- Windows 10+ with Docker Desktop installed
- 4GB RAM minimum
- 2GB free disk space

## Partnership Inquiries

Contact us to discuss:
- Revenue sharing opportunities
- White-label licensing
- Custom integration services
- Volume pricing discounts

---

This is a demonstration version. Production deployment includes additional security, monitoring, and compliance features.
"@ | Out-File -FilePath "$demoDir/README-PARTNERS.md" -Encoding UTF8

Write-Host "📦 Demo package created successfully!" -ForegroundColor Green
Write-Host "📍 Location: $demoDir" -ForegroundColor Green
Write-Host "📧 Share this folder with your partners" -ForegroundColor Green

# Get current IP for sharing
$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.*"}).IPAddress | Select-Object -First 1

Write-Host "" -ForegroundColor Green
Write-Host "🌐 Alternative: Share live demo at http://$ip:3000" -ForegroundColor Cyan
Write-Host "📚 API docs at http://$ip:8000/docs" -ForegroundColor Cyan
