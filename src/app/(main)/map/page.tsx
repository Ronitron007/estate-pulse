import { Metadata } from "next";
import { Suspense } from "react";
import { getProjectsForMap, getCities } from "@/lib/queries/projects";
import { PropertyMap } from "@/components/map/PropertyMap";
import { MapListToggle } from "@/components/map/MapListToggle";

export const metadata: Metadata = {
  title: "Map View | Estate Pulse",
  description: "Explore properties on an interactive map",
};

// Tricity center (Chandigarh area)
const DEFAULT_CENTER = { lat: 30.7333, lng: 76.7794 };

async function MapContent() {
  const [projects, cities] = await Promise.all([
    getProjectsForMap(),
    getCities(),
  ]);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      <div className="p-4 bg-white border-b flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Map View</h1>
          <p className="text-sm text-gray-500">{projects.length} properties</p>
        </div>
        <MapListToggle currentView="map" />
      </div>
      <div className="flex-1">
        <PropertyMap projects={projects} center={DEFAULT_CENTER} />
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-gray-100">
          <p className="text-gray-500">Loading map...</p>
        </div>
      }
    >
      <MapContent />
    </Suspense>
  );
}
