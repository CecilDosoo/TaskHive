# Script to fix PostgreSQL username in .env file
Write-Host "=== Fix PostgreSQL Username ===" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path .env)) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    exit
}

Write-Host "Current DATABASE_URL:" -ForegroundColor Yellow
Get-Content .env | Select-String "DATABASE_URL"
Write-Host ""

Write-Host "Common PostgreSQL usernames:" -ForegroundColor Cyan
Write-Host "  1. postgres (most common default)"
Write-Host "  2. $env:USERNAME (your Windows username)"
Write-Host "  3. admin"
Write-Host ""

Write-Host "To find your correct username:" -ForegroundColor Yellow
Write-Host "  Option A: Check pgAdmin" -ForegroundColor Cyan
Write-Host "    - Open pgAdmin"
Write-Host "    - Look at your server connection"
Write-Host "    - Right-click server → Properties → Connection tab"
Write-Host ""
Write-Host "  Option B: Try connecting" -ForegroundColor Cyan
Write-Host "    Run: psql -U postgres"
Write-Host "    If it asks for password, 'postgres' is correct!"
Write-Host "    If not, try: psql -U $env:USERNAME"
Write-Host ""

$username = Read-Host "Enter your PostgreSQL username"
$password = Read-Host "Enter your PostgreSQL password" -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

$host = Read-Host "Host (default: localhost)"
if ([string]::IsNullOrWhiteSpace($host)) { $host = "localhost" }

$port = Read-Host "Port (default: 5432)"
if ([string]::IsNullOrWhiteSpace($port)) { $port = "5432" }

$database = Read-Host "Database name (default: taskhive)"
if ([string]::IsNullOrWhiteSpace($database)) { $database = "taskhive" }

# Update .env file
$envContent = Get-Content .env -Raw
$newDbUrl = "postgresql://${username}:${passwordPlain}@${host}:${port}/${database}?schema=public"
$envContent = $envContent -replace 'DATABASE_URL=".*"', "DATABASE_URL=`"$newDbUrl`""
$envContent | Set-Content .env -NoNewline

Write-Host ""
Write-Host "✓ .env file updated!" -ForegroundColor Green
Write-Host ""
Write-Host "New DATABASE_URL:" -ForegroundColor Yellow
Write-Host "DATABASE_URL=`"postgresql://${username}:***@${host}:${port}/${database}?schema=public`"" -ForegroundColor Gray
Write-Host ""
Write-Host "Now try running: npm run prisma:migrate" -ForegroundColor Cyan










