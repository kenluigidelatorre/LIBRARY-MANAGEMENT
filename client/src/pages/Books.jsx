import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, FolderKanban } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { useTableFilter } from '../hooks/useTableFilter';
import { usePagination } from '../hooks/usePagination';
import TableToolbar from '../components/common/TableToolbar';
import StatusBadge from '../components/common/StatusBadge';
import Pagination from '../components/common/Pagination';
import BookModal from '../components/books/BookModal';
import DeleteConfirmModal from '../components/common/DeleteConfirmModal';

export default function Books() {
  const { books, categories, addBook, updateBook, deleteBook } = useLibrary();
  const navigate = useNavigate();

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [deletingBook, setDeletingBook] = useState(null);

  const preFiltered = useMemo(() => {
    return books.filter((b) => {
      const matchCat = categoryFilter === 'All' || b.category === categoryFilter;
      const matchStatus = statusFilter === 'All' || b.status === statusFilter;
      return matchCat && matchStatus;
    });
  }, [books, categoryFilter, statusFilter]);

  const { search, setSearch, sortKey, setSortKey, filteredItems } = useTableFilter(
    preFiltered,
    ['id', 'title', 'author', 'isbn', 'category']
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
          <h1 className="page-title">Books</h1>
          <p className="page-subtitle">Manage book catalog, ISBN records, and shelf availability</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/categories')}
            className="btn-secondary"
          >
            <FolderKanban size={16} />
            <span>Categories</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingBook(null);
              setModalOpen(true);
            }}
            className="btn-primary"
          >
            <Plus size={16} />
            <span>Add Book</span>
          </button>
        </div>
      </div>

      <TableToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search title, author, ISBN..."
        filters={[
          {
            label: 'Category filter',
            value: categoryFilter,
            onChange: setCategoryFilter,
            options: [
              { value: 'All', label: 'All Categories' },
              ...categories.map((c) => ({ value: c.name, label: c.name })),
            ],
          },
          {
            label: 'Status filter',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: 'All', label: 'All Statuses' },
              { value: 'Available', label: 'Available' },
              { value: 'Low Stock', label: 'Low Stock' },
              { value: 'Unavailable', label: 'Unavailable' },
            ],
          },
        ]}
        sortOptions={[
          { value: 'title', label: 'Title (A–Z)' },
          { value: 'author', label: 'Author' },
          { value: 'category', label: 'Category' },
        ]}
        sortKey={sortKey}
        onSortChange={setSortKey}
      />

      <section className="cmd-card overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-[#111827]">Book Catalog</h2>
          <span className="text-[12.5px] font-medium text-[#6B7280] tabular-nums">
            {filteredItems.length} titles
          </span>
        </div>

        <div className="table-scroll">
          <table className="cmd-table">
            <thead>
              <tr>
                <th>Book ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>ISBN</th>
                <th className="text-right">Copies</th>
                <th className="text-right">Available</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-[#6B7280]">
                    No books match your search or filters.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((book) => (
                  <tr key={book.id}>
                    <td className="font-mono-data text-[12.5px] font-semibold text-[#374151]">
                      {book.id}
                    </td>
                    <td className="font-semibold text-[#111827] max-w-[230px] truncate">
                      {book.title}
                    </td>
                    <td>{book.author}</td>
                    <td className="text-[#4B5563]">{book.category}</td>
                    <td className="font-mono-data text-[12px] text-[#4B5563]">{book.isbn}</td>
                    <td className="text-right tabular-nums">{book.copies}</td>
                    <td className="text-right tabular-nums font-semibold">{book.available}</td>
                    <td>
                      <StatusBadge status={book.status} />
                    </td>
                    <td className="text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        <button
                          type="button"
                          aria-label={`Edit ${book.title}`}
                          onClick={() => {
                            setEditingBook(book);
                            setModalOpen(true);
                          }}
                          className="p-1.5 rounded-md text-[#158F50] hover:bg-[#E7F6EE]"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${book.title}`}
                          onClick={() => setDeletingBook(book)}
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

      <BookModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editingBook}
        categories={categories}
        onSubmit={(formData) => {
          if (editingBook) {
            updateBook(editingBook.id, formData);
          } else {
            addBook(formData);
          }
        }}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingBook)}
        onClose={() => setDeletingBook(null)}
        itemName={deletingBook?.title}
        onConfirm={() => {
          if (deletingBook) deleteBook(deletingBook.id);
        }}
      />
    </div>
  );
}
