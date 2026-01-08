# PostgreSQL Setup Helper Script
Write-Host "=== TaskHive Database Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    @"
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://postgres:CHANGE_ME@localhost:5432/taskhive?schema=public"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:5173
"@ | Out-File -FilePath .env -Encoding utf8
    Write-Host ".env file created!" -ForegroundColor Green
}

Write-Host "Please provide your PostgreSQL credentials:" -ForegroundColor Yellow
$username = Read-Host "PostgreSQL Username (default: postgres)"
if ([string]::IsNullOrWhiteSpace($username)) { $username = "postgres" }

$password = Read-Host "PostgreSQL Password" -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

$database = Read-Host "Database Name (default: taskhive)"
if ([string]::IsNullOrWhiteSpace($database)) { $database = "taskhive" }

$host = Read-Host "Host (default: localhost)"
if ([string]::IsNullOrWhiteSpace($host)) { $host = "localhost" }

$port = Read-Host "Port (default: 5432)"
if ([string]::IsNullOrWhiteSpace($port)) { $port = "5432" }

# Update .env file
$envContent = Get-Content .env -Raw
$newDbUrl = "postgresql://${username}:${passwordPlain}@${host}:${port}/${database}?schema=public"
$envContent = $envContent -replace 'DATABASE_URL=".*"', "DATABASE_URL=`"$newDbUrl`""
$envContent | Set-Content .env -NoNewline

Write-Host ""
Write-Host "✓ .env file updated!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Make sure the database '$database' exists"
Write-Host "2. Run: npm run prisma:generate"
Write-Host "3. Run: npm run prisma:migrate"
Write-Host ""










