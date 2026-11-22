import { NavLink, Outlet, useLocation } from "react-router-dom";
import { BookOpen, LayoutDashboard, Users, GraduationCap, BookMarked, Repeat2, CalendarDays, Wallet, ChartNoAxesCombined, Settings, Search, Bell, Menu, X, Library } from "lucide-react";
import { useState } from "react";

const nav = [
  { label: "OVERVIEW", items: [{ to: "/", label: "Dashboard", icon: LayoutDashboard }] },
  { label: "LIBRARY", items: [
    { to: "/students", label: "Students", icon: Users },
    { to: "/faculty", label: "Faculties", icon: GraduationCap },
    { to: "/books", label: "Books", icon: BookOpen },
    { to: "/loans", label: "Loans", icon: Repeat2 },
    { to: "/reservations", label: "Reservations", icon: CalendarDays },
    { to: "/fines", label: "Fines & Payments", icon: Wallet }
  ]},
  { label: "INSIGHTS", items: [
    { to: "/reports", label: "Reports", icon: ChartNoAxesCombined },
    { to: "/settings", label: "Settings", icon: Settings }
  ]}
];

const titles = {
  "/": ["Dashboard", "Welcome back. Here's what's happening in your library."],
  "/students": ["Students", "View students registered with the Library subsystem."],
  "/faculty": ["Faculties", "View faculty members registered with the Library subsystem."],
  "/books": ["Books", "Manage your library collection and availability."],
  "/loans": ["Loans", "Manage borrowing activity and process returned books."],
  "/reservations": ["Reservations", "Track book reservations and requests."],
  "/fines": ["Fines & Payments", "Monitor outstanding fines and payment records."],
  "/reports": ["Reports & Analytics", "A snapshot of your library's operational data."],
  "/settings": ["Settings", "Review system information and library policy."]
};

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const [title, subtitle] = titles[location.pathname] || titles["/"];
  return <div className="app-shell">
    {mobileOpen && <button className="mobile-scrim" onClick={() => setMobileOpen(false)} aria-label="Close menu"/>}
    <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
      <div className="brand"><div className="brand-mark"><Library size={23}/></div><div><strong>IDSC Library</strong><span>MANAGEMENT SYSTEM</span></div><button className="mobile-close" onClick={() => setMobileOpen(false)}><X/></button></div>
      <div className="nav-groups">{nav.map(group => <div className="nav-group" key={group.label}><div className="nav-label">{group.label}</div>{group.items.map(item => {
        const Icon = item.icon;
        return <NavLink key={item.to} to={item.to} end={item.to === "/"} onClick={() => setMobileOpen(false)} className={({isActive}) => `nav-link ${isActive ? "active" : ""}`}><Icon size={18}/><span>{item.label}</span></NavLink>;
      })}</div>)}</div>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><BookMarked size={17}/></div><strong>Library workspace</strong><span>Keep your collection organized and up to date.</span></div><div className="profile"><div className="avatar">LA</div><div><strong>Library Admin</strong><span>Administrator</span></div><span className="online-dot"/></div></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><button className="menu-toggle" onClick={() => setMobileOpen(true)}><Menu/></button><div className="breadcrumb">Workspace <span>/</span> <strong>{title}</strong></div><div className="topbar-right"><div className="topbar-tag"><span className="online-dot"/> System workspace</div><button className="icon-button notification" title="Notifications"><Bell size={18}/><i/></button><div className="top-avatar">LA</div></div></header>
      <div className="content"><div className="mobile-page-title"><h1>{title}</h1><p>{subtitle}</p></div><Outlet/></div>
      <footer className="footer">IDSC Library Management System <span>•</span> Frontend workspace</footer>
    </main>
  </div>;
}