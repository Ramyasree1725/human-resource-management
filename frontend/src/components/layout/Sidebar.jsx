import { useApp } from '../../context/AppContext';
import {
  IconDashboard,
  IconUsers,
  IconCalendar,
  IconClock,
  IconBuilding,
  IconDollar,
  IconAnalytics,
  IconSettings,
  IconBolt
} from '../common/Icons';

export function Sidebar() {
  const { activeTab, setActiveTab, stats } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: IconDashboard, badge: null },
    { id: 'work_reports', label: 'Daily Work Logs', icon: IconBolt, badge: 'Twice Daily', badgeColor: 'bg-slate-800 text-slate-200 border border-slate-700' },
    { id: 'employees', label: 'Employees', icon: IconUsers, badge: stats?.totalEmployees || null },
    { id: 'leaves', label: 'Leave Management', icon: IconCalendar, badge: stats?.pendingLeaves ? `${stats.pendingLeaves} new` : null, badgeColor: 'bg-slate-800 text-slate-200 border border-slate-700' },
    { id: 'attendance', label: 'Attendance', icon: IconClock, badge: null },
    { id: 'departments', label: 'Departments & Org', icon: IconBuilding, badge: '10' },
    { id: 'payroll', label: 'Payroll & Slips', icon: IconDollar, badge: null },
    { id: 'analytics', label: 'Analytics & Reports', icon: IconAnalytics, badge: null },
    { id: 'settings', label: 'Settings & Mock Data', icon: IconSettings, badge: null }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col shrink-0 border-r border-slate-800 select-none min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white text-slate-950 font-extrabold flex items-center justify-center shadow-md">
          <IconBolt className="w-5 h-5 text-slate-950" />
        </div>
        <div>
          <h1 className="font-bold text-base tracking-tight text-white m-0">TechNova HR</h1>
          <p className="text-xs text-slate-400 font-medium m-0">Enterprise Suite 2026</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto">
        <div className="px-3 pt-2 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Core Modules
        </div>

        {navItems.map(item => {
          const isActive = activeTab === item.id;
          const IconComp = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-white text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <IconComp className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-slate-950 text-white' : (item.badgeColor || 'bg-slate-800 text-slate-300')
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Company Info Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white text-slate-950 flex items-center justify-center text-xs font-bold shadow-xs">
            TN
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate m-0">TechNova Solutions</p>
            <p className="text-[11px] text-slate-400 truncate m-0">Bangalore, IN</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
