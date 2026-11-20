import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function TableToolbar({
  search,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  filters = [],
  sortOptions = [],
  sortKey,
  onSortChange,
  rightActions,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[240px]">
        <div className="relative flex-1 max-w-[300px] min-w-[200px]">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#E1E7E3] bg-white text-[13px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#158F50] focus:ring-2 focus:ring-[#158F50]/15"
          />
        </div>

        {filters.map((filter) => (
          <div key={filter.label} className="relative inline-flex items-center">
            <SlidersHorizontal
              size={14}
              className="absolute left-2.5 text-[#6B7280] pointer-events-none"
            />
            <select
              aria-label={filter.label}
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="h-9 pl-8 pr-7 rounded-lg border border-[#E1E7E3] bg-white text-[13px] font-medium text-[#374151] hover:border-[#CDD7D1] focus:outline-none focus:border-[#158F50]"
            >
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        {sortOptions.length > 0 && (
          <div className="relative inline-flex items-center">
            <ArrowUpDown
              size={14}
              className="absolute left-2.5 text-[#6B7280] pointer-events-none"
            />
            <select
              aria-label="Sort records"
              value={sortKey}
              onChange={(e) => onSortChange(e.target.value)}
              className="h-9 pl-8 pr-7 rounded-lg border border-[#E1E7E3] bg-white text-[13px] font-medium text-[#374151] hover:border-[#CDD7D1] focus:outline-none focus:border-[#158F50]"
            >
              <option value="">Sort by</option>
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {rightActions && <div className="flex items-center gap-2 shrink-0">{rightActions}</div>}
    </div>
  );
}
