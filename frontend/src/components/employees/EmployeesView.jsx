import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { EmployeeFilters } from './EmployeeFilters';
import { EmployeeTable, EmployeeGrid } from './EmployeeTable';
import { EmployeeDetailModal } from './EmployeeDetailModal';
import { EmployeeFormModal } from './EmployeeFormModal';
import { Pagination, Loader } from '../common/Loader';
import { Modal } from '../common/Modal';

import { IconPlus } from '../common/Icons';

export function EmployeesView({ isAddModalOpen, setIsAddModalOpen }) {
  const { globalSearch, triggerRefresh, addToast } = useApp();
  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table');

  // Modals state
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deletingEmployee, setDeletingEmployee] = useState(null);

  // Filter params
  const [filters, setFilters] = useState({
    search: globalSearch || '',
    departmentId: 'ALL',
    status: 'ALL',
    employmentType: 'ALL',
    locationId: 'ALL',
    sortBy: 'employeeId',
    sortDir: 'asc',
    page: 1,
    limit: 10
  });

  // Sync globalSearch when navbar search changes
  useEffect(() => {
    if (globalSearch !== undefined) {
      setFilters(prev => ({ ...prev, search: globalSearch, page: 1 }));
    }
  }, [globalSearch]);

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getEmployees(filters);
      if (res.data) {
        setEmployees(res.data);
        setPagination(res.pagination);
      }
    } catch (e) {
      addToast('Failed to fetch employee records', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, addToast]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleSaveEmployee = async (formData) => {
    try {
      if (editingEmployee) {
        await api.updateEmployee(editingEmployee.id, formData);
        addToast(`Updated employee ${formData.firstName} ${formData.lastName}`, 'success');
      } else {
        await api.createEmployee(formData);
        addToast(`Onboarded new employee ${formData.firstName} ${formData.lastName}`, 'success');
      }
      setEditingEmployee(null);
      setIsAddModalOpen(false);
      triggerRefresh();
      loadEmployees();
    } catch (e) {
      addToast('Failed to save employee record', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingEmployee) return;
    try {
      await api.deleteEmployee(deletingEmployee.id);
      addToast(`Deleted employee record for ${deletingEmployee.firstName} ${deletingEmployee.lastName}`, 'warning');
      setDeletingEmployee(null);
      triggerRefresh();
      loadEmployees();
    } catch (e) {
      addToast('Failed to delete employee', 'error');
    }
  };

  const handleExportCSV = () => {
    if (employees.length === 0) return;
    const headers = ['Employee ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Department', 'Designation', 'Status', 'Salary', 'Joining Date'];
    const rows = employees.map(e => [
      e.employeeId,
      e.firstName,
      e.lastName,
      e.email,
      e.phone || '',
      e.departmentId,
      e.designation,
      e.status,
      e.salary,
      e.joiningDate
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.map(val => `"${val}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `technova_employees_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Exported employee directory to CSV', 'success');
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight m-0">Employee Directory</h2>
          <p className="text-xs text-slate-500 m-0">Browse, search, manage profiles and employee lifecycle records.</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer self-start sm:self-center"
        >
          <IconPlus className="w-4 h-4" />
          <span>Add New Employee</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <EmployeeFilters
        filters={filters}
        setFilters={setFilters}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onExportCSV={handleExportCSV}
      />

      {/* Main Content */}
      {loading ? (
        <Loader text="Loading employee directory..." />
      ) : (
        <>
          {viewMode === 'table' ? (
            <EmployeeTable
              employees={employees}
              onSelect={setSelectedEmployee}
              onEdit={setEditingEmployee}
              onDelete={setDeletingEmployee}
            />
          ) : (
            <EmployeeGrid
              employees={employees}
              onSelect={setSelectedEmployee}
              onEdit={setEditingEmployee}
              onDelete={setDeletingEmployee}
            />
          )}

          {/* Pagination */}
          <Pagination
            pagination={pagination}
            onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
            onLimitChange={(limit) => setFilters(prev => ({ ...prev, limit, page: 1 }))}
          />
        </>
      )}

      {/* Detail Profile Modal */}
      <EmployeeDetailModal
        employee={selectedEmployee}
        isOpen={Boolean(selectedEmployee)}
        onClose={() => setSelectedEmployee(null)}
        onEdit={(emp) => { setSelectedEmployee(null); setEditingEmployee(emp); }}
      />

      {/* Create / Edit Form Modal */}
      <EmployeeFormModal
        isOpen={isAddModalOpen || Boolean(editingEmployee)}
        onClose={() => { setIsAddModalOpen(false); setEditingEmployee(null); }}
        onSave={handleSaveEmployee}
        initialData={editingEmployee}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingEmployee)}
        onClose={() => setDeletingEmployee(null)}
        title="Confirm Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 m-0">
            Are you sure you want to delete employee <strong>{deletingEmployee?.firstName} {deletingEmployee?.lastName}</strong> ({deletingEmployee?.employeeId})? This action will remove the record from active directory.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setDeletingEmployee(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl shadow-md shadow-rose-600/25 transition-colors cursor-pointer"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
