import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { 
  LuLogIn, LuArrowRight, LuCpu, LuLink
} from 'react-icons/lu';

import { useAuth } from '../../contexts/AuthContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isLoggedIn = !!user;
  
  return (
    <div className="w-full bg-[#0f1117] text-white selection:bg-blue-500/30">
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent">
        <h2 className="text-7xl md:text-9xl font-black mb-8 tracking-tighter leading-[0.9]">
          Build. Chain. <br/>
          <span className="text-blue-500 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">Execute.</span>
        </h2>
        <p className="text-2xl md:text-3xl text-gray-400 max-w-4xl font-medium leading-relaxed mb-12">
          Stop running isolated prompts. Build interconnected logic sequences where 
          <span className="text-white"> every output feeds the next </span> automatically.
        </p>
        
        <div className="flex flex-col md:flex-row gap-6">
          {!isLoggedIn ? (
            <>
              <button 
                onClick={() => navigate('/login')}
                className="bg-blue-600 hover:bg-blue-500 cursor-pointer px-12 py-6 rounded-2xl font-black text-xl flex items-center gap-4 transition-all shadow-[0_20px_80px_rgba(37,99,235,0.25)] active:scale-95"
              >
                Sign In <LuLogIn size={24} />
              </button>
              <button 
                onClick={() => navigate('/signup')}
                className="bg-[#161922] border border-gray-800 cursor-pointer hover:border-blue-500 px-12 py-6 rounded-2xl font-black text-xl transition-all"
              >
                Sign Up 
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-4">            
              <button 
                onClick={() => navigate('/chains')}
                className="bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl cursor-pointer font-black text-xl flex items-center justify-center gap-4 transition-all shadow-[0_20px_80px_rgba(37,99,235,0.25)]"
              >
                Go to chains <LuArrowRight size={24} />
              </button>
              <p className="text-gray-600 font-bold uppercase tracking-widest text-sm">Logged in as {user.email}</p>
            </div>
          )}
        </div>
      </section>

      <FeatureSection 
        tag="Repository"
        title="Chains Inventory"
        icon={LuLink}
        desc="Your library of automated intelligence. Manage and view your entire collection of workflows."
        benefit="View your chains"
        onClick={() => navigate('/chains')}
        imageSlot={
          <div className="relative group cursor-pointer overflow-hidden rounded-[2.5rem] border border-gray-800 bg-[#161922] p-8 transition-all hover:border-blue-500">
             <div className="flex justify-between items-center mb-10">
                <div className="h-6 w-32 bg-gray-800 rounded-lg animate-pulse"></div>
                <div className="h-10 w-10 bg-blue-600/20 rounded-xl"></div>
             </div>
             <div className="space-y-4">
                <div className="h-12 w-full bg-gray-800/40 rounded-xl"></div>
                <div className="h-12 w-full bg-gray-800/40 rounded-xl"></div>
                <div className="h-12 w-2/3 bg-gray-800/40 rounded-xl"></div>
             </div>
             <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold text-blue-400">View Inventory</div>
          </div>
        }
      />

      <FeatureSection 
        tag="History"
        title="Execution Logs"
        icon={LuCpu}
        reverse
        desc="Never lose a perfect output. Track every execution, review previous inputs, and verify the chain of thought across every historical run."
        benefit="Review past executions"
        onClick={() => navigate('/executions')}
        imageSlot={
          <div className="relative group cursor-pointer overflow-hidden rounded-[2.5rem] border border-gray-800 bg-[#161922] p-8 transition-all hover:border-emerald-500">
             <div className="flex gap-4 mb-6">
                <div className="h-4 w-4 rounded-full bg-emerald-500"></div>
                <div className="h-4 w-24 bg-gray-800 rounded"></div>
             </div>
             <div className="space-y-3">
                <div className="h-2 w-full bg-gray-800 rounded"></div>
                <div className="h-2 w-full bg-gray-800 rounded"></div>
                <div className="h-2 w-full bg-gray-800 rounded"></div>
             </div>
             <div className="absolute inset-0 bg-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold text-emerald-400">Track Executions</div>
          </div>
        }
      />

      <FeatureSection 
        tag="Account"
        title="Profile Control"
        icon={FaUserCircle}
        desc="Manage your account preferences and track your usage metrics."
        benefit="Check account"
        onClick={() => navigate('/profile')}
        imageSlot={
          <div className="relative group cursor-pointer overflow-hidden rounded-[2.5rem] border border-gray-800 bg-[#161922] p-10 flex flex-col items-center transition-all hover:border-purple-500">
             <div className="w-20 h-20 rounded-full bg-gray-800 mb-4 flex items-center justify-center">
                <FaUserCircle size={40} className="text-gray-600" />
             </div>
             <div className="h-4 w-32 bg-gray-800 rounded mb-2"></div>
             <div className="h-3 w-48 bg-gray-800/50 rounded"></div>
             <div className="absolute inset-0 bg-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold text-purple-400">Update Profile</div>
          </div>
        }
      />

      <section className="py-40 bg-blue-600/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-black mb-4">The Core Workflow</h2>
          </div>

          <div className="relative flex flex-col gap-12">
            <div className="absolute left-[30px] top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-blue-500/20 to-transparent hidden md:block"></div>

            <FormulaStep 
              step="01" 
              title="Initialize" 
              desc="Create a new entry in your Inventory to begin the construction process." 
            />
            <FormulaStep 
              step="02" 
              title="Chain" 
              desc="Build your logic using our multi-modal node system on the canvas." 
            />
            <FormulaStep 
              step="03" 
              title="Execute" 
              desc="Trigger the sequence and monitor the step flow in real-time." 
            />
            <FormulaStep 
              step="04" 
              title="Log" 
              desc="Your results are automatically committed to the History for future retrieval." 
              isLast
            />
          </div>
        </div>
      </section>

      <section className="py-40 text-center px-6 border-t border-gray-800/30">
        <h2 className="text-6xl font-black mb-12 tracking-tight">Ready to chain?</h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          {!isLoggedIn ? (
            <button 
              onClick={() => navigate('/signup')} 
              className="bg-white text-black cursor-pointer px-12 py-6 rounded-3xl font-black text-xl hover:bg-blue-500 hover:text-white transition-all shadow-2xl active:scale-95"
            >
              Sign in to get started
            </button>
          ) : (
            <button 
              onClick={() => navigate('/chains')} 
              className="bg-blue-600 text-white cursor-pointer px-12 py-6 rounded-3xl font-black text-xl hover:bg-blue-500 transition-all shadow-2xl active:scale-95"
            >
              Go to chains
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

/* --- REUSABLE SUB-COMPONENTS --- */

function FeatureSection({ tag, title, icon: Icon, desc, benefit, imageSlot, reverse, onClick }) {
  return (
    <section className={`py-32 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
      <div className={reverse ? 'lg:order-2' : ''}>
        <span className="text-blue-500 font-black tracking-[0.3em] uppercase text-sm mb-4 block">{tag}</span>
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <Icon className="text-blue-500" size={32} />
          </div>
          <h3 className="text-5xl font-black tracking-tight">{title}</h3>
        </div>
        <p className="text-xl text-gray-400 leading-relaxed mb-8">{desc}</p>
        <button 
          onClick={onClick}
          className="flex items-center gap-3 cursor-pointer text-white font-bold bg-[#161922] border border-gray-800 hover:border-blue-500 px-6 py-3 rounded-xl transition-all group"
        >
          <span>{benefit}</span>
          <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      <div className={`${reverse ? 'lg:order-1' : ''}`}>
        {imageSlot}
      </div>
    </section>
  );
}

function FormulaStep({ step, title, desc, isLast }) {
  return (
    <div className="relative flex items-start gap-10 group">
      <div className="w-20 h-20 rounded-[2rem] bg-[#161922] border-2 border-blue-500 flex items-center justify-center shrink-0 z-10 font-black text-2xl text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-xl">
        {step}
      </div>
      <div className="pt-4">
        <h4 className="text-3xl font-black mb-2 uppercase tracking-tight">{title}</h4>
        <p className="text-xl text-gray-500 max-w-2xl font-medium">{desc}</p>
      </div>
    </div>
  );
}