# UFML Smoke Tests
# Tests the complete workflow: Health → Upload → Analysis → Delete

param(
    [string]$ApiUrl = "http://127.0.0.1:8000",
    [string]$SamplePdfPath = "sample.pdf"
)

$ErrorActionPreference = "Stop"

Write-Host "🧪 UFML Smoke Tests" -ForegroundColor Green
Write-Host "API URL: $ApiUrl" -ForegroundColor Yellow
Write-Host ""

$TestResults = @()

function Test-Step {
    param(
        [string]$Name,
        [scriptblock]$TestScript
    )
    
    Write-Host "Testing: $Name" -ForegroundColor Cyan
    try {
        $result = & $TestScript
        Write-Host "✅ PASS: $Name" -ForegroundColor Green
        $TestResults += @{Name = $Name; Status = "PASS"; Result = $result}
        return $result
    }
    catch {
        Write-Host "❌ FAIL: $Name - $($_.Exception.Message)" -ForegroundColor Red
        $TestResults += @{Name = $Name; Status = "FAIL"; Error = $_.Exception.Message}
        throw
    }
}

try {
    # Test 1: Health Check
    $healthResult = Test-Step "Health Check" {
        $response = Invoke-RestMethod -Uri "$ApiUrl/healthz" -Method GET
        if ($response.ok -ne $true) {
            throw "Health check returned: $($response | ConvertTo-Json)"
        }
        return $response
    }

    # Test 2: AI Health Check
    $aiHealthResult = Test-Step "AI Health Check" {
        $response = Invoke-RestMethod -Uri "$ApiUrl/ai/health" -Method GET
        if (-not $response.ai_service) {
            throw "AI health check missing ai_service field"
        }
        return $response
    }

    # Test 3: Upload PDF (if sample exists)
    $uploadResult = $null
    if (Test-Path $SamplePdfPath) {
        $uploadResult = Test-Step "PDF Upload" {
            $boundary = [System.Guid]::NewGuid().ToString()
            $fileBytes = [System.IO.File]::ReadAllBytes($SamplePdfPath)
            
            $body = "--$boundary`r`n"
            $body += "Content-Disposition: form-data; name=`"file`"; filename=`"$(Split-Path $SamplePdfPath -Leaf)`"`r`n"
            $body += "Content-Type: application/pdf`r`n`r`n"
            $body += [System.Text.Encoding]::GetEncoding("iso-8859-1").GetString($fileBytes)
            $body += "`r`n--$boundary--`r`n"
            
            $response = Invoke-RestMethod -Uri "$ApiUrl/reports/upload?user_id=test-client&bureau=Experian" -Method POST -Body $body -ContentType "multipart/form-data; boundary=$boundary"
            
            if (-not $response.id) {
                throw "Upload response missing ID field"
            }
            return $response
        }
    } else {
        Write-Host "⚠️  SKIP: PDF Upload (no sample PDF found at $SamplePdfPath)" -ForegroundColor Yellow
        $TestResults += @{Name = "PDF Upload"; Status = "SKIP"; Reason = "No sample PDF"}
    }

    # Test 4: List Reports
    $reportsResult = Test-Step "List Reports" {
        $response = Invoke-RestMethod -Uri "$ApiUrl/reports" -Method GET
        if ($response -isnot [array]) {
            throw "Reports endpoint should return an array"
        }
        if ($uploadResult -and $response.Count -eq 0) {
            throw "Expected at least 1 report after upload"
        }
        return $response
    }

    # Test 5: AI Analysis (if we have a report)
    $analysisResult = $null
    if ($uploadResult -or $reportsResult.Count -gt 0) {
        $reportId = if ($uploadResult) { $uploadResult.id } else { $reportsResult[0].id }
        
        $analysisResult = Test-Step "AI Analysis" {
            $body = @{report_id = $reportId} | ConvertTo-Json
            $response = Invoke-RestMethod -Uri "$ApiUrl/reports/analyze" -Method POST -Body $body -ContentType "application/json"
            
            if (-not $response.summary) {
                throw "Analysis response missing summary field"
            }
            return $response
        }
    } else {
        Write-Host "⚠️  SKIP: AI Analysis (no reports available)" -ForegroundColor Yellow
        $TestResults += @{Name = "AI Analysis"; Status = "SKIP"; Reason = "No reports available"}
    }

    # Test 6: Delete Report (if we have one)
    if ($uploadResult -or $reportsResult.Count -gt 0) {
        $reportId = if ($uploadResult) { $uploadResult.id } else { $reportsResult[0].id }
        
        Test-Step "Delete Report" {
            Invoke-RestMethod -Uri "$ApiUrl/reports/$reportId" -Method DELETE
            return "Report deleted successfully"
        }
    } else {
        Write-Host "⚠️  SKIP: Delete Report (no reports available)" -ForegroundColor Yellow
        $TestResults += @{Name = "Delete Report"; Status = "SKIP"; Reason = "No reports available"}
    }

    # Summary
    Write-Host ""
    Write-Host "📊 Test Summary:" -ForegroundColor Green
    $passed = ($TestResults | Where-Object { $_.Status -eq "PASS" }).Count
    $failed = ($TestResults | Where-Object { $_.Status -eq "FAIL" }).Count
    $skipped = ($TestResults | Where-Object { $_.Status -eq "SKIP" }).Count
    
    Write-Host "✅ Passed: $passed" -ForegroundColor Green
    Write-Host "❌ Failed: $failed" -ForegroundColor Red
    Write-Host "⚠️  Skipped: $skipped" -ForegroundColor Yellow
    
    if ($failed -gt 0) {
        Write-Host ""
        Write-Host "Failed tests:" -ForegroundColor Red
        $TestResults | Where-Object { $_.Status -eq "FAIL" } | ForEach-Object {
            Write-Host "  - $($_.Name): $($_.Error)" -ForegroundColor Red
        }
        exit 1
    } else {
        Write-Host ""
        Write-Host "🎉 All tests passed!" -ForegroundColor Green
        exit 0
    }

}
catch {
    Write-Host ""
    Write-Host "💥 Smoke tests failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
