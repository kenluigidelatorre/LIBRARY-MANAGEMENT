
import { useEffect, useMemo, useState } from 'react';
import { Users } from 'lucide-react';

const REGISTERED_USERS_KEY = 'cmd_library_registered_users';

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem(REGISTERED_USERS_KEY) || '[]'
      );

      setStaff(
        Array.isArray(stored)
          ? stored.filter((user) => user.roleCode !== 'ADMIN')
          : []
      );
    } catch {
      setStaff([]);
    }
  }, []);

  const filteredStaff = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return staff;

    return staff.filter((user) =>
      [user.id, user.name, user.email, user.role]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(keyword))
    );
  }, [staff, search]);

  return (
    <div className="space-y-5">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Staff Management</h1>
          <p className="page-subtitle">
            View and manage registered library staff accounts
          </p>
        </div>
      </div>

      <section className="cmd-card overflow-hidden">
        <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-[16px] font-bold text-[#111827]">
              Registered Staff
            </h2>
            <p className="text-[12.5px] text-[#6B7280] mt-1">
              {filteredStaff.length} total records
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <label htmlFor="staff-search" className="sr-only">
              Search staff
            </label>
            <input
              id="staff-search"
              name="staffSearch"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search staff..."
              className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#169C53]"
            />
          </div>
        </div>

        <div className="table-scroll">
          <table className="cmd-table">
            <thead>
              <tr>
                <th>Staff ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Account Type</th>
              </tr>
            </thead>

            <tbody>
              {filteredStaff.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-10 text-[#6B7280]"
                  >
                    {staff.length === 0
                      ? 'No registered staff accounts found.'
                      : 'No staff records match your search.'}
                  </td>
                </tr>
              ) : (
                filteredStaff.map((user) => (
                  <tr key={user.id}>
                    <td className="font-mono-data text-[12.5px] font-semibold text-[#374151]">
                      {user.id}
                    </td>
                    <td className="font-semibold text-[#111827]">
                      {user.name}
                    </td>
                    <td className="text-[#4B5563]">{user.email}</td>
                    <td>{user.role || 'Library Staff'}</td>
                    <td>
                      <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold bg-[#E7F6EE] text-[#15803D]">
                        Staff
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
