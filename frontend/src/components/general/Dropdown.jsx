import { useState, useRef, useEffect } from "react";
import { LuChevronDown } from "react-icons/lu";

export default function Dropdown({ icon: Icon, title, data, onSelect, renderItem }) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handler = (e) => { if (!menuRef.current?.contains(e.target)) setOpen(false); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
      <div className="relative flex items-center" ref={menuRef}>
        <button 
          onClick={() => setOpen(!open)}
          title={title}
          className={`flex items-center justify-center w-12 h-12 rounded-xl border-y border-l cursor-pointer transition-all duration-300 shadow-2xl
            ${open 
                ? 'bg-blue-600 border-blue-500 text-white translate-x-0' 
                : 'bg-[#1c212c] border-gray-800 text-gray-400 hover:text-white hover:bg-[#222936]'
            }`}
        >
          {open ? <LuChevronDown size={20} /> : <Icon size={20} />}
        </button>

        {open && (
          <div className="absolute top-12 right-0 w-80 bg-[#1c212c] border border-gray-800 rounded-2xl rounded-t-none shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 animate-in slide-in-from-right-5 fade-in duration-200">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</span>
                <span className="text-[10px] bg-gray-800 px-2 py-0.5 rounded text-gray-400">{data.length} Total</span>
            </div>
            
            <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                {data.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-600 italic">No items found</div>
                ) : (
                    data.map((item, i) => (
                        <div 
                            key={item._id || i} 
                            onClick={() => { onSelect(item); setOpen(false); }}
                            className="p-4 hover:bg-blue-500/5 cursor-pointer border-b border-gray-800/50 transition-colors last:border-none"
                        >
                            {renderItem(item)}
                        </div>
                    ))
                )}
            </div>
          </div>
        )}
      </div>
    );
}