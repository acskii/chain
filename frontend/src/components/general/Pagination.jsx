import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex justify-center items-center gap-4 mt-12 pb-10">
      <button 
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-3 rounded-full bg-[#161922] border border-gray-800 disabled:opacity-30 hover:border-blue-500 transition-all"
      >
        <LuChevronLeft size={28} />
      </button>
      
      <div className="flex gap-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={`w-12 h-12 rounded-xl border flex items-center justify-center font-bold transition-all ${
              currentPage === i + 1 
              ? 'bg-blue-600 border-blue-500 text-white' 
              : 'bg-[#161922] border-gray-800 text-gray-400 hover:border-gray-600'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <button 
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-3 rounded-full bg-[#161922] border border-gray-800 disabled:opacity-30 hover:border-blue-500 transition-all"
      >
        <LuChevronRight size={28} />
      </button>
    </div>
  );
}