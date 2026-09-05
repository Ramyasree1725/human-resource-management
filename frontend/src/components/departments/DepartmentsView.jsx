import { useState } from 'react';
import { DEPARTMENTS } from '../../constants/metaConstants';
import { useApp } from '../../context/AppContext';
import { IconBuilding, IconGrid, IconTable } from '../common/Icons';

export function DepartmentsView() {
  const { stats } = useApp();
  const [selectedDept, setSelectedDept] = useState(DEPARTMENTS[0]);
  const [viewTab, setViewTab] = useState('cards'); // 'cards' or 'hierarchy'

  const deptDistribution = stats?.departmentDistribution || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight m-0">Departments & Organizational Structure</h2>
          <p className="text-xs text-slate-500 m-0">Organizational hierarchy, sub-departments, budget centers and leaders.</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60 self-start sm:self-center">
          <button
            onClick={() => setViewTab('cards')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              viewTab === 'cards' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <IconBuilding className="w-3.5 h-3.5" />
            <span>Department Cards</span>
          </button>
          <button
            onClick={() => setViewTab('hierarchy')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              viewTab === 'hierarchy' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <IconGrid className="w-3.5 h-3.5" />
            <span>Visual Org Chart</span>
          </button>
        </div>
      </div>

      {viewTab === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DEPARTMENTS.map(dept => {
            const currentCount = deptDistribution[dept.id] || 0;
            const target = dept.employeeCountTarget || 100;
            const pct = Math.min(100, Math.round((currentCount / target) * 100));

            return (
              <div
                key={dept.id}
                onClick={() => setSelectedDept(dept)}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: dept.color }}></span>
                      <h3 className="font-bold text-slate-900 m-0 group-hover:text-indigo-600 transition-colors">
                        {dept.name}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {dept.code}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 m-0 line-clamp-2">{dept.fullName}</p>

                  {/* Leader & Location */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <p className="m-0"><strong>Department Head:</strong> {dept.headName} ({dept.headTitle})</p>
                    <p className="m-0"><strong>Location:</strong> {dept.location}</p>
                    <p className="m-0"><strong>Budget Code:</strong> <span className="font-mono text-indigo-600 font-semibold">{dept.budgetCode}</span></p>
                  </div>

                  {/* Sub-departments */}
                  <div className="mt-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Sub-Units:</span>
                    <div className="flex flex-wrap gap-1">
                      {(dept.subDepartments || []).map(sub => (
                        <span key={sub.id} className="px-2 py-0.5 bg-slate-50 border border-slate-200/70 text-slate-600 rounded text-[10px]">
                          {sub.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-5 pt-3 border-t border-slate-100">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-500">Active Staff</span>
                    <span className="text-slate-800">{currentCount} / {target} target</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 5)}%`, backgroundColor: dept.color }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Visual Organization Hierarchy Tree */
        <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm text-center">
          <div className="inline-block p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-lg mb-8">
            <p className="text-xs text-indigo-300 font-bold uppercase tracking-wider m-0">Board & Executive Leadership</p>
            <h3 className="text-lg font-extrabold text-white m-0">Dr. Vikram Sharma • CEO & Managing Director</h3>
            <p className="text-xs text-slate-300 m-0 mt-1">TechNova Solutions Pvt Ltd</p>
          </div>

          <div className="w-0.5 h-8 bg-slate-300 mx-auto -mt-4 mb-4"></div>

          {/* C-Level Suite */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DEPARTMENTS.slice(0, 4).map(d => (
              <div key={d.id} className="p-4 rounded-xl border-2 border-indigo-100 bg-indigo-50/40 text-left shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full inline-block mr-2" style={{ backgroundColor: d.color }}></span>
                <span className="text-xs font-bold text-indigo-900">{d.headTitle}</span>
                <p className="text-xs font-semibold text-slate-800 m-0 mt-1">{d.headName}</p>
                <p className="text-[11px] text-slate-500 m-0">{d.name} Division</p>
              </div>
            ))}
          </div>

          <div className="w-0.5 h-8 bg-slate-300 mx-auto mt-4 mb-4"></div>

          {/* Extended Business Units */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEPARTMENTS.slice(4).map(d => (
              <div key={d.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-left shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full inline-block mr-2" style={{ backgroundColor: d.color }}></span>
                <span className="text-xs font-bold text-slate-900">{d.name}</span>
                <p className="text-xs text-slate-600 m-0 mt-0.5">Leader: {d.headName}</p>
                <p className="text-[10px] text-slate-400 m-0 font-mono">{d.subDepartments?.length || 0} Functional Sub-Teams</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
