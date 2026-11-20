import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}) {
  if (totalItems === 0) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  const pages = [];
  for (let i = 1; i <= totalPages; i += 1) {
    pages.push(i);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-t border-[#E1E7E3] bg-[#FAFDFB]">
      <p className="text-[12.5px] text-[#6B7280] tabular-nums">
        Showing <span className="font-semibold text-[#111827]">{start}</span> to{' '}
        <span className="font-semibold text-[#111827]">{end}</span> of{' '}
        <span className="font-semibold text-[#111827]">{totalItems}</span> entries
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
          className="h-8 px-2.5 rounded-md border border-[#E1E7E3] bg-white text-[#4B5563] text-[12.5px] font-medium flex items-center gap-1 disabled:opacity-45 disabled:cursor-not-allowed hover:bg-[#F3F6F4]"
        >
          <ChevronLeft size={14} />
          <span>Prev</span>
        </button>

        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-md text-[12.5px] font-semibold tabular-nums transition-colors ${
              page === currentPage
                ? 'bg-[#158F50] text-white'
                : 'border border-[#E1E7E3] bg-white text-[#4B5563] hover:bg-[#F3F6F4]'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
          className="h-8 px-2.5 rounded-md border border-[#E1E7E3] bg-white text-[#4B5563] text-[12.5px] font-medium flex items-center gap-1 disabled:opacity-45 disabled:cursor-not-allowed hover:bg-[#F3F6F4]"
        >
          <span>Next</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
