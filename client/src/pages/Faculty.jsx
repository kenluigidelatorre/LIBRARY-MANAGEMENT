import { useEffect,useMemo,useState } from "react";
import { GraduationCap } from "lucide-react";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import Status from "../components/Status";
import { facultyApi } from "../api/services";
export default function Faculty(){
 const [rows,setRows]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(""),[search,setSearch]=useState("");
 const load=async()=>{setLoading(true);setError("");try{setRows(await facultyApi.list())}catch(e){setError(e.message)}finally{setLoading(false)}};
 useEffect(()=>{load()},[]);
 const filtered=useMemo(()=>rows.filter(r=>[r.facultyId,r.name,r.department,r.email].join(" ").toLowerCase().includes(search.toLowerCase())),[rows,search]);
 const columns=[{key:"facultyId",label:"FACULTY ID"},{key:"name",label:"FACULTY NAME",render:r=><strong>{r.name}</strong>},{key:"department",label:"DEPARTMENT"},{key:"email",label:"EMAIL"},{key:"libraryStatus",label:"LIBRARY STATUS",render:r=><Status value={r.libraryStatus}/>}];
 return <><PageHeader title="Faculties" description="Faculty members registered with the Library subsystem."/><div className="info-strip"><GraduationCap size={18}/><span>Faculty records are currently read-only because the backend provides GET endpoints only.</span></div><DataTable columns={columns} rows={filtered} loading={loading} error={error} onRetry={load} search={search} onSearch={setSearch} searchPlaceholder="Search faculty ID, name, department..."/></>;
}