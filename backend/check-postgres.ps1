# Check PostgreSQL Status
Write-Host "Checking PostgreSQL status..." -ForegroundColor Cyan

$service = Get-Service -Name postgresql-x64-18 -ErrorAction SilentlyContinue

if ($service) {
    Write-Host "`nService Status: $($service.Status)" -ForegroundColor $(if ($service.Status -eq 'Running') { 'Green' } else { 'Yellow' })
    Write-Host "Service Name: $($service.Name)" -ForegroundColor White
    Write-Host "Display Name: $($service.DisplayName)" -ForegroundColor White
    
    if ($service.Status -eq 'Running') {
        Write-Host "`n✅ PostgreSQL is running!" -ForegroundColor Green
        Write-Host "You can now run: npx prisma migrate deploy" -ForegroundColor Cyan
    } else {
        Write-Host "`n❌ PostgreSQL is not running" -ForegroundColor Red
        Write-Host "`nTo start it:" -ForegroundColor Yellow
        Write-Host "1. Open Services (Win+R, type 'services.msc')" -ForegroundColor White
        Write-Host "2. Find 'postgresql-x64-18 - PostgreSQL Server 18'" -ForegroundColor White
        Write-Host "3. Right-click → Start" -ForegroundColor White
        Write-Host "`nOr run PowerShell as Administrator and execute:" -ForegroundColor Yellow
        Write-Host "   Start-Service -Name postgresql-x64-18" -ForegroundColor Cyan
    }
} else {
    Write-Host "❌ PostgreSQL service not found" -ForegroundColor Red
    Write-Host "You may need to install PostgreSQL or check the service name" -ForegroundColor Yellow
}


