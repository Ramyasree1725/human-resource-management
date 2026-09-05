import { DEPARTMENTS, EMPLOYEE_STATUSES, EMPLOYMENT_TYPES, WORK_LOCATIONS } from '../../constants/metaConstants';
import { IconSearch, IconDownload, IconTable, IconGrid, IconFilter } from '../common/Icons';

export function EmployeeFilters({ filters, setFilters, viewMode, setViewMode, onExportCSV }) {
  const handleChange = (key, val) => {
    setFilters(prev => ({ ...prev, [key]: val, page: 1 }));
  };

  const handleClear = () => {
    setFilters({
      search: '',
      departmentId: 'ALL',
      status: 'ALL',
      employmentType: 'ALL',
      locationId: 'ALL',
      sortBy: 'employeeId',
      sortDir: 'asc',
      page: 1,
      limit: 10
    });
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3 text-left">
      {/* Top Filter Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <IconSearch className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Search by name, ID, email, designation..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-800 outline-none text-slate-800"
          />
        </div>

        {/* View Toggle & Export */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={onExportCSV}
            title="Export to CSV"
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
          >
            <IconDownload className="w-3.5 h-3.5 text-slate-600" />
            <span>Export CSV</span>
          </button>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'table' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <IconTable className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'grid' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <IconGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown Filters Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 pt-1">
        {/* Department */}
        <select
          value={filters.departmentId}
          onChange={(e) => handleChange('departmentId', e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:border-slate-800 cursor-pointer font-medium"
        >
          <option value="ALL">All Departments</option>
          {DEPARTMENTS.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>

        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:border-slate-800 cursor-pointer font-medium"
        >
          <option value="ALL">All Statuses</option>
          {Object.keys(EMPLOYEE_STATUSES).map(key => (
            <option key={key} value={key}>{EMPLOYEE_STATUSES[key].label}</option>
          ))}
        </select>

        {/* Employment Type */}
        <select
          value={filters.employmentType}
          onChange={(e) => handleChange('employmentType', e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:border-slate-800 cursor-pointer font-medium"
        >
          <option value="ALL">All Employment Types</option>
          {Object.keys(EMPLOYMENT_TYPES).map(key => (
            <option key={key} value={key}>{EMPLOYMENT_TYPES[key].label}</option>
          ))}
        </select>

        {/* Location */}
        <select
          value={filters.locationId}
          onChange={(e) => handleChange('locationId', e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:border-slate-800 cursor-pointer font-medium"
        >
          <option value="ALL">All Locations</option>
          {WORK_LOCATIONS.map(loc => (
            <option key={loc.id} value={loc.id}>{loc.name}</option>
          ))}
        </select>

        {/* Clear Filters Button */}
        <button
          onClick={handleClear}
          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer col-span-2 sm:col-span-4 lg:col-span-1 text-center flex items-center justify-center gap-1.5"
        >
          <IconFilter className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  );
}
