"use client";

import { PropertyCard, PropertyCardSkeleton } from "./PropertyCard";
import { Home, Search } from "lucide-react";
import type { Project } from "@/types/database";

interface PropertyGridProps {
  projects: Project[];
  isLoading?: boolean;
}

export function PropertyGrid({ projects, isLoading = false }: PropertyGridProps) {
  if (isLoading) {
    return (
      <div className="divide-y divide-border border-t border-border">
        {Array.from({ length: 4 }).map((_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-20">
        <Home className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-foreground text-lg font-medium mb-2">No properties found</p>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Try adjusting your filters or search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-border">
      {projects.map((project) => (
        <PropertyCard key={project.id} project={project} />
      ))}
    </div>
  );
}
