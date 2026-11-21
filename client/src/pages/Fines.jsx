import { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  CheckCircle,
  Ban,
  PhilippinePeso,
  AlertCircle,
  CheckCircle2,
  Receipt,
} from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { useTableFilter } from '../hooks/useTableFilter';
import { usePagination } from '../hooks/usePagination';
import StatCard from '../components/common/StatCard';
import TableToolbar from '../components/common/TableToolbar';
import StatusBadge from '../components/common/StatusBadge';
import Pagination from '../components/common/Pagination';
import Modal from '../components/common/Modal';
import DeleteConfirmModal from '../components/common/DeleteConfirmModal';

export default function Fines() {
  const { fines, students, faculty, books, addFine, updateFineStatus, deleteFine } =
    useLibrary();

  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState('');

  const allBorrowers = useMemo(
    () => [
      ...students.map((s) => ({ id: s.id, name: `${s.name} (Student)` })),
      ...faculty.map((f) => ({ id: f.id, name: `${f.name} (Faculty)` })),
    ],
    [students, faculty]
  );

  const [form, setForm] = useState({
    borrowerId: '',
    bookTitle: '',
    reason: 'Late Return',
    daysLate: 1,
    amount: 5.0,
  });

  const openModal = () => {
    setError('');
    setForm({
      borrowerId: allBorrowers[0]?.id || '',
      bookTitle: books[0]?.title || '',
      reason: 'Late Return',
      daysLate: 1,
      amount: 5.0,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const studentMatch = students.find((s) => s.id === form.borrowerId);
    const facultyMatch = faculty.find((f) => f.id === form.borrowerId);
    const member = studentMatch || facultyMatch;
    if (!member || Number(form.amount) <= 0) {
      setError('Please select a borrower and enter a positive fine amount.');
      return;
    }
    addFine({
      borrowerId: member.id,
      borrowerType: facultyMatch ? 'FACULTY' : 'STUDENT',
      borrowerName: member.name,
      bookTitle: form.bookTitle,
      reason: form.reason.trim() || 'Library Penalty',
      daysLate: Number(form.daysLate) || 0,
      amount: Number(form.amount),
      status: 'Unpaid',
      assessedDate: new Date().toISOString().slice(0, 10),
    });
    setModalOpen(false);
  };

  const totalAssessed = fines.reduce((s, f) => s + Number(f.amount || 0), 0);
  const totalPaid = fines
    .filter((f) => f.status === 'Paid')
    .reduce((s, f) => s + Number(f.amount || 0), 0);
  const totalUnpaid = fines
    .filter((f) => f.status === 'Unpaid')
    .reduce((s, f) => s + Number(f.amount || 0), 0);
  const totalWaived = fines
    .filter((f) => f.status === 'Waived')
    .reduce((s, f) => s + Number(f.amount || 0), 0);

  const preFiltered = useMemo(() => {
    return fines.filter((f) => statusFilter === 'All' || f.status === statusFilter);
  }, [fines, statusFilter]);

  const { search, setSearch, sortKey, setSortKey, filteredItems } = useTableFilter(
    preFiltered,
    ['id', 'borrowerName', 'bookTitle', 'reason']
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
          <h1 className="page-title">Fines</h1>
          <p className="page-subtitle">Track overdue charges, collections, and waived penalties</p>
        </div>
        <button type="button" onClick={openModal} className="btn-primary">
          <Plus size={16} />
          <span>Assess Fine</span>
        </button>
      </div>

      <div className="stat-grid-4">
        <StatCard
          icon={Receipt}
          label="Total Assessed"
          value={`₱${totalAssessed.toFixed(2)}`}
          tone="blue"
        />
        <StatCard
          icon={CheckCircle2}
          label="Collected"
          value={`₱${totalPaid.toFixed(2)}`}
          tone="green"
        />
        <StatCard
          icon={AlertCircle}
          label="Unpaid Balance"
          value={`₱${totalUnpaid.toFixed(2)}`}
          tone="red"
        />
        <StatCard
          icon={PhilippinePeso}
          label="Waived"
          value={`₱${totalWaived.toFixed(2)}`}
          tone="amber"
        />
      </div>

      <TableToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search fines by borrower or book..."
        filters={[
          {
            label: 'Status filter',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: 'All', label: 'All Statuses' },
              { value: 'Unpaid', label: 'Unpaid' },
              { value: 'Paid', label: 'Paid' },
              { value: 'Waived', label: 'Waived' },
            ],
          },
        ]}
        sortOptions={[
          { value: 'assessedDate', label: 'Assessed Date' },
          { value: 'borrowerName', label: 'Borrower' },
        ]}
        sortKey={sortKey}
        onSortChange={setSortKey}
      />

      <section className="cmd-card overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-[#111827]">Fine Ledger</h2>
          <span className="text-[12.5px] font-medium text-[#6B7280] tabular-nums">
            {filteredItems.length} entries
          </span>
        </div>

        <div className="table-scroll">
          <table className="cmd-table">
            <thead>
              <tr>
                <th>Fine ID</th>
                <th>Borrower</th>
                <th>Book Title</th>
                <th>Reason</th>
                <th className="text-right">Days Late</th>
                <th className="text-right">Amount</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-[#6B7280]">
                    No fine records match your filter.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((fine) => (
                  <tr key={fine.id}>
                    <td className="font-mono-data text-[12.5px] font-semibold text-[#374151]">
                      {fine.id}
                    </td>
                    <td className="font-semibold text-[#111827]">{fine.borrowerName}</td>
                    <td className="max-w-[200px] truncate">{fine.bookTitle}</td>
                    <td className="text-[#4B5563]">{fine.reason}</td>
                    <td className="text-right tabular-nums">{fine.daysLate}</td>
                    <td className="text-right tabular-nums font-bold">
                      ₱{Number(fine.amount).toFixed(2)}
                    </td>
                    <td>
                      <StatusBadge status={fine.status} />
                    </td>
                    <td className="text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        {fine.status === 'Unpaid' && (
                          <>
                            <button
                              type="button"
                              title="Mark as Paid"
                              onClick={() => updateFineStatus(fine.id, 'Paid')}
                              className="p-1.5 rounded-md text-[#158F50] hover:bg-[#E7F6EE]"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              type="button"
                              title="Waive Fine"
                              onClick={() => updateFineStatus(fine.id, 'Waived')}
                              className="p-1.5 rounded-md text-[#6B7280] hover:bg-[#F3F6F4]"
                            >
                              <Ban size={16} />
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          aria-label={`Delete ${fine.id}`}
                          onClick={() => setDeleting(fine)}
                          className="p-1.5 rounded-md text-[#DC2626] hover:bg-[#FEE2E2]"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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
        title="Assess Library Fine"
        maxWidth="450px"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="px-3.5 py-2.5 rounded-lg bg-[#FEE2E2] text-[#DC2626] text-[13px] font-medium">
              {error}
            </div>
          )}
          <div>
            <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
              Borrower
            </label>
            <select
              value={form.borrowerId}
              onChange={(e) => setForm({ ...form, borrowerId: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] focus:outline-none focus:bg-white focus:border-[#158F50]"
            >
              {allBorrowers.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
              Book Title
            </label>
            <select
              value={form.bookTitle}
              onChange={(e) => setForm({ ...form, bookTitle: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] focus:outline-none focus:bg-white focus:border-[#158F50]"
            >
              {books.map((b) => (
                <option key={b.id} value={b.title}>
                  {b.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
              Reason
            </label>
            <input
              type="text"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] focus:outline-none focus:bg-white focus:border-[#158F50]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
                Days Late
              </label>
              <input
                type="number"
                min="0"
                value={form.daysLate}
                onChange={(e) => setForm({ ...form, daysLate: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] tabular-nums focus:outline-none focus:bg-white focus:border-[#158F50]"
              />
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
                Amount (₱)
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] tabular-nums focus:outline-none focus:bg-white focus:border-[#158F50]"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1">
              Save Fine
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
        itemName={deleting ? `${deleting.borrowerName} (₱${deleting.amount})` : ''}
        onConfirm={() => {
          if (deleting) deleteFine(deleting.id);
        }}
      />
    </div>
  );
}