import { LuCircleCheckBig, LuTrash2, LuZap, LuFileText, LuTerminal } from 'react-icons/lu';
import { BiLoaderCircle } from "react-icons/bi";

export default function StepLevel({ step, inputValue, onPromptChange, onDelete, onInputChange, isActive, isCompleted }) {
  const isInputRequired = step.type === 'input' || step.type === 'file';

  return (
    <div className={`transition-all duration-500 group
      ${isActive ? 'scale-[1.02] z-10' : 'scale-100'}
    `}>
      {/* The Node Card */}
      <div className={`relative p-8 rounded-[2.5rem] border-2 transition-all duration-500 shadow-2xl
        ${isActive ? 'border-blue-500 bg-[#1a1f2e] ring-8 ring-blue-500/5' : 
          isCompleted ? 'border-emerald-500/30 bg-[#161a22]' : 
          'border-gray-800 bg-[#161922] hover:border-gray-700'}
      `}>
        
        {/* Top Header Row */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            {/* Step Badge */}
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg transition-colors shadow-inner
              ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-500'}
            `}>
              {step.order}
            </div>
            
            {/* Type Indicator */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-widest
              ${step.type === 'input' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                step.type === 'output' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                'bg-blue-500/10 border-blue-500/20 text-blue-400'}
            `}>
              {step.type === 'input' ? <LuTerminal size={12}/> : <LuZap size={12}/>}
              {step.type} NODE
            </div>
          </div>

          <div className="flex gap-3 items-center">
            {isCompleted && <LuCircleCheckBig className="text-emerald-500 animate-in zoom-in" size={24} />}
            {isActive && <BiLoaderCircle className="text-blue-500 animate-spin" size={24} />}
            <button 
              className="p-2.5 hover:bg-red-500/10 cursor-pointer text-gray-600 hover:text-red-400 rounded-xl transition-all opacity-0 group-hover:opacity-100"
              onClick={onDelete}
              title="Delete Step"
            >
              <LuTrash2 size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] ml-1">AI Instructions</label>
          <div className="relative">
            <textarea 
              value={step.prompt}
              onChange={(e) => onPromptChange(e.target.value)}
              placeholder="What should the AI do in this step?"
              className="w-full bg-transparent border-none p-0 text-xl md:text-2xl text-gray-100 focus:ring-0 resize-none placeholder:text-gray-800 leading-relaxed min-h-[80px]"
              rows={Math.max(2, step.prompt.split('\n').length)}
            />
          </div>
        </div>
        
        {isInputRequired && (
          <div className="mt-8 pt-6 border-t border-gray-800/50 animate-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 mb-3">
               <LuFileText size={14} className="text-blue-500/50"/>
               <label className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]">Execution Context</label>
            </div>
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              disabled={isCompleted || isActive}
              placeholder={`Type or paste data for step ${step.order}...`}
              className="w-full bg-gray-950/50 border border-gray-800 rounded-2xl px-5 py-4 text-gray-200 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all text-lg font-medium placeholder:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
            />
          </div>
        )}

        {isActive && (
          <div className="absolute bottom-0 left-0 w-full h-1 overflow-hidden rounded-b-[2.5rem]">
            <div className="h-full bg-blue-500 animate-[progress_2s_ease-in-out_infinite] w-1/3 shadow-[0_0_10px_#3b82f6]"></div>
          </div>
        )}
      </div>
    </div>
  );
}