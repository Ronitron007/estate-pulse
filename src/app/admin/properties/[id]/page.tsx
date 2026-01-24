import { notFound } from "next/navigation";
import { getProjectById, getUniqueCities, getAllBuilders, getAllAmenities } from "@/lib/queries/admin";
import { PropertyForm } from "../_components/PropertyForm";
import { projectToFormData } from "../_components/property-schema";
import { updatePropertyAction, deletePropertyAction } from "../actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: Props) {
  const { id } = await params;

  const [project, cities, builders, amenities] = await Promise.all([
    getProjectById(id),
    getUniqueCities(),
    getAllBuilders(),
    getAllAmenities(),
  ]);

  if (!project) notFound();

  const handleSubmit = async (data: any) => {
    "use server";
    return updatePropertyAction(id, data);
  };

  const handleDelete = async () => {
    "use server";
    return deletePropertyAction(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Property</h1>
        <p className="text-muted-foreground">Update {project.name}</p>
      </div>
      <PropertyForm
        initialData={projectToFormData(project)}
        projectId={id}
        builders={builders}
        cities={cities}
        amenities={amenities}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </div>
  );
}
