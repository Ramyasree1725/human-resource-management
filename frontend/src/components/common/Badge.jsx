import { EMPLOYEE_STATUSES } from '../../constants/metaConstants';

export function StatusBadge({ status }) {
  const meta = EMPLOYEE_STATUSES[status] || {
    label: status || 'Unknown',
    color: '#6b7280',
    bg: '#f3f4f6',
    text: '#374151'
  };

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold select-none"
      style={{ backgroundColor: meta.bg, color: meta.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.color }}></span>
      {meta.label}
    </span>
  );
}

export function LeaveStatusBadge({ status }) {
  const styles = {
    APPROVED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
    REJECTED: 'bg-rose-100 text-rose-800 border-rose-200'
  };

  const statusIcons = {
    APPROVED: '✓',
    PENDING: '•',
    REJECTED: '✕'
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold border ${styles[status] || 'bg-slate-100 text-slate-800'}`}>
      <span>{statusIcons[status] || ''}</span>
      <span>{status}</span>
    </span>
  );
}
