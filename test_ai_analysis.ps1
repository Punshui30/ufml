# Test AI Analysis Script
Write-Host "=== TESTING AI ANALYSIS ===" -ForegroundColor Green

# Test 1: Check if backend is running
Write-Host "`n1. Checking backend health..." -ForegroundColor Yellow
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

# Test 2: Get a report ID
Write-Host "`n2. Getting report ID..." -ForegroundColor Yellow
$reports = Invoke-WebRequest -Uri "http://127.0.0.1:8000/reports" -Method GET
$reportsJson = $reports.Content | ConvertFrom-Json
$reportId = $reportsJson[0].id
Write-Host "✅ Using report ID: $reportId" -ForegroundColor Green

# Test 3: Test AI analysis
Write-Host "`n3. Testing AI analysis..." -ForegroundColor Yellow
$body = @{report_id=$reportId} | ConvertTo-Json
$analysis = Invoke-WebRequest -Uri "http://127.0.0.1:8000/reports/analyze" -Method POST -Body $body -ContentType "application/json"
$analysisJson = $analysis.Content | ConvertFrom-Json

Write-Host "✅ AI Analysis completed" -ForegroundColor Green
Write-Host "   AI Service: $($analysisJson.ai_service)" -ForegroundColor Cyan
Write-Host "   Response size: $($analysis.Content.Length) bytes" -ForegroundColor Cyan
Write-Host "   Summary keys: $($analysisJson.summary.PSObject.Properties.Name -join ', ')" -ForegroundColor Cyan

# Test 4: Check for dispute opportunities
Write-Host "`n4. Checking dispute opportunities..." -ForegroundColor Yellow
if ($analysisJson.summary.dispute_opportunities) {
    Write-Host "✅ Found $($analysisJson.summary.dispute_opportunities.Count) dispute opportunities" -ForegroundColor Green
    if ($analysisJson.summary.dispute_opportunities.Count -gt 0) {
        $firstDispute = $analysisJson.summary.dispute_opportunities[0]
        Write-Host "   First dispute:" -ForegroundColor Cyan
        Write-Host "     Account: $($firstDispute.account_name)" -ForegroundColor White
        Write-Host "     Reason: $($firstDispute.reason_description)" -ForegroundColor White
    }
} else {
    Write-Host "❌ No dispute_opportunities field found" -ForegroundColor Red
}

# Test 5: Check other AI fields
Write-Host "`n5. Checking other AI fields..." -ForegroundColor Yellow
$aiFields = @('e_oscar_workarounds', 'procedural_disputes', 'advanced_dispute_plan', 'specialty_bureau_targets')
foreach ($field in $aiFields) {
    if ($analysisJson.summary.$field) {
        Write-Host "✅ Found $field" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing $field" -ForegroundColor Red
    }
}

Write-Host "`n=== AI ANALYSIS TEST COMPLETE ===" -ForegroundColor Green
