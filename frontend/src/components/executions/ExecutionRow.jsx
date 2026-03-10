import { useState } from 'react';
import { LuChevronDown, LuChevronUp, LuCalendar, LuCpu } from 'react-icons/lu';

export default function ExecutionRow({ execution, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const dateStr = new Date(execution.createdAt).toLocaleString();

  // Helper to extract a snippet of the first input for the preview
  const firstInput = execution.stepInputs ? Object.values(execution.stepInputs)[0] : "N/A";

  return (
    <div className="bg-[#161922] transition-all overflow-hidden">
      <div className="p-6 flex flex-wrap items-center justify-between gap-4">
        {/* Basic Info Group */}
        <div className="flex items-center gap-6 flex-1 min-w-[300px]">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${execution.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
            <LuCpu size={28} />
          </div>
          
          <div className="flex-1">
            <span className="font-semibold text-s tracking-widest">{execution._id}</span>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
              <span className="flex items-center gap-1"><LuCalendar size={14}/> {dateStr}</span>
              <span className="uppercase font-black text-[10px] tracking-widest">{execution.status}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-3 bg-gray-800 rounded-xl hover:bg-gray-700 text-gray-400 transition-all"
          >
            {isExpanded ? <LuChevronUp size={24} /> : <LuChevronDown size={24} />}
          </button>
          {/* <button 
            onClick={onDelete}
            className="p-3 bg-red-900/10 rounded-xl hover:bg-red-900/30 text-red-500 transition-all"
          >
            <Trash2 size={24} />
          </button> */}
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-8 pb-8 pt-2 border-t border-gray-800/50 animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            {/* Inputs Block */}
            <div className="bg-black/20 p-6 rounded-2xl border border-gray-800">
              <h4 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-4">Unique Step Inputs</h4>
              <div className="space-y-4">
                {Object.entries(execution.stepInputs || {}).map(([order, val]) => (
                  <div key={order} className="flex gap-4">
                    <span className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-xs font-bold text-blue-400 shrink-0">{order}</span>
                    <p className="text-gray-300 break-words">{val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Response Block */}
            <div className="bg-blue-500/5 p-6 rounded-2xl border border-blue-500/20">
              <h4 className="text-sm font-black text-blue-500/50 uppercase tracking-widest mb-4">Final AI Response</h4>
              <div className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">
                {execution.response || "No response recorded."}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}