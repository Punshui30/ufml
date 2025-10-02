# Credit Hardar Database Setup Script
# This script helps set up a local PostgreSQL database for development

Write-Host "Setting up Credit Hardar Database..." -ForegroundColor Green

# Check if PostgreSQL is installed
try {
    $pgVersion = psql --version
    Write-Host "✅ PostgreSQL found: $pgVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ PostgreSQL not found. Please install PostgreSQL first:" -ForegroundColor Red
    Write-Host "   Download from: https://www.postgresql.org/download/" -ForegroundColor Yellow
    exit 1
}

# Database configuration
$DB_NAME = "credithardar"
$DB_USER = "hardaruser"
$DB_PASSWORD = "secure_password_123"
$DB_HOST = "localhost"
$DB_PORT = "5432"

Write-Host "Creating database and user..." -ForegroundColor Yellow

# Create database and user (run as postgres superuser)
$createScript = @"
-- Create user if not exists
DO `$`$`$`
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$DB_USER') THEN
        CREATE ROLE $DB_USER LOGIN PASSWORD '$DB_PASSWORD';
    END IF;
END
`$`$`$`;

-- Create database if not exists
SELECT 'CREATE DATABASE $DB_NAME OWNER $DB_USER'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
"@

try {
    echo $createScript | psql -U postgres -h $DB_HOST -p $DB_PORT
    Write-Host "✅ Database and user created successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Warning: Could not create database automatically" -ForegroundColor Yellow
    Write-Host "Please run these commands manually:" -ForegroundColor Yellow
    Write-Host "psql -U postgres" -ForegroundColor Cyan
    Write-Host "CREATE DATABASE $DB_NAME;" -ForegroundColor Cyan
    Write-Host "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" -ForegroundColor Cyan
    Write-Host "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" -ForegroundColor Cyan
    Write-Host "exit" -ForegroundColor Cyan
}

# Set environment variables
Write-Host "Setting up environment variables..." -ForegroundColor Yellow

$envContent = @"
# Database Configuration
DATABASE_URL=postgresql+psycopg2://$DB_USER`:$DB_PASSWORD@$DB_HOST`:$DB_PORT/$DB_NAME

# API Configuration
CORS_ORIGINS=http://localhost:3000
RATE_LIMIT_PER_MIN=200

# Security
MAIL_WEBHOOK_SECRET=your_webhook_secret_here

# Development
DB_ECHO=false
"@

$envContent | Out-File -FilePath "apps/api/.env" -Encoding UTF8
Write-Host "✅ Environment file created at apps/api/.env" -ForegroundColor Green

# Initialize database tables
Write-Host "Initializing database tables..." -ForegroundColor Yellow

try {
    Set-Location "apps/api"
    python init_db.py
    Set-Location "../.."
    Write-Host "✅ Database tables initialized successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to initialize database tables" -ForegroundColor Red
    Write-Host "Please run: cd apps/api && python init_db.py" -ForegroundColor Yellow
}

Write-Host "`n🎉 Database setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Start the API server: cd apps/api && python -m uvicorn main:app --reload" -ForegroundColor Cyan
Write-Host "2. Start the web app: cd apps/web && npm run dev" -ForegroundColor Cyan
Write-Host "3. Visit: http://localhost:3000" -ForegroundColor Cyan



