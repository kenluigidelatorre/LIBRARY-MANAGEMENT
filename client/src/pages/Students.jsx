import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { useTableFilter } from '../hooks/useTableFilter';
import { usePagination } from '../hooks/usePagination';
import TableToolbar from '../components/common/TableToolbar';
import StatusBadge from '../components/common/StatusBadge';
import Pagination from '../components/common/Pagination';
import StudentModal from '../components/students/StudentModal';
import DeleteConfirmModal from '../components/common/DeleteConfirmModal';

export default function Students() {
  const { students, addStudent, updateStudent, deleteStudent } = useLibrary();

  const [statusFilter, setStatusFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);

  const preFiltered = useMemo(() => {
    return students.filter((s) => {
      const matchStatus = statusFilter === 'All' || s.status === statusFilter;
      const matchYear = yearFilter === 'All' || s.year === yearFilter;
      return matchStatus && matchYear;
    });
  }, [students, statusFilter, yearFilter]);

  const { search, setSearch, sortKey, setSortKey, filteredItems } = useTableFilter(
    preFiltered,
    ['id', 'name', 'email', 'program']
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
          <h1 className="page-title">Library Students</h1>
          <p className="page-subtitle">Manage registered student borrowers</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingStudent(null);
            setModalOpen(true);
          }}
          className="btn-primary"
        >
          <Plus size={16} />
          <span>Add Student</span>
        </button>
      </div>

      <TableToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search students..."
        filters={[
          {
            label: 'Year filter',
            value: yearFilter,
            onChange: setYearFilter,
            options: [
              { value: 'All', label: 'All Years' },
              { value: '1st Year', label: '1st Year' },
              { value: '2nd Year', label: '2nd Year' },
              { value: '3rd Year', label: '3rd Year' },
              { value: '4th Year', label: '4th Year' },
            ],
          },
          {
            label: 'Status filter',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: 'All', label: 'All Statuses' },
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
            ],
          },
        ]}
        sortOptions={[
          { value: 'name', label: 'Name (A–Z)' },
          { value: 'id', label: 'Student ID' },
          { value: 'program', label: 'Program' },
        ]}
        sortKey={sortKey}
        onSortChange={setSortKey}
      />

      <section className="cmd-card overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-[#111827]">Students</h2>
          <span className="text-[12.5px] font-medium text-[#6B7280] tabular-nums">
            {filteredItems.length} total records
          </span>
        </div>

        <div className="table-scroll">
          <table className="cmd-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Program</th>
                <th>Year</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-[#6B7280]">
                    No student records match your current search or filter.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((student) => (
                  <tr key={student.id}>
                    <td className="font-mono-data text-[12.5px] font-semibold text-[#374151]">
                      {student.id}
                    </td>
                    <td className="font-semibold text-[#111827]">{student.name}</td>
                    <td className="text-[#4B5563]">{student.email}</td>
                    <td>{student.program}</td>
                    <td className="tabular-nums">{student.year}</td>
                    <td>
                      <StatusBadge status={student.status} />
                    </td>
                    <td className="text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        <button
                          type="button"
                          aria-label={`Edit ${student.name}`}
                          onClick={() => {
                            setEditingStudent(student);
                            setModalOpen(true);
                          }}
                          className="p-1.5 rounded-md text-[#158F50] hover:bg-[#E7F6EE] transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${student.name}`}
                          onClick={() => setDeletingStudent(student)}
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

      <StudentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editingStudent}
        onSubmit={(formData) => {
          if (editingStudent) {
            updateStudent(editingStudent.id, formData);
          } else {
            addStudent(formData);
          }
        }}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingStudent)}
        onClose={() => setDeletingStudent(null)}
        itemName={deletingStudent?.name}
        onConfirm={() => {
          if (deletingStudent) deleteStudent(deletingStudent.id);
        }}
      />
    </div>
  );
}
