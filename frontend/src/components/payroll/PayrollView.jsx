import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Modal } from '../common/Modal';
import { Loader } from '../common/Loader';
import { IconDollar, IconBuilding, IconTable, IconCheckCircle, IconEye, IconDownload } from '../common/Icons';
import { DEPARTMENTS } from '../../constants/metaConstants';

export function PayrollView() {
  const { addToast } = useApp();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayslipEmp, setSelectedPayslipEmp] = useState(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getEmployees({ limit: 100 });
      if (res.data) setEmployees(res.data);
    } catch (e) {
      addToast('Failed to load payroll data', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const totalAnnualCTC = employees.reduce((acc, e) => acc + (e.salary || 0), 0);
  const totalMonthlyGross = Math.round(totalAnnualCTC / 12);
  const totalMonthlyPF = Math.round(totalMonthlyGross * 0.5 * 0.12);
  const totalMonthlyNet = totalMonthlyGross - totalMonthlyPF;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight m-0">Payroll & Compensation Management</h2>
          <p className="text-xs text-slate-500 m-0">Compute monthly salary breakdown, allowances, PF, tax, and generate pay slips.</p>
        </div>

        <button
          onClick={() => addToast('Batch salary disbursement processed for current pay period!', 'success')}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer self-start sm:self-center"
        >
          <IconDollar className="w-4 h-4 text-white" />
          <span>Process Monthly Payroll</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase m-0">Total Monthly Gross Payroll</p>
            <p className="text-2xl font-extrabold text-slate-900 m-0 mt-1">{formatCurrency(totalMonthlyGross)}</p>
            <p className="text-[11px] text-slate-400 m-0 mt-0.5">{employees.length} active salaried employees</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <IconDollar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase m-0">Total Net Monthly Payout</p>
            <p className="text-2xl font-extrabold text-emerald-600 m-0 mt-1">{formatCurrency(totalMonthlyNet)}</p>
            <p className="text-[11px] text-slate-400 m-0 mt-0.5">Disbursed directly via NEFT/RTGS</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <IconBuilding className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase m-0">Statutory Deductions (PF/Tax)</p>
            <p className="text-2xl font-extrabold text-indigo-600 m-0 mt-1">{formatCurrency(totalMonthlyPF)}</p>
            <p className="text-[11px] text-slate-400 m-0 mt-0.5">EPF & Employee Insurance</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <IconTable className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Payroll Table */}
      {loading ? (
        <Loader text="Calculating payroll ledger..." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800 m-0">Salary Ledger - Current Cycle</h4>
            <span className="text-xs text-slate-500 font-mono">Status: Ready for Disbursement</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Annual CTC</th>
                  <th className="py-3.5 px-4">Basic Pay (50%)</th>
                  <th className="py-3.5 px-4">HRA + Allowances</th>
                  <th className="py-3.5 px-4">PF Deduction</th>
                  <th className="py-3.5 px-4">Net In-Hand</th>
                  <th className="py-3.5 px-4 text-right">Payslip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map(emp => {
                  const dept = DEPARTMENTS.find(d => d.id === emp.departmentId);
                  const monthly = Math.round((emp.salary || 0) / 12);
                  const basic = Math.round(monthly * 0.5);
                  const hraAllowances = Math.round(monthly * 0.5);
                  const pf = Math.round(basic * 0.12);
                  const net = monthly - pf;

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900 m-0">{emp.firstName} {emp.lastName}</p>
                        <p className="text-[11px] font-mono text-slate-400 m-0">{emp.employeeId}</p>
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        {dept?.name || 'General'}
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {formatCurrency(emp.salary)}
                      </td>

                      <td className="py-3 px-4 text-slate-700">
                        {formatCurrency(basic)}
                      </td>

                      <td className="py-3 px-4 text-slate-700">
                        {formatCurrency(hraAllowances)}
                      </td>

                      <td className="py-3 px-4 text-rose-600 font-medium">
                        - {formatCurrency(pf)}
                      </td>

                      <td className="py-3 px-4 font-bold text-emerald-700">
                        {formatCurrency(net)}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedPayslipEmp(emp)}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <IconEye className="w-3.5 h-3.5" />
                          <span>View Slip</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payslip Modal View */}
      {selectedPayslipEmp && (
        <Modal
          isOpen={Boolean(selectedPayslipEmp)}
          onClose={() => setSelectedPayslipEmp(null)}
          title={`Official Payslip - ${selectedPayslipEmp.firstName} ${selectedPayslipEmp.lastName}`}
          maxWidth="max-w-2xl"
        >
          <div className="p-6 border border-slate-200 rounded-2xl bg-white space-y-5 text-xs text-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 border-slate-200">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 m-0">TechNova Solutions Pvt Ltd</h3>
                <p className="text-slate-500 m-0">100 Innovation Drive, Tech Park, Bangalore 560001</p>
                <p className="text-[10px] text-slate-400 font-mono m-0 mt-0.5">CIN: U72200KA2020PTC123456</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-md uppercase tracking-wider text-[10px]">
                  Pay Slip Breakdown
                </span>
              </div>
            </div>

            {/* Employee Details Grid */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
              <p className="m-0"><strong>Employee Name:</strong> {selectedPayslipEmp.firstName} {selectedPayslipEmp.lastName}</p>
              <p className="m-0"><strong>Employee ID:</strong> {selectedPayslipEmp.employeeId}</p>
              <p className="m-0"><strong>Designation:</strong> {selectedPayslipEmp.designation}</p>
              <p className="m-0"><strong>Department:</strong> {DEPARTMENTS.find(d => d.id === selectedPayslipEmp.departmentId)?.name}</p>
              <p className="m-0"><strong>Bank A/C:</strong> *******8921 (HDFC Bank)</p>
              <p className="m-0"><strong>PAN:</strong> ABCDE1234F</p>
            </div>

            {/* Earnings & Deductions Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-xl p-3">
                <p className="font-bold text-slate-900 uppercase tracking-wider text-[10px] border-b pb-1 mb-2">Earnings (INR)</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>Basic Salary (50%)</span>
                    <span>{formatCurrency(Math.round(((selectedPayslipEmp.salary || 0) / 12) * 0.5))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>HRA (20%)</span>
                    <span>{formatCurrency(Math.round(((selectedPayslipEmp.salary || 0) / 12) * 0.2))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Special Allowance (30%)</span>
                    <span>{formatCurrency(Math.round(((selectedPayslipEmp.salary || 0) / 12) * 0.3))}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t text-slate-900">
                    <span>Total Gross Earnings</span>
                    <span>{formatCurrency(Math.round((selectedPayslipEmp.salary || 0) / 12))}</span>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-3">
                <p className="font-bold text-slate-900 uppercase tracking-wider text-[10px] border-b pb-1 mb-2">Deductions (INR)</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>Provident Fund (EPF 12%)</span>
                    <span>{formatCurrency(Math.round(((selectedPayslipEmp.salary || 0) / 12) * 0.5 * 0.12))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Professional Tax (PT)</span>
                    <span>₹200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Income Tax (TDS)</span>
                    <span>₹0</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t text-rose-600">
                    <span>Total Deductions</span>
                    <span>{formatCurrency(Math.round(((selectedPayslipEmp.salary || 0) / 12) * 0.5 * 0.12) + 200)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Pay */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-emerald-800 uppercase m-0">Net Salary Payable</p>
                <p className="text-xl font-extrabold text-emerald-950 m-0">
                  {formatCurrency(Math.round((selectedPayslipEmp.salary || 0) / 12) - Math.round(((selectedPayslipEmp.salary || 0) / 12) * 0.5 * 0.12) - 200)}
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                <IconCheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Verified Direct Deposit</span>
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs cursor-pointer flex items-center gap-1.5"
              >
                <IconDownload className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
