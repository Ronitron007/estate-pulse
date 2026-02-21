"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProjectHighlight, Icon } from "@/types/database";

interface HighlightsEditorProps {
  highlights: ProjectHighlight[];
  icons: Icon[];
  onChange: (highlights: ProjectHighlight[]) => void;
}

export function HighlightsEditor({ highlights, icons, onChange }: HighlightsEditorProps) {
  const addHighlight = () => {
    onChange([...highlights, { text: "", icon_id: null, icon_name: null }]);
  };

  const updateHighlight = (index: number, field: keyof ProjectHighlight, value: string | null) => {
    const updated = [...highlights];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const setIcon = (index: number, iconId: string) => {
    const icon = icons.find((i) => i.id === iconId);
    const updated = [...highlights];
    updated[index] = {
      ...updated[index],
      icon_id: iconId || null,
      icon_name: icon?.lucide_name || null,
    };
    onChange(updated);
  };

  const removeHighlight = (index: number) => {
    const updated = [...highlights];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {highlights.map((h, i) => (
        <div key={i} className="p-4 border rounded-lg space-y-4 relative">
          <button
            type="button"
            onClick={() => removeHighlight(i)}
            className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-red-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Highlight Text</Label>
              <Input
                value={h.text}
                onChange={(e) => updateHighlight(i, "text", e.target.value)}
                placeholder="e.g., 12 Ultra Luxury Sky-Villas"
              />
            </div>

            <div className="space-y-2">
              <Label>Icon</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={h.icon_id || ""}
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

      <Button type="button" variant="outline" onClick={addHighlight}>
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Highlight
      </Button>
    </div>
  );
}
