"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProjectParking } from "@/types/database";

interface ParkingEditorProps {
  parking: ProjectParking | null;
  onChange: (parking: ProjectParking | null) => void;
}

const PARKING_TYPES = ["stilt", "basement", "open", "covered", "multi-level"];

export function ParkingEditor({ parking, onChange }: ParkingEditorProps) {
  const data: ProjectParking = parking || { types: [], basement_levels: null, guest_parking: false, allotment: null };

  const update = (partial: Partial<ProjectParking>) => {
    onChange({ ...data, ...partial });
  };

  const toggleType = (type: string) => {
    const types = data.types.includes(type)
      ? data.types.filter((t) => t !== type)
      : [...data.types, type];
    update({ types });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Parking Types</Label>
        <div className="flex flex-wrap gap-2">
          {PARKING_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.types.includes(type)}
                onChange={() => toggleType(type)}
                className="rounded border-gray-300"
              />
              <span className="text-sm capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Basement Levels</Label>
          <Input
            type="number"
            value={data.basement_levels ?? ""}
            onChange={(e) => update({ basement_levels: e.target.value ? Number(e.target.value) : null })}
            placeholder="2"
          />
        </div>

        <div className="space-y-2">
          <Label>Guest Parking</Label>
          <label className="flex items-center gap-2 h-10 cursor-pointer">
            <input
              type="checkbox"
              checked={data.guest_parking}
              onChange={(e) => update({ guest_parking: e.target.checked })}
              className="rounded border-gray-300"
            />
            <span className="text-sm">Available</span>
          </label>
        </div>

        <div className="space-y-2">
          <Label>Per Unit Allotment</Label>
          <Input
            value={data.allotment || ""}
            onChange={(e) => update({ allotment: e.target.value || null })}
            placeholder="1 covered + 1 open per unit"
          />
        </div>
      </div>
    </div>
  );
}
