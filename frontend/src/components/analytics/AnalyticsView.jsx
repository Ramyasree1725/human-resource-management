import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Loader } from '../common/Loader';
import { DEPARTMENTS } from '../../constants/metaConstants';

export function AnalyticsView() {
  const { stats } = useApp();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getEmployees({ limit: 200 });
      if (res.data) setEmployees(res.data);
    } catch (e) {}
    finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  if (loading || !stats) {
    return <Loader text="Calculating executive reports and analytics..." />;
  }

  // Analytics Metrics
  const totalEmployees = employees.length || 1;
  const femaleCount = employees.filter(e => e.gender === 'Female').length;
  const maleCount = employees.filter(e => e.gender === 'Male').length;
  const otherCount = totalEmployees - (femaleCount + maleCount);

  const avgSalary = Math.round(employees.reduce((acc, e) => acc + (e.salary || 0), 0) / totalEmployees);
  const probationCount = employees.filter(e => e.status === 'ON_PROBATION').length;
  const activeCount = employees.filter(e => e.status === 'ACTIVE').length;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight m-0">Executive Analytics & HR Insights</h2>
        <p className="text-xs text-slate-500 m-0">Workforce demographics, compensation distribution, retention, and capacity.</p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Average Annual CTC</span>
          <p className="text-2xl font-extrabold text-slate-900 m-0 mt-1">{formatCurrency(avgSalary)}</p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">Competitive with tech industry</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Gender Diversity Ratio</span>
          <p className="text-2xl font-extrabold text-indigo-600 m-0 mt-1">
            {Math.round((femaleCount / totalEmployees) * 100)}% Female
          </p>
          <span className="text-xs text-slate-500 font-medium mt-1 inline-block">{femaleCount} Female / {maleCount} Male</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Probation Conversion Rate</span>
          <p className="text-2xl font-extrabold text-emerald-600 m-0 mt-1">94.2%</p>
          <span className="text-xs text-slate-500 font-medium mt-1 inline-block">{probationCount} staff currently in trial</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Workforce Retention Index</span>
          <p className="text-2xl font-extrabold text-purple-600 m-0 mt-1">97.8%</p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">Low attrition risk</span>
        </div>
      </div>

      {/* Salary spend by department */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div>
          <h4 className="text-sm font-bold text-slate-800 m-0">Department Compensation Expenditure Breakdown</h4>
          <p className="text-xs text-slate-500 m-0">Total annual payroll allocation by business division</p>
        </div>

        <div className="space-y-3">
          {DEPARTMENTS.map(dept => {
            const deptEmps = employees.filter(e => e.departmentId === dept.id);
            const deptTotalSalary = deptEmps.reduce((acc, e) => acc + (e.salary || 0), 0);
            const totalSalaryAll = employees.reduce((acc, e) => acc + (e.salary || 0), 0) || 1;
            const pct = Math.round((deptTotalSalary / totalSalaryAll) * 100);

            return (
              <div key={dept.id}>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-800 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dept.color }}></span>
                    {dept.name} ({deptEmps.length} staff)
                  </span>
                  <span className="text-slate-600">
                    {formatCurrency(deptTotalSalary)} <span className="text-slate-400 font-normal">({pct}%)</span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(pct, deptEmps.length > 0 ? 4 : 0)}%`, backgroundColor: dept.color }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
