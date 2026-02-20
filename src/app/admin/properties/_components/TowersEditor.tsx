"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Tower } from "@/types/database";

interface TowersEditorProps {
  towers: Partial<Tower>[];
  onChange: (towers: Partial<Tower>[]) => void;
}

export function TowersEditor({ towers, onChange }: TowersEditorProps) {
  const addTower = () => {
    onChange([
      ...towers,
      {
        id: `temp-${Date.now()}`,
        name: "",
        floor_from: null,
        floor_to: null,
        units_per_floor: null,
        lifts_count: null,
        lift_type: null,
        staircase_info: null,
      },
    ]);
  };

  const updateTower = (index: number, field: keyof Tower, value: any) => {
    const updated = [...towers];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeTower = (index: number) => {
    const updated = [...towers];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {towers.map((tower, i) => (
        <div key={tower.id || i} className="p-4 border rounded-lg space-y-4 relative">
          <button
            type="button"
            onClick={() => removeTower(i)}
            className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-red-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Tower Name</Label>
              <Input
                value={tower.name || ""}
                onChange={(e) => updateTower(i, "name", e.target.value)}
                placeholder="e.g., Tower A"
              />
            </div>

            <div className="space-y-2">
              <Label>Floor From</Label>
              <Input
                type="number"
                value={tower.floor_from ?? ""}
                onChange={(e) => updateTower(i, "floor_from", e.target.value ? Number(e.target.value) : null)}
                placeholder="1"
              />
            </div>

            <div className="space-y-2">
              <Label>Floor To</Label>
              <Input
                type="number"
                value={tower.floor_to ?? ""}
                onChange={(e) => updateTower(i, "floor_to", e.target.value ? Number(e.target.value) : null)}
                placeholder="25"
              />
            </div>

            <div className="space-y-2">
              <Label>Units Per Floor</Label>
              <Input
                type="number"
                value={tower.units_per_floor ?? ""}
                onChange={(e) => updateTower(i, "units_per_floor", e.target.value ? Number(e.target.value) : null)}
                placeholder="4"
              />
            </div>

            <div className="space-y-2">
              <Label>Lifts Count</Label>
              <Input
                type="number"
                value={tower.lifts_count ?? ""}
                onChange={(e) => updateTower(i, "lifts_count", e.target.value ? Number(e.target.value) : null)}
                placeholder="2"
              />
            </div>

            <div className="space-y-2">
              <Label>Lift Type</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={tower.lift_type || ""}
                onChange={(e) => updateTower(i, "lift_type", e.target.value || null)}
              >
                <option value="">Select type</option>
                <option value="standard">Standard</option>
                <option value="high-speed">High Speed</option>
              </select>
            </div>

            <div className="space-y-2 sm:col-span-3">
              <Label>Staircase Info</Label>
              <Input
                value={tower.staircase_info || ""}
                onChange={(e) => updateTower(i, "staircase_info", e.target.value || null)}
                placeholder="e.g., Double staircase"
              />
            </div>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addTower}>
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Tower
      </Button>
    </div>
  );
}
