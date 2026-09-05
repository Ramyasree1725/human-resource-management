import { StatusBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { IconEye, IconEdit, IconTrash, IconSearch, IconMail, IconPhone, IconMapPin } from '../common/Icons';
import { DEPARTMENTS, WORK_LOCATIONS } from '../../constants/metaConstants';

export function EmployeeTable({ employees, onSelect, onEdit, onDelete }) {
  const getDept = (id) => DEPARTMENTS.find(d => d.id === id);
  const getLoc = (id) => WORK_LOCATIONS.find(l => l.id === id);

  const formatSalary = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  if (employees.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <IconSearch className="w-5 h-5" />
        </div>
        <p className="text-sm font-semibold text-slate-700">No employees match your search filter</p>
        <p className="text-xs text-slate-400 mt-1">Try broadening your search query or reset filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden text-left">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">Employee</th>
              <th className="py-3.5 px-4">Department & Role</th>
              <th className="py-3.5 px-4">Contact</th>
              <th className="py-3.5 px-4">Location</th>
              <th className="py-3.5 px-4">Annual CTC</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.map(emp => {
              const dept = getDept(emp.departmentId);
              const loc = getLoc(emp.workLocationId);

              return (
                <tr
                  key={emp.id}
                  className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
                  onClick={() => onSelect(emp)}
                >
                  {/* Name & ID */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        firstName={emp.firstName}
                        lastName={emp.lastName}
                        size="md"
                      />
                      <div>
                        <p className="font-bold text-slate-900 m-0 group-hover:underline transition-colors">
                          {emp.firstName} {emp.lastName}
                        </p>
                        <p className="text-[11px] font-mono text-slate-400 m-0">{emp.employeeId}</p>
                      </div>
                    </div>
                  </td>

                  {/* Department & Role */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800">{emp.designation || 'Associate'}</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dept?.color || '#64748b' }}></span>
                        {dept?.name || 'General'}
                      </span>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="py-3 px-4">
                    <p className="text-slate-700 m-0 truncate max-w-[150px]">{emp.email}</p>
                    <p className="text-[11px] text-slate-400 m-0">{emp.phone || 'N/A'}</p>
                  </td>

                  {/* Location */}
                  <td className="py-3 px-4 text-slate-600">
                    <div className="flex items-center gap-1">
                      <IconMapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{loc?.city || emp.location || 'Bangalore'}</span>
                    </div>
                  </td>

                  {/* Salary */}
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {formatSalary(emp.salary)}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <StatusBadge status={emp.status} />
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onSelect(emp)}
                        title="View Profile"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <IconEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(emp)}
                        title="Edit Details"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <IconEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(emp)}
                        title="Delete Record"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <IconTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function EmployeeGrid({ employees, onSelect, onEdit, onDelete }) {
  const getDept = (id) => DEPARTMENTS.find(d => d.id === id);

  if (employees.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <IconSearch className="w-5 h-5" />
        </div>
        <p className="text-sm font-semibold text-slate-700">No employees match your search filter</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 text-left">
      {employees.map(emp => {
        const dept = getDept(emp.departmentId);

        return (
          <div
            key={emp.id}
            onClick={() => onSelect(emp)}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              {/* Header with Avatar & Badge */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <Avatar
                  firstName={emp.firstName}
                  lastName={emp.lastName}
                  size="lg"
                />
                <StatusBadge status={emp.status} />
              </div>

              {/* Name & Title */}
              <h4 className="font-bold text-slate-900 m-0 group-hover:underline transition-colors">
                {emp.firstName} {emp.lastName}
              </h4>
              <p className="text-xs font-medium text-slate-600 m-0 mt-0.5">{emp.designation}</p>
              <p className="text-[11px] font-mono text-slate-400 m-0 mt-0.5">{emp.employeeId} • {dept?.name}</p>

              {/* Info Details */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <p className="truncate m-0 flex items-center gap-1.5 text-slate-600">
                  <IconMail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{emp.email}</span>
                </p>
                <p className="m-0 flex items-center gap-1.5 text-slate-600">
                  <IconPhone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{emp.phone || 'N/A'}</span>
                </p>
              </div>

              {/* Skills Tags */}
              {emp.skills && emp.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {emp.skills.slice(0, 3).map((sk, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-medium border border-slate-200">
                      {sk}
                    </span>
                  ))}
                  {emp.skills.length > 3 && (
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-400 rounded-md text-[10px] border border-slate-200">
                      +{emp.skills.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div
              className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-xs font-bold text-slate-800">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(emp.salary || 0)}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(emp)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                >
                  <IconEdit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(emp)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                >
                  <IconTrash className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
