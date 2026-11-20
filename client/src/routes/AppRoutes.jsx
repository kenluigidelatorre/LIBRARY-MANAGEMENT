import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/layout/MainLayout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/Dashboard';
import Students from '../pages/Students';
import Faculty from '../pages/Faculty';
import Books from '../pages/Books';
import Categories from '../pages/Categories';
import Borrowing from '../pages/Borrowing';
import Returns from '../pages/Returns';
import Reservations from '../pages/Reservations';
import Fines from '../pages/Fines';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="faculty" element={<Faculty />} />
        <Route path="books" element={<Books />} />
        <Route path="categories" element={<Categories />} />
        <Route path="borrowing" element={<Borrowing />} />
        <Route path="returns" element={<Returns />} />
        <Route path="reservations" element={<Reservations />} />
        <Route path="fines" element={<Fines />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
