import { useEffect, useMemo, useState } from "react";
import { Users, RefreshCw } from "lucide-react";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import Status from "../components/Status";
import { studentsApi } from "../api/services";
export default function Students() {
  const [rows, setRows] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [search, setSearch] = useState("");
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setRows(await studentsApi.list());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const filtered = useMemo(
    () =>
      rows.filter((r) =>
        [r.studentId, r.name, r.program, r.yearLevel]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [rows, search],
  );
  const columns = [
    { key: "studentId", label: "STUDENT ID" },
    {
      key: "name",
      label: "STUDENT NAME",
      render: (r) => <strong>{r.name}</strong>,
    },
    { key: "program", label: "PROGRAM" },
    { key: "yearLevel", label: "YEAR LEVEL" },
    {
      key: "libraryStatus",
      label: "LIBRARY STATUS",
      render: (r) => <Status value={r.libraryStatus} />,
    },
  ];
  return (
    <>
      <PageHeader
        title="Students"
        description="Student records registered with the Library subsystem."
        action={
          <button className="btn btn-light" onClick={load}>
            <RefreshCw size={16} /> Refresh
          </button>
        }
      />
      <div className="info-strip">
        <Users size={18} />
        <span>
          Student records are managed by the Registrar. This page displays the
          Library's registered student records.
        </span>
      </div>
      <DataTable
        columns={columns}
        rows={filtered}
        loading={loading}
        error={error}
        onRetry={load}
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search student ID, name, program..."
      />
    </>
  );
}
