import { Metadata } from "next";
import { Suspense } from "react";
import { getProjectsForMap } from "@/lib/queries/projects";
import { MapWithUserLocation } from "@/components/map/MapWithUserLocation";

export const metadata: Metadata = {
  title: "Map View | Estate Pulse",
  description: "Explore properties on an interactive map",
};

// Tricity center (Chandigarh area)
const DEFAULT_CENTER = { lat: 30.7333, lng: 76.7794 };

async function MapContent() {
  const projects = await getProjectsForMap();

  return (
    <MapWithUserLocation
      projects={projects}
      defaultCenter={DEFAULT_CENTER}
    />
  );
}

export default function MapPage() {
  return (
    <div className="pt-16 md:pt-20">
      <Suspense
        fallback={
          <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-gray-100">
            <p className="text-gray-500">Loading map...</p>
          </div>
        }
      >
        <MapContent />
      </Suspense>
    </div>
  );
}
