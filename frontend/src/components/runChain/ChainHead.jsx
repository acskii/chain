import { FaLink } from "react-icons/fa";

export default function ChainHead({ name, onChange }) {
    return (
        <div className="flex flex-col items-center animate-in fade-in slide-in-from-top-8 duration-700">
            {/* The Coil Node */}
            <div className="group relative bg-gradient-to-br from-blue-600 to-blue-900 p-[2px] rounded-full shadow-[0_0_40px_rgba(37,99,235,0.2)]">
                <div className="bg-[#0f1117] rounded-full px-4 py-4 flex items-center gap-4 border border-blue-500/30">
                    <div className="bg-blue-500/20 p-2 rounded-full ring-2 ring-blue-500/40">
                        <input 
                            value={name}
                            onChange={(e) => onChange(e.target.value)}
                            className="bg-transparent border-none outline-none text-2xl font-bold text-center tracking-tighter text-white w-64 placeholder:text-gray-700"
                            placeholder="Untitled"
                        />
                    </div>
                </div>
            </div>

            {/* The Physical Link Connector */}
            <div className="flex flex-col items-center">
                <div className="w-[2px] h-20 bg-gradient-to-b from-blue-500 via-gray-700 to-gray-800"></div>
                <div className="bg-gray-800 p-2 rounded-md border border-gray-700">
                    <FaLink size={16} className="rotate-135" />
                </div>
                <div className="w-[2px] h-8 bg-gray-800"></div>
            </div>
        </div>
    );
};