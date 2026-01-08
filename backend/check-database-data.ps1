# Check Database Tables and Data
Write-Host "Checking database tables and data..." -ForegroundColor Cyan

# Try to connect and check table counts
$env:PGPASSWORD = Read-Host "Enter your PostgreSQL password (or press Enter to skip)"

if ($env:PGPASSWORD) {
    Write-Host "`nConnecting to database..." -ForegroundColor Yellow
    
    # Try to find psql
    $psqlPath = $null
    $possiblePaths = @(
        "C:\Program Files\PostgreSQL\18\bin\psql.exe",
        "C:\Program Files\PostgreSQL\17\bin\psql.exe",
        "C:\Program Files\PostgreSQL\16\bin\psql.exe",
        "C:\Program Files\PostgreSQL\15\bin\psql.exe",
        "psql"
    )
    
    foreach ($path in $possiblePaths) {
        if (Get-Command $path -ErrorAction SilentlyContinue) {
            $psqlPath = $path
            break
        } elseif (Test-Path $path) {
            $psqlPath = $path
            break
        }
    }
    
    if ($psqlPath) {
        Write-Host "Found psql at: $psqlPath" -ForegroundColor Green
        
        $query = @"
SELECT 
    schemaname,
    tablename,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = t.tablename) as exists,
    (SELECT COUNT(*) FROM pg_class WHERE relname = t.tablename) as has_table
FROM pg_tables t
WHERE schemaname = 'public'
ORDER BY tablename;
"@
        
        Write-Host "`nTables in database:" -ForegroundColor Yellow
        & $psqlPath -U postgres -d taskhive2 -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;"
        
        Write-Host "`nRow counts:" -ForegroundColor Yellow
        & $psqlPath -U postgres -d taskhive2 -c @"
SELECT 
    'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'projects', COUNT(*) FROM projects
UNION ALL
SELECT 'tasks', COUNT(*) FROM tasks
UNION ALL
SELECT 'activity_logs', COUNT(*) FROM activity_logs
UNION ALL
SELECT 'project_members', COUNT(*) FROM project_members
ORDER BY table_name;
"@
    } else {
        Write-Host "Could not find psql. Please use Prisma Studio instead:" -ForegroundColor Yellow
        Write-Host "  npx prisma studio" -ForegroundColor Cyan
    }
} else {
    Write-Host "`nTo check your database data, you can:" -ForegroundColor Yellow
    Write-Host "1. Use Prisma Studio (GUI):" -ForegroundColor White
    Write-Host "   npx prisma studio" -ForegroundColor Cyan
    Write-Host "`n2. Or use pgAdmin to browse your database" -ForegroundColor White
}


