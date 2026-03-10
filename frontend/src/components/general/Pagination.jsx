import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 4;

    if (totalPages <= 8) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let startPage = Math.max(1, currentPage - 1);
      let endPage = startPage + maxVisiblePages - 1;

      if (endPage >= totalPages) {
        endPage = totalPages - 1; // Save the last spot for the actual last page
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis and last page
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    return pages;
  };

  const buttonBase = "h-10 flex items-center justify-center rounded-lg border transition-all duration-200 font-semibold text-sm shadow-sm";

  return (
    <div className="flex justify-center items-center gap-2 mt-12 pb-10">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`${buttonBase} w-10 cursor-pointer bg-blue-400 border-gray-800 text-white disabled:opacity-20 hover:border-blue-500/50 hover:text-white`}
      >
        <LuChevronLeft size={18} />
      </button>

      <div className="flex gap-2">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span key={`gap-${index}`} className="h-10 w-8 flex items-end justify-center text-gray-600 pb-2">
                ...
              </span>
            );
          }

          const isActive = currentPage === page;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`${buttonBase} min-w-[40px] px-3 cursor-pointer
                ${isActive 
                  ? 'bg-blue-600 border-blue-500 text-white' 
                  : 'bg-[#1c212c] border-gray-800 text-gray-500 hover:text-gray-200 hover:border-gray-700'
                }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`${buttonBase} w-10 cursor-pointer bg-blue-500 border-gray-800 text-white disabled:opacity-20 hover:border-blue-500/50 hover:text-white`}
      >
        <LuChevronRight size={18} />
      </button>
    </div>
  );
}