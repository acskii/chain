import { useState } from 'react';
import { LuMousePointer2, LuCpu, LuFileJson, LuFileText, LuCheck } from 'react-icons/lu';

const NODE_TYPES = [
  { id: 'input', label: 'Input Node', icon: LuMousePointer2, desc: 'Accepts user text input' },
  { id: 'internal', label: 'Internal Node', icon: LuCpu, desc: 'Pure AI processing step' },
  { id: 'output', label: 'Output Node', icon: LuFileJson, desc: 'Formats final response' },
  { id: 'file', label: 'File Node', icon: LuFileText, desc: 'Injects file contents' },
];

export default function AddStepNode({ onAdd }) {
  const [selectedType, setSelectedType] = useState(null);

  const handleConfirm = () => {
    onAdd(selectedType);
    setSelectedType(null);
  };

  return (
    <div className="flex flex-col items-center py-10">
      <div className="w-px h-12 bg-gray-800 mb-4"></div>
      
      {!selectedType ? (
        <div className="flex items-center gap-6">
          {NODE_TYPES.map((type) => (
            <div key={type.id} className="group relative">
              <button
                onClick={() => setSelectedType(type.id)}
                className="w-16 h-16 rounded-2xl bg-[#161922] border-2 border-gray-800 flex items-center justify-center hover:border-blue-500 hover:text-blue-400 transition-all"
              >
                <type.icon size={28} />
              </button>
              {/* Hover Tooltip */}
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all bg-gray-800 text-white text-sm p-3 rounded-xl w-40 text-center pointer-events-none z-50 shadow-xl border border-gray-700">
                <p className="font-bold">{type.label}</p>
                <p className="text-xs text-gray-400">{type.desc}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full max-w-xl bg-blue-900/10 border-2 border-blue-500 rounded-3xl p-8 flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-300">
          <h3 className="text-xl font-bold uppercase tracking-widest text-blue-400">
            Confirm New {selectedType} Node
          </h3>
          <div className="flex gap-4">
            <button 
              onClick={handleConfirm}
              className="bg-emerald-600 hover:bg-emerald-500 px-8 py-3 rounded-xl flex items-center gap-2 font-bold"
            >
              <LuCheck size={20} /> Connect to Chain
            </button>
            <button 
              onClick={() => setSelectedType(null)}
              className="bg-gray-800 hover:bg-gray-700 px-8 py-3 rounded-xl font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}