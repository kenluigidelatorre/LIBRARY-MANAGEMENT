import { useEffect, useState } from "react";
import { BookOpen, Users, GraduationCap, Repeat2, CalendarDays, AlertTriangle, ArrowUpRight, Clock3 } from "lucide-react";
import PageHeader from "../components/PageHeader";
import Status from "../components/Status";
import { Loading, ErrorState, Empty } from "../components/States";
import { booksApi, studentsApi, facultyApi, loansApi, reservationsApi, finesApi } from "../api/services";
import { date, money } from "../utils/format";

export default function Dashboard() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = async () => {
    setLoading(true); setError("");
    try {
      const [books, students, faculty, loans, reservations, fines] = await Promise.all([
        booksApi.list(), studentsApi.list(), facultyApi.list(), loansApi.list(), reservationsApi.list(), finesApi.list()
      ]);
      setData({ books, students, faculty, loans, reservations, fines });
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  if (loading) return <><PageHeader title="Dashboard" description="A live overview of your library operations."/><Loading label="Loading dashboard data..."/></>;
  if (error) return <><PageHeader title="Dashboard" description="A live overview of your library operations."/><ErrorState message={error} onRetry={load}/></>;
  const { books = [], students = [], faculty = [], loans = [], reservations = [], fines = [] } = data;
  const activeLoans = loans.filter(x => String(x.status).toUpperCase() !== "RETURNED");
  const overdue = activeLoans.filter(x => x.dueDate && new Date(x.dueDate) < new Date());
  const stats = [
    { label: "Total books", value: books.length, note: `${books.reduce((n,b)=>n+Number(b.availableQuantity||0),0)} available copies`, icon: BookOpen, tone: "green" },
    { label: "Library students", value: students.length, note: "Registered students", icon: Users, tone: "blue" },
    { label: "Faculty members", value: faculty.length, note: "Registered faculty", icon: GraduationCap, tone: "purple" },
    { label: "Active loans", value: activeLoans.length, note: "Currently borrowed", icon: Repeat2, tone: "orange" }
  ];
  const recent = [...loans].sort((a,b)=>new Date(b.borrowedDate)-new Date(a.borrowedDate)).slice(0,6);
  return <>
    <PageHeader title="Dashboard" description="A live overview of your library operations." action={<span className="live-pill"><span className="online-dot"/> Live API data</span>}/>
    <div className="welcome-banner"><div><span className="banner-kicker">LIBRARY OVERVIEW</span><h2>Your library, at a glance.</h2><p>Monitor collections, borrowing activity, reservations, and overdue records.</p></div><div className="banner-art"><BookOpen size={74}/><span/><i/></div></div>
    <div className="stats-grid">{stats.map(s=>{const Icon=s.icon;return <div className="stat-card" key={s.label}><div className={`stat-icon ${s.tone}`}><Icon size={20}/></div><div className="stat-label">{s.label}</div><div className="stat-value">{s.value.toLocaleString()}</div><div className="stat-note">{s.note}</div></div>})}</div>
    <div className="dashboard-grid">
      <section className="panel panel-large"><div className="panel-heading"><div><h3>Recent borrowing activity</h3><p>Latest loan records from the database</p></div><span className="subtle-link">Latest records <ArrowUpRight size={14}/></span></div>
        {recent.length ? <div className="activity-list">{recent.map((loan,i)=><div className="activity-row" key={loan.loanId||i}><div className="activity-book"><BookOpen size={18}/></div><div className="activity-main"><strong>{loan.bookId || "Book record"}</strong><span>{loan.borrowerType} · {loan.borrowerId}</span></div><div className="activity-date">{date(loan.borrowedDate)}</div><Status value={loan.status}/></div>)}</div> : <Empty title="No borrowing activity yet"/>}
      </section>
      <section className="panel"><div className="panel-heading"><div><h3>Attention needed</h3><p>Items requiring follow-up</p></div><AlertTriangle size={18} className="muted-icon"/></div>
        <div className="attention-item"><div className="attention-icon red"><Clock3 size={18}/></div><div><strong>{overdue.length} overdue loans</strong><span>Past their due date</span></div></div>
        <div className="attention-item"><div className="attention-icon amber"><CalendarDays size={18}/></div><div><strong>{reservations.filter(x=>String(x.status).toUpperCase()==="PENDING").length} pending reservations</strong><span>Awaiting action</span></div></div>
        <div className="attention-item"><div className="attention-icon green"><AlertTriangle size={18}/></div><div><strong>{fines.filter(x=>String(x.status).toUpperCase()!=="PAID").length} unpaid fines</strong><span>{money(fines.filter(x=>String(x.status).toUpperCase()!=="PAID").reduce((n,f)=>n+Number(f.amount||0),0))} outstanding</span></div></div>
      </section>
    </div>
    <div className="panel"><div className="panel-heading"><div><h3>Collection snapshot</h3><p>Availability across your book collection</p></div></div><div className="collection-grid"><div><span>Total titles</span><strong>{books.length}</strong></div><div><span>Total copies</span><strong>{books.reduce((n,b)=>n+Number(b.quantity||0),0)}</strong></div><div><span>Available copies</span><strong>{books.reduce((n,b)=>n+Number(b.availableQuantity||0),0)}</strong></div><div><span>Reservations</span><strong>{reservations.length}</strong></div></div></div>
  </>;
}