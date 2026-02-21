"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PointOfInterest } from "@/types/database";

interface POIsEditorProps {
  pois: PointOfInterest[];
  onChange: (pois: PointOfInterest[]) => void;
}

const CATEGORIES = ["transport", "education", "healthcare", "shopping", "food", "lifestyle", "notable"];

export function POIsEditor({ pois, onChange }: POIsEditorProps) {
  const addPOI = () => {
    onChange([...pois, { name: "", category: "notable", distance_value: 0, distance_unit: "km" }]);
  };

  const updatePOI = (index: number, field: keyof PointOfInterest, value: string | number) => {
    const updated = [...pois];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removePOI = (index: number) => {
    const updated = [...pois];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {pois.map((poi, i) => (
        <div key={i} className="p-4 border rounded-lg space-y-4 relative">
          <button
            type="button"
            onClick={() => removePOI(i)}
            className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-red-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="grid gap-4 sm:grid-cols-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={poi.name}
                onChange={(e) => updatePOI(i, "name", e.target.value)}
                placeholder="e.g., Elante Mall"
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={poi.category}
                onChange={(e) => updatePOI(i, "category", e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Distance</Label>
              <Input
                type="number"
                step="0.1"
                value={poi.distance_value}
                onChange={(e) => updatePOI(i, "distance_value", Number(e.target.value))}
                placeholder="5.5"
              />
            </div>

            <div className="space-y-2">
              <Label>Unit</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={poi.distance_unit}
                onChange={(e) => updatePOI(i, "distance_unit", e.target.value)}
              >
                <option value="km">km</option>
                <option value="min">min</option>
              </select>
            </div>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addPOI}>
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Point of Interest
      </Button>
    </div>
  );
}
