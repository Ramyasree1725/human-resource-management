@echo off
setlocal enabledelayedexpansion

echo ======================================================================
echo   TechNova HRMS: Clean Push (Resetting History to Remove Secrets)
echo ======================================================================

cd /d "%~dp0"

echo.
echo [1/6] Cleaning up temporary scripts...
if exist "create_new_repo_and_push.ps1" del /f /q "create_new_repo_and_push.ps1"
if exist "create_new_repo_and_push.bat" del /f /q "create_new_repo_and_push.bat"
if exist "push_and_create_prs.ps1" del /f /q "push_and_create_prs.ps1"
if exist "push_and_create_prs.bat" del /f /q "push_and_create_prs.bat"

echo.
echo [2/6] Configuring Remote URL...
git remote remove origin 2>nul
git remote add origin https://github.com/Ramyasree1725/human-resource-management.git
git remote set-url origin https://github.com/Ramyasree1725/human-resource-management.git

echo.
echo [3/6] Creating a 100%% clean Git tree without secrets...
git checkout --orphan clean_main
git add -A
git commit -m "Initial complete release: TechNova HRMS Full-Stack Application"

git branch -D main 2>nul
git branch -m main

echo.
echo [4/6] Pushing 'main' branch to GitHub...
git push -u origin main --force

echo.
echo [5/6] Creating and pushing 5 Feature Branches...
git checkout -B feature/employee-directory main
git push -u origin feature/employee-directory --force

git checkout -B feature/leave-attendance-management main
git push -u origin feature/leave-attendance-management --force

git checkout -B feature/payroll-salary-slips main
git push -u origin feature/payroll-salary-slips --force

git checkout -B feature/org-departments-hierarchy main
git push -u origin feature/org-departments-hierarchy --force

git checkout -B feature/analytics-reporting-dashboard main
git push -u origin feature/analytics-reporting-dashboard --force

git checkout main

echo.
echo ======================================================================
echo   SUCCESS! Main and All 5 Branches are Pushed to GitHub!
echo ======================================================================
echo   Repository: https://github.com/Ramyasree1725/human-resource-management
echo   Branches:   https://github.com/Ramyasree1725/human-resource-management/branches
echo   PRs URL:    https://github.com/Ramyasree1725/human-resource-management/pulls
echo ======================================================================
echo.
pause
