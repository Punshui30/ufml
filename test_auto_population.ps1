# Test Auto-Population Script
Write-Host "=== TESTING AUTO-POPULATION ===" -ForegroundColor Green

# Test 1: Get report data
Write-Host "`n1. Getting report data..." -ForegroundColor Yellow
$reportId = "572bad67-c716-486e-ab36-e3e8d02fc8ec"
$body = @{report_id=$reportId} | ConvertTo-Json
$analysis = Invoke-WebRequest -Uri "http://127.0.0.1:8000/reports/analyze" -Method POST -Body $body -ContentType "application/json"
$analysisJson = $analysis.Content | ConvertFrom-Json

Write-Host "✅ AI Analysis completed" -ForegroundColor Green
Write-Host "   AI Service: $($analysisJson.ai_service)" -ForegroundColor Cyan
Write-Host "   Dispute Opportunities: $($analysisJson.summary.dispute_opportunities.Count)" -ForegroundColor Cyan

if ($analysisJson.summary.dispute_opportunities.Count -gt 0) {
    $firstDispute = $analysisJson.summary.dispute_opportunities[0]
    Write-Host "   First Dispute:" -ForegroundColor Cyan
    Write-Host "     Account: $($firstDispute.account_name)" -ForegroundColor White
    Write-Host "     Category: $($firstDispute.dispute_category)" -ForegroundColor White
    Write-Host "     Reason: $($firstDispute.reason_code)" -ForegroundColor White
    Write-Host "     Description: $($firstDispute.reason_description)" -ForegroundColor White
    Write-Host "     Confidence: $($firstDispute.confidence_score)" -ForegroundColor White
}

# Test 2: Get client data
Write-Host "`n2. Getting client data..." -ForegroundColor Yellow
$clients = Invoke-WebRequest -Uri "http://127.0.0.1:8000/clients" -Method GET
$clientsJson = $clients.Content | ConvertFrom-Json
$clientId = $clientsJson.clients[0].id

Write-Host "✅ Client data retrieved" -ForegroundColor Green
Write-Host "   Client ID: $clientId" -ForegroundColor Cyan
Write-Host "   Client Email: $($clientsJson.clients[0].email)" -ForegroundColor Cyan

# Test 3: Test dispute creation URL
Write-Host "`n3. Testing dispute creation URL..." -ForegroundColor Yellow
$disputeUrl = "http://localhost:3000/disputes/create?client_id=$clientId&report_id=$reportId"
Write-Host "✅ Dispute creation URL:" -ForegroundColor Green
Write-Host "   $disputeUrl" -ForegroundColor Cyan

# Test 4: Check if frontend is accessible
Write-Host "`n4. Testing frontend accessibility..." -ForegroundColor Yellow
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET
    if ($frontend.StatusCode -eq 200) {
        Write-Host "✅ Frontend is accessible" -ForegroundColor Green
    } else {
        Write-Host "❌ Frontend health check failed" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Frontend is not running" -ForegroundColor Red
}

Write-Host "`n=== AUTO-POPULATION TEST COMPLETE ===" -ForegroundColor Green
Write-Host "`nTo test auto-population:" -ForegroundColor Yellow
Write-Host "1. Open this URL in your browser:" -ForegroundColor Cyan
Write-Host "   $disputeUrl" -ForegroundColor White
Write-Host "2. Check if the form is auto-populated with:" -ForegroundColor Cyan
Write-Host "   - Client: $($clientsJson.clients[0].email)" -ForegroundColor White
Write-Host "   - Bureau: $($analysisJson.summary.bureau)" -ForegroundColor White
Write-Host "   - Dispute suggestions from AI analysis" -ForegroundColor White
Write-Host "3. Check browser console for auto-population logs" -ForegroundColor Cyan
Write-Host "4. Fill out any missing fields and submit the form" -ForegroundColor Cyan

