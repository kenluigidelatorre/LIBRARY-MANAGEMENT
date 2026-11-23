
import { useCallback, useEffect, useState } from 'react';
import { UserPlus, Users, RefreshCw } from 'lucide-react';
import api from '../services/api';

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const loadStaff = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/auth/staff');
     setStaff(response.data.data || []);
    } catch (err) {
      setError(err.message || 'Unable to load staff accounts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    const fullName = form.fullName.trim();
    const email = form.email.trim();

    if (!fullName || !email || !form.password) {
      setError('Please complete all required fields.');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post('/auth/staff', {
        fullName,
        email,
        password: form.password,
      });

      setSuccess(
        response.data.message || 'Staff account created successfully.'
      );

      setForm({
        fullName: '',
        email: '',
        password: '',
      });

      await loadStaff();
    } catch (err) {
      setError(err.message || 'Unable to create staff account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Staff Management</h1>
          <p className="page-subtitle">
            Manage Library Staff accounts and access.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CREATE STAFF FORM */}
        <form
          onSubmit={handleSubmit}
          className="cmd-card p-6 space-y-5 h-fit"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#E8F5ED] text-[#158F50] flex items-center justify-center">
              <UserPlus size={20} />
            </div>

            <div>
              <h2 className="text-[17px] font-bold text-[#111827]">
                Create Staff Account
              </h2>
              <p className="text-[12.5px] text-[#6B7280]">
                Add a new member to the library team.
              </p>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-[13px] text-red-700"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="rounded-lg border border-green-200 bg-green-50 p-3 text-[13px] text-green-700"
            >
              {success}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="staff-full-name"
                className="block text-[12.5px] font-semibold text-[#374151] mb-1.5"
              >
                Full Name
              </label>

              <input
                id="staff-full-name"
                name="fullName"
                type="text"
                required
                maxLength={150}
                value={form.fullName}
                onChange={handleInputChange}
                placeholder="Enter full name"
                className="w-full h-10 px-3.5 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] focus:outline-none focus:bg-white focus:border-[#158F50]"
              />
            </div>

            <div>
              <label
                htmlFor="staff-email"
                className="block text-[12.5px] font-semibold text-[#374151] mb-1.5"
              >
                Email Address
              </label>

              <input
                id="staff-email"
                name="email"
                type="email"
                required
                maxLength={255}
                value={form.email}
                onChange={handleInputChange}
                placeholder="staff@example.com"
                className="w-full h-10 px-3.5 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] focus:outline-none focus:bg-white focus:border-[#158F50]"
              />
            </div>

            <div>
              <label
                htmlFor="staff-password"
                className="block text-[12.5px] font-semibold text-[#374151] mb-1.5"
              >
                Temporary Password
              </label>

              <input
                id="staff-password"
                name="password"
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={handleInputChange}
                placeholder="At least 8 characters"
                className="w-full h-10 px-3.5 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] focus:outline-none focus:bg-white focus:border-[#158F50]"
              />

              <p className="text-[11.5px] text-[#6B7280] mt-1.5">
                The account will automatically receive the Library Staff role.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <UserPlus size={15} />
            <span>
              {submitting ? 'Creating Account...' : 'Create Staff Account'}
            </span>
          </button>
        </form>

        {/* STAFF ACCOUNT LIST */}
        <div className="cmd-card p-6 space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#E8F5ED] text-[#158F50] flex items-center justify-center">
                <Users size={20} />
              </div>

              <div>
                <h2 className="text-[17px] font-bold text-[#111827]">
                  Library Staff
                </h2>
                <p className="text-[12.5px] text-[#6B7280]">
                  {staff.length} registered account(s)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={loadStaff}
              disabled={loading}
              aria-label="Refresh staff list"
              className="btn-secondary"
            >
              <RefreshCw size={15} />
              <span>Refresh</span>
            </button>
          </div>

          {loading ? (
            <p className="text-[13px] text-[#6B7280] py-6 text-center">
              Loading staff accounts...
            </p>
          ) : staff.length === 0 ? (
            <div className="py-8 text-center">
              <Users
                size={30}
                className="mx-auto mb-2 text-[#9CA3AF]"
              />

              <p className="text-[13px] font-semibold text-[#374151]">
                No staff accounts found
              </p>

              <p className="text-[12px] text-[#6B7280] mt-1">
                Create a staff account to get started.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#E5E7EB]">
                    <th className="py-3 pr-3 text-[11px] font-semibold text-[#6B7280] uppercase">
                      Staff Member
                    </th>
                    <th className="py-3 text-[11px] font-semibold text-[#6B7280] uppercase">
                      Role
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {staff.map((member) => (
                    <tr
                      key={member.id}
                      className="border-b border-[#F0F2F1] last:border-0"
                    >
                      <td className="py-3 pr-3">
                        <p className="text-[13px] font-semibold text-[#111827]">
                          {member.fullName}
                        </p>

                        <p className="text-[11.5px] text-[#6B7280] break-all">
                          {member.email}
                        </p>
                      </td>

                      <td className="py-3">
                        <span className="inline-flex rounded-full bg-[#E8F5ED] px-2.5 py-1 text-[11px] font-semibold text-[#158F50]">
                          Library Staff
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
