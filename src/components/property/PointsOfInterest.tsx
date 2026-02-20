"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import type { PointOfInterest } from "@/types/database";

interface PointsOfInterestProps {
  pois: PointOfInterest[];
}

const CATEGORY_LABELS: Record<string, string> = {
  transport: "Transport",
  education: "Education",
  healthcare: "Healthcare",
  shopping: "Shopping",
  food: "Food & Dining",
  lifestyle: "Lifestyle",
  notable: "Notable",
};

export function PointsOfInterest({ pois }: PointsOfInterestProps) {
  const categories = [...new Set(pois.map((p) => p.category))];
  const [active, setActive] = useState<string>(categories[0] || "");

  const filtered = active ? pois.filter((p) => p.category === active) : pois;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Nearby Places
        </CardTitle>
      </CardHeader>
      <CardContent>
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  active === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {CATEGORY_LABELS[cat] || cat}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-2">
          {filtered.map((poi, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
              <span className="text-gray-700">{poi.name}</span>
              <span className="text-sm font-medium text-gray-500">
                {poi.distance_value} {poi.distance_unit}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
