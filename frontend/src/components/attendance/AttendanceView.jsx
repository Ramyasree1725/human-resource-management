import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Modal } from '../common/Modal';
import { Loader } from '../common/Loader';
import { IconClock, IconEdit, IconBuilding, IconLaptop, IconCalendar, IconCheckCircle } from '../common/Icons';

export function AttendanceView() {
  const { addToast } = useApp();
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
  const [markForm, setMarkForm] = useState({
    employeeId: '',
    status: 'PRESENT',
    checkIn: '09:30 AM',
    checkOut: '06:30 PM',
    workLocation: 'Office',
    hoursWorked: 8.5
  });

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getAttendance(selectedDate);
      if (res.data) setAttendanceLogs(res.data);
      const empRes = await api.getEmployees({ limit: 100 });
      if (empRes.data) {
        setEmployees(empRes.data);
        if (empRes.data.length > 0 && !markForm.employeeId) {
          setMarkForm(prev => ({ ...prev, employeeId: empRes.data[0].employeeId }));
        }
      }
    } catch (e) {
      addToast('Failed to load attendance logs', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedDate, addToast, markForm.employeeId]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const handleMarkSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.markAttendance({ ...markForm, date: selectedDate });
      addToast('Attendance marked successfully!', 'success');
      setIsMarkModalOpen(false);
      fetchAttendance();
    } catch (e) {
      addToast('Failed to mark attendance', 'error');
    }
  };

  const handleQuickCheckIn = async () => {
    const emp = employees[0] || { employeeId: 'EMP01001', firstName: 'Staff' };
    try {
      await api.markAttendance({
        employeeId: emp.employeeId,
        date: selectedDate,
        status: 'PRESENT',
        checkIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        checkOut: 'In Progress',
        workLocation: 'Office',
        hoursWorked: 8.5
      });
      addToast(`Checked-in ${emp.firstName} for ${selectedDate}!`, 'success');
      fetchAttendance();
    } catch (e) {
      addToast('Quick Check-in failed', 'error');
    }
  };

  const counts = {
    present: attendanceLogs.filter(a => a.status === 'PRESENT' || a.status === 'Present').length,
    remote: attendanceLogs.filter(a => a.status === 'REMOTE' || a.status === 'Remote').length,
    leave: attendanceLogs.filter(a => a.status === 'ON_LEAVE' || a.status === 'On Leave').length,
    halfDay: attendanceLogs.filter(a => a.status === 'HALF_DAY' || a.status === 'Half Day').length
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight m-0">Attendance & Shifts Tracking</h2>
          <p className="text-xs text-slate-500 m-0">Real-time daily punches, working hours, remote logs, and shifts.</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={handleQuickCheckIn}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <IconClock className="w-4 h-4 text-white" />
            <span>Quick Check-In</span>
          </button>
          <button
            onClick={() => setIsMarkModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <IconEdit className="w-4 h-4 text-white" />
            <span>Manual Override</span>
          </button>
        </div>
      </div>

      {/* Daily Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase m-0">In-Office Present</p>
            <p className="text-2xl font-extrabold text-emerald-600 m-0 mt-1">{counts.present}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <IconBuilding className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase m-0">Work From Home (WFH)</p>
            <p className="text-2xl font-extrabold text-blue-600 m-0 mt-1">{counts.remote}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <IconLaptop className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase m-0">On Leave</p>
            <p className="text-2xl font-extrabold text-purple-600 m-0 mt-1">{counts.leave}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <IconCalendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase m-0">Half-Day / Partial</p>
            <p className="text-2xl font-extrabold text-amber-600 m-0 mt-1">{counts.halfDay}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <IconClock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Date Picker Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <IconCalendar className="w-4 h-4 text-indigo-600" />
            <span>Select Log Date:</span>
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-semibold outline-none focus:border-indigo-500 cursor-pointer shadow-xs"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Showing <strong>{attendanceLogs.length}</strong> employee logs for <span className="text-indigo-600 font-bold">{selectedDate}</span>
        </span>
      </div>

      {/* Logs Table */}
      {loading ? (
        <Loader text="Loading daily attendance logs..." />
      ) : attendanceLogs.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-700">No attendance logs found for this date.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden text-left">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Check-In</th>
                  <th className="py-3.5 px-4">Check-Out</th>
                  <th className="py-3.5 px-4">Mode</th>
                  <th className="py-3.5 px-4">Hours Logged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendanceLogs.map(att => (
                  <tr key={att.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900 m-0">{att.employeeName}</p>
                      <p className="text-[11px] font-mono text-slate-400 m-0">{att.employeeId}</p>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        att.status === 'PRESENT'
                          ? 'bg-emerald-100 text-emerald-800'
                          : att.status === 'REMOTE'
                          ? 'bg-blue-100 text-blue-800'
                          : att.status === 'HALF_DAY'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {att.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-700">
                      {att.checkIn || '--'}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-700">
                      {att.checkOut || '--'}
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {att.workLocation || 'Office'}
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-900">
                      {att.hoursWorked ? `${att.hoursWorked} hrs` : '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manual Mark Attendance Modal */}
      <Modal
        isOpen={isMarkModalOpen}
        onClose={() => setIsMarkModalOpen(false)}
        title="Manual Attendance Override"
      >
        <form onSubmit={handleMarkSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Select Employee</label>
            <select
              value={markForm.employeeId}
              onChange={(e) => setMarkForm({ ...markForm, employeeId: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-indigo-500 cursor-pointer"
            >
              {employees.map(emp => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.firstName} {emp.lastName} ({emp.employeeId}) - {emp.designation}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Status</label>
              <select
                value={markForm.status}
                onChange={(e) => setMarkForm({ ...markForm, status: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="PRESENT">Present (In-Office)</option>
                <option value="REMOTE">Remote (WFH)</option>
                <option value="HALF_DAY">Half-Day</option>
                <option value="ON_LEAVE">On Leave</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Work Mode</label>
              <select
                value={markForm.workLocation}
                onChange={(e) => setMarkForm({ ...markForm, workLocation: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Office">Bangalore HQ</option>
                <option value="Remote">Home Office</option>
                <option value="Client Site">Client Site</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Punch In Time</label>
              <input
                type="text"
                value={markForm.checkIn}
                onChange={(e) => setMarkForm({ ...markForm, checkIn: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Punch Out Time</label>
              <input
                type="text"
                value={markForm.checkOut}
                onChange={(e) => setMarkForm({ ...markForm, checkOut: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Effective Hours Worked</label>
            <input
              type="number"
              step="0.5"
              value={markForm.hoursWorked}
              onChange={(e) => setMarkForm({ ...markForm, hoursWorked: parseFloat(e.target.value) || 0 })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsMarkModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md cursor-pointer"
            >
              Save Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
