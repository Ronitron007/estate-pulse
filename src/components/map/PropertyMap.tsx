"use client";

import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { MarkerCluster } from "./MarkerCluster";
import type { Project } from "@/types/database";

interface PropertyMapProps {
  projects: Pick<Project, "id" | "slug" | "name" | "location" | "price_min" | "price_max" | "property_type">[];
  center: { lat: number; lng: number };
  zoom?: number;
}

export function PropertyMap({ projects, center, zoom = 12 }: PropertyMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Google Maps API key not configured</p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        defaultCenter={center}
        defaultZoom={zoom}
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID}
        gestureHandling="greedy"
        disableDefaultUI={false}
        className="w-full h-full"
      >
        <MarkerCluster projects={projects} />
      </Map>
    </APIProvider>
  );
}
