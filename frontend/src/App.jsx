import { Routes, Route, useLocation } from 'react-router-dom';
import { VscGithub } from "react-icons/vsc";
import { useApp } from './contexts/AppContext';
import ChainsPage from './pages/chains/ChainsPage';
import RunChainPage from './pages/chains/run';
import ExecutionsPage from './pages/executions/ExecutionsPage';
import HomePage from './pages/home/page';
import SettingsPage from './pages/settings/page';
import SideMenu from './components/general/SideMenu';

export default function App() {
  const { toast } = useApp();
  const location = useLocation();

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl animate-bounce">
          {toast.message}
        </div>
      )}

      <SideMenu />

      {/* Main Container */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-20 bg-[#161922] border-bottom border-gray-800 flex items-center justify-between px-8">
          <div className="flex flex-row items-center gap-2">
            <img src="/icon.png" width={30} height={30}></img>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              CHAIN ARCHITECT
            </h1>
          </div>
          {/* <div className="flex gap-6 items-center">
            <VscGithub size={30} className="text-gray-400 hover:text-white cursor-pointer" />
          </div> */}
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-12 bg-[#0f1117]">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/chains" element={<ChainsPage />} />
            <Route path="/executions" element={<ExecutionsPage />} />
            <Route path="/run/:id" element={<RunChainPage />} />
          </Routes>
        </main>

        {/* Bottom Bar */}
        <footer className="h-16 bg-[#161922] border-t border-gray-800 flex items-center px-8 text-gray-500 text-sm">
           {location.pathname.includes('/run') ? 'Execution Mode Active' : 'System Ready'}
        </footer>
      </div>
    </div>
  );
}