import { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <AppContext.Provider value={{ isSidebarExpanded, setSidebarExpanded }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);