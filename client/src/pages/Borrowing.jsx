import { useState, useMemo } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  ArrowLeftRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
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

export default function Borrowing() {
  const {
    borrowings,
    books,
    students,
    faculty,
    settings,
    addBorrowing,
    updateBorrowing,
    deleteBorrowing,
    processReturn,
  } = useLibrary();

  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState('');

  const today = new Date().toISOString().slice(0, 10);
  const defaultDue = new Date(
    Date.now() + Number(settings.studentLoanDays || 14) * 86400000
  )
    .toISOString()
    .slice(0, 10);

  const [form, setForm] = useState({
    bookId: '',
    role: 'Student',
    borrowerId: '',
    borrowDate: today,
    dueDate: defaultDue,
    status: 'Borrowed',
  });

  const openModal = (item = null) => {
    setEditing(item);
    setError('');
    if (item) {
      setForm({
        bookId: item.bookId || '',
        role: item.role || 'Student',
        borrowerId: item.borrowerId || '',
        borrowDate: item.borrowDate || today,
        dueDate: item.dueDate || defaultDue,
        status: item.status || 'Borrowed',
      });
    } else {
      const availBook = books.find((b) => b.available > 0) || books[0];
      const firstStudent = students[0];
      setForm({
        bookId: availBook?.id || '',
        role: 'Student',
        borrowerId: firstStudent?.id || '',
        borrowDate: today,
        dueDate: defaultDue,
        status: 'Borrowed',
      });
    }
    setModalOpen(true);
  };

  const handleRoleChange = (role) => {
    const list = role === 'Student' ? students : faculty;
    const days =
      role === 'Student'
        ? Number(settings.studentLoanDays || 14)
        : Number(settings.facultyLoanDays || 30);
    const nextDue = new Date(new Date(form.borrowDate).getTime() + days * 86400000)
      .toISOString()
      .slice(0, 10);

    setForm((prev) => ({
      ...prev,
      role,
      borrowerId: list[0]?.id || '',
      dueDate: nextDue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const book = books.find((b) => b.id === form.bookId);
    const list = form.role === 'Student' ? students : faculty;
    const borrower = list.find((u) => u.id === form.borrowerId);

    if (!book || !borrower) {
      setError('Please select both a valid book and borrower.');
      return;
    }
    if (!editing && book.available <= 0) {
      setError('This book currently has 0 available copies.');
      return;
    }
    if (form.dueDate < form.borrowDate) {
      setError('Due date cannot be earlier than borrow date.');
      return;
    }

    const payload = {
      bookId: book.id,
      bookTitle: book.title,
      borrowerId: borrower.id,
      borrowerName: borrower.name,
      role: form.role,
      borrowDate: form.borrowDate,
      dueDate: form.dueDate,
      status: form.status,
    };

    if (editing) {
      updateBorrowing(editing.id, payload);
    } else {
      addBorrowing(payload);
    }
    setModalOpen(false);
  };

  const preFiltered = useMemo(() => {
    return borrowings.filter((b) => {
      const matchStatus = statusFilter === 'All' || b.status === statusFilter;
      const matchRole = roleFilter === 'All' || b.role === roleFilter;
      return matchStatus && matchRole;
    });
  }, [borrowings, statusFilter, roleFilter]);

  const { search, setSearch, sortKey, setSortKey, filteredItems } = useTableFilter(
    preFiltered,
    ['id', 'bookTitle', 'borrowerName', 'role']
  );

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems,
    totalItems,
    pageSize,
  } = usePagination(filteredItems, 6);

  const activeBorrowers = form.role === 'Student' ? students : faculty;

  return (
    <div className="space-y-5">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Borrowing</h1>
          <p className="page-subtitle">Issue books and monitor active student and faculty loans</p>
        </div>
        <button type="button" onClick={() => openModal()} className="btn-primary">
          <Plus size={16} />
          <span>New Borrow</span>
        </button>
      </div>

      <div className="stat-grid-4">
        <StatCard
          icon={ArrowLeftRight}
          label="Total Loans"
          value={borrowings.length}
          tone="blue"
        />
        <StatCard
          icon={Clock}
          label="Active Borrowed"
          value={borrowings.filter((b) => b.status === 'Borrowed').length}
          tone="amber"
        />
        <StatCard
          icon={AlertTriangle}
          label="Overdue"
          value={borrowings.filter((b) => b.status === 'Overdue').length}
          tone="red"
        />
        <StatCard
          icon={CheckCircle2}
          label="Returned"
          value={borrowings.filter((b) => b.status === 'Returned').length}
          tone="green"
        />
      </div>

      <TableToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search book or borrower..."
        filters={[
          {
            label: 'Status filter',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: 'All', label: 'All Statuses' },
              { value: 'Borrowed', label: 'Borrowed' },
              { value: 'Overdue', label: 'Overdue' },
              { value: 'Returned', label: 'Returned' },
            ],
          },
          {
            label: 'Role filter',
            value: roleFilter,
            onChange: setRoleFilter,
            options: [
              { value: 'All', label: 'All Roles' },
              { value: 'Student', label: 'Student' },
              { value: 'Faculty', label: 'Faculty' },
            ],
          },
        ]}
        sortOptions={[
          { value: 'borrowDate', label: 'Borrow Date' },
          { value: 'dueDate', label: 'Due Date' },
          { value: 'bookTitle', label: 'Book Title' },
        ]}
        sortKey={sortKey}
        onSortChange={setSortKey}
      />

      <section className="cmd-card overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-[#111827]">Borrowing Records</h2>
          <span className="text-[12.5px] font-medium text-[#6B7280] tabular-nums">
            {filteredItems.length} records
          </span>
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
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-[#6B7280]">
                    No borrowing records match your current filter.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => (
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
                      <div className="inline-flex items-center justify-end gap-1">
                        {item.status !== 'Returned' && (
                          <button
                            type="button"
                            title="Mark Returned"
                            onClick={() =>
                              processReturn({
                                borrowId: item.id,
                                returnDate: today,
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
                          aria-label={`Edit ${item.id}`}
                          onClick={() => openModal(item)}
                          className="p-1.5 rounded-md text-[#1D4ED8] hover:bg-[#DBEAFE]"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${item.id}`}
                          onClick={() => setDeleting(item)}
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
        title={editing ? 'Edit Borrowing Record' : 'Issue Book Loan'}
        maxWidth="480px"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="px-3.5 py-2.5 rounded-lg bg-[#FEE2E2] text-[#DC2626] text-[13px] font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
              Select Book
            </label>
            <select
              value={form.bookId}
              onChange={(e) => setForm({ ...form, bookId: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] focus:outline-none focus:bg-white focus:border-[#158F50]"
            >
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} ({b.available} available)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
                Borrower Type
              </label>
              <select
                value={form.role}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] focus:outline-none focus:bg-white focus:border-[#158F50]"
              >
                <option value="Student">Student</option>
                <option value="Faculty">Faculty</option>
              </select>
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
                Borrower
              </label>
              <select
                value={form.borrowerId}
                onChange={(e) => setForm({ ...form, borrowerId: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] focus:outline-none focus:bg-white focus:border-[#158F50]"
              >
                {activeBorrowers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
                Borrow Date
              </label>
              <input
                type="date"
                value={form.borrowDate}
                onChange={(e) => setForm({ ...form, borrowDate: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] tabular-nums focus:outline-none focus:bg-white focus:border-[#158F50]"
              />
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] tabular-nums focus:outline-none focus:bg-white focus:border-[#158F50]"
              />
            </div>
          </div>

          {editing && (
            <div>
              <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] focus:outline-none focus:bg-white focus:border-[#158F50]"
              >
                <option value="Borrowed">Borrowed</option>
                <option value="Overdue">Overdue</option>
                <option value="Returned">Returned</option>
              </select>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1">
              {editing ? 'Save Changes' : 'Issue Book'}
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
        itemName={deleting ? `${deleting.bookTitle} (${deleting.borrowerName})` : ''}
        onConfirm={() => {
          if (deleting) deleteBorrowing(deleting.id);
        }}
      />
    </div>
  );
}
