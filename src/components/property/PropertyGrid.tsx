"use client";

import { PropertyCard } from "./PropertyCard";
import type { Project } from "@/types/database";

interface PropertyGridProps {
  projects: Project[];
  showPrice?: boolean;
}

export function PropertyGrid({ projects, showPrice = false }: PropertyGridProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No properties found</p>
        <p className="text-gray-400 mt-2">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <PropertyCard key={project.id} project={project} showPrice={showPrice} />
      ))}
    </div>
  );
}
