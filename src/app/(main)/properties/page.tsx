import { Suspense } from "react";
import { Metadata } from "next";
import { getProjects, getCities } from "@/lib/queries/projects";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { MapListToggle } from "@/components/map/MapListToggle";
import { createClient } from "@/lib/supabase/server";
import type { ProjectFilters, PropertyType, ProjectStatus } from "@/types/database";

export const metadata: Metadata = {
  title: "Properties | Estate Pulse",
  description: "Browse residential and commercial properties from top builders",
};

interface PageProps {
  searchParams: Promise<{
    city?: string;
    type?: string;
    status?: string;
    q?: string;
  }>;
}

async function PropertiesContent({ searchParams }: PageProps) {
  const params = await searchParams;

  const filters: ProjectFilters = {
    city: params.city,
    property_type: params.type as PropertyType,
    status: params.status as ProjectStatus,
    search: params.q,
  };

  const [projects, cities] = await Promise.all([
    getProjects(filters),
    getCities(),
  ]);

  // Check if user is logged in
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <PropertyFilters cities={cities} />
      <p className="text-sm text-gray-500 mb-4">{projects.length} properties found</p>
      <PropertyGrid projects={projects} showPrice={!!user} />
    </>
  );
}

export default async function PropertiesPage(props: PageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <Suspense fallback={<div className="w-24 h-9 bg-gray-100 rounded-lg animate-pulse" />}>
            <MapListToggle currentView="list" />
          </Suspense>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <PropertiesContent searchParams={props.searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
