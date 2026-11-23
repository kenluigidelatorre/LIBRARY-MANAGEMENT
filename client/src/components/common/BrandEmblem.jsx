
export default function BrandEmblem({ size = 40 }) {
  return (
    <img
      src="/logo.png"
      alt="IDS Colleges Logo"
      width={size}
      height={size}
      className="shrink-0 object-contain"
    />
  );
}
