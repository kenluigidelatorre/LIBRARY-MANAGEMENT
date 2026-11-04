import { Search } from "lucide-react";
import { Empty, Loading, ErrorState } from "./States";

export default function DataTable({ columns, rows = [], loading, error, onRetry, search, onSearch, searchPlaceholder = "Search records...", emptyTitle }) {
  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={onRetry}/>;
  return <div className="table-card">
    {onSearch && <div className="table-toolbar"><div className="search-box"><Search size={17}/><input value={search} onChange={e => onSearch(e.target.value)} placeholder={searchPlaceholder}/></div><span className="record-count">{rows.length} records</span></div>}
    {rows.length === 0 ? <Empty title={emptyTitle || "No matching records"} /> :
      <div className="table-scroll"><table><thead><tr>{columns.map(c => <th key={c.key}>{c.label}</th>)}</tr></thead>
        <tbody>{rows.map((row, i) => <tr key={row.id || row.bookId || row.loanId || row.fineId || row.reservationId || row.studentId || row.facultyId || i}>
          {columns.map(c => <td key={c.key}>{c.render ? c.render(row) : (row[c.key] ?? "—")}</td>)}
        </tr>)}</tbody></table></div>}
  </div>;
}