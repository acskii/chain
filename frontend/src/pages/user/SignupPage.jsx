import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuMail, LuLock, LuArrowRight } from 'react-icons/lu';
import { FcGoogle } from 'react-icons/fc';
import api from '../../contexts/APIContext';

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleGoogleLogin = () => {
    window.location.href = import.meta.env.GOOGLE_AUTH_URL;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/user/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Check your data.');
    }
  };

  return (
    <div className="max-h-screen bg-[#0f1117] max-w-3xl text-white mx-auto xl:max-w-none flex items-start justify-center px-6 md:px-12 overflow-hidden selection:bg-blue-500/40">
        {/* FORM */}
        <div>
          <div className="mb-16">
            <h2 className="text-7xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-6">Start <span className="text-blue-500">Chaining!</span></h2>
          </div>

          {/* Form Stack */}
          <div className="space-y-10">
            <button 
              onClick={handleGoogleLogin}
              className="w-full bg-white cursor-pointer text-black hover:bg-gray-100 py-6 rounded-3xl font-bold text-xl flex items-center justify-center gap-4 transition-all shadow-[0_15px_60px_rgba(255,255,255,0.05)] active:scale-[0.98]"
            >
              <FcGoogle size={30} />
              Sign up with Google
            </button>

            <div className="relative flex items-center mb-10">
              <div className="flex-grow border-t-2 border-gray-800"></div>
              <span className="flex-shrink mx-6 text-gray-500 text-lg font-black uppercase tracking-widest">or</span>
              <div className="flex-grow border-t-2 border-gray-800"></div>
            </div>

            <form onSubmit={handleSignup} className="space-y-10">
              <div className="space-y-4">
                <label className="text-lg font-bold text-gray-400 uppercase tracking-widest ml-2">Email</label>
                <div className="mt-2 relative">
                  <LuMail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" size={28} />
                  <input 
                    type="email" 
                    required
                    className="w-full bg-[#161922] border-2 border-gray-800 focus:border-blue-500 rounded-3xl py-7 pl-16 pr-8 outline-none transition-all font-medium text-xl placeholder-gray-700"
                    placeholder="Email"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-lg font-bold text-gray-400 uppercase tracking-widest ml-2">Password</label>
                <div className="mt-2 relative">
                  <LuLock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" size={28} />
                  <input 
                    type="password" 
                    required
                    className="w-full bg-[#161922] border-2 border-gray-800 focus:border-blue-500 rounded-3xl py-7 pl-16 pr-8 outline-none transition-all font-medium text-xl placeholder-gray-700"
                    placeholder="Password"
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

               {error && <p className="text-red-500 text-lg font-bold ml-2 bg-red-500/10 p-4 rounded-xl border border-red-500/30">{error}</p>}

              <button 
                type="submit"
                className="w-full cursor-pointer bg-blue-600 hover:bg-blue-500 py-7 rounded-3xl font-bold text-2xl flex items-center justify-center gap-4 transition-all shadow-[0_20px_60px_rgba(37,99,235,0.25)] active:scale-[0.98]"
              >
                Create Account <LuArrowRight size={28} />
              </button>
            </form>

            <p className="text-center mt-12 text-gray-500 font-medium text-xl">
              Already have an account? <button onClick={() => navigate('/login')} className="text-white font-bold cursor-pointer hover:text-blue-500 transition-colors">Sign in</button>
            </p>
          </div>
        </div>
      </div>
  );
}