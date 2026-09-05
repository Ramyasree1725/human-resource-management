import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useToast } from './ToastContext';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState('role_admin');
  const [globalSearch, setGlobalSearch] = useState('');
  const [stats, setStats] = useState(null);
  const [isServerConnected, setIsServerConnected] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const { addToast } = useToast();

  const triggerRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const checkConnection = useCallback(async () => {
    const health = await api.checkHealth();
    setIsServerConnected(health.connected);
  }, []);

  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const res = await api.getDashboardStats();
      if (res.data) {
        setStats(res.data);
      }
    } catch (e) {
      console.error('Failed to load stats', e);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 8000);
    return () => clearInterval(interval);
  }, [checkConnection]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats, refreshKey]);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentRole,
        setCurrentRole,
        globalSearch,
        setGlobalSearch,
        stats,
        loadingStats,
        isServerConnected,
        triggerRefresh,
        checkConnection,
        addToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
