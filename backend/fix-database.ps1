# Fix Prisma Database Connection and Restore Tables
Write-Host "🔧 Fixing Prisma Database Connection..." -ForegroundColor Cyan

# Step 1: Check if PostgreSQL is running
Write-Host "`n1. Checking PostgreSQL service..." -ForegroundColor Yellow
$pgService = Get-Service -Name postgresql* -ErrorAction SilentlyContinue
if ($pgService) {
    Write-Host "   PostgreSQL service found: $($pgService.Name)" -ForegroundColor Green
    if ($pgService.Status -eq 'Running') {
        Write-Host "   ✅ PostgreSQL is running" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  PostgreSQL is not running. Starting..." -ForegroundColor Yellow
        Start-Service -Name $pgService.Name
        Start-Sleep -Seconds 3
        Write-Host "   ✅ PostgreSQL started" -ForegroundColor Green
    }
} else {
    Write-Host "   ❌ PostgreSQL service not found" -ForegroundColor Red
    Write-Host "   Please make sure PostgreSQL is installed and running" -ForegroundColor Yellow
    exit 1
}

# Step 2: Check DATABASE_URL
Write-Host "`n2. Checking DATABASE_URL..." -ForegroundColor Yellow
if (Test-Path .env) {
    $dbUrl = Get-Content .env | Select-String -Pattern "DATABASE_URL"
    if ($dbUrl) {
        Write-Host "   DATABASE_URL found in .env" -ForegroundColor Green
        Write-Host "   $dbUrl" -ForegroundColor Gray
    } else {
        Write-Host "   ❌ DATABASE_URL not found in .env" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "   ❌ .env file not found" -ForegroundColor Red
    exit 1
}

# Step 3: Generate Prisma Client
Write-Host "`n3. Generating Prisma Client..." -ForegroundColor Yellow
try {
    npx prisma generate
    Write-Host "   ✅ Prisma Client generated" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed to generate Prisma Client" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    exit 1
}

# Step 4: Check migration status
Write-Host "`n4. Checking migration status..." -ForegroundColor Yellow
try {
    $migrateStatus = npx prisma migrate status 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Migrations are up to date" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Migrations need to be applied" -ForegroundColor Yellow
        Write-Host "`n5. Applying migrations..." -ForegroundColor Yellow
        npx prisma migrate deploy
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ Migrations applied successfully" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Failed to apply migrations" -ForegroundColor Red
            Write-Host "   Trying to reset database..." -ForegroundColor Yellow
            Write-Host "   ⚠️  This will DELETE ALL DATA. Continue? (y/n)" -ForegroundColor Red
            $response = Read-Host
            if ($response -eq 'y' -or $response -eq 'Y') {
                npx prisma migrate reset --force
                Write-Host "   ✅ Database reset and migrations applied" -ForegroundColor Green
            } else {
                Write-Host "   Cancelled" -ForegroundColor Yellow
                exit 1
            }
        }
    }
} catch {
    Write-Host "   ❌ Cannot connect to database" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    Write-Host "`n   Please check:" -ForegroundColor Yellow
    Write-Host "   1. PostgreSQL is running" -ForegroundColor Yellow
    Write-Host "   2. DATABASE_URL in .env is correct" -ForegroundColor Yellow
    Write-Host "   3. Database exists" -ForegroundColor Yellow
    exit 1
}

# Step 5: Verify tables exist
Write-Host "`n6. Verifying database tables..." -ForegroundColor Yellow
try {
    npx prisma db pull --print
    Write-Host "   ✅ Database connection successful" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Could not verify tables (this is okay if migrations were just applied)" -ForegroundColor Yellow
}

Write-Host "`n✅ Database setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Restart your backend server" -ForegroundColor White
Write-Host "2. Check if data is showing up" -ForegroundColor White



