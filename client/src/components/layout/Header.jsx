import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  User,
  Settings,
  LogOut,
  UserPlus,
  BookOpen,
  Users,
  GraduationCap,
  Download,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLibrary } from '../../context/LibraryContext';

export default function Header({ onOpenSidebar }) {
  const { user, logout } = useAuth();
  const { books, students, faculty, borrowings, reservations } = useLibrary();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notificationsCleared, setNotificationsCleared] = useState(false);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const overdueItems = borrowings.filter((b) => b.status === 'Overdue');
  const pendingReservations = reservations.filter((r) => r.status === 'Pending');
  const alertList = [
    ...overdueItems.map((b) => ({
      id: `ov-${b.id}`,
      title: `Overdue: ${b.bookTitle}`,
      detail: `${b.borrowerName} · Due ${b.dueDate}`,
      route: '/borrowing',
    })),
    ...pendingReservations.map((r) => ({
      id: `res-${r.id}`,
      title: `Pending Reservation: ${r.bookTitle}`,
      detail: `Requested by ${r.borrowerName}`,
      route: '/reservations',
    })),
  ];

  const q = query.trim().toLowerCase();
  const matchedBooks = q
    ? books
        .filter(
          (b) =>
            b.title.toLowerCase().includes(q) ||
            b.author.toLowerCase().includes(q) ||
            b.isbn.toLowerCase().includes(q)
        )
        .slice(0, 3)
    : [];
  const matchedStudents = q
    ? students
        .filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.id.toLowerCase().includes(q) ||
            s.program.toLowerCase().includes(q)
        )
        .slice(0, 3)
    : [];
  const matchedFaculty = q
    ? faculty
        .filter(
          (f) =>
            f.name.toLowerCase().includes(q) || f.department.toLowerCase().includes(q)
        )
        .slice(0, 2)
    : [];

  const hasResults =
    matchedBooks.length > 0 || matchedStudents.length > 0 || matchedFaculty.length > 0;

  return (
    <header className="top-header">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open navigation menu"
          className="mobile-menu-btn"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Centered Search Bar matching Figma */}
      <div className="header-search-wrap" ref={searchRef}>
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSearchResults(true);
          }}
          onFocus={() => query && setShowSearchResults(true)}
          placeholder="Search anything..."
          aria-label="Global search"
          className="header-search-input"
        />

        {showSearchResults && q.length > 0 && (
          <div
            className="absolute left-0 right-0 top-[46px] bg-white border border-[#E1E7E3] rounded-xl overflow-hidden z-50"
            style={{ boxShadow: 'var(--shadow-dropdown)' }}
          >
            {!hasResults ? (
              <div className="p-4 text-[13px] text-[#6B7280] text-center">
                No matching books, students, or faculty found.
              </div>
            ) : (
              <div className="divide-y divide-[#E1E7E3] max-h-[340px] overflow-y-auto">
                {matchedBooks.map((book) => (
                  <button
                    key={book.id}
                    type="button"
                    onClick={() => {
                      setShowSearchResults(false);
                      setQuery('');
                      navigate('/books');
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-[#F3F6F4] flex items-center gap-3"
                  >
                    <BookOpen size={15} className="text-[#158F50] shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-[#111827] truncate">
                        {book.title}
                      </div>
                      <div className="text-[11.5px] text-[#6B7280]">
                        Book · {book.author}
                      </div>
                    </div>
                  </button>
                ))}
                {matchedStudents.map((stu) => (
                  <button
                    key={stu.id}
                    type="button"
                    onClick={() => {
                      setShowSearchResults(false);
                      setQuery('');
                      navigate('/students');
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-[#F3F6F4] flex items-center gap-3"
                  >
                    <Users size={15} className="text-[#1D4ED8] shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-[#111827] truncate">
                        {stu.name}
                      </div>
                      <div className="text-[11.5px] text-[#6B7280]">
                        Student · {stu.program}
                      </div>
                    </div>
                  </button>
                ))}
                {matchedFaculty.map((fac) => (
                  <button
                    key={fac.id}
                    type="button"
                    onClick={() => {
                      setShowSearchResults(false);
                      setQuery('');
                      navigate('/faculty');
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-[#F3F6F4] flex items-center gap-3"
                  >
                    <GraduationCap size={15} className="text-[#B45309] shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-[#111827] truncate">
                        {fac.name}
                      </div>
                      <div className="text-[11.5px] text-[#6B7280]">
                        Faculty · {fac.department}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Notifications + User Profile */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setShowNotifications((prev) => !prev);
              setShowProfileMenu(false);
            }}
            aria-label="Notifications"
            className="relative w-9 h-9 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] hover:bg-[#E7F6EE] text-[#4B5563] hover:text-[#158F50] flex items-center justify-center transition-colors"
          >
            <Bell size={17} />
            {!notificationsCleared && alertList.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-[#DC2626] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                {alertList.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              className="absolute right-0 top-[44px] w-[310px] bg-white border border-[#E1E7E3] rounded-xl overflow-hidden z-50"
              style={{ boxShadow: 'var(--shadow-dropdown)' }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E1E7E3]">
                <span className="text-[13.5px] font-bold text-[#111827]">Notifications</span>
                {alertList.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setNotificationsCleared(true)}
                    className="text-[12px] font-medium text-[#158F50] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-[280px] overflow-y-auto divide-y divide-[#E1E7E3]">
                {alertList.length === 0 || notificationsCleared ? (
                  <div className="p-5 text-center text-[13px] text-[#6B7280]">
                    You are all caught up.
                  </div>
                ) : (
                  alertList.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setShowNotifications(false);
                        navigate(item.route);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-[#F3F6F4] transition-colors"
                    >
                      <div className="text-[13px] font-semibold text-[#111827]">
                        {item.title}
                      </div>
                      <div className="text-[12px] text-[#6B7280] mt-0.5">{item.detail}</div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setShowProfileMenu((prev) => !prev);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-lg hover:bg-[#F3F6F4] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#158F50] text-white flex items-center justify-center text-[13px] font-bold shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-[13px] font-semibold text-[#111827] leading-tight whitespace-nowrap">
                {user?.name || 'Admin User'}
              </div>
              <div className="text-[11px] text-[#6B7280] leading-tight whitespace-nowrap">
                {user?.role || 'Head Librarian'}
              </div>
            </div>
            <ChevronDown size={15} className="text-[#6B7280] shrink-0" />
          </button>

          {showProfileMenu && (
            <div
              className="absolute right-0 top-[44px] w-[210px] bg-white border border-[#E1E7E3] rounded-xl py-1.5 z-50"
              style={{ boxShadow: 'var(--shadow-dropdown)' }}
            >
              <div className="px-3.5 py-2 border-b border-[#E1E7E3]">
                <div className="text-[13px] font-semibold text-[#111827] truncate">
                  {user?.name || 'Admin User'}
                </div>
                <div className="text-[11.5px] text-[#6B7280] truncate">
                  {user?.email || 'admin@cmdlibrary.edu'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/settings');
                }}
                className="w-full px-3.5 py-2 text-left text-[13px] text-[#374151] hover:bg-[#F3F6F4] flex items-center gap-2.5"
              >
                <Settings size={15} />
                <span>System Settings</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/login');
                }}
                className="w-full px-3.5 py-2 text-left text-[13px] text-[#374151] hover:bg-[#F3F6F4] flex items-center gap-2.5"
              >
                <User size={15} />
                <span>Login Screen</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/register');
                }}
                className="w-full px-3.5 py-2 text-left text-[13px] text-[#374151] hover:bg-[#F3F6F4] flex items-center gap-2.5"
              >
                <UserPlus size={15} />
                <span>Register Account</span>
              </button>
             
              <div className="my-1 border-t border-[#E1E7E3]" />
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                  navigate('/login');
                }}
                className="w-full px-3.5 py-2 text-left text-[13px] text-[#DC2626] hover:bg-[#FEE2E2]/50 flex items-center gap-2.5 font-medium"
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
