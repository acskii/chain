import { LuSparkles, LuCopy, LuRefreshCw } from 'react-icons/lu';

export default function ExecutionResult({ response, onClear }) {
  if (!response) return null;

  return (
    <div className="mt-12 p-10 bg-gradient-to-br from-gray-900 to-[#161922] border-2 border-emerald-500/30 rounded-[2.5rem] shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <LuSparkles className="text-emerald-400" />
          <h3 className="text-2xl font-bold text-white">Final Output</h3>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => navigator.clipboard.writeText(response)}
            className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-400 hover:text-white"
          >
            <LuCopy size={20} />
          </button>
          <button 
            onClick={onClear}
            className="p-3 bg-gray-800 hover:bg-red-900/20 rounded-xl text-gray-400 hover:text-red-400"
          >
            <LuRefreshCw size={20} />
          </button>
        </div>
      </div>
      
      <div className="bg-black/20 p-6 rounded-2xl border border-white/5 text-gray-200 leading-relaxed">
        <pre className="whitespace-pre-wrap font-sans text-xl">
          {response}
        </pre>
      </div>
    </div>
  );
}