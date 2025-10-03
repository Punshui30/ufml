# Complete Workflow Test Script
Write-Host "=== UFML CREDIT PLATFORM WORKFLOW TEST ===" -ForegroundColor Green

# Test 1: Backend Health
Write-Host "`n1. Testing Backend Health..." -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest -Uri "http://127.0.0.1:8000/healthz" -Method GET
    if ($health.StatusCode -eq 200) {
        Write-Host "✅ Backend is healthy" -ForegroundColor Green
    } else {
        Write-Host "❌ Backend health check failed" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Backend is not running" -ForegroundColor Red
    exit 1
}

# Test 2: List Reports
Write-Host "`n2. Testing Report Listing..." -ForegroundColor Yellow
try {
    $reports = Invoke-WebRequest -Uri "http://127.0.0.1:8000/reports" -Method GET
    $reportsJson = $reports.Content | ConvertFrom-Json
    Write-Host "✅ Found $($reportsJson.Count) reports" -ForegroundColor Green
    if ($reportsJson.Count -gt 0) {
        Write-Host "   Latest report: $($reportsJson[0].filename)" -ForegroundColor Cyan
        $reportId = $reportsJson[0].id
    } else {
        Write-Host "❌ No reports found - upload a report first" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Failed to list reports" -ForegroundColor Red
    exit 1
}

# Test 3: AI Analysis
Write-Host "`n3. Testing AI Analysis..." -ForegroundColor Yellow
try {
    $body = @{report_id=$reportId} | ConvertTo-Json
    $analysis = Invoke-WebRequest -Uri "http://127.0.0.1:8000/reports/analyze" -Method POST -Body $body -ContentType "application/json"
    $analysisJson = $analysis.Content | ConvertFrom-Json
    Write-Host "✅ AI Analysis completed" -ForegroundColor Green
    Write-Host "   AI Service: $($analysisJson.ai_service)" -ForegroundColor Cyan
    Write-Host "   Accounts found: $($analysisJson.summary.accounts.Count)" -ForegroundColor Cyan
    if ($analysisJson.summary.accounts.Count -gt 0) {
        Write-Host "   First creditor: $($analysisJson.summary.accounts[0].creditor_name)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ AI Analysis failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: List Clients
Write-Host "`n4. Testing Client Listing..." -ForegroundColor Yellow
try {
    $clients = Invoke-WebRequest -Uri "http://127.0.0.1:8000/clients" -Method GET
    $clientsJson = $clients.Content | ConvertFrom-Json
    Write-Host "✅ Found $($clientsJson.clients.Count) clients" -ForegroundColor Green
    if ($clientsJson.clients.Count -gt 0) {
        $clientId = $clientsJson.clients[0].id
        Write-Host "   First client: $($clientsJson.clients[0].email)" -ForegroundColor Cyan
    } else {
        Write-Host "❌ No clients found" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Failed to list clients" -ForegroundColor Red
    exit 1
}

# Test 5: Create Dispute
Write-Host "`n5. Testing Dispute Creation..." -ForegroundColor Yellow
try {
    $disputeBody = @{
        user_id = $clientId
        target = "CRA"
        bureau = "Equifax"
        reason_code = "FACTUAL_DISPUTE"
        narrative = "Test dispute from workflow test script"
    } | ConvertTo-Json
    
    $dispute = Invoke-WebRequest -Uri "http://127.0.0.1:8000/disputes" -Method POST -Body $disputeBody -ContentType "application/json"
    $disputeJson = $dispute.Content | ConvertFrom-Json
    Write-Host "✅ Dispute created successfully" -ForegroundColor Green
    Write-Host "   Dispute ID: $($disputeJson.dispute_id)" -ForegroundColor Cyan
    Write-Host "   Status: $($disputeJson.status)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Dispute creation failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: List Disputes
Write-Host "`n6. Testing Dispute Listing..." -ForegroundColor Yellow
try {
    $disputes = Invoke-WebRequest -Uri "http://127.0.0.1:8000/disputes" -Method GET
    $disputesJson = $disputes.Content | ConvertFrom-Json
    Write-Host "✅ Found $($disputesJson.Count) disputes" -ForegroundColor Green
    if ($disputesJson.Count -gt 0) {
        Write-Host "   Latest dispute: $($disputesJson[-1].reason_code)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Failed to list disputes" -ForegroundColor Red
}

# Test 7: Frontend Health
Write-Host "`n7. Testing Frontend Health..." -ForegroundColor Yellow
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

Write-Host "`n=== WORKFLOW TEST COMPLETE ===" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Open http://localhost:3000 in your browser" -ForegroundColor Cyan
Write-Host "2. Navigate to Disputes → Create New Dispute" -ForegroundColor Cyan
Write-Host "3. Fill out the form completely:" -ForegroundColor Cyan
Write-Host "   - Select a client from dropdown" -ForegroundColor White
Write-Host "   - Select a credit bureau" -ForegroundColor White
Write-Host "   - Select a dispute reason" -ForegroundColor White
Write-Host "   - Add additional details" -ForegroundColor White
Write-Host "4. Click 'Create Dispute Letter'" -ForegroundColor Cyan
Write-Host "5. Check browser console for any errors" -ForegroundColor Cyan

