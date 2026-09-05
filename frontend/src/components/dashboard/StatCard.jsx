export function StatCard({ title, value, subtitle, icon, trend, color = 'slate' }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between text-left">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 flex items-center justify-center text-lg">
          {icon}
        </div>
      </div>

      <div className="mt-4">
        <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          {trend && (
            <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              {trend}
            </span>
          )}
          <span className="text-xs text-slate-500">{subtitle}</span>
        </div>
      </div>
    </div>
  );
}
