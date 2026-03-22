import { Routes, Route, useLocation } from 'react-router-dom';
import { VscGithub } from "react-icons/vsc";
import { useApp } from './contexts/AppContext';
import ChainsPage from './pages/chains/ChainsPage';
import ExecutionsPage from './pages/executions/ExecutionsPage';
import HomePage from './pages/home/HomePage';
import SettingsPage from './pages/settings/page';
import SideMenu from './components/general/SideMenu';
import BuilderPage from './pages/chains/BuilderPage';
import LoginPage from './pages/user/LoginPage';
import ProtectedRoute from './components/general/ProtectedRoute';
import SignupPage from './pages/user/SignupPage';
import Header from './components/general/Header';
import ProfilePage from './pages/user/ProfilePage';

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
        <Header />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-12 bg-[#0f1117]">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/u/:id" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/chains" element={<ProtectedRoute><ChainsPage /></ProtectedRoute>} />
            <Route path="/executions" element={<ProtectedRoute><ExecutionsPage /></ProtectedRoute>} />
            <Route path="/run/:id" element={<ProtectedRoute><BuilderPage /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}