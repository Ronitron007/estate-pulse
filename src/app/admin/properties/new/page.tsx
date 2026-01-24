import { getUniqueCities, getAllBuilders, getAllAmenities } from "@/lib/queries/admin";
import { PropertyForm } from "../_components/PropertyForm";
import { createPropertyAction } from "../actions";

export default async function NewPropertyPage() {
  const [cities, builders, amenities] = await Promise.all([
    getUniqueCities(),
    getAllBuilders(),
    getAllAmenities(),
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
        onSubmit={createPropertyAction}
      />
    </div>
  );
}
