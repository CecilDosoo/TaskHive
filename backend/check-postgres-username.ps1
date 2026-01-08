# Script to help find your PostgreSQL username
Write-Host "=== Finding Your PostgreSQL Username ===" -ForegroundColor Cyan
Write-Host ""

# Method 1: Check common default usernames
Write-Host "Common PostgreSQL usernames:" -ForegroundColor Yellow
Write-Host "  - postgres (most common default)"
Write-Host "  - Your Windows username"
Write-Host "  - admin"
Write-Host "  - root"
Write-Host ""

# Method 2: Try to connect and see what works
Write-Host "Let's test different usernames..." -ForegroundColor Yellow
Write-Host ""

$testUsernames = @("postgres", $env:USERNAME, "admin")

foreach ($testUser in $testUsernames) {
    Write-Host "Testing username: $testUser" -ForegroundColor Gray
    
    # Try to find psql
    $psqlPaths = @(
        "psql",
        "C:\Program Files\PostgreSQL\16\bin\psql.exe",
        "C:\Program Files\PostgreSQL\15\bin\psql.exe",
        "C:\Program Files\PostgreSQL\14\bin\psql.exe"
    )
    
    $psqlPath = $null
    foreach ($path in $psqlPaths) {
        if (Get-Command $path -ErrorAction SilentlyContinue) {
            $psqlPath = $path
            break
        }
    }
    
    if ($psqlPath) {
        Write-Host "  Found psql at: $psqlPath" -ForegroundColor Gray
        Write-Host "  Try connecting with: $psqlPath -U $testUser" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "=== How to Find Your Username ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Method 1: Check pgAdmin" -ForegroundColor Yellow
Write-Host "  1. Open pgAdmin"
Write-Host "  2. Look at the server connection in the left sidebar"
Write-Host "  3. Right-click the server → Properties"
Write-Host "  4. Check the 'Connection' tab for the username"
Write-Host ""

Write-Host "Method 2: Check Windows Services" -ForegroundColor Yellow
Write-Host "  1. Press Win+R, type: services.msc"
Write-Host "  2. Find 'postgresql-x64-[version]' service"
Write-Host "  3. Right-click → Properties → Log On tab"
Write-Host "  4. The username shown there might be your PostgreSQL user"
Write-Host ""

Write-Host "Method 3: Try Connecting" -ForegroundColor Yellow
Write-Host "  Try these commands one by one:"
Write-Host "    psql -U postgres"
Write-Host "    psql -U $env:USERNAME"
Write-Host "  Whichever one works (asks for password) is your username!"
Write-Host ""

Write-Host "Method 4: Check PostgreSQL Config" -ForegroundColor Yellow
Write-Host "  Look in: C:\Program Files\PostgreSQL\[VERSION]\data\pg_hba.conf"
Write-Host "  (But be careful editing this file!)"
Write-Host ""

Write-Host "=== Common Issues ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Username might be your Windows username (not 'postgres')"
Write-Host "2. Some installations use 'postgres' as default"
Write-Host "3. Check what username you used when installing PostgreSQL"
Write-Host ""

$suggestedUser = Read-Host "What username do you want to try? (or press Enter to skip)"
if ($suggestedUser) {
    Write-Host ""
    Write-Host "To test this username, run:" -ForegroundColor Cyan
    Write-Host "  psql -U $suggestedUser" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "If it asks for a password, that's your correct username!" -ForegroundColor Green
}










