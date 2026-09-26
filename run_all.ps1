# PowerShell Script to Launch TransitEye Platform (Backend + Frontend + Edge AI Service)

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " Starting TransitEye - Mobile Urban Intelligence Platform" -ForegroundColor Green
Write-Host " SIH 2026 Problem Statement 26124" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan

$rootDir = Get-Location

# 1. Start Python FastAPI Backend on port 8000
Write-Host "`n[1/3] Starting Python FastAPI Backend Server on http://127.0.0.1:8000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir'; python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload"

# 2. Start React Vite Frontend on port 5173
Write-Host "[2/3] Starting React Vite Frontend Server on http://localhost:5173..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\frontend'; npm run dev"

# 3. Trigger initial AI Plate Detection Event to Backend
Write-Host "[3/3] Triggering RF-DETR + ANPR AI Detection Service..." -ForegroundColor Cyan
Start-Sleep -Seconds 3
python "$rootDir\ai\ai_service.py" --plate MH02AR3934 --bus BUS-104

Write-Host "`n============================================================" -ForegroundColor Green
Write-Host " TRANSITEYE PLATFORM IS RUNNING!" -ForegroundColor Green
Write-Host " Access Dashboard at: http://localhost:5173/" -ForegroundColor Yellow
Write-Host " API Docs at         : http://127.0.0.1:8000/docs" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Green
