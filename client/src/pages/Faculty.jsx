import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { useTableFilter } from '../hooks/useTableFilter';
import { usePagination } from '../hooks/usePagination';
import TableToolbar from '../components/common/TableToolbar';
import StatusBadge from '../components/common/StatusBadge';
import Pagination from '../components/common/Pagination';
import FacultyModal from '../components/faculty/FacultyModal';
import DeleteConfirmModal from '../components/common/DeleteConfirmModal';

export default function Faculty() {
  const { faculty, addFaculty, updateFaculty, deleteFaculty } = useLibrary();

  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [deletingFaculty, setDeletingFaculty] = useState(null);

  const departments = useMemo(() => {
    const unique = Array.from(new Set(faculty.map((f) => f.department)));
    return unique;
  }, [faculty]);

  const preFiltered = useMemo(() => {
    return faculty.filter((f) => {
      const matchDept = deptFilter === 'All' || f.department === deptFilter;
      const matchStatus = statusFilter === 'All' || f.status === statusFilter;
      return matchDept && matchStatus;
    });
  }, [faculty, deptFilter, statusFilter]);

  const { search, setSearch, sortKey, setSortKey, filteredItems } = useTableFilter(
    preFiltered,
    ['id', 'name', 'email', 'department']
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
          <h1 className="page-title">Faculty</h1>
          <p className="page-subtitle">Manage faculty members and academic departments</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingFaculty(null);
            setModalOpen(true);
          }}
          className="btn-primary"
        >
          <Plus size={16} />
          <span>Add Faculty</span>
        </button>
      </div>

      <TableToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search faculty..."
        filters={[
          {
            label: 'Department filter',
            value: deptFilter,
            onChange: setDeptFilter,
            options: [
              { value: 'All', label: 'All Departments' },
              ...departments.map((d) => ({ value: d, label: d })),
            ],
          },
          {
            label: 'Status filter',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: 'All', label: 'All Statuses' },
              { value: 'Active', label: 'Active' },
              { value: 'On Leave', label: 'On Leave' },
              { value: 'Inactive', label: 'Inactive' },
            ],
          },
        ]}
        sortOptions={[
          { value: 'name', label: 'Name (A–Z)' },
          { value: 'id', label: 'Faculty ID' },
          { value: 'department', label: 'Department' },
        ]}
        sortKey={sortKey}
        onSortChange={setSortKey}
      />

      <section className="cmd-card overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-[#111827]">Faculties</h2>
          <span className="text-[12.5px] font-medium text-[#6B7280] tabular-nums">
            {filteredItems.length} total records
          </span>
        </div>

        <div className="table-scroll">
          <table className="cmd-table">
            <thead>
              <tr>
                <th>Faculty ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-[#6B7280]">
                    No faculty records match your search or filter.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => (
                  <tr key={item.id}>
                    <td className="font-mono-data text-[12.5px] font-semibold text-[#374151]">
                      {item.id}
                    </td>
                    <td className="font-semibold text-[#111827]">{item.name}</td>
                    <td className="text-[#4B5563]">{item.email}</td>
                    <td>{item.department}</td>
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        <button
                          type="button"
                          aria-label={`Edit ${item.name}`}
                          onClick={() => {
                            setEditingFaculty(item);
                            setModalOpen(true);
                          }}
                          className="p-1.5 rounded-md text-[#158F50] hover:bg-[#E7F6EE] transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${item.name}`}
                          onClick={() => setDeletingFaculty(item)}
                          className="p-1.5 rounded-md text-[#DC2626] hover:bg-[#FEE2E2] transition-colors"
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

      <FacultyModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editingFaculty}
        onSubmit={(formData) => {
          if (editingFaculty) {
            updateFaculty(editingFaculty.id, formData);
          } else {
            addFaculty(formData);
          }
        }}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingFaculty)}
        onClose={() => setDeletingFaculty(null)}
        itemName={deletingFaculty?.name}
        onConfirm={() => {
          if (deletingFaculty) deleteFaculty(deletingFaculty.id);
        }}
      />
    </div>
  );
}
