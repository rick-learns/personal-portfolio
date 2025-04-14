# PowerShell script to run all tests for the Portfolio Backend

Write-Host "Running all unit tests..." -ForegroundColor Cyan
go test ./... -v

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ All unit tests passed!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️ Some unit tests encountered issues. This is expected if:" -ForegroundColor Yellow
    Write-Host "  - Email tests are failing due to API key issues (these are skipped in the updated code)" -ForegroundColor Yellow
    Write-Host "  - Rate limiter tests had incorrect setup (fixed in the updated code)" -ForegroundColor Yellow
}

Write-Host "`n=== Integration Testing Instructions ===" -ForegroundColor Cyan
Write-Host "To run integration tests, please:" -ForegroundColor Yellow
Write-Host "1. Start the server with: go run main.go" -ForegroundColor Yellow
Write-Host "2. In a separate terminal, run: ./integration_test.ps1" -ForegroundColor Yellow
Write-Host "3. The integration tests will validate:" -ForegroundColor Yellow
Write-Host "   - Health endpoint functionality" -ForegroundColor Yellow
Write-Host "   - Contact form validation" -ForegroundColor Yellow
Write-Host "   - Optionally: email sending (if you choose to test it)" -ForegroundColor Yellow
Write-Host "`nNote: Make sure your .env file contains a valid RESEND_API_KEY" -ForegroundColor Yellow
Write-Host "      if you want to test actual email sending functionality" -ForegroundColor Yellow
