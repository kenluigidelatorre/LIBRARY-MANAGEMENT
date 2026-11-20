import { useState, useMemo } from 'react';
import { BookOpen, Users, AlertTriangle, TrendingUp } from 'lucide-react';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export default function AnalyticsChart({ books = [], borrowings = [], returns = [] }) {
  const [period, setPeriod] = useState('year');
  const [hoveredMonth, setHoveredMonth] = useState(null);

  const monthlySeries = useMemo(() => {
    const counts = MONTHS.map((month) => ({
      month,
      borrowed: 0,
      returned: 0,
      overdue: 0,
    }));

    borrowings.forEach((loan) => {
      const dateStr = loan.borrowDate;
      if (!dateStr) return;
      const monthIdx = new Date(dateStr).getMonth();
      if (!Number.isNaN(monthIdx) && counts[monthIdx]) {
        if (loan.status === 'Overdue') {
          counts[monthIdx].overdue += 1;
        } else if (loan.status === 'Returned') {
          counts[monthIdx].returned += 1;
        } else {
          counts[monthIdx].borrowed += 1;
        }
      }
    });

    returns.forEach((ret) => {
      const dateStr = ret.returnDate;
      if (!dateStr) return;
      const monthIdx = new Date(dateStr).getMonth();
      if (!Number.isNaN(monthIdx) && counts[monthIdx]) {
        // Avoid double-counting if already counted from borrowings with Returned status
        const matched = borrowings.some((b) => b.id === ret.borrowId);
        if (!matched) {
          counts[monthIdx].returned += 1;
        }
      }
    });

    return counts;
  }, [borrowings, returns]);

  const chartData = period === 'half' ? monthlySeries.slice(6) : monthlySeries;

  const peakCount = useMemo(() => {
    const maxFound = chartData.reduce(
      (max, row) => Math.max(max, row.borrowed, row.returned, row.overdue),
      0
    );
    return Math.max(4, Math.ceil(maxFound / 4) * 4);
  }, [chartData]);

  const yTicks = [
    peakCount,
    Math.round(peakCount * 0.75),
    Math.round(peakCount * 0.5),
    Math.round(peakCount * 0.25),
    0,
  ];

  const totalCopies = books.reduce((sum, b) => sum + Number(b.copies || 0), 0);
  const availCopies = books.reduce((sum, b) => sum + Number(b.available || 0), 0);
  const utilizationPct =
    totalCopies > 0
      ? Math.round(((totalCopies - availCopies) / totalCopies) * 100)
      : 0;

  const onTimeReturns = returns.filter((r) => r.status === 'On Time').length;
  const returnRatePct =
    returns.length > 0 ? Math.round((onTimeReturns / returns.length) * 100) : 0;

  const mostBorrowedTitle = useMemo(() => {
    if (borrowings.length === 0) return books[0]?.title || 'No loans recorded';
    const tally = {};
    borrowings.forEach((b) => {
      tally[b.bookTitle] = (tally[b.bookTitle] || 0) + 1;
    });
    const top = Object.entries(tally).sort((a, b) => b[1] - a[1])[0];
    return top ? top[0] : books[0]?.title || 'No loans recorded';
  }, [borrowings, books]);

  const summaryHighlights = [
    {
      icon: BookOpen,
      label: 'Most Borrowed Book',
      value: mostBorrowedTitle,
    },
    {
      icon: Users,
      label: 'Active Loans',
      value: `${borrowings.filter((b) => b.status !== 'Returned').length} active records`,
    },
    {
      icon: TrendingUp,
      label: 'On-Time Return Rate',
      value: returns.length > 0 ? `${returnRatePct}% on schedule` : 'No returns yet',
    },
    {
      icon: AlertTriangle,
      label: 'Catalog Utilization',
      value: `${utilizationPct}% in circulation`,
    },
  ];

  return (
    <section className="cmd-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[17px] font-bold text-[#111827]">Reports &amp; Analytics</h2>
          <p className="text-[12.5px] text-[#6B7280] mt-0.5">
            Monthly borrowing, return, and overdue trends
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-4 text-[12px] font-medium text-[#4B5563]">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
              Borrowed
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#158F50]" />
              Returned
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6EE7B7]" />
              Overdue
            </span>
          </div>

          <select
            aria-label="Select analytics period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="h-8 px-3 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[12.5px] font-medium text-[#374151] focus:outline-none focus:border-[#158F50]"
          >
            <option value="year">This Year</option>
            <option value="half">Last 6 Months</option>
          </select>
        </div>
      </div>

      <div className="relative pt-4 pb-2">
        <div className="flex">
          <div className="flex flex-col justify-between pr-3 pb-7 text-[11px] font-medium text-[#9CA3AF] tabular-nums select-none">
            {yTicks.map((tick) => (
              <span key={tick}>{tick}</span>
            ))}
          </div>

          <div className="flex-1 relative">
            <div className="h-[220px] flex flex-col justify-between border-b border-[#E1E7E3] relative">
              {yTicks.slice(0, -1).map((tick, idx) => (
                <div
                  key={`${tick}-${idx}`}
                  className="w-full border-t border-dashed border-[#E5ECE8]"
                />
              ))}

              <div className="absolute inset-0 flex items-end justify-between gap-2 px-2">
                {chartData.map((row) => {
                  const isHovered = hoveredMonth === row.month;
                  return (
                    <div
                      key={row.month}
                      onMouseEnter={() => setHoveredMonth(row.month)}
                      onMouseLeave={() => setHoveredMonth(null)}
                      className="flex-1 h-full flex items-end justify-center gap-[3px] relative group cursor-pointer"
                    >
                      {isHovered && (
                        <div className="absolute -top-11 left-1/2 -translate-x-1/2 z-20 bg-[#0C3B22] text-white text-[11px] rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-md pointer-events-none tabular-nums">
                          <span className="font-semibold">{row.month}:</span> {row.borrowed}B ·{' '}
                          {row.returned}R · {row.overdue}O
                        </div>
                      )}
                      <div
                        className="w-2.5 sm:w-3 rounded-t-[4px] bg-[#EF4444] transition-opacity duration-150 group-hover:opacity-90"
                        style={{ height: `${Math.min(100, (row.borrowed / peakCount) * 100)}%` }}
                      />
                      <div
                        className="w-2.5 sm:w-3 rounded-t-[4px] bg-[#158F50] transition-opacity duration-150 group-hover:opacity-90"
                        style={{ height: `${Math.min(100, (row.returned / peakCount) * 100)}%` }}
                      />
                      <div
                        className="w-2.5 sm:w-3 rounded-t-[4px] bg-[#6EE7B7] transition-opacity duration-150 group-hover:opacity-90"
                        style={{ height: `${Math.min(100, (row.overdue / peakCount) * 100)}%` }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between gap-2 px-2 pt-2.5">
              {chartData.map((row) => (
                <div
                  key={row.month}
                  className="flex-1 text-center text-[11.5px] font-medium text-[#6B7280]"
                >
                  {row.month}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-4 border-t border-[#E1E7E3]">
        {summaryHighlights.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="rounded-xl border border-[#E1E7E3] bg-[#F8FAF9] px-4 py-3 flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-[#E7F6EE] text-[#158F50] flex items-center justify-center shrink-0 mt-0.5">
              <Icon size={15} />
            </div>
            <div className="min-w-0">
              <div className="text-[11.5px] font-medium text-[#6B7280]">{label}</div>
              <div className="text-[13px] font-bold text-[#111827] truncate mt-0.5">
                {value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
