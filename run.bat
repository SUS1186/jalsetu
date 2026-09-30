@echo off
title JalSetu Launcher
echo ========================================================
echo   Launching JalSetu (Backend + Frontend)
echo ========================================================

:: 1. Launch FastAPI Backend in a separate window
start "JalSetu Backend (FastAPI)" cmd /k "cd /d %~dp0 && call .venv\Scripts\activate.bat && uvicorn backend.app:app --host 127.0.0.1 --port 8000 --reload"

:: 2. Launch Vite Frontend in a separate window
start "JalSetu Frontend (React/Vite)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both servers have been launched in separate terminal windows.
echo - Backend API Docs: http://127.0.0.1:8000/docs
echo - Frontend App:     http://localhost:5173
echo ========================================================
