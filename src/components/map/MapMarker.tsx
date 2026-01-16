"use client";

import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import type { Project } from "@/types/database";

interface MapMarkerProps {
  project: Pick<Project, "id" | "location" | "property_type">;
  onClick?: () => void;
}

const typeColors: Record<string, string> = {
  apartment: "#3b82f6", // blue
  villa: "#10b981", // green
  plot: "#f59e0b", // amber
  commercial: "#8b5cf6", // purple
  penthouse: "#ec4899", // pink
};

export function MapMarker({ project, onClick }: MapMarkerProps) {
  if (!project.location) return null;

  const color = project.property_type ? typeColors[project.property_type] : "#3b82f6";

  return (
    <AdvancedMarker
      position={{ lat: project.location.lat, lng: project.location.lng }}
      onClick={onClick}
    >
      <Pin
        background={color}
        borderColor={color}
        glyphColor="#ffffff"
      />
    </AdvancedMarker>
  );
}
