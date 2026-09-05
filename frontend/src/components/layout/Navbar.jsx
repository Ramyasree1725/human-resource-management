import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ROLES } from '../../constants/metaConstants';
import { IconSearch, IconPlus, IconCheckCircle } from '../common/Icons';

export function Navbar({ onOpenAddModal }) {
  const {
    currentRole,
    setCurrentRole,
    globalSearch,
    setGlobalSearch,
    setActiveTab,
    isServerConnected,
    checkConnection,
    addToast
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const handleRoleChange = (roleId) => {
    setCurrentRole(roleId);
    setShowRoleMenu(false);
    const roleObj = ROLES.find(r => r.id === roleId);
    addToast(`Switched active profile to ${roleObj?.name}`, 'info');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      setActiveTab('employees');
    }
  };

  const currentRoleObj = ROLES.find(r => r.id === currentRole) || ROLES[0];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative w-96 max-w-full">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          <IconSearch className="w-4 h-4" />
        </span>
        <input
          type="text"
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          placeholder="Search employee by name, ID, department..."
          className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-800 outline-none transition-all placeholder:text-slate-400 text-slate-800"
        />
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Server Status Pill */}
        <div
          onClick={checkConnection}
          title={isServerConnected ? 'Backend Express API Connected' : 'Running on In-Browser High-Performance Local Store'}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer border transition-colors ${
            isServerConnected
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isServerConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></span>
          <span>{isServerConnected ? 'Backend Online' : 'Local Store Active'}</span>
        </div>

        {/* Quick Add Employee Button */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <IconPlus className="w-3.5 h-3.5" />
          <span>Add Employee</span>
        </button>

        {/* Role Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {currentRoleObj.name.charAt(0)}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-slate-800 m-0 leading-tight">{currentRoleObj.name}</p>
              <p className="text-[10px] text-slate-500 m-0">Switch Role</p>
            </div>
            <span className="text-slate-400 text-xs">▼</span>
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-fade-in">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Switch Perspective
              </div>
              {ROLES.map(role => (
                <button
                  key={role.id}
                  onClick={() => handleRoleChange(role.id)}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-100 cursor-pointer ${
                    currentRole === role.id ? 'font-bold text-slate-900 bg-slate-100' : 'text-slate-700'
                  }`}
                >
                  <span>{role.name}</span>
                  {currentRole === role.id && <IconCheckCircle className="w-3.5 h-3.5 text-slate-900" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
