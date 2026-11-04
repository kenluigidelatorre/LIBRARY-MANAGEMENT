import { titleCase } from "../utils/format";
export default function Status({ value }) {
  const key = String(value || "unknown").toLowerCase();
  return <span className={`status status-${key.replace(/[^a-z0-9]+/g, "-")}`}>{titleCase(value || "Unknown")}</span>;
}