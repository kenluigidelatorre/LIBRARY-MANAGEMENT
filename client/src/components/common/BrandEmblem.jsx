export default function BrandEmblem({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="32" cy="32" r="30" fill="#169C53" stroke="#D1FAE5" strokeWidth="2.5" />
      <circle cx="32" cy="32" r="24" fill="#0D5E32" stroke="#86EFAC" strokeWidth="1.2" strokeDasharray="3 2" />
      {/* Open Book & Laurel Crest */}
      <path
        d="M19 23.5C19 22.4 19.9 21.5 21 21.5C24.5 21.5 28.6 22.6 31.5 24.5V41.5C28.6 39.8 24.5 38.8 21 38.8C19.9 38.8 19 37.9 19 36.8V23.5Z"
        fill="#FFFFFF"
      />
      <path
        d="M45 23.5C45 22.4 44.1 21.5 43 21.5C39.5 21.5 35.4 22.6 32.5 24.5V41.5C35.4 39.8 39.5 38.8 43 38.8C44.1 38.8 45 37.9 45 36.8V23.5Z"
        fill="#ECFDF5"
      />
      <path d="M23 27.5H28.5M23 31.5H28.5M35.5 27.5H41M35.5 31.5H41" stroke="#15803D" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="32" cy="15.5" r="2.2" fill="#FEF08A" />
    </svg>
  );
}
