import { Suspense } from "react";
import { Metadata } from "next";
import { getProjects, getCities } from "@/lib/queries/projects";
import { MapListToggle } from "@/components/map/MapListToggle";
import { PropertiesClientView } from "@/components/property/PropertiesClientView";
import type { ProjectFilters, PropertyType, ProjectStatus } from "@/types/database";

export const metadata: Metadata = {
  title: "Properties | PerfectGhar.in",
  description: "Browse residential and commercial properties from top builders",
};

interface PageProps {
  searchParams: Promise<{
    city?: string;
    type?: string;
    status?: string;
    q?: string;
    sort?: string;
  }>;
}

async function PropertiesContent({ searchParams }: PageProps) {
  const params = await searchParams;

  const filters: ProjectFilters = {
    city: params.city,
    property_type: params.type as PropertyType,
    status: params.status as ProjectStatus,
    search: params.q,
    sort: params.sort as ProjectFilters["sort"],
  };

  const [projects, cities] = await Promise.all([
    getProjects(filters),
    getCities(),
  ]);

  return <PropertiesClientView projects={projects} cities={cities} />;
}

export default async function PropertiesPage(props: PageProps) {
  return (
    <div className="min-h-screen bg-background pt-16 md:pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">Properties</h1>
          <Suspense fallback={<div className="w-24 h-9 bg-muted rounded-sm animate-pulse" />}>
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
