import { useState, useMemo } from 'react';
import { Plus, Trash2, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { useTableFilter } from '../hooks/useTableFilter';
import { usePagination } from '../hooks/usePagination';
import StatCard from '../components/common/StatCard';
import TableToolbar from '../components/common/TableToolbar';
import StatusBadge from '../components/common/StatusBadge';
import Pagination from '../components/common/Pagination';
import Modal from '../components/common/Modal';
import DeleteConfirmModal from '../components/common/DeleteConfirmModal';

export default function Returns() {
  const { returns, borrowings, settings, processReturn, deleteReturn } = useLibrary();

  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const activeLoans = useMemo(
    () => borrowings.filter((b) => b.status !== 'Returned'),
    [borrowings]
  );

  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    borrowId: '',
    returnDate: today,
    condition: 'Good',
  });

  const openModal = () => {
    setForm({
      borrowId: activeLoans[0]?.id || '',
      returnDate: today,
      condition: 'Good',
    });
    setModalOpen(true);
  };

  const selectedLoan = activeLoans.find((b) => b.id === form.borrowId);
  const estimatedFine = useMemo(() => {
    if (!selectedLoan) return 0;
    const diffMs =
      new Date(form.returnDate).getTime() - new Date(selectedLoan.dueDate).getTime();
    const daysLate = Math.max(0, Math.ceil(diffMs / 86400000));
    const rate = Number(settings.dailyFineRate || 1);
    const damage = form.condition === 'Damaged' ? 10 : form.condition === 'Lost' ? 35 : 0;
    return daysLate * rate + damage;
  }, [selectedLoan, form.returnDate, form.condition, settings.dailyFineRate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.borrowId) return;
    processReturn(form);
    setModalOpen(false);
  };

  const preFiltered = useMemo(() => {
    return returns.filter((r) => statusFilter === 'All' || r.status === statusFilter);
  }, [returns, statusFilter]);

  const { search, setSearch, sortKey, setSortKey, filteredItems } = useTableFilter(
    preFiltered,
    ['id', 'borrowId', 'bookTitle', 'borrowerName']
  );

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems,
    totalItems,
    pageSize,
  } = usePagination(filteredItems, 6);

  return (
    <div className="space-y-5">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Returns</h1>
          <p className="page-subtitle">Process returned books, inspect condition, and track timeliness</p>
        </div>
        <button
          type="button"
          onClick={openModal}
          disabled={activeLoans.length === 0}
          className="btn-primary disabled:opacity-50"
        >
          <Plus size={16} />
          <span>Process Return</span>
        </button>
      </div>

      {/* 3 Stat Cards matching Figma Image 3 col 3 */}
      <div className="stat-grid-3">
        <StatCard
          icon={RotateCcw}
          label="Total Returns Processed"
          value={returns.length}
          tone="blue"
        />
        <StatCard
          icon={CheckCircle2}
          label="On-Time Returns"
          value={returns.filter((r) => r.status === 'On Time').length}
          tone="green"
        />
        <StatCard
          icon={AlertCircle}
          label="Late Returns"
          value={returns.filter((r) => r.status === 'Late').length}
          tone="red"
        />
      </div>

      <TableToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search returns..."
        filters={[
          {
            label: 'Status filter',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: 'All', label: 'All Returns' },
              { value: 'On Time', label: 'On Time' },
              { value: 'Late', label: 'Late' },
            ],
          },
        ]}
        sortOptions={[
          { value: 'returnDate', label: 'Return Date' },
          { value: 'bookTitle', label: 'Book Title' },
        ]}
        sortKey={sortKey}
        onSortChange={setSortKey}
      />

      <section className="cmd-card overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-[#111827]">Return Logs</h2>
          <span className="text-[12.5px] font-medium text-[#6B7280] tabular-nums">
            {filteredItems.length} records
          </span>
        </div>

        <div className="table-scroll">
          <table className="cmd-table">
            <thead>
              <tr>
                <th>Return ID</th>
                <th>Book Title</th>
                <th>Borrower</th>
                <th>Borrow Date</th>
                <th>Return Date</th>
                <th>Condition</th>
                <th>Status</th>
                <th className="text-right">Fine</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-[#6B7280]">
                    No return records found.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((ret) => (
                  <tr key={ret.id}>
                    <td className="font-mono-data text-[12.5px] font-semibold text-[#374151]">
                      {ret.id}
                    </td>
                    <td className="font-semibold text-[#111827] max-w-[220px] truncate">
                      {ret.bookTitle}
                    </td>
                    <td>{ret.borrowerName}</td>
                    <td className="tabular-nums text-[#4B5563]">{ret.borrowDate}</td>
                    <td className="tabular-nums text-[#4B5563]">{ret.returnDate}</td>
                    <td>{ret.condition}</td>
                    <td>
                      <StatusBadge status={ret.status} />
                    </td>
                    <td className="text-right tabular-nums font-semibold">
                      ${Number(ret.fineAmount || 0).toFixed(2)}
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        aria-label={`Delete ${ret.id}`}
                        onClick={() => setDeleting(ret)}
                        className="p-1.5 rounded-md text-[#DC2626] hover:bg-[#FEE2E2]"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </section>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Process Book Return"
        maxWidth="460px"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
              Active Borrowing Record
            </label>
            <select
              value={form.borrowId}
              onChange={(e) => setForm({ ...form, borrowId: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] focus:outline-none focus:bg-white focus:border-[#158F50]"
            >
              {activeLoans.map((loan) => (
                <option key={loan.id} value={loan.id}>
                  {loan.id} · {loan.bookTitle} ({loan.borrowerName})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
                Return Date
              </label>
              <input
                type="date"
                value={form.returnDate}
                onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] tabular-nums focus:outline-none focus:bg-white focus:border-[#158F50]"
              />
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
                Book Condition
              </label>
              <select
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] focus:outline-none focus:bg-white focus:border-[#158F50]"
              >
                <option value="Good">Good</option>
                <option value="Minor Wear">Minor Wear</option>
                <option value="Damaged">Damaged ($10 fee)</option>
                <option value="Lost">Lost ($35 fee)</option>
              </select>
            </div>
          </div>

          {selectedLoan && (
            <div className="rounded-lg border border-[#E1E7E3] bg-[#F8FAF9] p-3.5 text-[13px] space-y-1">
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Original Due Date</span>
                <span className="font-semibold tabular-nums">{selectedLoan.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Estimated Late / Condition Fine</span>
                <span className="font-bold text-[#111827] tabular-nums">
                  ${estimatedFine.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1">
              Confirm Return
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <DeleteConfirmModal
        isOpen={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        itemName={deleting?.bookTitle}
        onConfirm={() => {
          if (deleting) deleteReturn(deleting.id);
        }}
      />
    </div>
  );
}
