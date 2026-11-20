export default function StatCard({
  icon: Icon,
  label,
  value,
  tone = 'green',
  subtext,
  onClick,
}) {
  const toneStyles = {
    green: {
      bg: 'bg-[#E7F6EE]',
      color: 'text-[#158F50]',
    },
    red: {
      bg: 'bg-[#FEE2E2]',
      color: 'text-[#DC2626]',
    },
    amber: {
      bg: 'bg-[#FEF3C7]',
      color: 'text-[#D97706]',
    },
    blue: {
      bg: 'bg-[#DBEAFE]',
      color: 'text-[#1D4ED8]',
    },
    slate: {
      bg: 'bg-[#F1F5F9]',
      color: 'text-[#475569]',
    },
  };

  const style = toneStyles[tone] || toneStyles.green;
  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`cmd-card p-5 text-left flex flex-col justify-between gap-3.5 transition-colors ${
        onClick ? 'hover:border-[#158F50]/45 hover:bg-[#FAFDFB] w-full' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${style.bg} ${style.color}`}>
          {Icon && <Icon size={19} strokeWidth={2.1} />}
        </div>
        {subtext && (
          <span className="text-[11.5px] font-medium text-[#6B7280] tabular-nums">
            {subtext}
          </span>
        )}
      </div>

      <div>
        <div className="text-[28px] font-bold leading-tight text-[#111827] tabular-nums font-[var(--font-display)]">
          {value}
        </div>
        <div className="text-[13px] font-medium text-[#6B7280] mt-1">{label}</div>
      </div>
    </Wrapper>
  );
}
