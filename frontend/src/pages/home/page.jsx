import { useNavigate } from 'react-router-dom';
import { LuDatabase, LuZap, LuKey } from 'react-icons/lu';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto py-20 text-center">
      <h2 className="text-6xl font-black mb-6 tracking-tighter">
        Build. Chain. <span className="text-blue-500">Execute.</span>
      </h2>
      <p className="text-2xl text-gray-400 mb-12 leading-relaxed">
        Chain Architect allows you to link multiple AI prompts into a single automated workflow. 
        Each step feeds into the next, creating a powerful logic sequence for complex tasks.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 text-left">
        <div 
          onClick={() => navigate('/chains')}
          className="p-8 bg-[#161922] border border-gray-800 rounded-[2rem] hover:border-blue-500 cursor-pointer transition-all group"
        >
          <LuDatabase className="text-blue-500 mb-4" size={40} />
          <h3 className="text-2xl font-bold mb-2">Manage Chains</h3>
          <p className="text-gray-500 text-lg">Create, edit, and organize your AI workflows in a visual grid.</p>
        </div>

        <div 
          onClick={() => navigate('/executions')}
          className="p-8 bg-[#161922] border border-gray-800 rounded-[2rem] hover:border-emerald-500 cursor-pointer transition-all group"
        >
          <LuZap className="text-emerald-500 mb-4" size={40} />
          <h3 className="text-2xl font-bold mb-2">View History</h3>
          <p className="text-gray-500 text-lg">Track every run, see past inputs, and review AI responses.</p>
        </div>
      </div>

      <div className="p-6 bg-amber-900/10 border border-amber-500/20 rounded-2xl flex items-center gap-4 text-left">
        <LuKey className="text-amber-500 shrink-0" size={32} />
        <p className="text-amber-200/80 text-lg">
          <span className="font-bold">Coming Soon:</span> Custom API Key management. For now, the system uses the default server-side key.
        </p>
      </div>
    </div>
  );
}