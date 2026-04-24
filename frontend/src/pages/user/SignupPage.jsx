/* Page component that allows users to create a new account on the platform */

/* React */
import { useState } from 'react';

/* Contexts */
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../../contexts/APIContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

/* Icons */
import { LuMail, LuLock, LuArrowRight } from 'react-icons/lu';
import { FcGoogle } from 'react-icons/fc';
import { AiFillMeh } from "react-icons/ai";

export default function SignupPage() {
   // Contexts
  const navigate = useNavigate();
  const { showToast } = useToast(); 
  const { user } = useAuth();
  
  // Login Credentials (Email method)
  const [emailCred, setEmailCred] = useState({ email: '', password: '' });

  const handleGoogleLogin = () => {
    // Let back-end handle the OAuth authentication    
    window.location.href = import.meta.env.VITE_GOOGLE_AUTH_URL;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await userAPI.register(emailCred);

      // Return to previous page
      navigate('/login', { replace: true });
    } catch (error) {
      if (error.status == 409) {
        // Email is already used in another user
        showToast("Email already exists as another user, use another email.", "error");
      } else {
        showToast(error.message, "error");
      }
    }
  };

  if (user) return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="bg-gray-800/30 p-10 rounded-full mb-8">
          <AiFillMeh size={80} className="text-gray-600 animate-pulse" />
        </div>
        <h2 className="text-4xl font-bold mb-4">Already Logged In</h2>
        <p className="text-gray-500 text-xl max-w-md">
          You are already logged in as <span className="font-bold">{user.email}</span>.
        </p>
        <p className="text-gray-500 text-xl max-w-md">
          Please logout before you can access this page.
        </p>
      </div>
    );

  return (
    <div className="max-h-screen bg-[#0f1117] max-w-3xl text-white mx-auto xl:max-w-none flex items-start justify-center px-6 md:px-12 overflow-hidden selection:bg-blue-500/40">
        <div>
          <div className="mb-16">
            <h2 className="text-7xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-6">Start <span className="text-blue-500">Chaining!</span></h2>
          </div>

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
                    onChange={(e) => setEmailCred({...emailCred, email: e.target.value})}
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
                    onChange={(e) => setEmailCred({...emailCred, password: e.target.value})}
                  />
                </div>
              </div>

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