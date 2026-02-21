"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Configuration, Tower } from "@/types/database";

interface ConfigurationsEditorProps {
  configurations: Partial<Configuration>[];
  towers: Partial<Tower>[];
  onChange: (configs: Partial<Configuration>[]) => void;
}

export function ConfigurationsEditor({ configurations, towers, onChange }: ConfigurationsEditorProps) {
  const addConfig = () => {
    onChange([
      ...configurations,
      {
        id: `temp-${Date.now()}`,
        bedrooms: null,
        bathrooms: null,
        config_name: "",
        carpet_area_sqft: null,
        built_up_area_sqft: null,
        balcony_area_sqft: null,
        covered_area_sqft: null,
        super_area_sqft: null,
        price: null,
        tower_id: null,
        floor_from: null,
        floor_to: null,
        type_label: null,
      },
    ]);
  };

  const updateConfig = (index: number, field: keyof Configuration, value: any) => {
    const newConfigs = [...configurations];
    newConfigs[index] = { ...newConfigs[index], [field]: value };
    onChange(newConfigs);
  };

  const removeConfig = (index: number) => {
    const newConfigs = [...configurations];
    newConfigs.splice(index, 1);
    onChange(newConfigs);
  };

  return (
    <div className="space-y-4">
      {configurations.map((config, i) => (
        <div key={config.id || i} className="p-4 border rounded-lg space-y-4 relative">
          <button
            type="button"
            onClick={() => removeConfig(i)}
            className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-red-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Config Name</Label>
              <Input
                value={config.config_name || ""}
                onChange={(e) => updateConfig(i, "config_name", e.target.value)}
                placeholder="e.g., 2 BHK Compact"
              />
            </div>

            <div className="space-y-2">
              <Label>Type Label</Label>
              <Input
                value={config.type_label || ""}
                onChange={(e) => updateConfig(i, "type_label", e.target.value || null)}
                placeholder="Type A"
              />
            </div>

            <div className="space-y-2">
              <Label>Bedrooms</Label>
              <Input
                type="number"
                value={config.bedrooms ?? ""}
                onChange={(e) => updateConfig(i, "bedrooms", e.target.value ? Number(e.target.value) : null)}
                placeholder="2"
              />
            </div>

            <div className="space-y-2">
              <Label>Bathrooms</Label>
              <Input
                type="number"
                value={config.bathrooms ?? ""}
                onChange={(e) => updateConfig(i, "bathrooms", e.target.value ? Number(e.target.value) : null)}
                placeholder="2"
              />
            </div>

            {towers.length > 0 && (
              <div className="space-y-2">
                <Label>Tower</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={config.tower_id || ""}
                  onChange={(e) => updateConfig(i, "tower_id", e.target.value || null)}
                >
                  <option value="">No tower</option>
                  {towers.map((tower) => (
                    <option key={tower.id} value={tower.id}>
                      {tower.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Floor From</Label>
              <Input
                type="number"
                value={config.floor_from ?? ""}
                onChange={(e) => updateConfig(i, "floor_from", e.target.value ? Number(e.target.value) : null)}
                placeholder="1"
              />
            </div>

            <div className="space-y-2">
              <Label>Floor To</Label>
              <Input
                type="number"
                value={config.floor_to ?? ""}
                onChange={(e) => updateConfig(i, "floor_to", e.target.value ? Number(e.target.value) : null)}
                placeholder="25"
              />
            </div>

            <div className="space-y-2">
              <Label>Carpet Area (sqft)</Label>
              <Input
                type="number"
                value={config.carpet_area_sqft ?? ""}
                onChange={(e) => updateConfig(i, "carpet_area_sqft", e.target.value ? Number(e.target.value) : null)}
                placeholder="850"
              />
            </div>

            <div className="space-y-2">
              <Label>Built-up Area (sqft)</Label>
              <Input
                type="number"
                value={config.built_up_area_sqft ?? ""}
                onChange={(e) => updateConfig(i, "built_up_area_sqft", e.target.value ? Number(e.target.value) : null)}
                placeholder="1100"
              />
            </div>

            <div className="space-y-2">
              <Label>Balcony Area (sqft)</Label>
              <Input
                type="number"
                value={config.balcony_area_sqft ?? ""}
                onChange={(e) => updateConfig(i, "balcony_area_sqft", e.target.value ? Number(e.target.value) : null)}
                placeholder="100"
              />
            </div>

            <div className="space-y-2">
              <Label>Covered Area (sqft)</Label>
              <Input
                type="number"
                value={config.covered_area_sqft ?? ""}
                onChange={(e) => updateConfig(i, "covered_area_sqft", e.target.value ? Number(e.target.value) : null)}
                placeholder="950"
              />
            </div>

            <div className="space-y-2">
              <Label>Super Area (sqft)</Label>
              <Input
                type="number"
                value={config.super_area_sqft ?? ""}
                onChange={(e) => updateConfig(i, "super_area_sqft", e.target.value ? Number(e.target.value) : null)}
                placeholder="1400"
              />
            </div>

            <div className="space-y-2">
              <Label>Price (INR)</Label>
              <Input
                type="number"
                value={config.price ?? ""}
                onChange={(e) => updateConfig(i, "price", e.target.value ? Number(e.target.value) : null)}
                placeholder="5500000"
              />
            </div>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addConfig}>
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Configuration
      </Button>
    </div>
  );
}
