import { CheckCircle2, Clock, AlertCircle, XCircle, Info } from 'lucide-react';

const STATUS_MAP = {
  Active: { bg: '#DCFCE7', text: '#15803D', icon: CheckCircle2 },
  Available: { bg: '#DCFCE7', text: '#15803D', icon: CheckCircle2 },
  Returned: { bg: '#DCFCE7', text: '#15803D', icon: CheckCircle2 },
  'On Time': { bg: '#DCFCE7', text: '#15803D', icon: CheckCircle2 },
  Paid: { bg: '#DCFCE7', text: '#15803D', icon: CheckCircle2 },
  Completed: { bg: '#DCFCE7', text: '#15803D', icon: CheckCircle2 },
  Approved: { bg: '#DBEAFE', text: '#1D4ED8', icon: Info },
  Borrowed: { bg: '#DBEAFE', text: '#1D4ED8', icon: Clock },
  Pending: { bg: '#FEF3C7', text: '#B45309', icon: Clock },
  'Low Stock': { bg: '#FEF3C7', text: '#B45309', icon: AlertCircle },
  'On Leave': { bg: '#FEF3C7', text: '#B45309', icon: Clock },
  Late: { bg: '#FEF3C7', text: '#B45309', icon: AlertCircle },
  Waived: { bg: '#F1F5F9', text: '#475569', icon: Info },
  Inactive: { bg: '#F1F5F9', text: '#475569', icon: XCircle },
  Cancelled: { bg: '#F1F5F9', text: '#475569', icon: XCircle },
  Overdue: { bg: '#FEE2E2', text: '#DC2626', icon: AlertCircle },
  Unpaid: { bg: '#FEE2E2', text: '#DC2626', icon: AlertCircle },
  Unavailable: { bg: '#FEE2E2', text: '#DC2626', icon: XCircle },
};

export default function StatusBadge({ status }) {
  const config = STATUS_MAP[status] || {
    bg: '#F1F5F9',
    text: '#475569',
    icon: Info,
  };
  const Icon = config.icon;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold whitespace-nowrap shrink-0"
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      <Icon size={13} strokeWidth={2.2} aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
}
