import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { IconSettings, IconShield, IconBolt, IconTrash } from '../common/Icons';

export function SettingsView() {
  const { isServerConnected, checkConnection, triggerRefresh, addToast } = useApp();
  const [generateCount, setGenerateCount] = useState(60);
  const [generating, setGenerating] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    api.getAuditLogs().then(res => {
      if (res.data) setAuditLogs(res.data);
    });
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await api.generateDataset(generateCount);
      addToast(`Successfully generated ${generateCount} employee records and associated logs!`, 'success');
      triggerRefresh();
      const logsRes = await api.getAuditLogs();
      if (logsRes.data) setAuditLogs(logsRes.data);
    } catch (e) {
      addToast('Failed to generate mock dataset', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data back to initial default state?')) {
      api.resetData();
      addToast('Database reset to initial sample data.', 'warning');
      triggerRefresh();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight m-0">Settings & Mock Data Generator</h2>
        <p className="text-xs text-slate-500 m-0">System configuration, dataset seeding, database reset, and audit trail.</p>
      </div>

      {/* Connection & Architecture Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-800 m-0">System Architecture & Backend Status</h4>
            <p className="text-xs text-slate-500 m-0">Node.js Express REST API backend on port 5000 with In-Memory store</p>
          </div>
          <button
            onClick={checkConnection}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Check Connection
          </button>
        </div>

        <div className="p-4 rounded-xl border flex items-center justify-between text-xs font-semibold bg-slate-50">
          <div className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${isServerConnected ? 'bg-emerald-500 animate-ping' : 'bg-indigo-500'}`}></span>
            <div>
              <p className="font-bold text-slate-900 m-0">
                {isServerConnected ? 'Backend Server Connected (http://localhost:5000)' : 'Client Local Store Operational'}
              </p>
              <p className="text-[11px] text-slate-500 m-0 font-normal">
                {isServerConnected
                  ? 'All requests are persisting directly to the Express backend store.'
                  : 'Fast client-side high performance in-memory mock store with LocalStorage persistence.'}
              </p>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
            isServerConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
          }`}>
            {isServerConnected ? 'ONLINE' : 'LOCAL ACTIVE'}
          </span>
        </div>
      </div>

      {/* Mock Data Generator */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div>
          <h4 className="text-sm font-bold text-slate-800 m-0 flex items-center gap-1.5">
            <IconBolt className="w-4 h-4 text-indigo-600" />
            <span>Large Scale Mock Data Generator</span>
          </h4>
          <p className="text-xs text-slate-500 m-0">
            Regenerate complete enterprise test data (employees across all departments, leaves, attendance, salaries) with a single click.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Record Count:</span>
            <select
              value={generateCount}
              onChange={(e) => setGenerateCount(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
            >
              <option value={30}>30 Employees (Fast)</option>
              <option value={60}>60 Employees (Standard)</option>
              <option value={100}>100 Employees (Rich)</option>
              <option value={200}>200 Employees (Large)</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
          >
            <IconBolt className="w-3.5 h-3.5 text-white" />
            <span>{generating ? 'Generating Data...' : 'Generate Dataset Now'}</span>
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-semibold rounded-xl transition-colors cursor-pointer sm:ml-auto flex items-center gap-1.5"
          >
            <IconTrash className="w-3.5 h-3.5" />
            <span>Reset Database to Sample</span>
          </button>
        </div>
      </div>

      {/* Full Audit Log View */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div>
          <h4 className="text-sm font-bold text-slate-800 m-0">System Audit Trail</h4>
          <p className="text-xs text-slate-500 m-0">Immutable records of all database mutations, employee creations, and leave actions.</p>
        </div>

        <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 text-xs">
          {auditLogs.map((log, idx) => (
            <div key={log.id || idx} className="py-2.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[10px] font-bold text-slate-700">
                  {log.action}
                </span>
                <span className="text-slate-800 font-medium">{log.details}</span>
              </div>
              <span className="text-slate-400 text-[11px] shrink-0">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
