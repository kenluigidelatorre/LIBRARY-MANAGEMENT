import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import ToastContainer from '../common/ToastContainer';
import { useAuth } from '../../context/AuthContext';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setSidebarOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className="main-wrapper">
        <Header onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
