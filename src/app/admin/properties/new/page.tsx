import { getUniqueCities, getAllBuilders, getAllAmenities } from "@/lib/queries/admin";
import { getIcons } from "@/lib/queries/projects";
import { PropertyForm } from "../_components/PropertyForm";
import { createPropertyAction } from "../actions";

export default async function NewPropertyPage() {
  const [cities, builders, amenities, icons] = await Promise.all([
    getUniqueCities(),
    getAllBuilders(),
    getAllAmenities(),
    getIcons(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add Property</h1>
        <p className="text-muted-foreground">Create a new property listing</p>
      </div>
      <PropertyForm
        builders={builders}
        cities={cities}
        amenities={amenities}
        icons={icons}
        onSubmit={createPropertyAction}
      />
    </div>
  );
}
