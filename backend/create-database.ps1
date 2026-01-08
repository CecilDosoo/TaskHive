# PostgreSQL Database Creation Script
Write-Host "=== Creating TaskHive Database ===" -ForegroundColor Cyan
Write-Host ""

# Get PostgreSQL connection details
$username = Read-Host "PostgreSQL Username (default: postgres)"
if ([string]::IsNullOrWhiteSpace($username)) { $username = "postgres" }

$host = Read-Host "Host (default: localhost)"
if ([string]::IsNullOrWhiteSpace($host)) { $host = "localhost" }

$port = Read-Host "Port (default: 5432)"
if ([string]::IsNullOrWhiteSpace($port)) { $port = "5432" }

$database = Read-Host "Database Name (default: taskhive)"
if ([string]::IsNullOrWhiteSpace($database)) { $database = "taskhive" }

Write-Host ""
Write-Host "Attempting to create database '$database'..." -ForegroundColor Yellow

# Try to find psql in common locations
$psqlPaths = @(
    "psql",
    "C:\Program Files\PostgreSQL\16\bin\psql.exe",
    "C:\Program Files\PostgreSQL\15\bin\psql.exe",
    "C:\Program Files\PostgreSQL\14\bin\psql.exe",
    "C:\Program Files\PostgreSQL\13\bin\psql.exe",
    "C:\Program Files\PostgreSQL\12\bin\psql.exe"
)

$psqlPath = $null
foreach ($path in $psqlPaths) {
    if (Get-Command $path -ErrorAction SilentlyContinue) {
        $psqlPath = $path
        break
    }
}

if (-not $psqlPath) {
    Write-Host ""
    Write-Host "❌ psql command not found in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please use one of these methods:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Method 1: Add PostgreSQL to PATH" -ForegroundColor Cyan
    Write-Host "  Find psql.exe in: C:\Program Files\PostgreSQL\[VERSION]\bin"
    Write-Host "  Add that folder to your system PATH"
    Write-Host ""
    Write-Host "Method 2: Use pgAdmin (GUI)" -ForegroundColor Cyan
    Write-Host "  1. Open pgAdmin"
    Write-Host "  2. Right-click 'Databases' → 'Create' → 'Database'"
    Write-Host "  3. Name: $database"
    Write-Host "  4. Click 'Save'"
    Write-Host ""
    Write-Host "Method 3: Manual SQL Command" -ForegroundColor Cyan
    Write-Host "  Connect to PostgreSQL and run:"
    Write-Host "  CREATE DATABASE $database;"
    Write-Host ""
    exit
}

# Create database using psql
Write-Host "Using: $psqlPath" -ForegroundColor Gray
Write-Host ""

$env:PGPASSWORD = Read-Host "PostgreSQL Password" -AsSecureString | ConvertFrom-SecureString -AsPlainText

try {
    $createDbQuery = "CREATE DATABASE $database;"
    & $psqlPath -U $username -h $host -p $port -d postgres -c $createDbQuery
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ Database '$database' created successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Update your .env file with the correct DATABASE_URL"
        Write-Host "2. Run: npm run prisma:generate"
        Write-Host "3. Run: npm run prisma:migrate"
    } else {
        Write-Host ""
        Write-Host "❌ Failed to create database. Check your credentials." -ForegroundColor Red
    }
} catch {
    Write-Host ""
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Try creating the database manually using pgAdmin or psql." -ForegroundColor Yellow
}

# Clear password from environment
Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue










