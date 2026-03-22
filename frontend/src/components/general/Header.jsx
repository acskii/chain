import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LuUser } from 'react-icons/lu';

export default function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-20 bg-[#161922] border-b border-gray-800 flex items-center justify-between px-8 z-10 sticky top-0">
      <Link to="/" className="flex flex-row items-center gap-2 hover:opacity-80 transition-opacity">
        <img src="/icon.png" width={30} height={30} alt="Logo" />
        <h1 className="text-2xl font-black bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 bg-clip-text text-transparent tracking-tighter">
          CHAIN ARCHITECT
        </h1>
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Operator</span>
              <span className="text-sm font-bold text-gray-200">{user.email}</span>
            </div>
            <button 
              onClick={() => navigate(`/u/${user.userId}`)}
              className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white transition-all cursor-pointer"
            >
              <LuUser size={24} />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => navigate('/login')}
            className="text-sm font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}