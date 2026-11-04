import { X } from "lucide-react";

export default function Modal({ title, onClose, children, wide = false }) {
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className={`modal ${wide ? "modal-wide" : ""}`} role="dialog" aria-modal="true">
        <header className="modal-header">
          <div><h2>{title}</h2><p>Enter the information below.</p></div>
          <button className="icon-button" onClick={onClose} aria-label="Close"><X size={19}/></button>
        </header>
        {children}
      </section>
    </div>
  );
}