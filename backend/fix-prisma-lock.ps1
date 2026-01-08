# Fix Prisma EPERM Error - Stop Backend and Regenerate
Write-Host "🔧 Fixing Prisma Lock Error..." -ForegroundColor Cyan

# Step 1: Find and stop backend Node processes
Write-Host "`n1. Finding backend Node processes..." -ForegroundColor Yellow
$backendProcesses = Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object {
    $_.Path -like "*nodejs*" -or $_.Path -like "*node*"
}

if ($backendProcesses) {
    Write-Host "   Found $($backendProcesses.Count) Node process(es)" -ForegroundColor Yellow
    
    # Try to identify backend processes by checking if they're using port 5001
    $backendPort = 5001
    $netstat = netstat -ano | Select-String ":$backendPort"
    
    if ($netstat) {
        $pids = $netstat | ForEach-Object {
            if ($_ -match '\s+(\d+)\s*$') {
                $matches[1]
            }
        } | Select-Object -Unique
        
        foreach ($pid in $pids) {
            $proc = Get-Process -Id $pid -ErrorAction SilentlyContinue
            if ($proc -and $proc.ProcessName -eq "node") {
                Write-Host "   Stopping backend process (PID: $pid)..." -ForegroundColor Yellow
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                Start-Sleep -Seconds 1
            }
        }
    }
    
    # Also stop any Node processes that might be holding the Prisma file
    Write-Host "   Stopping all Node processes (you may need to restart your dev servers)..." -ForegroundColor Yellow
    Write-Host "   Continue? (y/n)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -eq 'y' -or $response -eq 'Y') {
        Stop-Process -Name node -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
        Write-Host "   ✅ Node processes stopped" -ForegroundColor Green
    } else {
        Write-Host "   Skipped. Please manually stop your backend server (Ctrl+C)" -ForegroundColor Yellow
    }
} else {
    Write-Host "   No Node processes found" -ForegroundColor Green
}

# Step 2: Try to delete the locked Prisma file
Write-Host "`n2. Attempting to unlock Prisma query engine..." -ForegroundColor Yellow
$prismaEnginePath = "node_modules\.prisma\client\query_engine-windows.dll.node"
$prismaEngineTmpPath = "node_modules\.prisma\client\query_engine-windows.dll.node.tmp*"

if (Test-Path $prismaEnginePath) {
    Write-Host "   Found Prisma engine file" -ForegroundColor Yellow
    try {
        Remove-Item $prismaEnginePath -Force -ErrorAction Stop
        Write-Host "   ✅ Removed locked file" -ForegroundColor Green
    } catch {
        Write-Host "   ⚠️  Could not remove file (may still be locked)" -ForegroundColor Yellow
    }
}

# Remove any temp files
if (Test-Path $prismaEngineTmpPath) {
    Get-ChildItem $prismaEngineTmpPath | ForEach-Object {
        try {
            Remove-Item $_.FullName -Force -ErrorAction Stop
            Write-Host "   ✅ Removed temp file: $($_.Name)" -ForegroundColor Green
        } catch {
            Write-Host "   ⚠️  Could not remove temp file: $($_.Name)" -ForegroundColor Yellow
        }
    }
}

# Step 3: Wait a moment for file system to release locks
Write-Host "`n3. Waiting for file system to release locks..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

# Step 4: Generate Prisma Client
Write-Host "`n4. Generating Prisma Client..." -ForegroundColor Yellow
try {
    npx prisma generate
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Prisma Client generated successfully!" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Prisma generate failed" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ❌ Error: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Done! You can now restart your backend server." -ForegroundColor Green



