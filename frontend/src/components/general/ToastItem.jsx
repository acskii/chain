import { IoClose } from "react-icons/io5";
import { BiSolidInfoSquare, BiSolidError } from "react-icons/bi";
import { FaCheckSquare } from "react-icons/fa";

export default function ToastItem({ toast, onClose }) {
    const styles = {
        success: "bg-green-500",
        error: "bg-red-500",
        info: "bg-blue-500",
    };

    const icons = {
        success: FaCheckSquare, error: BiSolidError, info: BiSolidInfoSquare
    }
    const Icon = icons[toast.type];

    return (
        <div className={`
            pointer-events-auto text-white font-semibold
            w-full flex items-center justify-between 
            p-4 transition-all duration-300 transform
            animate-in fade-in slide-in-from-top-5
            ${styles[toast.type]}
        `}>
            <div className="flex items-center gap-3">
                <Icon size={20} />
                <p className="text-md leading-relaxed">{toast.message}</p>
            </div>
            
            <button 
                onClick={onClose}
                className="p-1 cursor-pointer hover:bg-black/5 rounded-full transition-colors"
                aria-label="Close"
            >
                <IoClose size={20}/>
            </button>
        </div>
    );
};