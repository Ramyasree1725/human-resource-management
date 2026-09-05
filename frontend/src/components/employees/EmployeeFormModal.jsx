import { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { DEPARTMENTS, WORK_LOCATIONS, EMPLOYMENT_TYPES, EMPLOYEE_STATUSES } from '../../constants/metaConstants';

export function EmployeeFormModal({ isOpen, onClose, onSave, initialData = null }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    departmentId: 'dept_eng_001',
    designation: '',
    employmentType: 'FULL_TIME',
    status: 'ACTIVE',
    workLocationId: 'loc_hq',
    joiningDate: new Date().toISOString().split('T')[0],
    salary: 850000,
    skills: 'React, Node.js, JavaScript',
    address: 'Bangalore, India'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        departmentId: initialData.departmentId || 'dept_eng_001',
        designation: initialData.designation || '',
        employmentType: initialData.employmentType || 'FULL_TIME',
        status: initialData.status || 'ACTIVE',
        workLocationId: initialData.workLocationId || 'loc_hq',
        joiningDate: initialData.joiningDate || new Date().toISOString().split('T')[0],
        salary: initialData.salary || 850000,
        skills: Array.isArray(initialData.skills) ? initialData.skills.join(', ') : (initialData.skills || ''),
        address: initialData.address || ''
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        departmentId: 'dept_eng_001',
        designation: '',
        employmentType: 'FULL_TIME',
        status: 'ACTIVE',
        workLocationId: 'loc_hq',
        joiningDate: new Date().toISOString().split('T')[0],
        salary: 850000,
        skills: 'React, Node.js, JavaScript',
        address: 'Bangalore, India'
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'salary' ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert('Please fill out all required fields');
      return;
    }

    const payload = {
      ...formData,
      skills: typeof formData.skills === 'string'
        ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
        : formData.skills
    };

    onSave(payload);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit Employee (${initialData.employeeId})` : 'Onboard New Employee'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Personal Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
            <input
              type="text"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              placeholder="e.g. Ramesh"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Last Name *</label>
            <input
              type="text"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              placeholder="e.g. Kumar"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Work Email *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. ramesh.kumar@technova.com"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +91 98765 43210"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Employment & Designation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Department *</label>
            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none cursor-pointer"
            >
              {DEPARTMENTS.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Job Designation *</label>
            <input
              type="text"
              name="designation"
              required
              value={formData.designation}
              onChange={handleChange}
              placeholder="e.g. Senior Software Engineer"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Status & Types */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Employment Type</label>
            <select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none cursor-pointer"
            >
              {Object.keys(EMPLOYMENT_TYPES).map(key => (
                <option key={key} value={key}>{EMPLOYMENT_TYPES[key].label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none cursor-pointer"
            >
              {Object.keys(EMPLOYEE_STATUSES).map(key => (
                <option key={key} value={key}>{EMPLOYEE_STATUSES[key].label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Work Location</label>
            <select
              name="workLocationId"
              value={formData.workLocationId}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none cursor-pointer"
            >
              {WORK_LOCATIONS.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Compensation & Joining Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Annual CTC (INR) *</label>
            <input
              type="number"
              name="salary"
              required
              min="100000"
              step="50000"
              value={formData.salary}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Date of Joining</label>
            <input
              type="date"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Skills (comma-separated)</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g. React, Node.js, TypeScript, Docker"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
          />
        </div>

        {/* Footer Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
          >
            {initialData ? 'Save Changes' : 'Create Employee'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
