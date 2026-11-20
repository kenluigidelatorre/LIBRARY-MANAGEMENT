import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ArrowLeftRight,
  RotateCcw,
  CalendarClock,
  CircleDollarSign,
  BarChart3,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import BrandEmblem from '../common/BrandEmblem';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/faculty', label: 'Faculties', icon: GraduationCap },
  { to: '/books', label: 'Books', icon: BookOpen },
  { to: '/borrowing', label: 'Borrowing', icon: ArrowLeftRight },
  { to: '/returns', label: 'Returns', icon: RotateCcw },
  { to: '/reservations', label: 'Reservations', icon: CalendarClock },
  { to: '/fines', label: 'Fines', icon: CircleDollarSign },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose, onLogout }) {
  const { user } = useAuth();

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`} aria-label="Main navigation">
        <div className="flex items-center justify-between pr-3">
          <NavLink to="/dashboard" className="sidebar-brand flex-1" onClick={onClose}>
            <BrandEmblem size={38} />
            <div className="min-w-0">
              <div className="sidebar-brand-title">CMD</div>
              <div className="sidebar-brand-subtitle">Library Management System</div>
            </div>
          </NavLink>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} strokeWidth={2} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            onClick={onLogout}
            className="sidebar-link w-full text-left bg-transparent border-0"
          >
            <LogOut size={18} strokeWidth={2} />
            <span>{user ? 'Sign Out' : 'Log In'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
