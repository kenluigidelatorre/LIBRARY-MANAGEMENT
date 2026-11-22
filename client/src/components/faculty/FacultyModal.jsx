import { useState, useEffect } from 'react';
import Modal from '../common/Modal';

const DEPARTMENTS = [
  'Computer Science',
  'Mathematics',
  'Natural Sciences',
  'Business & Economics',
  'Humanities',
  'Engineering',
];
const STATUSES = ['Active', 'On Leave', 'Inactive'];

export default function FacultyModal({ isOpen, onClose, initialData, onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    department: 'Computer Science',
    status: 'Active',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        email: initialData.email || '',
        department: initialData.department || 'Computer Science',
        status: initialData.status || 'Active',
      });
    } else {
      setForm({
        name: '',
        email: '',
        department: 'Computer Science',
        status: 'Active',
      });
    }
    setError('');
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setError('Please enter both Full Name and Email Address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      department: form.department,
      status: form.status,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Faculty' : 'Add Faculty'}
      maxWidth="460px"
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
            Department
          </label>
          <select
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            className="w-full h-10 px-3.5 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] text-[#111827] focus:outline-none focus:bg-white focus:border-[#158F50]"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
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
            {initialData ? 'Save Changes' : 'Add Faculty'}
          </button>
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
