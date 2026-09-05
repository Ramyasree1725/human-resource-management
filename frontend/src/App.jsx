import { ToastProvider } from './context/ToastContext';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout/Layout';

function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <Layout />
      </AppProvider>
    </ToastProvider>
  );
}

export default App;
