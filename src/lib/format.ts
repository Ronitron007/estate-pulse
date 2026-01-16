export function formatPrice(price: number | null): string {
  if (!price) return "";

  // Convert from paise/cents to rupees
  const amount = price / 100;

  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}K`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatPriceRange(min: number | null, max: number | null, onRequest: boolean): string {
  if (onRequest) return "Price on Request";
  if (!min && !max) return "Price on Request";
  if (min && max && min === max) return formatPrice(min);
  if (min && max) return `${formatPrice(min)} - ${formatPrice(max)}`;
  if (min) return `From ${formatPrice(min)}`;
  if (max) return `Up to ${formatPrice(max)}`;
  return "Price on Request";
}

export function formatArea(sqft: number | null): string {
  if (!sqft) return "";
  return `${sqft.toLocaleString("en-IN")} sq.ft`;
}

export function formatDate(date: string | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
