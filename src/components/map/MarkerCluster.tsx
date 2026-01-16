"use client";

import { useEffect, useRef, useCallback } from "react";
import { useMap, AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { useState } from "react";
import Link from "next/link";
import type { Project } from "@/types/database";
import { formatPriceRange } from "@/lib/format";

interface MarkerClusterProps {
  projects: Pick<Project, "id" | "slug" | "name" | "location" | "price_min" | "price_max" | "property_type">[];
}

export function MarkerCluster({ projects }: MarkerClusterProps) {
  const map = useMap();
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  // Filter projects with valid locations
  const projectsWithLocation = projects.filter(
    (p) => p.location && p.location.lat && p.location.lng
  );

  const handleMarkerClick = useCallback((project: typeof projects[0]) => {
    setSelectedProject(project);
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedProject(null);
  }, []);

  return (
    <>
      {projectsWithLocation.map((project) => (
        <AdvancedMarker
          key={project.id}
          position={{ lat: project.location!.lat, lng: project.location!.lng }}
          onClick={() => handleMarkerClick(project)}
        >
          <Pin
            background="#3b82f6"
            borderColor="#1d4ed8"
            glyphColor="#ffffff"
          />
        </AdvancedMarker>
      ))}

      {selectedProject && selectedProject.location && (
        <InfoWindow
          position={{ lat: selectedProject.location.lat, lng: selectedProject.location.lng }}
          onCloseClick={handleInfoWindowClose}
        >
          <div className="p-2 min-w-[200px]">
            <h3 className="font-semibold text-sm">{selectedProject.name}</h3>
            {selectedProject.property_type && (
              <p className="text-xs text-gray-500 capitalize">{selectedProject.property_type}</p>
            )}
            <p className="text-sm font-medium text-blue-600 mt-1">
              {formatPriceRange(selectedProject.price_min, selectedProject.price_max, false)}
            </p>
            <Link
              href={`/properties/${selectedProject.slug}`}
              className="text-xs text-blue-600 hover:underline mt-2 block"
            >
              View details
            </Link>
          </div>
        </InfoWindow>
      )}
    </>
  );
}
