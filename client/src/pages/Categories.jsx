import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import Modal from '../components/common/Modal';
import DeleteConfirmModal from '../components/common/DeleteConfirmModal';

export default function Categories() {
  const { categories, books, addCategory, updateCategory, deleteCategory } = useLibrary();
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState({ name: '', code: '', description: '' });
  const [error, setError] = useState('');

  const openModal = (cat = null) => {
    setEditing(cat);
    setForm(
      cat
        ? { name: cat.name, code: cat.code, description: cat.description }
        : { name: '', code: '', description: '' }
    );
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.code.trim()) {
      setError('Category Name and Code are required.');
      return;
    }
    if (editing) {
      updateCategory(editing.id, {
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        description: form.description.trim(),
      });
    } else {
      addCategory({
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        description: form.description.trim(),
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="page-header-row">
        <div>
          <button
            type="button"
            onClick={() => navigate('/books')}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#158F50] hover:underline mb-1.5 bg-transparent border-0 p-0"
          >
            <ArrowLeft size={14} />
            <span>Back to Books</span>
          </button>
          <h1 className="page-title">Book Categories</h1>
          <p className="page-subtitle">Organize catalog subjects and shelf classifications</p>
        </div>
        <button type="button" onClick={() => openModal()} className="btn-primary">
          <Plus size={16} />
          <span>Add Category</span>
        </button>
      </div>

      <section className="cmd-card overflow-hidden">
        <div className="table-scroll">
          <table className="cmd-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Code</th>
                <th>Category Name</th>
                <th>Description</th>
                <th className="text-right">Books Count</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => {
                const count = books.filter((b) => b.category === cat.name).length;
                return (
                  <tr key={cat.id}>
                    <td className="font-mono-data text-[12.5px] font-semibold text-[#374151]">
                      {cat.id}
                    </td>
                    <td className="font-mono-data text-[12.5px] font-bold text-[#158F50]">
                      {cat.code}
                    </td>
                    <td className="font-semibold text-[#111827]">{cat.name}</td>
                    <td className="text-[#4B5563] max-w-[340px]">{cat.description}</td>
                    <td className="text-right tabular-nums font-semibold">{count}</td>
                    <td className="text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        <button
                          type="button"
                          aria-label={`Edit ${cat.name}`}
                          onClick={() => openModal(cat)}
                          className="p-1.5 rounded-md text-[#158F50] hover:bg-[#E7F6EE]"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${cat.name}`}
                          onClick={() => setDeleting(cat)}
                          className="p-1.5 rounded-md text-[#DC2626] hover:bg-[#FEE2E2]"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Category' : 'Add Category'}
        maxWidth="440px"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="px-3.5 py-2.5 rounded-lg bg-[#FEE2E2] text-[#DC2626] text-[13px] font-medium">
              {error}
            </div>
          )}
          <div>
            <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
              Category Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Computer Science"
              className="w-full h-10 px-3.5 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] focus:outline-none focus:bg-white focus:border-[#158F50]"
            />
          </div>
          <div>
            <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
              Classification Code
            </label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="e.g. CS"
              className="w-full h-10 px-3.5 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] font-mono-data uppercase focus:outline-none focus:bg-white focus:border-[#158F50]"
            />
          </div>
          <div>
            <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief subject scope..."
              className="w-full p-3 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] focus:outline-none focus:bg-white focus:border-[#158F50]"
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1">
              {editing ? 'Save Changes' : 'Create Category'}
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
        itemName={deleting?.name}
        onConfirm={() => {
          if (deleting) deleteCategory(deleting.id);
        }}
      />
    </div>
  );
}
