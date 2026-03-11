import { useState } from 'react';
import { LuMousePointer2, LuCpu, LuFileJson, LuFileText, LuPlus, LuX } from 'react-icons/lu';

const NODE_TYPES = [
  { id: 'input', label: 'Input Node', icon: LuMousePointer2, desc: 'Accepts user text input', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: 'fixed', label: 'Fixed Node', icon: LuCpu, desc: 'Pure AI processing step', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'output', label: 'Output Node', icon: LuFileJson, desc: 'Formats final response', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { id: 'file', label: 'File Node', icon: LuFileText, desc: 'Injects file contents', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
];

export default function AddStepNode({ onAdd }) {
  const [selectedType, setSelectedType] = useState(null);

  const handleConfirm = () => {
    onAdd(selectedType.id);
    setSelectedType(null);
  };

  return (
    <div className="flex flex-col items-center w-full mt-4 pb-20">
      {/* Connector Line from previous node */}
      <div className="w-[2px] h-12 bg-gradient-to-b from-gray-800 to-blue-500/20 mb-6"></div>
      
      {!selectedType ? (
        <div className="group flex flex-col items-center">
          <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-8 group-hover:text-blue-500/50 transition-colors">
            Add Next Link
          </div>
          
          <div className="flex items-center gap-4 p-3 bg-[#161922]/50 border border-gray-800 rounded-[2rem] backdrop-blur-sm shadow-xl">
            {NODE_TYPES.map((type) => (
              <div key={type.id} className="group/item relative">
                <button
                  onClick={() => setSelectedType(type)}
                  className={`w-14 h-14 rounded-xl bg-[#0f1117] cursor-pointer border border-gray-800 flex items-center justify-center hover:border-blue-500 transition-all duration-300`}
                >
                  <type.icon size={22} className="text-gray-400 group-hover/item:text-blue-400" />
                </button>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 scale-0 group-hover/item:scale-100 transition-all origin-bottom bg-gray-900 p-3 rounded-xl w-50 text-center z-50 pointer-events-none">
                  <p className={`font-bold text-md uppercase tracking-wider ${type.color}`}>{type.label}</p>
                  <p className="text-md text-gray-500 mt-1 leading-relaxed">{type.desc}</p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
          <div className="flex items-center gap-4">
            <h2 className={`font-bold text-md uppercase tracking-wider ${selectedType.color}`}>{selectedType.label}</h2>
            <button 
              onClick={handleConfirm}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-xl flex items-center gap-3 font-bold text-md transition-all cursor-pointer"
            >
              <LuPlus size={18} /> Confirm Connection
            </button>
            <button 
              onClick={() => setSelectedType(null)}
              className="bg-gray-800 hover:bg-gray-700 text-gray-400 px-3 py-2 rounded-xl flex items-center gap-2 font-bold text-md transition-all cursor-pointer"
            >
              <LuX size={18} /> Cancel
            </button>
          </div>
      )}
    </div>
  );
}