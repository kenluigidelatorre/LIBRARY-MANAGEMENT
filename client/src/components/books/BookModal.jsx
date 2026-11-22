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
  });

  const [borrowedCopies, setBorrowedCopies] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      const totalCopies = Number(initialData.copies ?? 5);
      const availableCopies = Number(initialData.available ?? totalCopies);

      setForm({
        title: initialData.title || '',
        author: initialData.author || '',
        isbn: initialData.isbn || '',
        category:
          initialData.category ||
          categories[0]?.name ||
          'Computer Science',
        publisher: initialData.publisher || '',
        year: initialData.year || 2024,
        copies: totalCopies,
      });

      // Preserve the number of copies currently borrowed.
      setBorrowedCopies(
        Math.max(0, totalCopies - availableCopies)
      );
    } else {
      setForm({
        title: '',
        author: '',
        isbn: '',
        category: categories[0]?.name || 'Computer Science',
        publisher: '',
        year: 2024,
        copies: 5,
      });

      setBorrowedCopies(0);
    }

    setError('');
  }, [initialData, isOpen, categories]);

  const totalCopies = Number(form.copies);
  const availableCopies = totalCopies - borrowedCopies;

  const getStatus = () => {
    if (availableCopies <= 0) {
      return 'Unavailable';
    }

    if (availableCopies <= 2 && totalCopies > 2) {
      return 'Low Stock';
    }

    return 'Available';
  };

  const status = getStatus();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.author.trim() ||
      !form.isbn.trim()
    ) {
      setError('Title, Author, and ISBN are required.');
      return;
    }

    if (
      !Number.isInteger(totalCopies) ||
      totalCopies < 1
    ) {
      setError('Total copies must be at least 1.');
      return;
    }

    if (totalCopies < borrowedCopies) {
      setError(
        `You cannot set total copies below ${borrowedCopies} because those copies are currently borrowed.`
      );
      return;
    }

    onSubmit({
      ...form,
      title: form.title.trim(),
      author: form.author.trim(),
      isbn: form.isbn.trim(),
      publisher: form.publisher.trim() || 'Academic Press',
      year: Number(form.year) || 2024,
      copies: totalCopies,
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

        {/* BOOK TITLE */}
        <div>
          <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
            Book Title
          </label>

          <input
            type="text"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            placeholder="e.g. Introduction to Algorithms"
            className="w-full h-10 px-3.5 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] focus:outline-none focus:bg-white focus:border-[#158F50]"
          />
        </div>

        {/* AUTHOR AND ISBN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
              Author
            </label>

            <input
              type="text"
              value={form.author}
              onChange={(e) =>
                setForm({ ...form, author: e.target.value })
              }
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
              onChange={(e) =>
                setForm({ ...form, isbn: e.target.value })
              }
              placeholder="978-0-000-00000-0"
              className="w-full h-10 px-3.5 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] font-mono-data focus:outline-none focus:bg-white focus:border-[#158F50]"
            />
          </div>
        </div>

        {/* CATEGORY AND PUBLISHER */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
              Category
            </label>

            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
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
              onChange={(e) =>
                setForm({ ...form, publisher: e.target.value })
              }
              placeholder="Publisher"
              className="w-full h-10 px-3.5 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] focus:outline-none focus:bg-white focus:border-[#158F50]"
            />
          </div>
        </div>

        {/* PUBLICATION YEAR */}
        <div>
          <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
            Publication Year
          </label>

          <input
            type="number"
            min="1000"
            max="2100"
            value={form.year}
            onChange={(e) =>
              setForm({ ...form, year: e.target.value })
            }
            className="w-full h-10 px-3.5 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] focus:outline-none focus:bg-white focus:border-[#158F50]"
          />
        </div>

        {/* INVENTORY */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
              Total Copies
            </label>

            <input
              type="number"
              min={Math.max(1, borrowedCopies)}
              step="1"
              value={form.copies}
              onChange={(e) =>
                setForm({ ...form, copies: e.target.value })
              }
              className="w-full h-10 px-3 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] tabular-nums focus:outline-none focus:bg-white focus:border-[#158F50]"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
              Available
            </label>

            <input
              type="number"
              value={Math.max(0, availableCopies)}
              readOnly
              className="w-full h-10 px-3 rounded-lg border border-[#E1E7E3] bg-[#E9EFEB] text-[13.5px] tabular-nums text-[#6B7280] cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
              Status
            </label>

            <div
              className={`w-full h-10 px-2 rounded-lg border border-[#E1E7E3] flex items-center justify-center text-[12px] font-semibold ${
                status === 'Available'
                  ? 'bg-[#DCFCE7] text-[#15803D]'
                  : status === 'Low Stock'
                    ? 'bg-[#FEF3C7] text-[#B45309]'
                    : 'bg-[#FEE2E2] text-[#DC2626]'
              }`}
            >
              {status}
            </div>
          </div>
        </div>

        {/* BORROWED COPIES INFORMATION */}
        {initialData && borrowedCopies > 0 && (
          <p className="text-[12px] text-[#6B7280]">
            {borrowedCopies} {borrowedCopies === 1 ? 'copy is' : 'copies are'} currently borrowed. These copies are preserved when updating total stock.
          </p>
        )}

        {/* BUTTONS */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="btn-primary flex-1"
          >
            {initialData ? 'Save Changes' : 'Add Book'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}