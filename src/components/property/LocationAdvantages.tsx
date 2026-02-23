import { Plane, Building2, GraduationCap, Heart, ShoppingBag } from 'lucide-react';

const ICONS = {
  airportKm: { icon: Plane, label: 'Airport' },
  itParkKm: { icon: Building2, label: 'IT Park' },
  schoolsKm: { icon: GraduationCap, label: 'Schools' },
  hospitalsKm: { icon: Heart, label: 'Hospitals' },
  marketKm: { icon: ShoppingBag, label: 'Market' },
} as const;

type LocationAdvantagesData = Partial<Record<keyof typeof ICONS, number>>;

export function LocationAdvantages({ data }: { data: LocationAdvantagesData }) {
  const entries = Object.entries(ICONS).filter(([key]) => data[key as keyof typeof ICONS] != null);
  if (!entries.length) return null;

  return (
    <div className="py-6 border-b border-border">
      <h3 className="font-display text-lg font-semibold mb-4">Location Advantages</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {entries.map(([key, { icon: Icon, label }]) => (
          <div key={key} className="flex flex-col items-center gap-1 rounded-sm bg-muted p-3 text-center">
            <Icon className="h-5 w-5 text-primary" />
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-sm font-semibold">{data[key as keyof typeof ICONS]} km</span>
          </div>
        ))}
      </div>
    </div>
  );
}
