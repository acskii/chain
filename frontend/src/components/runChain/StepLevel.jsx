import { LuCircleCheckBig } from 'react-icons/lu';
import { BiLoaderCircle } from "react-icons/bi";
import { FaRegTrashCan } from "react-icons/fa6";

export default function StepLevel({ step, inputValue, onPromptChange, onDelete, onInputChange, isActive, isCompleted }) {
  const isInputRequired = step.type === 'input' || step.type === 'file';

  return (
    <div className={`relative p-8 rounded-[2rem] border-2 transition-all duration-700 ${
        isActive ? 'border-blue-500 bg-blue-500/5 ring-4 ring-blue-500/10' : 
        isCompleted ? 'border-emerald-500/40 bg-emerald-500/5' : 
        'border-gray-800 bg-[#161922]'
    }`}>
      {/* Connector Line */}
      <div className="absolute -top-6 left-1/2 w-px h-6 bg-gray-800"></div>
      
      <div className="absolute -top-4 -left-4 w-10 h-10 rounded-xl bg-gray-900 border border-gray-700 flex items-center justify-center font-black text-blue-400 shadow-xl">
        {step.order}
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2">
             <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                 step.type === 'input' ? 'bg-purple-900/40 text-purple-400' :
                 step.type === 'output' ? 'bg-amber-900/40 text-amber-400' :
                 'bg-gray-800 text-gray-400'
             }`}>
                {step.type} NODE
             </span>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          {isCompleted && <LuCircleCheckBig className="text-emerald-500 animate-in zoom-in" size={28} />}
          {isActive && <BiLoaderCircle className="text-blue-500 animate-spin" size={28} />}
          <button 
            className="p-2 hover:bg-red-500/10 text-gray-600 hover:text-red-500 rounded-xl transition-all"
            onClick={onDelete}
            >
            <FaRegTrashCan size={22} />
          </button>
        </div>
      </div>

      {/* Prompt Display/Edit */}
      <div>
          <label className="text-xs font-bold text-gray-500 mb-2 block uppercase">Step Prompt</label>
          <textarea 
            value={step.prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="Describe what the AI should do in this step..."
            className="w-full bg-transparent border-none p-0 text-xl text-gray-200 focus:ring-0 resize-none placeholder:text-gray-700"
            rows={2}
          />
        </div>
      
      {/* Input Field (If required by type) */}
      {isInputRequired && (
        <div className="mt-6 animate-in slide-in-from-left-4">
          <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">User Input Required</label>
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            disabled={isCompleted || isActive}
            placeholder={`Enter ${step.stepType === 'file' ? 'file content' : 'data'} for this step...`}
            className="w-full bg-black/30 border border-gray-700 rounded-2xl p-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-xl disabled:opacity-50"
          />
        </div>
      )}

      {/* Progress Overlay for Active Step */}
      {isActive && (
        <div className="absolute inset-0 bg-blue-500/5 rounded-[2rem] pointer-events-none overflow-hidden">
           <div className="absolute bottom-0 left-0 h-1 bg-blue-500 animate-progress-glow w-full"></div>
        </div>
      )}
    </div>
  );
}