import { useState, useMemo } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  CalendarClock,
  Clock,
  CheckCircle2,
  XCircle,
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

export default function Reservations() {
  const {
    reservations,
    books,
    students,
    faculty,
    addReservation,
    updateReservation,
    deleteReservation,
  } = useLibrary();

  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const today = new Date().toISOString().slice(0, 10);
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

  const [form, setForm] = useState({
    bookId: '',
    role: 'Student',
    borrowerId: '',
    reservedDate: today,
    expiryDate: nextWeek,
    status: 'Pending',
  });

  const openModal = (item = null) => {
    setEditing(item);
    if (item) {
      setForm({
        bookId: item.bookId || books[0]?.id || '',
        role: item.role || 'Student',
        borrowerId: item.borrowerId || '',
        reservedDate: item.reservedDate || today,
        expiryDate: item.expiryDate || nextWeek,
        status: item.status || 'Pending',
      });
    } else {
      setForm({
        bookId: books[0]?.id || '',
        role: 'Student',
        borrowerId: students[0]?.id || '',
        reservedDate: today,
        expiryDate: nextWeek,
        status: 'Pending',
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const book = books.find((b) => b.id === form.bookId);
    const list = form.role === 'Student' ? students : faculty;
    const borrower = list.find((u) => u.id === form.borrowerId);
    if (!book || !borrower) return;

    const payload = {
      bookId: book.id,
      bookTitle: book.title,
      borrowerId: borrower.id,
      borrowerName: borrower.name,
      role: form.role,
      reservedDate: form.reservedDate,
      expiryDate: form.expiryDate,
      status: form.status,
    };

    if (editing) {
      updateReservation(editing.id, payload);
    } else {
      addReservation(payload);
    }
    setModalOpen(false);
  };

  const preFiltered = useMemo(() => {
    return reservations.filter((r) => statusFilter === 'All' || r.status === statusFilter);
  }, [reservations, statusFilter]);

  const { search, setSearch, sortKey, setSortKey, filteredItems } = useTableFilter(
    preFiltered,
    ['id', 'bookTitle', 'borrowerName']
  );

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems,
    totalItems,
    pageSize,
  } = usePagination(filteredItems, 6);

  const borrowerList = form.role === 'Student' ? students : faculty;

  return (
    <div className="space-y-5">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Reservations</h1>
          <p className="page-subtitle">Manage book hold requests and pickup expirations</p>
        </div>
        <button type="button" onClick={() => openModal()} className="btn-primary">
          <Plus size={16} />
          <span>New Reservation</span>
        </button>
      </div>

      <div className="stat-grid-4">
        <StatCard
          icon={CalendarClock}
          label="Total Reservations"
          value={reservations.length}
          tone="blue"
        />
        <StatCard
          icon={Clock}
          label="Pending Approval"
          value={reservations.filter((r) => r.status === 'Pending').length}
          tone="amber"
        />
        <StatCard
          icon={CheckCircle2}
          label="Approved / Ready"
          value={reservations.filter((r) => r.status === 'Approved').length}
          tone="green"
        />
        <StatCard
          icon={XCircle}
          label="Cancelled"
          value={reservations.filter((r) => r.status === 'Cancelled').length}
          tone="slate"
        />
      </div>

      <TableToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search reservations..."
        filters={[
          {
            label: 'Status filter',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: 'All', label: 'All Statuses' },
              { value: 'Pending', label: 'Pending' },
              { value: 'Approved', label: 'Approved' },
              { value: 'Completed', label: 'Completed' },
              { value: 'Cancelled', label: 'Cancelled' },
            ],
          },
        ]}
        sortOptions={[
          { value: 'reservedDate', label: 'Reserved Date' },
          { value: 'expiryDate', label: 'Pickup Expiry' },
          { value: 'bookTitle', label: 'Book Title' },
        ]}
        sortKey={sortKey}
        onSortChange={setSortKey}
      />

      <section className="cmd-card overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-[#111827]">Reservation Queue</h2>
          <span className="text-[12.5px] font-medium text-[#6B7280] tabular-nums">
            {filteredItems.length} records
          </span>
        </div>

        <div className="table-scroll">
          <table className="cmd-table">
            <thead>
              <tr>
                <th>Reservation ID</th>
                <th>Book Title</th>
                <th>Reserved By</th>
                <th>Role</th>
                <th>Reserved Date</th>
                <th>Pickup Expiry</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-[#6B7280]">
                    No reservation records match your filter.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((res) => (
                  <tr key={res.id}>
                    <td className="font-mono-data text-[12.5px] font-semibold text-[#374151]">
                      {res.id}
                    </td>
                    <td className="font-semibold text-[#111827] max-w-[220px] truncate">
                      {res.bookTitle}
                    </td>
                    <td>{res.borrowerName}</td>
                    <td className="text-[#4B5563]">{res.role}</td>
                    <td className="tabular-nums text-[#4B5563]">{res.reservedDate}</td>
                    <td className="tabular-nums text-[#4B5563]">{res.expiryDate}</td>
                    <td>
                      <StatusBadge status={res.status} />
                    </td>
                    <td className="text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        {res.status === 'Pending' && (
                          <button
                            type="button"
                            title="Approve Reservation"
                            onClick={() => updateReservation(res.id, { status: 'Approved' })}
                            className="p-1.5 rounded-md text-[#158F50] hover:bg-[#E7F6EE]"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        <button
                          type="button"
                          aria-label={`Edit ${res.id}`}
                          onClick={() => openModal(res)}
                          className="p-1.5 rounded-md text-[#1D4ED8] hover:bg-[#DBEAFE]"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${res.id}`}
                          onClick={() => setDeleting(res)}
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
        title={editing ? 'Edit Reservation' : 'New Book Reservation'}
        maxWidth="460px"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
              Book
            </label>
            <select
              value={form.bookId}
              onChange={(e) => setForm({ ...form, bookId: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] focus:outline-none focus:bg-white focus:border-[#158F50]"
            >
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
                Member Type
              </label>
              <select
                value={form.role}
                onChange={(e) => {
                  const role = e.target.value;
                  const list = role === 'Student' ? students : faculty;
                  setForm({ ...form, role, borrowerId: list[0]?.id || '' });
                }}
                className="w-full h-10 px-3 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] focus:outline-none focus:bg-white focus:border-[#158F50]"
              >
                <option value="Student">Student</option>
                <option value="Faculty">Faculty</option>
              </select>
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
                Member
              </label>
              <select
                value={form.borrowerId}
                onChange={(e) => setForm({ ...form, borrowerId: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] focus:outline-none focus:bg-white focus:border-[#158F50]"
              >
                {borrowerList.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
                Reserved Date
              </label>
              <input
                type="date"
                value={form.reservedDate}
                onChange={(e) => setForm({ ...form, reservedDate: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] tabular-nums focus:outline-none focus:bg-white focus:border-[#158F50]"
              />
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
                Pickup Expiry
              </label>
              <input
                type="date"
                value={form.expiryDate}
                onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] tabular-nums focus:outline-none focus:bg-white focus:border-[#158F50]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] focus:outline-none focus:bg-white focus:border-[#158F50]"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1">
              {editing ? 'Save Changes' : 'Create Reservation'}
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
          if (deleting) deleteReservation(deleting.id);
        }}
      />
    </div>
  );
}
