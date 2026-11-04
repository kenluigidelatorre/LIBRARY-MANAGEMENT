import { useEffect,useMemo,useState } from "react";
import { Plus, RotateCcw, Trash2 } from "lucide-react";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import Status from "../components/Status";
import { loansApi,booksApi,studentsApi,facultyApi } from "../api/services";
import { date } from "../utils/format";
export default function Loans(){
 const [rows,setRows]=useState([]),[books,setBooks]=useState([]),[students,setStudents]=useState([]),[faculty,setFaculty]=useState([]);
 const [loading,setLoading]=useState(true),[error,setError]=useState(""),[search,setSearch]=useState(""),[modal,setModal]=useState(false),[saving,setSaving]=useState(false),[message,setMessage]=useState("");
 const [form,setForm]=useState({borrowerType:"STUDENT",borrowerId:"",bookId:"",borrowedDate:new Date().toISOString().slice(0,10),dueDate:""});
 const load=async()=>{setLoading(true);setError("");try{const [l,b,s,f]=await Promise.all([loansApi.list(),booksApi.list(),studentsApi.list(),facultyApi.list()]);setRows(l);setBooks(b);setStudents(s);setFaculty(f)}catch(e){setError(e.message)}finally{setLoading(false)}};
 useEffect(()=>{load()},[]);
 const filtered=useMemo(()=>rows.filter(r=>[r.loanId,r.borrowerId,r.borrowerType,r.bookId,r.status].join(" ").toLowerCase().includes(search.toLowerCase())),[rows,search]);
 const borrow=async(e)=>{e.preventDefault();setSaving(true);setMessage("");try{await loansApi.create({borrowerType:form.borrowerType,borrowerId:form.borrowerId,bookId:form.bookId,borrowedDate:form.borrowedDate,dueDate:form.dueDate});setModal(false);setForm({borrowerType:"STUDENT",borrowerId:"",bookId:"",borrowedDate:new Date().toISOString().slice(0,10),dueDate:""});await load()}catch(e){setMessage(e.message)}finally{setSaving(false)}};
 const returnBook=async(row)=>{if(!confirm(`Mark loan ${row.loanId} as returned?`))return;try{await loansApi.update(row.loanId,{returnedDate:new Date().toISOString().slice(0,10),status:"RETURNED"});await load()}catch(e){setError(e.message)}};
 const remove=async(row)=>{if(!confirm(`Delete loan ${row.loanId}?`))return;try{await loansApi.remove(row.loanId);await load()}catch(e){setError(e.message)}};
 const columns=[{key:"loanId",label:"LOAN ID"},{key:"borrowerId",label:"BORROWER",render:r=><div className="primary-cell"><strong>{r.borrowerId}</strong><span>{r.borrowerType}</span></div>},{key:"bookId",label:"BOOK ID"},{key:"borrowedDate",label:"BORROWED",render:r=>date(r.borrowedDate)},{key:"dueDate",label:"DUE DATE",render:r=>date(r.dueDate)},{key:"returnedDate",label:"RETURNED",render:r=>date(r.returnedDate)},{key:"status",label:"STATUS",render:r=><Status value={r.status}/>},{key:"actions",label:"ACTIONS",render:r=><div className="row-actions">{String(r.status).toUpperCase()!=="RETURNED"&&<button className="icon-button" title="Process return" onClick={()=>returnBook(r)}><RotateCcw size={16}/></button>}<button className="icon-button danger-hover" title="Delete loan" onClick={()=>remove(r)}><Trash2 size={16}/></button></div>}];
 const people=form.borrowerType==="STUDENT"?students:faculty;
 return <><PageHeader title="Loans" description="Borrowing and returns are managed together in one workspace." action={<button className="btn btn-primary" onClick={()=>{setMessage("");setModal(true)}}><Plus size={17}/> Borrow book</button>}/><DataTable columns={columns} rows={filtered} loading={loading} error={error} onRetry={load} search={search} onSearch={setSearch} searchPlaceholder="Search loan, borrower, or book ID..."/>
 {modal&&<Modal title="Create a book loan" onClose={()=>setModal(false)}><form className="form-stack" onSubmit={borrow}>
  <label className="field">Borrower type<select value={form.borrowerType} onChange={e=>setForm(p=>({...p,borrowerType:e.target.value,borrowerId:""}))}><option value="STUDENT">Student</option><option value="FACULTY">Faculty</option></select></label>
  <label className="field">Borrower ID<select required value={form.borrowerId} onChange={e=>setForm(p=>({...p,borrowerId:e.target.value}))}><option value="">Select borrower</option>{people.map(p=><option key={form.borrowerType==="STUDENT"?p.studentId:p.facultyId} value={form.borrowerType==="STUDENT"?p.studentId:p.facultyId}>{form.borrowerType==="STUDENT"?p.studentId:p.facultyId} — {p.name}</option>)}</select></label>
  <label className="field">Book<select required value={form.bookId} onChange={e=>setForm(p=>({...p,bookId:e.target.value}))}><option value="">Select available book</option>{books.filter(b=>Number(b.availableQuantity)>0).map(b=><option key={b.bookId} value={b.bookId}>{b.bookId} — {b.title} ({b.availableQuantity} available)</option>)}</select></label>
  <div className="form-two"><label className="field">Borrowed date<input type="date" required value={form.borrowedDate} onChange={e=>setForm(p=>({...p,borrowedDate:e.target.value}))}/></label><label className="field">Due date<input type="date" required min={form.borrowedDate} value={form.dueDate} onChange={e=>setForm(p=>({...p,dueDate:e.target.value}))}/></label></div>
  {message&&<div className="form-error">{message}</div>}<div className="form-actions"><button type="button" className="btn btn-light" onClick={()=>setModal(false)}>Cancel</button><button className="btn btn-primary" disabled={saving}>{saving?"Creating...":"Create loan"}</button></div>
 </form></Modal>}</>;
}