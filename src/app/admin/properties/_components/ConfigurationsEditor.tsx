"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Configuration } from "@/types/database";

interface ConfigurationsEditorProps {
  configurations: Partial<Configuration>[];
  onChange: (configs: Partial<Configuration>[]) => void;
}

export function ConfigurationsEditor({ configurations, onChange }: ConfigurationsEditorProps) {
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
        price: null,
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
