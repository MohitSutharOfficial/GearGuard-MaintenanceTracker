# GearGuard Backend - Start Script
# This script loads environment variables and starts the server

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Starting GearGuard Backend Server   " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to backend directory
Set-Location $PSScriptRoot\backend

# Check if .env exists
if (-Not (Test-Path ".env")) {
    Write-Host "ERROR: .env file not found!" -ForegroundColor Red
    Write-Host "Expected location: $PSScriptRoot\backend\.env" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please create a .env file with your Supabase credentials." -ForegroundColor Yellow
    pause
    exit 1
}

# Load and set environment variables
Write-Host "Loading environment variables..." -ForegroundColor Yellow
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^#][^=]+)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        Set-Item -Path "env:$name" -Value $value
        Write-Host "   Set $name" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Starting Node.js server..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop" -ForegroundColor Gray
Write-Host ""

# Start the server
npm run dev
