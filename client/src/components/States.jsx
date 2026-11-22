import { AlertCircle, LoaderCircle, SearchX } from "lucide-react";

export function Loading({ label = "Loading records..." }) {
  return <div className="state-box"><LoaderCircle className="spin" size={25}/><span>{label}</span></div>;
}
export function Empty({ title = "No records found", detail = "Records will appear here when available." }) {
  return <div className="state-box empty-state"><SearchX size={28}/><strong>{title}</strong><span>{detail}</span></div>;
}
export function ErrorState({ message, onRetry }) {
  return <div className="error-state"><AlertCircle size={20}/><span>{message}</span>{onRetry && <button className="btn btn-light btn-sm" onClick={onRetry}>Retry</button>}</div>;
}