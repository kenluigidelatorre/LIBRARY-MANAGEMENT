import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users,
  GraduationCap,
  ArrowLeftRight,
  AlertTriangle,
  CalendarClock,
  CheckCircle,
  Eye,
} from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';

export default function Dashboard() {
  const {
    books,
    students,
    faculty,
    borrowings,
    returns,
    reservations,
    processReturn,
  } = useLibrary();
  const navigate = useNavigate();
  const [activityFilter, setActivityFilter] = useState('All');

  const totalBookCopies = books.reduce((sum, b) => sum + Number(b.copies || 0), 0);
  const activeBorrowed = borrowings.filter((b) => b.status === 'Borrowed').length;
  const overdueCount = borrowings.filter((b) => b.status === 'Overdue').length;
  const pendingReservations = reservations.filter((r) => r.status === 'Pending').length;

  const filteredActivity = borrowings
    .filter((b) => (activityFilter === 'All' ? true : b.status === activityFilter))
    .slice(0, 7);

  return (
    <div className="space-y-6">
      {/* Hero Banner matching Figma Image 1 */}
      <section className="hero-banner">
        <img
          src="/src/assets/images/library.jpg"
          alt="CMD Campus Library Building"
          referrerPolicy="no-referrer"
          className="hero-banner-img"
        />
        <div className="relative z-10 px-7 py-6 max-w-[600px]">
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-[#A7F3D0]">
            Welcome to
          </p>
          <h1
            style={{ color: '#ffffff' }}
            className="text-[22px] sm:text-[26px] font-extrabold !text-white leading-tight mt-1 drop-shadow-md"
          >
            LIBRARY MANAGEMENT SYSTEM
          </h1>
          <p className="text-[13.5px] text-[#D1FAE5]/90 mt-2 leading-relaxed max-w-[490px]">
            Manage books, student &amp; faculty records, borrowing circulation, returns,
            reservations, and library analytics in one unified workspace.
          </p>
        </div>
      </section>

      {/* Dashboard Title */}
      <div className="page-header-row">
        <div>
          <h2 className="page-title">Dashboard</h2>
          <p className="page-subtitle">
            Overview of library catalog, active circulation, and member statistics
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/books')}
            className="btn-secondary"
          >
            <BookOpen size={16} />
            <span>View Catalog</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/borrowing')}
            className="btn-primary"
          >
            <ArrowLeftRight size={16} />
            <span>Issue Book</span>
          </button>
        </div>
      </div>

      {/* 6 Stat Cards Grid (3x2 matching Figma) */}
      <div className="stat-grid-6">
        <StatCard
          icon={BookOpen}
          label="Total Books in Catalog"
          value={totalBookCopies}
          subtext={`${books.length} titles`}
          tone="green"
          onClick={() => navigate('/books')}
        />
        <StatCard
          icon={Users}
          label="Registered Students"
          value={students.length}
          subtext={`${students.filter((s) => s.status === 'Active').length} active`}
          tone="blue"
          onClick={() => navigate('/students')}
        />
        <StatCard
          icon={GraduationCap}
          label="Faculty Members"
          value={faculty.length}
          subtext={`${faculty.filter((f) => f.status === 'Active').length} active`}
          tone="green"
          onClick={() => navigate('/faculty')}
        />
        <StatCard
          icon={ArrowLeftRight}
          label="Currently Borrowed"
          value={activeBorrowed}
          tone="amber"
          onClick={() => navigate('/borrowing')}
        />
        <StatCard
          icon={AlertTriangle}
          label="Overdue Books"
          value={overdueCount}
          tone="red"
          onClick={() => navigate('/borrowing')}
        />
        <StatCard
          icon={CalendarClock}
          label="Pending Reservations"
          value={pendingReservations}
          tone="green"
          onClick={() => navigate('/reservations')}
        />
      </div>

      {/* Recent Borrowing Activity Table */}
      <section className="cmd-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div>
            <h2 className="text-[17px] font-bold text-[#111827]">
              Recent Borrowing Activity
            </h2>
            <p className="text-[12.5px] text-[#6B7280] mt-0.5">
              Latest book checkouts, due dates, and return statuses
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#F3F6F4] p-1 rounded-lg">
            {['All', 'Borrowed', 'Overdue', 'Returned'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActivityFilter(tab)}
                className={`px-3 py-1 rounded-md text-[12px] font-semibold transition-colors whitespace-nowrap ${
                  activityFilter === tab
                    ? 'bg-white text-[#111827] shadow-xs'
                    : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="table-scroll">
          <table className="cmd-table">
            <thead>
              <tr>
                <th>Borrow ID</th>
                <th>Book Title</th>
                <th>Borrower</th>
                <th>Role</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivity.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-[#6B7280]">
                    No borrowing activity matching this filter.
                  </td>
                </tr>
              ) : (
                filteredActivity.map((item) => (
                  <tr key={item.id}>
                    <td className="font-mono-data text-[12.5px] font-semibold text-[#374151]">
                      {item.id}
                    </td>
                    <td className="font-semibold text-[#111827] max-w-[230px] truncate">
                      {item.bookTitle}
                    </td>
                    <td>{item.borrowerName}</td>
                    <td className="text-[#4B5563]">{item.role}</td>
                    <td className="tabular-nums text-[#4B5563]">{item.borrowDate}</td>
                    <td className="tabular-nums text-[#4B5563]">{item.dueDate}</td>
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        {item.status !== 'Returned' && (
                          <button
                            type="button"
                            title="Quick Return"
                            onClick={() =>
                              processReturn({
                                borrowId: item.id,
                                returnDate: new Date().toISOString().slice(0, 10),
                                condition: 'Good',
                              })
                            }
                            className="p-1.5 rounded-md text-[#158F50] hover:bg-[#E7F6EE]"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        <button
                          type="button"
                          title="View in Borrowing"
                          onClick={() => navigate('/borrowing')}
                          className="p-1.5 rounded-md text-[#6B7280] hover:bg-[#F3F6F4] hover:text-[#111827]"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Reports & Analytics Grouped Bar Chart */}
      <AnalyticsChart books={books} borrowings={borrowings} returns={returns} />
    </div>
  );
}