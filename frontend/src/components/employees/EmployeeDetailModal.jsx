import { useState } from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { IconEdit, IconMail, IconPhone, IconMapPin, IconBriefcase, IconCheckCircle } from '../common/Icons';
import { DEPARTMENTS, WORK_LOCATIONS, EMPLOYMENT_TYPES } from '../../constants/metaConstants';

export function EmployeeDetailModal({ employee, isOpen, onClose, onEdit }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!employee) return null;

  const dept = DEPARTMENTS.find(d => d.id === employee.departmentId);
  const loc = WORK_LOCATIONS.find(l => l.id === employee.workLocationId);
  const empType = EMPLOYMENT_TYPES[employee.employmentType]?.label || employee.employmentType;

  const formatSalary = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const monthlyGross = Math.round((employee.salary || 0) / 12);
  const basicPay = Math.round(monthlyGross * 0.50);
  const hra = Math.round(monthlyGross * 0.20);
  const allowance = Math.round(monthlyGross * 0.30);
  const pf = Math.round(basicPay * 0.12);
  const netMonthly = monthlyGross - pf;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Employee Profile Details" maxWidth="max-w-3xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl mb-5 shadow-sm">
        <div className="flex items-center gap-4">
          <Avatar
            firstName={employee.firstName}
            lastName={employee.lastName}
            size="xl"
            className="border-2 border-white/20 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white m-0">{employee.firstName} {employee.lastName}</h3>
              <StatusBadge status={employee.status} />
            </div>
            <p className="text-sm text-indigo-300 m-0 mt-0.5">{employee.designation}</p>
            <p className="text-xs text-slate-400 font-mono m-0">{employee.employeeId} • {dept?.name || 'General'}</p>
          </div>
        </div>

        <button
          onClick={() => { onClose(); onEdit(employee); }}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-colors cursor-pointer self-start sm:self-center flex items-center gap-1.5"
        >
          <IconEdit className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-5 gap-4 text-xs font-semibold text-slate-500">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-2 transition-colors cursor-pointer ${
            activeTab === 'overview' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'hover:text-slate-800'
          }`}
        >
          Overview & Info
        </button>
        <button
          onClick={() => setActiveTab('compensation')}
          className={`pb-2 transition-colors cursor-pointer ${
            activeTab === 'compensation' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'hover:text-slate-800'
          }`}
        >
          Salary & Compensation
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`pb-2 transition-colors cursor-pointer ${
            activeTab === 'skills' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'hover:text-slate-800'
          }`}
        >
          Skills & Performance
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl space-y-2">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Contact Information</span>
            <p className="m-0 flex items-center gap-1.5">
              <IconMail className="w-3.5 h-3.5 text-slate-400" />
              <strong>Email:</strong> {employee.email}
            </p>
            <p className="m-0 flex items-center gap-1.5">
              <IconPhone className="w-3.5 h-3.5 text-slate-400" />
              <strong>Phone:</strong> {employee.phone || 'N/A'}
            </p>
            <p className="m-0"><strong>Address:</strong> {employee.address || 'Tech Park, Bangalore'}</p>
            <p className="m-0 flex items-center gap-1.5">
              <IconMapPin className="w-3.5 h-3.5 text-slate-400" />
              <strong>Location:</strong> {loc?.name || employee.location || 'Office'}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl space-y-2">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Employment Metadata</span>
            <p className="m-0"><strong>Department:</strong> {dept?.name}</p>
            <p className="m-0"><strong>Employment Type:</strong> {empType}</p>
            <p className="m-0"><strong>Joining Date:</strong> {employee.joiningDate || 'N/A'}</p>
            <p className="m-0"><strong>Reporting Manager:</strong> {employee.managerId || 'Department Head'}</p>
          </div>

          {employee.emergencyContact && (
            <div className="p-4 bg-slate-50 rounded-xl space-y-2 sm:col-span-2">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Emergency Contact</span>
              <p className="m-0">
                <strong>Name:</strong> {employee.emergencyContact.name} ({employee.emergencyContact.relation}) • <strong>Phone:</strong> {employee.emergencyContact.phone}
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'compensation' && (
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-indigo-700 uppercase m-0">Total Annual Compensation (CTC)</p>
              <p className="text-xl font-extrabold text-indigo-950 m-0">{formatSalary(employee.salary)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-indigo-700 uppercase m-0">Estimated Monthly In-Hand</p>
              <p className="text-xl font-extrabold text-emerald-700 m-0">{formatSalary(netMonthly)}</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Monthly Salary Component Breakdown</span>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-600">Basic Salary (50%)</span>
              <span className="font-semibold text-slate-900">{formatSalary(basicPay)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-600">House Rent Allowance - HRA (20%)</span>
              <span className="font-semibold text-slate-900">{formatSalary(hra)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-600">Special Allowance (30%)</span>
              <span className="font-semibold text-slate-900">{formatSalary(allowance)}</span>
            </div>
            <div className="flex justify-between py-1 text-rose-600 font-medium">
              <span>Provident Fund (PF Deduction - 12% Basic)</span>
              <span>- {formatSalary(pf)}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-2">Technical & Professional Skills</span>
            <div className="flex flex-wrap gap-2">
              {(employee.skills || ['React', 'JavaScript', 'Problem Solving']).map((sk, idx) => (
                <span key={idx} className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-xs font-semibold">
                  {sk}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">Performance Review</span>
              <p className="text-base font-bold text-slate-900 m-0 mt-1">
                Score: {employee.performanceRating || 4}.0 / 5.0
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1">
              <IconCheckCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span>Consistently Exceeds Expectations</span>
            </span>
          </div>
        </div>
      )}
    </Modal>
  );
}
