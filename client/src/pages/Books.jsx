import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import Status from "../components/Status";
import { booksApi } from "../api/services";
import { errorText } from "../utils/format";

const blank = { title:"", author:"", isbn:"", category:"", publisher:"", publicationYear:"", quantity:1, availableQuantity:1, status:"AVAILABLE" };
export default function Books() {
  const [rows,setRows]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(""),[search,setSearch]=useState("");
  const [modal,setModal]=useState(false),[editing,setEditing]=useState(null),[form,setForm]=useState(blank),[saving,setSaving]=useState(false),[notice,setNotice]=useState("");
  const load=async()=>{setLoading(true);setError("");try{setRows(await booksApi.list())}catch(e){setError(e.message)}finally{setLoading(false)}};
  useEffect(()=>{load()},[]);
  const filtered=useMemo(()=>rows.filter(b=>[b.bookId,b.title,b.author,b.isbn,b.category].join(" ").toLowerCase().includes(search.toLowerCase())),[rows,search]);
  const open=(book=null)=>{setEditing(book);setForm(book?{...blank,...book}:blank);setModal(true);setNotice("")};
  const change=(e)=>{const {name,value}=e.target;setForm(p=>({...p,[name]:["quantity","availableQuantity","publicationYear"].includes(name)?(value===""?"":Number(value)):value}))};
  const save=async(e)=>{e.preventDefault();setSaving(true);setNotice("");try{const payload={...form,publicationYear:form.publicationYear||null,quantity:Number(form.quantity),availableQuantity:editing?Number(form.availableQuantity):Number(form.quantity),status:Number(form.quantity)>0?"AVAILABLE":"UNAVAILABLE"};if(editing)await booksApi.update(editing.bookId,payload);else await booksApi.create(payload);setModal(false);await load()}catch(e){setNotice(errorText(e))}finally{setSaving(false)}};
  const remove=async(book)=>{if(!confirm(`Delete "${book.title}" (${book.bookId})? Books referenced by loans may not be deletable.`))return;try{await booksApi.remove(book.bookId);await load()}catch(e){setError(e.message)}};
  const columns=[{key:"bookId",label:"BOOK ID"},{key:"title",label:"BOOK TITLE",render:r=><div className="primary-cell"><strong>{r.title}</strong><span>{r.author}</span></div>},{key:"category",label:"CATEGORY"},{key:"isbn",label:"ISBN"},{key:"quantity",label:"COPIES"},{key:"availableQuantity",label:"AVAILABLE"},{key:"status",label:"STATUS",render:r=><Status value={r.status}/>},{key:"actions",label:"ACTIONS",render:r=><div className="row-actions"><button className="icon-button" title="Edit" onClick={()=>open(r)}><Pencil size={16}/></button><button className="icon-button danger-hover" title="Delete" onClick={()=>remove(r)}><Trash2 size={16}/></button></div>}];
  return <><PageHeader title="Books" description="Manage your library collection and availability." action={<button className="btn btn-primary" onClick={()=>open()}><Plus size={17}/> Add book</button>}/><DataTable columns={columns} rows={filtered} loading={loading} error={error} onRetry={load} search={search} onSearch={setSearch} searchPlaceholder="Search by title, author, ISBN..." />
  {modal&&<Modal title={editing?"Edit book":"Add new book"} onClose={()=>setModal(false)} wide><form className="form-grid" onSubmit={save}>
    <label className="field field-full">Book title<input name="title" value={form.title} onChange={change} required placeholder="Enter book title"/></label>
    <label className="field">Author<input name="author" value={form.author} onChange={change} required placeholder="Author name"/></label>
    <label className="field">ISBN<input name="isbn" value={form.isbn} onChange={change} required placeholder="ISBN"/></label>
    <label className="field">Category<input name="category" value={form.category} onChange={change} required placeholder="e.g. Technology"/></label>
    <label className="field">Publisher<input name="publisher" value={form.publisher} onChange={change} placeholder="Publisher"/></label>
    <label className="field">Publication year<input type="number" name="publicationYear" value={form.publicationYear} onChange={change} min="1000" max="2100" placeholder="2025"/></label>
    <label className="field">Total quantity<input type="number" name="quantity" value={form.quantity} onChange={change} min="0" required/></label>
    {editing&&<label className="field">Available quantity<input type="number" name="availableQuantity" value={form.availableQuantity} onChange={change} min="0" max={form.quantity} required/></label>}
    {notice&&<div className="form-error field-full">{notice}</div>}
    <div className="form-actions field-full"><button type="button" className="btn btn-light" onClick={()=>setModal(false)}>Cancel</button><button className="btn btn-primary" disabled={saving}>{saving?"Saving...":editing?"Save changes":"Create book"}</button></div>
  </form></Modal>}</>;
}