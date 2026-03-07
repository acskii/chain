import { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);
  const [toast, setToast] = useState(null); // { message, type: 'error' | 'success' }

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <AppContext.Provider value={{ isSidebarExpanded, setSidebarExpanded, toast, showToast }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);