@echo off
title TechNova HRMS Launcher
echo ========================================================
echo       TechNova HRMS - Starting Backend and Frontend
echo ========================================================
echo.

echo [1/3] Starting Backend Server (Port 5000)...
start "TechNova Backend Server" cmd /k "cd /d %~dp0backend && npm install && npm start"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Frontend Web App (Vite)...
start "TechNova Frontend App" cmd /k "cd /d %~dp0frontend && npm install && npm run dev"

timeout /t 3 /nobreak >nul

echo [3/3] Opening Web App in your browser...
start http://localhost:3002

echo.
echo ========================================================
echo  Both Backend and Frontend are now running!
echo  Backend:  http://localhost:5000
echo  Frontend: http://localhost:3002
echo ========================================================
pause
