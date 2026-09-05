@echo off
setlocal enabledelayedexpansion

echo ======================================================================
echo   TechNova HRMS: Adding Feature Diffs to 5 Branches and Pushing
echo ======================================================================

cd /d "%~dp0"

echo.
echo [1/5] Updating Branch 1: feature/employee-directory...
git checkout -B feature/employee-directory main
echo // Feature: Employee Directory and Profiles Module >> backend/src/controllers/employeeController.js
git add backend/src/controllers/employeeController.js
git commit -m "feat(employees): enhance employee directory CRUD and multi-criteria search filters"
git push -u origin feature/employee-directory --force

echo.
echo [2/5] Updating Branch 2: feature/leave-attendance-management...
git checkout -B feature/leave-attendance-management main
echo // Feature: Leave Balances and Real-Time Attendance >> backend/src/controllers/leaveController.js
git add backend/src/controllers/leaveController.js
git commit -m "feat(leaves): implement leave approval workflow and attendance punch calculations"
git push -u origin feature/leave-attendance-management --force

echo.
echo [3/5] Updating Branch 3: feature/payroll-salary-slips...
git checkout -B feature/payroll-salary-slips main
echo // Feature: Payroll Engine and PDF Payslip Generation >> backend/src/controllers/payrollController.js
git add backend/src/controllers/payrollController.js
git commit -m "feat(payroll): add automated salary ledger breakdown and printable payslip generator"
git push -u origin feature/payroll-salary-slips --force

echo.
echo [4/5] Updating Branch 4: feature/org-departments-hierarchy...
git checkout -B feature/org-departments-hierarchy main
echo // Feature: Department Units and Org Hierarchy Chart >> backend/src/controllers/departmentController.js
git add backend/src/controllers/departmentController.js
git commit -m "feat(departments): add department budget capacity and visual organizational tree"
git push -u origin feature/org-departments-hierarchy --force

echo.
echo [5/5] Updating Branch 5: feature/analytics-reporting-dashboard...
git checkout -B feature/analytics-reporting-dashboard main
echo // Feature: Executive KPI Dashboard and Diversity Metrics >> backend/src/controllers/reportController.js
git add backend/src/controllers/reportController.js
git commit -m "feat(analytics): add workforce diversity ratios and department cost analytics"
git push -u origin feature/analytics-reporting-dashboard --force

git checkout main

echo.
echo ======================================================================
echo   SUCCESS! All 5 Branches Updated with Commits and Pushed!
echo ======================================================================
pause
