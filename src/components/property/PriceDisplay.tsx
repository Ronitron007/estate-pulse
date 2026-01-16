import { createClient } from "@/lib/supabase/server";
import { formatPriceRange } from "@/lib/format";
import { Lock } from "lucide-react";

interface PriceDisplayProps {
  priceMin: number | null;
  priceMax: number | null;
  priceOnRequest: boolean;
}

export async function PriceDisplay({
  priceMin,
  priceMax,
  priceOnRequest,
}: PriceDisplayProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold text-blue-600">
          Login to see price
        </span>
        <Lock className="w-4 h-4 text-blue-600" />
      </div>
    );
  }

  return (
    <span className="text-lg font-semibold text-gray-900">
      {formatPriceRange(priceMin, priceMax, priceOnRequest)}
    </span>
  );
}
