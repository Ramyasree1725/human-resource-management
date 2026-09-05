import { useState } from 'react';
import { Modal } from '../common/Modal';
import { LEAVE_TYPES } from '../../constants/metaConstants';
import { IconCalendar, IconClock, IconShield, IconBriefcase } from '../common/Icons';

export function LeaveBalanceCards() {
  const balances = [
    { type: 'Annual Leave (AL)', balance: 18, total: 24, color: 'border-blue-200 bg-blue-50/50 text-blue-700', icon: IconCalendar },
    { type: 'Sick Leave (SL)', balance: 9, total: 12, color: 'border-rose-200 bg-rose-50/50 text-rose-700', icon: IconShield },
    { type: 'Casual Leave (CL)', balance: 5, total: 8, color: 'border-purple-200 bg-purple-50/50 text-purple-700', icon: IconBriefcase },
    { type: 'Compensatory Off', balance: 3, total: 5, color: 'border-emerald-200 bg-emerald-50/50 text-emerald-700', icon: IconClock }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {balances.map((b, idx) => {
        const IconComp = b.icon;
        return (
          <div key={idx} className={`p-4 rounded-2xl border ${b.color} flex items-center justify-between shadow-xs`}>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 m-0">{b.type}</p>
              <p className="text-2xl font-extrabold text-slate-900 m-0 mt-1">
                {b.balance} <span className="text-xs font-normal text-slate-500">/ {b.total} days</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center">
              <IconComp className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function LeaveRequestModal({ isOpen, onClose, onApply, employees = [] }) {
  const [formData, setFormData] = useState({
    employeeId: employees[0]?.employeeId || 'EMP01001',
    leaveType: 'ANNUAL',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    days: 1,
    reason: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'startDate' || name === 'endDate') {
        const d1 = new Date(next.startDate);
        const d2 = new Date(next.endDate);
        const diffTime = Math.abs(d2 - d1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        next.days = isNaN(diffDays) ? 1 : diffDays;
      }
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.reason.trim()) {
      alert('Please provide a reason for the leave');
      return;
    }
    onApply(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Apply For Time Off / Leave" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Applying Employee *</label>
          <select
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none cursor-pointer font-medium"
          >
            {employees.map(emp => (
              <option key={emp.id} value={emp.employeeId}>
                {emp.firstName} {emp.lastName} ({emp.employeeId})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Leave Category *</label>
          <select
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none cursor-pointer font-medium"
          >
            {Object.keys(LEAVE_TYPES).map(key => (
              <option key={key} value={key}>
                {LEAVE_TYPES[key].label} (Max {LEAVE_TYPES[key].maxDays} days)
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Start Date *</label>
            <input
              type="date"
              name="startDate"
              required
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none font-medium cursor-pointer"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">End Date *</label>
            <input
              type="date"
              name="endDate"
              required
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none font-medium cursor-pointer"
            />
          </div>
        </div>

        <div className="p-3 bg-indigo-50 text-indigo-900 rounded-xl flex items-center justify-between font-semibold">
          <span>Total Working Days Requested:</span>
          <span className="text-base font-extrabold">{formData.days} Day(s)</span>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Reason / Notes *</label>
          <textarea
            name="reason"
            rows="3"
            required
            placeholder="Specify reason for time off..."
            value={formData.reason}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
          ></textarea>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-600/25 transition-colors cursor-pointer"
          >
            Submit Leave Request
          </button>
        </div>
      </form>
    </Modal>
  );
}
