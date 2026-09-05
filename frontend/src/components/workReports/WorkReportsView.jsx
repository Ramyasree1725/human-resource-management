import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Modal } from '../common/Modal';
import { Loader } from '../common/Loader';
import { Avatar } from '../common/Avatar';
import { DEPARTMENTS } from '../../constants/metaConstants';
import {
  IconCheckCircle,
  IconClock,
  IconPlus,
  IconSearch,
  IconFilter,
  IconCalendar,
  IconUsers
} from '../common/Icons';

export function WorkReportsView() {
  const { addToast } = useApp();
  const [reports, setReports] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [slotFilter, setSlotFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [reviewingReport, setReviewingReport] = useState(null);
  const [reviewFeedback, setReviewFeedback] = useState('');

  const [form, setForm] = useState({
    employeeId: '',
    slot: 'MORNING_TO_AFTERNOON',
    taskTitle: '',
    taskDescription: '',
    deliverables: '',
    hoursSpent: 4.0,
    status: 'COMPLETED',
    blockers: 'None'
  });

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getWorkReports({
        date: selectedDate,
        slot: slotFilter,
        departmentId: deptFilter,
        status: statusFilter
      });
      if (res.data) setReports(res.data);

      const empRes = await api.getEmployees({ limit: 100 });
      if (empRes.data) {
        setEmployees(empRes.data);
        if (empRes.data.length > 0 && !form.employeeId) {
          setForm(prev => ({ ...prev, employeeId: empRes.data[0].employeeId }));
        }
      }
    } catch (e) {
      addToast('Failed to load work reports', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedDate, slotFilter, deptFilter, statusFilter, addToast, form.employeeId]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!form.taskTitle.trim() || !form.taskDescription.trim()) {
      addToast('Please enter task title and description', 'warning');
      return;
    }

    try {
      await api.submitWorkReport({
        ...form,
        date: selectedDate
      });
      addToast('Daily work report uploaded and sent to Head!', 'success');
      setIsUploadModalOpen(false);
      setForm({
        employeeId: employees[0]?.employeeId || '',
        slot: 'MORNING_TO_AFTERNOON',
        taskTitle: '',
        taskDescription: '',
        deliverables: '',
        hoursSpent: 4.0,
        status: 'COMPLETED',
        blockers: 'None'
      });
      fetchReports();
    } catch (e) {
      addToast('Failed to upload work report', 'error');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewingReport) return;

    try {
      await api.reviewWorkReport(reviewingReport.id, reviewFeedback, 'Office Head');
      addToast(`Reviewed work update for ${reviewingReport.employeeName}`, 'success');
      setReviewingReport(null);
      setReviewFeedback('');
      fetchReports();
    } catch (e) {
      addToast('Failed to save review', 'error');
    }
  };

  const morningCount = reports.filter(r => r.slot === 'MORNING_TO_AFTERNOON').length;
  const afternoonCount = reports.filter(r => r.slot === 'AFTERNOON_TO_EOD').length;
  const reviewedCount = reports.filter(r => r.managerReview?.status === 'REVIEWED').length;
  const blockersCount = reports.filter(r => r.status === 'BLOCKED' || (r.blockers && r.blockers.toLowerCase() !== 'none')).length;

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight m-0">Daily Employee Work Submissions</h2>
          <p className="text-xs text-slate-500 m-0">
            Twice-daily work progress logs: Morning-to-Afternoon (First Half) and Afternoon-to-Evening (Second Half) updates.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-center"
        >
          <IconPlus className="w-4 h-4" />
          <span>Upload Work Report</span>
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase m-0">Morning Logs (1st Half)</p>
            <p className="text-2xl font-extrabold text-slate-900 m-0 mt-1">{morningCount}</p>
            <p className="text-[10px] text-slate-400 m-0">09:30 AM - 01:30 PM</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center text-lg border border-slate-200">
            ☀️
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase m-0">Afternoon / EOD (2nd Half)</p>
            <p className="text-2xl font-extrabold text-slate-900 m-0 mt-1">{afternoonCount}</p>
            <p className="text-[10px] text-slate-400 m-0">02:00 PM - 06:30 PM</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center text-lg border border-slate-200">
            🌙
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase m-0">Head Reviewed</p>
            <p className="text-2xl font-extrabold text-slate-900 m-0 mt-1">{reviewedCount} / {reports.length}</p>
            <p className="text-[10px] text-slate-400 m-0">Acknowledged by Head</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center text-lg border border-slate-200">
            ✓
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase m-0">Blockers Flagged</p>
            <p className="text-2xl font-extrabold text-rose-600 m-0 mt-1">{blockersCount}</p>
            <p className="text-[10px] text-slate-400 m-0">Needs immediate support</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg border border-rose-200">
            ⚠️
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Shift Slot Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {[
              { key: 'ALL', label: 'All Updates' },
              { key: 'MORNING_TO_AFTERNOON', label: '☀️ Morning (1st Half)' },
              { key: 'AFTERNOON_TO_EOD', label: '🌙 Afternoon (2nd Half)' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setSlotFilter(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  slotFilter === tab.key
                    ? 'bg-slate-900 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Date Picker */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <IconCalendar className="w-3.5 h-3.5 text-slate-800" />
              <span>Log Date:</span>
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-semibold outline-none focus:border-slate-800 cursor-pointer shadow-xs"
            />
          </div>
        </div>

        {/* Secondary Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filters:</span>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium outline-none cursor-pointer"
          >
            <option value="ALL">All Departments</option>
            {DEPARTMENTS.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="BLOCKED">Blocked</option>
          </select>

          <span className="text-xs text-slate-400 ml-auto">
            Showing <strong>{reports.length}</strong> work logs for <strong>{selectedDate}</strong>
          </span>
        </div>
      </div>

      {/* Head Feedback & Remarks Summary Strip */}
      {(() => {
        const reviewedList = reports.filter(r => r.managerReview?.status === 'REVIEWED' && r.managerReview?.feedback);
        if (reviewedList.length === 0) return null;

        return (
          <div className="bg-slate-100/90 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">📢</span>
                <span className="text-xs font-bold text-slate-900">Office Head Task Feedback & Guidance Feed</span>
              </div>
              <span className="text-[10px] font-bold text-slate-800 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                {reviewedList.length} Remarks Shared
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {reviewedList.slice(0, 4).map(r => (
                <div key={r.id} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-slate-900">{r.employeeName} — {r.taskTitle}</span>
                    <span className="text-slate-400 font-mono">{r.slotLabel}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 font-medium">
                    "{r.managerReview.feedback}"
                  </div>
                  <p className="text-[10px] text-slate-500 m-0 text-right">Direct feedback from <strong>{r.managerReview.reviewedBy || 'Office Head'}</strong></p>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Reports Feed / Cards */}
      {loading ? (
        <Loader text="Loading daily work reports..." />
      ) : reports.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <IconSearch className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-slate-700">No work reports logged for this date and filter.</p>
          <p className="text-xs text-slate-400 mt-1">Employees can click "Upload Work Report" to submit their session update.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map(report => {
            const isMorning = report.slot === 'MORNING_TO_AFTERNOON';
            const dept = DEPARTMENTS.find(d => d.id === report.departmentId);

            return (
              <div
                key={report.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Employee & Slot Badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar
                        firstName={report.employeeName.split(' ')[0]}
                        lastName={report.employeeName.split(' ')[1] || ''}
                        size="md"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm m-0">{report.employeeName}</h4>
                        <p className="text-[11px] text-slate-500 m-0">
                          {report.designation || 'Staff'} • {dept?.name || 'General'}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      <span>{isMorning ? '☀️' : '🌙'}</span>
                      <span>{report.slotLabel}</span>
                    </span>
                  </div>

                  {/* Task Header */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-bold text-slate-900 text-xs m-0">{report.taskTitle}</h5>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        report.status === 'COMPLETED'
                          ? 'bg-slate-900 text-white'
                          : report.status === 'IN_PROGRESS'
                          ? 'bg-slate-200 text-slate-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 m-0 leading-relaxed">{report.taskDescription}</p>
                  </div>

                  {/* Key Deliverables & Hours */}
                  <div className="space-y-1 text-xs text-slate-600 mb-3">
                    {report.deliverables && (
                      <p className="m-0 flex items-start gap-1.5">
                        <strong className="text-slate-800 shrink-0">Deliverables:</strong>
                        <span className="text-slate-700">{report.deliverables}</span>
                      </p>
                    )}
                    {report.blockers && report.blockers.toLowerCase() !== 'none' && (
                      <p className="m-0 flex items-start gap-1.5 text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-100">
                        <strong className="shrink-0">⚠️ Blocker:</strong>
                        <span>{report.blockers}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer: Time Window, Hours & Head Review */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-500 font-mono">
                    <span>⏱ {report.timeWindow}</span> • <strong>{report.hoursSpent} hrs logged</strong>
                  </div>

                  <div>
                    {report.managerReview?.status === 'REVIEWED' ? (
                      <div className="text-[11px] text-slate-800 font-medium bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                        <span>✓ Reviewed by {report.managerReview.reviewedBy}</span>
                        {report.managerReview.feedback && (
                          <span className="block text-[10px] text-slate-600 italic mt-0.5">"{report.managerReview.feedback}"</span>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setReviewingReport(report);
                          setReviewFeedback('');
                        }}
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Acknowledge / Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Work Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Daily Work Report"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs text-left">
          {/* Employee Select */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Select Employee</label>
            <select
              value={form.employeeId}
              onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-slate-800 cursor-pointer"
            >
              {employees.map(emp => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.firstName} {emp.lastName} ({emp.employeeId}) - {emp.designation}
                </option>
              ))}
            </select>
          </div>

          {/* Shift Slot Selector */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Shift Session Slot</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, slot: 'MORNING_TO_AFTERNOON', hoursSpent: 4.0 })}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  form.slot === 'MORNING_TO_AFTERNOON'
                    ? 'border-slate-900 bg-slate-900 text-white font-bold'
                    : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                <p className="m-0 text-xs font-bold flex items-center gap-1.5">
                  <span>☀️</span>
                  <span>Morning to Afternoon</span>
                </p>
                <p className={`m-0 text-[10px] mt-1 font-normal ${form.slot === 'MORNING_TO_AFTERNOON' ? 'text-slate-300' : 'text-slate-500'}`}>
                  First Half (09:30 AM - 01:30 PM)
                </p>
              </button>

              <button
                type="button"
                onClick={() => setForm({ ...form, slot: 'AFTERNOON_TO_EOD', hoursSpent: 4.5 })}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  form.slot === 'AFTERNOON_TO_EOD'
                    ? 'border-slate-900 bg-slate-900 text-white font-bold'
                    : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                <p className="m-0 text-xs font-bold flex items-center gap-1.5">
                  <span>🌙</span>
                  <span>Afternoon to Evening (EOD)</span>
                </p>
                <p className={`m-0 text-[10px] mt-1 font-normal ${form.slot === 'AFTERNOON_TO_EOD' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Second Half (02:00 PM - 06:30 PM)
                </p>
              </button>
            </div>
          </div>

          {/* Task Title */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Primary Task / Project Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Completed Sprint Feature UI & Unit Testing"
              value={form.taskTitle}
              onChange={(e) => setForm({ ...form, taskTitle: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-slate-800"
            />
          </div>

          {/* Task Description */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Detailed Description of Work Done</label>
            <textarea
              required
              rows="3"
              placeholder="Describe what was accomplished in this shift session, resolved bugs, module changes..."
              value={form.taskDescription}
              onChange={(e) => setForm({ ...form, taskDescription: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-slate-800"
            ></textarea>
          </div>

          {/* Deliverables & Links */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Deliverables / Links / PR #</label>
              <input
                type="text"
                placeholder="e.g. PR #402 merged, Docs link"
                value={form.deliverables}
                onChange={(e) => setForm({ ...form, deliverables: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Progress Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-slate-800 cursor-pointer"
              >
                <option value="COMPLETED">Completed</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="BLOCKED">Blocked</option>
              </select>
            </div>
          </div>

          {/* Blockers */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Any Blockers / Escalations (Optional)</label>
            <input
              type="text"
              placeholder="Enter blockers or 'None'"
              value={form.blockers}
              onChange={(e) => setForm({ ...form, blockers: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-slate-800"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-xs cursor-pointer"
            >
              Submit & Send to Head
            </button>
          </div>
        </form>
      </Modal>

      {/* Review Feedback Modal */}
      <Modal
        isOpen={!!reviewingReport}
        onClose={() => setReviewingReport(null)}
        title="Office Head Work Review & Feedback"
      >
        {reviewingReport && (
          <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs text-left">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p className="font-bold text-slate-900 m-0 text-sm">{reviewingReport.employeeName}</p>
              <p className="text-[11px] text-slate-500 m-0">{reviewingReport.slotLabel} • {reviewingReport.date}</p>
              <p className="text-xs text-slate-800 font-semibold mt-2 m-0">{reviewingReport.taskTitle}</p>
              <p className="text-xs text-slate-600 m-0 mt-0.5">{reviewingReport.taskDescription}</p>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Manager Feedback / Remarks</label>
              <textarea
                rows="3"
                placeholder="Enter feedback, next steps, or acknowledgment notes..."
                value={reviewFeedback}
                onChange={(e) => setReviewFeedback(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-slate-800"
              ></textarea>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setReviewingReport(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-xs cursor-pointer"
              >
                Save Review & Send to Employee
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
