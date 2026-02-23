import { formatPriceRange } from "@/lib/format";

interface PriceDisplayProps {
  priceMin: number | null;
  priceMax: number | null;
  priceOnRequest: boolean;
}

export function PriceDisplay({
  priceMin,
  priceMax,
  priceOnRequest,
}: PriceDisplayProps) {
  return (
    <span className="text-lg font-semibold text-foreground">
      {formatPriceRange(priceMin, priceMax, priceOnRequest)}
    </span>
  );
}
