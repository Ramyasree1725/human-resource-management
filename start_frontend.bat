@echo off
title TechNova Frontend Web App
cd /d %~dp0frontend
echo Starting Frontend on http://localhost:3002...
npm run dev
pause
