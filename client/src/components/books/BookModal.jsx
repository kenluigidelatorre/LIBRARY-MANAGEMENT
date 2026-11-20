import { useState, useEffect } from 'react';
import Modal from '../common/Modal';

export default function BookModal({
  isOpen,
  onClose,
  initialData,
  categories = [],
  onSubmit,
}) {
  const [form, setForm] = useState({
    title: '',
    author: '',
    isbn: '',
    category: categories[0]?.name || 'Computer Science',
    publisher: '',
    year: 2024,
    copies: 5,
    available: 5,
    status: 'Available',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        author: initialData.author || '',
        isbn: initialData.isbn || '',
        category: initialData.category || categories[0]?.name || 'Computer Science',
        publisher: initialData.publisher || '',
        year: initialData.year || 2024,
        copies: initialData.copies ?? 5,
        available: initialData.available ?? 5,
        status: initialData.status || 'Available',
      });
    } else {
      setForm({
        title: '',
        author: '',
        isbn: '',
        category: categories[0]?.name || 'Computer Science',
        publisher: '',
        year: 2024,
        copies: 5,
        available: 5,
        status: 'Available',
      });
    }
    setError('');
  }, [initialData, isOpen, categories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim() || !form.isbn.trim()) {
      setError('Title, Author, and ISBN are required.');
      return;
    }
    const copies = Number(form.copies);
    const available = Number(form.available);
    if (copies < 1 || available < 0 || available > copies) {
      setError('Available copies must be between 0 and total copies.');
      return;
    }
    onSubmit({
      ...form,
      title: form.title.trim(),
      author: form.author.trim(),
      isbn: form.isbn.trim(),
      publisher: form.publisher.trim() || 'Academic Press',
      year: Number(form.year) || 2024,
      copies,
      available,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Book' : 'Add New Book'}
      maxWidth="520px"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="px-3.5 py-2.5 rounded-lg bg-[#FEE2E2] text-[#DC2626] text-[13px] font-medium">
            {error}
          </div>
        )}

        <div>
          <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
            Book Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Introduction to Algorithms"
            className="w-full h-10 px-3.5 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] focus:outline-none focus:bg-white focus:border-[#158F50]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
              Author
            </label>
            <input
              type="text"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              placeholder="Author name"
              className="w-full h-10 px-3.5 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] focus:outline-none focus:bg-white focus:border-[#158F50]"
            />
          </div>
          <div>
            <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
              ISBN
            </label>
            <input
              type="text"
              value={form.isbn}
              onChange={(e) => setForm({ ...form, isbn: e.target.value })}
              placeholder="978-0-000-00000-0"
              className="w-full h-10 px-3.5 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] font-mono-data focus:outline-none focus:bg-white focus:border-[#158F50]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full h-10 px-3.5 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] focus:outline-none focus:bg-white focus:border-[#158F50]"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
              Publisher
            </label>
            <input
              type="text"
              value={form.publisher}
              onChange={(e) => setForm({ ...form, publisher: e.target.value })}
              placeholder="Publisher"
              className="w-full h-10 px-3.5 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] focus:outline-none focus:bg-white focus:border-[#158F50]"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
              Total Copies
            </label>
            <input
              type="number"
              min="1"
              value={form.copies}
              onChange={(e) => setForm({ ...form, copies: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] tabular-nums focus:outline-none focus:bg-white focus:border-[#158F50]"
            />
          </div>
          <div>
            <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
              Available
            </label>
            <input
              type="number"
              min="0"
              value={form.available}
              onChange={(e) => setForm({ ...form, available: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] tabular-nums focus:outline-none focus:bg-white focus:border-[#158F50]"
            />
          </div>
          <div>
            <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full h-10 px-2.5 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13px] focus:outline-none focus:bg-white focus:border-[#158F50]"
            >
              <option value="Available">Available</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="btn-primary flex-1">
            {initialData ? 'Save Changes' : 'Add Book'}
          </button>
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
