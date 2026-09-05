# PowerShell Script to Launch UrbanSentinel AI (Backend + Frontend)

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " Starting TransitEye - Mobile Urban Intelligence Platform" -ForegroundColor Green
Write-Host " SIH 2026 Problem Statement 26124" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan

$rootDir = Get-Location

# Start Python FastAPI Backend in background window
Write-Host "`n[1/2] Starting Python FastAPI Backend Server on port 8000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir'; python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000"

# Start Vite React Frontend in current terminal window
Write-Host "[2/2] Starting React Vite Frontend Server on port 5173..." -ForegroundColor Cyan
Set-Location "$rootDir\frontend"
npm run dev
