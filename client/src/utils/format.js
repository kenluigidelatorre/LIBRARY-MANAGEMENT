export const money = (value) => new Intl.NumberFormat("en-PH", {
  style: "currency", currency: "PHP", maximumFractionDigits: 2
}).format(Number(value || 0));

export const date = (value) => {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString("en-PH", {
    year: "numeric", month: "short", day: "numeric"
  });
};

export const titleCase = (value = "") =>
  String(value).toLowerCase().replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

export const errorText = (error) => error?.message || "Something went wrong.";