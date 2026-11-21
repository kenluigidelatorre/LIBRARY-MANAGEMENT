import { useState } from 'react';
import { Save, RotateCcw, Download } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { settings, updateSettings, resetSampleData, addToast } = useLibrary();
  const { user, updateProfile } = useAuth();

  const [libForm, setLibForm] = useState(settings);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Admin User',
    email: user?.email || 'admin@cmdlibrary.edu',
    role: user?.role || 'Head Librarian',
  });

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSettings({
      ...libForm,
      studentLoanDays: Number(libForm.studentLoanDays),
      facultyLoanDays: Number(libForm.facultyLoanDays),
      maxBooksPerStudent: Number(libForm.maxBooksPerStudent),
      maxBooksPerFaculty: Number(libForm.maxBooksPerFaculty),
      dailyFineRate: Number(libForm.dailyFineRate),
      reservationHoldDays: Number(libForm.reservationHoldDays),
    });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
    addToast('Librarian account profile updated.');
  };

  return (
    <div className="space-y-6">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">
            Configure library policies, circulation limits, and administrator preferences
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">

          <button type="button" onClick={resetSampleData} className="btn-secondary">
            <RotateCcw size={15} />
            <span>Reset Sample Data</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Library Profile & Policies */}
        <form onSubmit={handleSaveSettings} className="cmd-card p-6 space-y-5">
          <div>
            <h2 className="text-[17px] font-bold text-[#111827]">
              Library &amp; Circulation Policies
            </h2>
            <p className="text-[12.5px] text-[#6B7280] mt-0.5">
              Defaults applied to new borrowing transactions and fines
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
                Library Name
              </label>
              <input
                type="text"
                value={libForm.libraryName}
                onChange={(e) => setLibForm({ ...libForm, libraryName: e.target.value })}
                className="w-full h-10 px-3.5 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] focus:outline-none focus:bg-white focus:border-[#158F50]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
                  Institution Code
                </label>
                <input
                  type="text"
                  value={libForm.institutionCode}
                  onChange={(e) => setLibForm({ ...libForm, institutionCode: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] font-mono-data focus:outline-none focus:bg-white focus:border-[#158F50]"
                />
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={libForm.contactEmail}
                  onChange={(e) => setLibForm({ ...libForm, contactEmail: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] focus:outline-none focus:bg-white focus:border-[#158F50]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
                  Student Loan Days
                </label>
                <input
                  type="number"
                  min="1"
                  value={libForm.studentLoanDays}
                  onChange={(e) => setLibForm({ ...libForm, studentLoanDays: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] tabular-nums focus:outline-none focus:bg-white focus:border-[#158F50]"
                />
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
                  Faculty Loan Days
                </label>
                <input
                  type="number"
                  min="1"
                  value={libForm.facultyLoanDays}
                  onChange={(e) => setLibForm({ ...libForm, facultyLoanDays: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] tabular-nums focus:outline-none focus:bg-white focus:border-[#158F50]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
                  Daily Fine Rate ($)
                </label>
                <input
                  type="number"
                  min="0.25"
                  step="0.25"
                  value={libForm.dailyFineRate}
                  onChange={(e) => setLibForm({ ...libForm, dailyFineRate: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] tabular-nums focus:outline-none focus:bg-white focus:border-[#158F50]"
                />
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
                  Reservation Hold (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  value={libForm.reservationHoldDays}
                  onChange={(e) =>
                    setLibForm({ ...libForm, reservationHoldDays: e.target.value })
                  }
                  className="w-full h-10 px-3.5 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] tabular-nums focus:outline-none focus:bg-white focus:border-[#158F50]"
                />
              </div>
            </div>

            <div className="pt-2 space-y-2.5">
              <label className="flex items-center gap-2.5 text-[13.5px] text-[#374151] cursor-pointer">
                <input
                  type="checkbox"
                  checked={libForm.emailNotifications}
                  onChange={(e) =>
                    setLibForm({ ...libForm, emailNotifications: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#158F50]"
                />
                <span>Send automatic due-date email reminders</span>
              </label>
              <label className="flex items-center gap-2.5 text-[13.5px] text-[#374151] cursor-pointer">
                <input
                  type="checkbox"
                  checked={libForm.overdueAutoAlert}
                  onChange={(e) =>
                    setLibForm({ ...libForm, overdueAutoAlert: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#158F50]"
                />
                <span>Highlight overdue loans in header notifications</span>
              </label>
            </div>
          </div>

          <button type="submit" className="btn-primary">
            <Save size={15} />
            <span>Save Library Settings</span>
          </button>
        </form>

        {/* Account Settings */}
        <form onSubmit={handleSaveProfile} className="cmd-card p-6 space-y-5 h-fit">
          <div>
            <h2 className="text-[17px] font-bold text-[#111827]">Account Profile</h2>
            <p className="text-[12.5px] text-[#6B7280] mt-0.5">
              Update your active librarian display name and role
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full h-10 px-3.5 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] focus:outline-none focus:bg-white focus:border-[#158F50]"
              />
            </div>

            <div>
              <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full h-10 px-3.5 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] focus:outline-none focus:bg-white focus:border-[#158F50]"
              />
            </div>

            <div>
              <label className="block text-[12.5px] font-semibold text-[#374151] mb-1.5">
                Role Title
              </label>
              <input
                type="text"
                value={profileForm.role}
                onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                className="w-full h-10 px-3.5 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] text-[13.5px] focus:outline-none focus:bg-white focus:border-[#158F50]"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary">
            <Save size={15} />
            <span>Update Account</span>
          </button>
        </form>
      </div>
    </div>
  );
}
