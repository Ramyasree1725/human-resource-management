import { DEPARTMENTS } from '../../constants/metaConstants';

export function DeptDistributionChart({ distribution = {} }) {
  const total = Object.values(distribution).reduce((a, b) => a + b, 0) || 1;

  const sortedDepts = DEPARTMENTS.map(d => ({
    ...d,
    count: distribution[d.id] || 0,
    pct: Math.round(((distribution[d.id] || 0) / total) * 100)
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm text-left">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h4 className="text-sm font-bold text-slate-800 m-0">Department Distribution</h4>
          <p className="text-xs text-slate-500 m-0">Headcount allocation across business units</p>
        </div>
        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
          {total} Total Staff
        </span>
      </div>

      <div className="space-y-3.5">
        {sortedDepts.slice(0, 6).map(dept => (
          <div key={dept.id}>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-700 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dept.color }}></span>
                {dept.name}
              </span>
              <span className="text-slate-500 font-semibold">{dept.count} ({dept.pct}%)</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(dept.pct, dept.count > 0 ? 3 : 0)}%`,
                  backgroundColor: dept.color
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatusDistributionChart({ distribution = {} }) {
  const statuses = [
    { key: 'ACTIVE', label: 'Active', color: '#10b981', bg: 'bg-emerald-500' },
    { key: 'ON_PROBATION', label: 'On Probation', color: '#f59e0b', bg: 'bg-amber-500' },
    { key: 'ON_LEAVE', label: 'On Leave', color: '#3b82f6', bg: 'bg-blue-500' },
    { key: 'NOTICE_PERIOD', label: 'Notice Period', color: '#f97316', bg: 'bg-orange-500' },
    { key: 'INACTIVE', label: 'Inactive / Other', color: '#6b7280', bg: 'bg-slate-400' }
  ];

  const total = Object.values(distribution).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm text-left">
      <div className="mb-5">
        <h4 className="text-sm font-bold text-slate-800 m-0">Employment Status Breakdown</h4>
        <p className="text-xs text-slate-500 m-0">Workforce operational status</p>
      </div>

      <div className="space-y-4">
        {statuses.map(st => {
          const count = distribution[st.key] || 0;
          const pct = Math.round((count / total) * 100);
          return (
            <div key={st.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-md ${st.bg}`}></span>
                <span className="text-xs font-semibold text-slate-700">{st.label}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-slate-900">{count}</span>
                <span className="text-xs text-slate-400 ml-1">({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function RecentActivityList({ logs = [] }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm text-left">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-slate-800 m-0">Recent Activity & Audit Logs</h4>
        <span className="text-xs text-slate-400">Live feed</span>
      </div>

      <div className="divide-y divide-slate-100">
        {logs.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No recent activity logs.</p>
        ) : (
          logs.slice(0, 5).map(log => (
            <div key={log.id} className="py-3 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs shrink-0 mt-0.5">
                📝
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-800 m-0 leading-relaxed">{log.details || log.action}</p>
                <p className="text-[10px] text-slate-400 m-0 mt-0.5">{new Date(log.timestamp).toLocaleTimeString()} • {new Date(log.timestamp).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
