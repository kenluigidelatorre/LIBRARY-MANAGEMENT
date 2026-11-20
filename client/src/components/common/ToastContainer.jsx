import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

export default function ToastContainer() {
  const { toasts, dismissToast } = useLibrary();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2.5 max-w-[360px] w-full pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info';
        const Icon = isError ? AlertCircle : isInfo ? Info : CheckCircle2;
        const accentColor = isError
          ? '#DC2626'
          : isInfo
          ? '#1D4ED8'
          : '#158F50';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 bg-white border border-[#E1E7E3] rounded-xl px-4 py-3 shadow-lg"
          >
            <Icon size={18} style={{ color: accentColor }} className="shrink-0 mt-0.5" />
            <p className="text-[13.5px] font-medium text-[#111827] flex-1 leading-snug">
              {toast.message}
            </p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="text-[#6B7280] hover:text-[#111827] shrink-0"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
