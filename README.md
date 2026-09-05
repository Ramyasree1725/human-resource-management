# TechNova HRMS - Enterprise Employee Management System

A production-grade, full-stack Employee Management System with real-time Dashboard, Employee Directory (CRUD), Leave Management, Attendance Tracking, Departments Org Hierarchy, Payroll & Salary Slip Generator, Analytics & Reports, and Mock Data Generation.

---

## 🚀 Quick Start Guide (ఎలా రన్ చేయాలి / How to Run)

### 1. Start the Backend Server (Node.js + Express)
Open a terminal in the project directory:
```bash
cd backend
npm install
npm start
```
> Server runs on `http://localhost:5000`

### 2. Start the Frontend Application (React + Vite + Tailwind)
Open a second terminal in the project directory:
```bash
cd frontend
npm install
npm run dev
```
> Web application starts on `http://localhost:3002` (or displayed Vite local URL).

---

## ✨ Features & Modules

1. **📊 Executive Dashboard**:
   - Total Workforce, Active staff, On Leave, and Pending Leave counts
   - Department headcount distribution bar chart
   - Employment status breakdown
   - Live activity & audit trail feed

2. **👥 Employee Directory & Profiles (Full CRUD)**:
   - Search by Name, Email, Employee ID, Designation, or Phone
   - Multi-filters: Department, Status, Employment Type, Work Location
   - Grid View & Table View toggle
   - Detailed Profile Modal (Overview, Compensation, Skills, Emergency Contacts)
   - Onboard new employees & Edit existing profiles
   - Export directory to CSV

3. **📅 Leave Management**:
   - Live Leave Balance breakdown cards (Annual, Sick, Casual, Comp-Off)
   - Request time-off / leave application modal
   - Filter requests by status (Pending, Approved, Rejected)
   - One-click HR Approval / Rejection with manager notes

4. **⏱️ Attendance Tracking**:
   - Daily punch logs, Check-In, Check-Out, and Hours Logged
   - Summary cards: In-Office Present, Work From Home (WFH), On Leave, Half-Day
   - Quick Check-in simulation button
   - Manual attendance override entry

5. **🏢 Departments & Organizational Hierarchy**:
   - 10 Department Cards with Department Head, Location, Budget Code, Target Headcount progress bar
   - Interactive Visual Org Chart Tree (C-Suite to Business Units)

6. **💰 Payroll & Salary Slips**:
   - Monthly Payroll ledger & total cost calculation
   - Automatic deduction calculation (Basic 50%, HRA 20%, Allowances 30%, EPF 12%, PT)
   - Official Corporate Payslip modal with Print/Save PDF support

7. **📈 Analytics & Reports**:
   - Average Annual CTC & Salary expenditure breakdown per department
   - Gender diversity ratio & retention index

8. **⚙️ Settings & Mock Data Generator**:
   - On-demand bulk test data generation (25, 50, 100, 250, 500 records)
   - One-click database reset
   - Real-time connection status indicator

---

## 🛠️ Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS, Plus Jakarta Sans
- **Backend**: Node.js, Express, CORS, Body-Parser, Morgan
- **Storage**: In-Memory Store + Resilient Local Client Sync (100% crash-proof)
