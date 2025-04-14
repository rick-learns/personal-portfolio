# PowerShell Integration Test Script for Portfolio Backend
# This script tests the API endpoints of the Portfolio backend

Write-Host "Starting integration tests for Portfolio Backend..." -ForegroundColor Cyan

# Ensure script exits on error
$ErrorActionPreference = "Stop"

# Ask for port
$port = Read-Host "Enter the port number your server is running on (default: 8081)"
if ([string]::IsNullOrWhiteSpace($port)) {
    $port = "8081"
}

# Configuration
$baseUrl = "http://localhost:$port"
$healthEndpoint = "$baseUrl/health"
$contactEndpoint = "$baseUrl/api/v1/contact"

Write-Host "Testing against server at $baseUrl" -ForegroundColor Cyan

# Test health endpoint
Write-Host "`nTesting health endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri $healthEndpoint -Method Get
    Write-Host "Health endpoint response:" -ForegroundColor Green
    $response | ConvertTo-Json
    
    # Check if status contains "Operational" regardless of the emoji
    if ($response.status -like "*Operational*") {
        Write-Host "✅ Health check passed!" -ForegroundColor Green
    } else {
        Write-Host "❌ Health check failed: Unexpected status" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Health check failed: $_" -ForegroundColor Red
    exit 1
}

# Test contact endpoint - Invalid request (missing fields)
Write-Host "`nTesting contact endpoint with invalid data (missing fields)..." -ForegroundColor Yellow
$invalidPayload = @{
    name = "Integration Test"
    # Missing email
    message = "This is a test message."
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $contactEndpoint -Method Post -Body $invalidPayload -ContentType "application/json"
    Write-Host "❌ Invalid request was accepted (should have failed)" -ForegroundColor Red
    exit 1
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 400) {
        Write-Host "✅ Contact endpoint correctly rejected invalid data" -ForegroundColor Green
    } else {
        Write-Host "❌ Contact endpoint invalid test failed: Unexpected status code $statusCode" -ForegroundColor Red
        exit 1
    }
}

# Test contact endpoint - Invalid request (invalid email)
Write-Host "`nTesting contact endpoint with invalid data (invalid email)..." -ForegroundColor Yellow
$invalidEmailPayload = @{
    name = "Integration Test"
    email = "not-an-email"
    message = "This is a test message with an invalid email."
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $contactEndpoint -Method Post -Body $invalidEmailPayload -ContentType "application/json"
    Write-Host "❌ Invalid email was accepted (should have failed)" -ForegroundColor Red
    exit 1
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 400) {
        Write-Host "✅ Contact endpoint correctly rejected invalid email" -ForegroundColor Green
    } else {
        Write-Host "❌ Contact endpoint invalid email test failed: Unexpected status code $statusCode" -ForegroundColor Red
        exit 1
    }
}

# Test contact endpoint - Valid request (optional - sends a real email)
$sendRealEmail = Read-Host "Would you like to test sending a real email? (y/n)"
if ($sendRealEmail -eq "y") {
    Write-Host "`nTesting contact endpoint with valid data (will send real email)..." -ForegroundColor Yellow
    $validPayload = @{
        name = "Integration Test"
        email = "test@example.com"
        message = "This is an automated test message from the integration test script."
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri $contactEndpoint -Method Post -Body $validPayload -ContentType "application/json"
        Write-Host "Contact endpoint response:" -ForegroundColor Green
        $response | ConvertTo-Json
        
        if ($response.message -eq "Message sent successfully!") {
            Write-Host "✅ Contact endpoint valid test passed!" -ForegroundColor Green
            Write-Host "✅ Check your email at rickykcohen@gmail.com for the test message" -ForegroundColor Green
        } else {
            Write-Host "❌ Contact endpoint valid test failed: Unexpected response" -ForegroundColor Red
            exit 1
        }
    } catch {
        Write-Host "❌ Contact endpoint valid test failed: $_" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Skipping real email test" -ForegroundColor Yellow
}

Write-Host "`n🎉 All integration tests passed!" -ForegroundColor Cyan
