import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { DashboardView } from '../dashboard/DashboardView';
import { EmployeesView } from '../employees/EmployeesView';
import { LeavesView } from '../leaves/LeavesView';
import { AttendanceView } from '../attendance/AttendanceView';
import { WorkReportsView } from '../workReports/WorkReportsView';
import { DepartmentsView } from '../departments/DepartmentsView';
import { PayrollView } from '../payroll/PayrollView';
import { AnalyticsView } from '../analytics/AnalyticsView';
import { SettingsView } from '../settings/SettingsView';

export function Layout() {
  const { activeTab } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans antialiased text-slate-800 text-left">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar */}
        <Navbar onOpenAddModal={() => setIsAddModalOpen(true)} />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <DashboardView onOpenAddModal={() => setIsAddModalOpen(true)} />}
            {activeTab === 'work_reports' && <WorkReportsView />}
            {activeTab === 'employees' && (
              <EmployeesView isAddModalOpen={isAddModalOpen} setIsAddModalOpen={setIsAddModalOpen} />
            )}
            {activeTab === 'leaves' && <LeavesView />}
            {activeTab === 'attendance' && <AttendanceView />}
            {activeTab === 'departments' && <DepartmentsView />}
            {activeTab === 'payroll' && <PayrollView />}
            {activeTab === 'analytics' && <AnalyticsView />}
            {activeTab === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>
    </div>
  );
}
