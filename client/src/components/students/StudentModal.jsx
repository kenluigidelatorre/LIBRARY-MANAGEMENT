import { useState, useEffect } from 'react';
import Modal from '../common/Modal';

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const STATUSES = ['Active', 'Inactive'];

export default function StudentModal({ isOpen, onClose, initialData, onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    program: '',
    year: '1st Year',
    status: 'Active',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        email: initialData.email || '',
        program: initialData.program || '',
        year: initialData.year || '1st Year',
        status: initialData.status || 'Active',
      });
    } else {
      setForm({
        name: '',
        email: '',
        program: '',
        year: '1st Year',
        status: 'Active',
      });
    }
    setError('');
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.program.trim()) {
      setError('Please complete Full Name, Email Address, and Program.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      program: form.program.trim(),
      year: form.year,
      status: form.status,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Student' : 'Add Student'}
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
            Full Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Full Name"
            className="w-full h-10 px-3.5 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] text-[#111827] focus:outline-none focus:bg-white focus:border-[#158F50]"
          />
        </div>

        <div>
          <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email Address"
            className="w-full h-10 px-3.5 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] text-[#111827] focus:outline-none focus:bg-white focus:border-[#158F50]"
          />
        </div>

        <div>
          <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
            Program
          </label>
          <input
            type="text"
            value={form.program}
            onChange={(e) => setForm({ ...form, program: e.target.value })}
            placeholder="e.g. BS Computer Science"
            className="w-full h-10 px-3.5 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] text-[#111827] focus:outline-none focus:bg-white focus:border-[#158F50]"
          />
        </div>

        <div>
          <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
            Year
          </label>
          <select
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            className="w-full h-10 px-3.5 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] text-[#111827] focus:outline-none focus:bg-white focus:border-[#158F50]"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
            Status
          </label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full h-10 px-3.5 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] text-[#111827] focus:outline-none focus:bg-white focus:border-[#158F50]"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="btn-primary flex-1">
            {initialData ? 'Save Changes' : 'Add Student'}
          </button>
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
