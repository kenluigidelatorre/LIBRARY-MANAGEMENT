import { useState } from 'react';
import { Download, BookOpen, Users, AlertTriangle, DollarSign } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import StatCard from '../components/common/StatCard';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';
import StatusBadge from '../components/common/StatusBadge';

export default function Reports() {
  const { books, categories, borrowings, returns, fines, addToast } = useLibrary();
  const [activeTab, setActiveTab] = useState('overview');

  const totalCopies = books.reduce((s, b) => s + Number(b.copies || 0), 0);
  const borrowedCopies = books.reduce(
    (s, b) => s + (Number(b.copies || 0) - Number(b.available || 0)),
    0
  );
  const unpaidFines = fines
    .filter((f) => f.status === 'Unpaid')
    .reduce((s, f) => s + Number(f.amount || 0), 0);

  const exportCsv = () => {
    const rows = [
      ['Book ID', 'Title', 'Author', 'Category', 'ISBN', 'Copies', 'Available', 'Status'],
      ...books.map((b) => [
        b.id,
        `"${b.title.replace(/"/g, '""')}"`,
        `"${b.author.replace(/"/g, '""')}"`,
        `"${b.category}"`,
        b.isbn,
        b.copies,
        b.available,
        b.status,
      ]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cmd-library-report.csv';
    link.click();
    URL.revokeObjectURL(url);
    addToast('Library inventory report exported as CSV.');
  };

  return (
    <div className="space-y-5">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Reports &amp; Analytics</h1>
          <p className="page-subtitle">
            Circulation metrics, category distribution, and overdue summaries
          </p>
        </div>
        <button type="button" onClick={exportCsv} className="btn-primary">
          <Download size={16} />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="stat-grid-4">
        <StatCard
          icon={BookOpen}
          label="Total Catalog Copies"
          value={totalCopies}
          tone="green"
        />
        <StatCard
          icon={Users}
          label="Copies in Circulation"
          value={borrowedCopies}
          tone="blue"
        />
        <StatCard
          icon={AlertTriangle}
          label="Overdue Loans"
          value={borrowings.filter((b) => b.status === 'Overdue').length}
          tone="red"
        />
        <StatCard
          icon={DollarSign}
          label="Outstanding Fines"
          value={`$${unpaidFines.toFixed(2)}`}
          tone="amber"
        />
      </div>

      {/* Report Tabs */}
      <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white border border-[#E1E7E3]">
        {[
          { id: 'overview', label: 'Circulation Overview' },
          { id: 'categories', label: 'Inventory by Category' },
          { id: 'overdue', label: 'Overdue & Unpaid Fines' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#158F50] text-white'
                : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F6F4]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <AnalyticsChart books={books} borrowings={borrowings} returns={returns} />
      )}

      {activeTab === 'categories' && (
        <section className="cmd-card p-6 space-y-4">
          <h2 className="text-[17px] font-bold text-[#111827]">
            Collection Distribution by Category
          </h2>
          <div className="space-y-4">
            {categories.map((cat) => {
              const catBooks = books.filter((b) => b.category === cat.name);
              const catCopies = catBooks.reduce((s, b) => s + Number(b.copies || 0), 0);
              const catAvail = catBooks.reduce((s, b) => s + Number(b.available || 0), 0);
              const pct = totalCopies > 0 ? Math.round((catCopies / totalCopies) * 100) : 0;

              return (
                <div key={cat.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[13.5px]">
                    <span className="font-semibold text-[#111827]">
                      {cat.name}{' '}
                      <span className="text-[12px] font-normal text-[#6B7280]">
                        ({catBooks.length} titles)
                      </span>
                    </span>
                    <span className="text-[#4B5563] tabular-nums">
                      {catAvail} / {catCopies} available ({pct}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-[#E7ECE9] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#158F50]"
                      style={{ width: `${Math.max(4, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {activeTab === 'overdue' && (
        <section className="cmd-card overflow-hidden">
          <div className="px-6 py-4">
            <h2 className="text-[17px] font-bold text-[#111827]">
              Overdue Loans &amp; Unpaid Penalties
            </h2>
          </div>
          <div className="table-scroll">
            <table className="cmd-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Borrower</th>
                  <th>Book Title</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {borrowings
                  .filter((b) => b.status === 'Overdue')
                  .map((item) => (
                    <tr key={item.id}>
                      <td className="font-mono-data text-[12.5px] font-semibold">{item.id}</td>
                      <td className="font-semibold">{item.borrowerName}</td>
                      <td>{item.bookTitle}</td>
                      <td className="tabular-nums">{item.dueDate}</td>
                      <td>
                        <StatusBadge status={item.status} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
