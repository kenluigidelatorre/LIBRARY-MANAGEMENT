import { Navigate, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Students from "./pages/Students";
import Faculty from "./pages/Faculty";
import Loans from "./pages/Loans";
import Reservations from "./pages/Reservations";
import Fines from "./pages/Fines";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/books" element={<Books />} />
        <Route path="/students" element={<Students />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/fines" element={<Fines />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<div className="panel"><h2>Page not found</h2><p>The page you're looking for doesn't exist.</p></div>} />
      </Route>
    </Routes>
  );
}
