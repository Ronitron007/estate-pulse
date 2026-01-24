"use client";

import { useMemo } from "react";
import type { Amenity } from "@/types/database";

interface AmenitiesSelectorProps {
  allAmenities: { id: string; name: string; category: string | null }[];
  selected: string[];
  onChange: (ids: string[]) => void;
}

export function AmenitiesSelector({ allAmenities, selected, onChange }: AmenitiesSelectorProps) {
  // Group amenities by category
  const grouped = useMemo(() => {
    const groups: Record<string, typeof allAmenities> = {};
    allAmenities.forEach((a) => {
      const cat = a.category || "Other";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(a);
    });
    return groups;
  }, [allAmenities]);

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const toggleCategory = (category: string) => {
    const categoryIds = grouped[category].map((a) => a.id);
    const allSelected = categoryIds.every((id) => selected.includes(id));

    if (allSelected) {
      onChange(selected.filter((id) => !categoryIds.includes(id)));
    } else {
      const newSelected = new Set([...selected, ...categoryIds]);
      onChange(Array.from(newSelected));
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, amenities]) => {
        const categoryIds = amenities.map((a) => a.id);
        const selectedCount = categoryIds.filter((id) => selected.includes(id)).length;
        const allSelected = selectedCount === categoryIds.length;

        return (
          <div key={category} className="space-y-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleCategory(category)}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  allSelected ? "bg-primary border-primary" : selectedCount > 0 ? "bg-primary/50 border-primary" : "border-muted-foreground/50"
                }`}
              >
                {(allSelected || selectedCount > 0) && (
                  <svg className="w-3 h-3 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span className="font-medium text-sm">{category}</span>
              <span className="text-xs text-muted-foreground">({selectedCount}/{categoryIds.length})</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pl-6">
              {amenities.map((amenity) => (
                <label
                  key={amenity.id}
                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                    selected.includes(amenity.id)
                      ? "border-primary bg-primary/5"
                      : "border-transparent hover:bg-muted/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(amenity.id)}
                    onChange={() => toggle(amenity.id)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      selected.includes(amenity.id) ? "bg-primary border-primary" : "border-muted-foreground/50"
                    }`}
                  >
                    {selected.includes(amenity.id) && (
                      <svg className="w-3 h-3 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm">{amenity.name}</span>
                </label>
              ))}
            </div>
          </div>
        );
      })}

      {allAmenities.length === 0 && (
        <p className="text-sm text-muted-foreground">No amenities available</p>
      )}
    </div>
  );
}
