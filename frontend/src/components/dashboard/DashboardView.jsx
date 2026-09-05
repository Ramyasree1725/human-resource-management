import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { StatCard } from './StatCard';
import { DeptDistributionChart, StatusDistributionChart, RecentActivityList } from './DeptDistributionChart';
import { Loader } from '../common/Loader';
import {
  IconUsers,
  IconBolt,
  IconCalendar,
  IconClock,
  IconDollar,
  IconBuilding,
  IconPlus
} from '../common/Icons';

export function DashboardView({ onOpenAddModal }) {
  const { stats, setActiveTab } = useApp();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await api.getAuditLogs();
        if (res.data) setLogs(res.data);
      } catch (e) {
        // silent fallback
      }
    }
    loadLogs();
  }, []);

  if (!stats) return <Loader text="Loading Enterprise Dashboard..." />;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-8 shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            TechNova Enterprise Portal • Online
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white m-0">
            Welcome to TechNova HRMS
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm m-0 leading-relaxed">
            Real-time organizational headcount, attendance logs, and daily work submissions.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2.5 bg-white text-slate-950 hover:bg-slate-100 text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <IconPlus className="w-4 h-4 text-slate-950" />
            <span>Onboard Employee</span>
          </button>
          <button
            onClick={() => setActiveTab('work_reports')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center gap-2"
          >
            <IconBolt className="w-4 h-4 text-slate-300" />
            <span>Daily Work Logs</span>
          </button>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Workforce"
          value={stats.totalEmployees}
          subtitle="Registered staff members"
          trend="+12% this qtr"
          color="slate"
          icon={<IconUsers className="w-5 h-5" />}
        />
        <StatCard
          title="Active Headcount"
          value={stats.activeEmployees}
          subtitle="On-duty staff members"
          trend="96.2% operational"
          color="slate"
          icon={<IconBolt className="w-5 h-5" />}
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingLeaves}
          subtitle="Awaiting supervisor action"
          color="slate"
          icon={<IconCalendar className="w-5 h-5" />}
        />
        <StatCard
          title="Monthly Payroll CTC"
          value={formatCurrency(stats.totalPayroll / 12)}
          subtitle="Gross monthly disbursement"
          color="slate"
          icon={<IconDollar className="w-5 h-5" />}
        />
      </div>

      {/* Charts & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DeptDistributionChart distribution={stats.departmentDistribution} />
        </div>
        <div>
          <StatusDistributionChart distribution={stats.statusDistribution} />
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveTab('work_reports')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-slate-400 hover:shadow-md transition-all cursor-pointer group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-slate-900 text-slate-900 group-hover:text-white flex items-center justify-center transition-colors font-bold">
              ☀️
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-slate-900 transition-colors m-0">
                Daily Work Submissions
              </h4>
              <p className="text-xs text-slate-500 m-0">Morning & afternoon shift logs</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('employees')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-slate-400 hover:shadow-md transition-all cursor-pointer group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-slate-900 text-slate-900 group-hover:text-white flex items-center justify-center transition-colors">
              <IconUsers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-slate-900 transition-colors m-0">
                Employee Directory
              </h4>
              <p className="text-xs text-slate-500 m-0">Browse {stats.totalEmployees} employee profiles</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('attendance')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-slate-400 hover:shadow-md transition-all cursor-pointer group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-slate-900 text-slate-900 group-hover:text-white flex items-center justify-center transition-colors">
              <IconClock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-slate-900 transition-colors m-0">
                Daily Attendance
              </h4>
              <p className="text-xs text-slate-500 m-0">Punch logs, shifts & hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Logs & Quick Insights */}
      <RecentActivityList logs={logs} />
    </div>
  );
}
