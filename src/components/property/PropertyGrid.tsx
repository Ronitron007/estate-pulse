"use client";

import { PropertyCard, PropertyCardSkeleton } from "./PropertyCard";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Home, Search } from "lucide-react";
import type { Project } from "@/types/database";

interface PropertyGridProps {
  projects: Project[];
  showPrice?: boolean;
  isLoading?: boolean;
}

export function PropertyGrid({ projects, showPrice = false, isLoading = false }: PropertyGridProps) {
  // Loading state with animated skeleton cards
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="opacity-0 animate-bounce-in"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <PropertyCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  // Empty state with friendly illustration and animation
  if (projects.length === 0) {
    return (
      <div className="text-center py-16 opacity-0 animate-bounce-in">
        <div className="relative inline-block mb-6">
          {/* Animated house icon */}
          <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 flex items-center justify-center animate-float">
            <Home className="w-12 h-12 text-gray-400" />
          </div>
          {/* Search icon orbiting */}
          <div className="absolute -right-2 top-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center animate-bounce">
            <Search className="w-5 h-5 text-blue-500" />
          </div>
        </div>
        <p className="text-gray-600 text-lg font-medium mb-2">No properties found</p>
        <p className="text-gray-400 max-w-sm mx-auto">
          Try adjusting your filters or search criteria. New properties are added daily!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => (
        <AnimateIn key={project.id} delay={index * 0.05}>
          <PropertyCard
            project={project}
            showPrice={showPrice}
            index={index}
          />
        </AnimateIn>
      ))}
    </div>
  );
}
