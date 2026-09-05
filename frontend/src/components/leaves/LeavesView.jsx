import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { LeaveBalanceCards, LeaveRequestModal } from './LeaveBalanceCards';
import { LeaveStatusBadge } from '../common/Badge';
import { Loader } from '../common/Loader';
import { IconCalendar, IconPlus, IconCheckCircle } from '../common/Icons';
import { LEAVE_TYPES } from '../../constants/metaConstants';

export function LeavesView() {
  const { triggerRefresh, addToast } = useApp();
  const [leaves, setLeaves] = useState([]);
  const [allLeavesCount, setAllLeavesCount] = useState({ pending: 0, approved: 0, rejected: 0, all: 0 });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getLeaves({ status: statusFilter });
      if (res.data) setLeaves(res.data);

      const allRes = await api.getLeaves({ status: 'ALL' });
      if (allRes.data) {
        setAllLeavesCount({
          all: allRes.data.length,
          pending: allRes.data.filter(l => l.status === 'PENDING' || l.status === 'Pending').length,
          approved: allRes.data.filter(l => l.status === 'APPROVED' || l.status === 'Approved').length,
          rejected: allRes.data.filter(l => l.status === 'REJECTED' || l.status === 'Rejected').length
        });
      }

      const empRes = await api.getEmployees({ limit: 100 });
      if (empRes.data) setEmployees(empRes.data);
    } catch (e) {
      addToast('Failed to load leave records', 'error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, addToast]);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const handleApplyLeave = async (leaveData) => {
    try {
      await api.applyLeave(leaveData);
      addToast('Leave application submitted successfully!', 'success');
      triggerRefresh();
      fetchLeaves();
    } catch (e) {
      addToast('Failed to submit leave application', 'error');
    }
  };

  const handleStatusUpdate = async (leaveId, newStatus) => {
    try {
      setLeaves(prev => {
        if (statusFilter === 'PENDING') {
          return prev.filter(l => l.id !== leaveId);
        }
        return prev.map(l => l.id === leaveId ? { ...l, status: newStatus } : l);
      });

      await api.updateLeaveStatus(leaveId, newStatus, `Action marked by HR Manager at ${new Date().toLocaleTimeString()}`);
      addToast(`Leave request ${newStatus.toLowerCase()} successfully`, newStatus === 'APPROVED' ? 'success' : 'warning');
      triggerRefresh();
      fetchLeaves();
    } catch (e) {
      addToast('Failed to update leave status', 'error');
      fetchLeaves();
    }
  };

  const filterTabs = [
    { key: 'PENDING', label: 'Pending Approvals', count: allLeavesCount.pending },
    { key: 'APPROVED', label: 'Approved', count: allLeavesCount.approved },
    { key: 'REJECTED', label: 'Rejected', count: allLeavesCount.rejected },
    { key: 'ALL', label: 'All History', count: allLeavesCount.all }
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight m-0">Leave & Time-Off Approvals</h2>
          <p className="text-xs text-slate-500 m-0">Review pending employee requests. Approved and rejected items automatically move out of the pending queue.</p>
        </div>

        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-center"
        >
          <IconPlus className="w-4 h-4" />
          <span>Apply Time-Off</span>
        </button>
      </div>

      {/* Leave Balance Overview Cards */}
      <LeaveBalanceCards />

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">Queue:</span>
          {filterTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                statusFilter === tab.key
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                statusFilter === tab.key ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-medium shrink-0">
          Showing <strong>{leaves.length}</strong> request(s)
        </span>
      </div>

      {/* Leave Requests Table */}
      {loading ? (
        <Loader text="Loading leave requests..." />
      ) : leaves.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 text-base font-bold">
            ✓
          </div>
          <p className="text-sm font-semibold text-slate-800">
            {statusFilter === 'PENDING' ? 'No pending leave requests!' : `No ${statusFilter.toLowerCase()} leave records found.`}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {statusFilter === 'PENDING' ? 'All employee leave requests have been reviewed and resolved.' : 'Records will appear here as requests are processed.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Leave ID & Employee</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Dates & Duration</th>
                  <th className="py-3.5 px-4">Reason / Notes</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Approval Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaves.map(lv => {
                  const typeMeta = LEAVE_TYPES[lv.leaveType] || { label: lv.leaveType };

                  return (
                    <tr key={lv.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900 m-0">{lv.employeeName}</p>
                        <p className="text-[11px] font-mono text-slate-400 m-0">{lv.leaveId} • {lv.employeeId}</p>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                          {typeMeta.label}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-800 m-0">{lv.startDate} to {lv.endDate}</p>
                        <p className="text-[11px] text-slate-400 m-0">{lv.days} day(s)</p>
                      </td>

                      <td className="py-3 px-4 max-w-[220px]">
                        <p className="text-slate-700 m-0 truncate" title={lv.reason}>{lv.reason}</p>
                        {lv.managerNotes && (
                          <p className="text-[10px] text-slate-400 m-0 italic mt-0.5 truncate">{lv.managerNotes}</p>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <LeaveStatusBadge status={lv.status} />
                      </td>

                      <td className="py-3 px-4 text-right">
                        {lv.status === 'PENDING' || lv.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleStatusUpdate(lv.id, 'APPROVED')}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg transition-colors cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(lv.id, 'REJECTED')}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Resolved ({lv.status})</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leave Apply Modal */}
      <LeaveRequestModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onApply={handleApplyLeave}
        employees={employees}
      />
    </div>
  );
}
