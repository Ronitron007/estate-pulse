"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProjectSpecification, Icon } from "@/types/database";

interface SpecificationsEditorProps {
  specifications: ProjectSpecification[];
  icons: Icon[];
  onChange: (specs: ProjectSpecification[]) => void;
}

export function SpecificationsEditor({ specifications, icons, onChange }: SpecificationsEditorProps) {
  const addSpec = () => {
    onChange([...specifications, { label: "", value: "", icon_id: null, icon_name: null }]);
  };

  const updateSpec = (index: number, field: keyof ProjectSpecification, value: string | null) => {
    const updated = [...specifications];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const setIcon = (index: number, iconId: string) => {
    const icon = icons.find((i) => i.id === iconId);
    const updated = [...specifications];
    updated[index] = {
      ...updated[index],
      icon_id: iconId || null,
      icon_name: icon?.lucide_name || null,
    };
    onChange(updated);
  };

  const removeSpec = (index: number) => {
    const updated = [...specifications];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {specifications.map((spec, i) => (
        <div key={i} className="p-4 border rounded-lg space-y-4 relative">
          <button
            type="button"
            onClick={() => removeSpec(i)}
            className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-red-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                value={spec.label}
                onChange={(e) => updateSpec(i, "label", e.target.value)}
                placeholder="e.g., Flooring"
              />
            </div>

            <div className="space-y-2">
              <Label>Value</Label>
              <Input
                value={spec.value}
                onChange={(e) => updateSpec(i, "value", e.target.value)}
                placeholder="e.g., Premium Vitrified Tiles"
              />
            </div>

            <div className="space-y-2">
              <Label>Icon</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={spec.icon_id || ""}
                onChange={(e) => setIcon(i, e.target.value)}
              >
                <option value="">No icon</option>
                {icons.map((icon) => (
                  <option key={icon.id} value={icon.id}>
                    {icon.name} ({icon.lucide_name})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addSpec}>
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Specification
      </Button>
    </div>
  );
}
