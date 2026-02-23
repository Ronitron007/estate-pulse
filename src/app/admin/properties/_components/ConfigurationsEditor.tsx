"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Configuration, ConfigTower, Tower } from "@/types/database";

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
        type_label: null,
        towers: [],
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

  const addTower = (configIndex: number) => {
    const config = configurations[configIndex];
    const currentTowers: ConfigTower[] = (config.towers as ConfigTower[]) || [];
    updateConfig(configIndex, "towers", [
      ...currentTowers,
      { name: "", floor_from: null, floor_to: null },
    ]);
  };

  const updateTower = (configIndex: number, towerIndex: number, field: keyof ConfigTower, value: any) => {
    const config = configurations[configIndex];
    const currentTowers: ConfigTower[] = [...((config.towers as ConfigTower[]) || [])];
    currentTowers[towerIndex] = { ...currentTowers[towerIndex], [field]: value };
    updateConfig(configIndex, "towers", currentTowers);
  };

  const removeTower = (configIndex: number, towerIndex: number) => {
    const config = configurations[configIndex];
    const currentTowers: ConfigTower[] = [...((config.towers as ConfigTower[]) || [])];
    currentTowers.splice(towerIndex, 1);
    updateConfig(configIndex, "towers", currentTowers);
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

          {/* Towers sub-editor */}
          <div className="space-y-2 pt-2 border-t">
            <Label className="text-sm font-medium">Towers</Label>
            {((config.towers as ConfigTower[]) || []).map((ct, ti) => (
              <div key={ti} className="flex items-center gap-2">
                {towers.length > 0 ? (
                  <select
                    className="flex h-9 w-40 rounded-md border border-input bg-background px-2 py-1 text-sm"
                    value={ct.name || ""}
                    onChange={(e) => updateTower(i, ti, "name", e.target.value)}
                  >
                    <option value="">Select tower</option>
                    {towers.map((t) => (
                      <option key={t.id || t.name} value={t.name || ""}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    className="h-9 w-40"
                    value={ct.name || ""}
                    onChange={(e) => updateTower(i, ti, "name", e.target.value)}
                    placeholder="Tower name"
                  />
                )}
                <Input
                  className="h-9 w-20"
                  type="number"
                  value={ct.floor_from ?? ""}
                  onChange={(e) => updateTower(i, ti, "floor_from", e.target.value ? Number(e.target.value) : null)}
                  placeholder="Fl from"
                />
                <span className="text-muted-foreground">–</span>
                <Input
                  className="h-9 w-20"
                  type="number"
                  value={ct.floor_to ?? ""}
                  onChange={(e) => updateTower(i, ti, "floor_to", e.target.value ? Number(e.target.value) : null)}
                  placeholder="Fl to"
                />
                <button
                  type="button"
                  onClick={() => removeTower(i, ti)}
                  className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addTower(i)}
              className="text-sm text-primary hover:underline"
            >
              + Add Tower
            </button>
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
