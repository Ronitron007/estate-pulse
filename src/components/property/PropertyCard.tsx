"use client";

import Link from "next/link";
import { MapPin, Building2, Calendar, Home } from "lucide-react";
import { formatPrice, formatPriceRange, formatDate } from "@/lib/format";
import { getImageUrl } from "@/lib/image-urls";
import type { Project } from "@/types/database";

interface PropertyCardProps {
  project: Project;
  index?: number;
}

export function PropertyCard({ project, index = 0 }: PropertyCardProps) {
  const primaryImage = project.images?.find((img) => img.is_primary) || project.images?.[0];
  const minBedrooms = project.configurations?.length
    ? Math.min(...project.configurations.filter((c) => c.bedrooms).map((c) => c.bedrooms!))
    : null;
  const maxBedrooms = project.configurations?.length
    ? Math.max(...project.configurations.filter((c) => c.bedrooms).map((c) => c.bedrooms!))
    : null;

  const bedroomText =
    minBedrooms && maxBedrooms
      ? minBedrooms === maxBedrooms
        ? `${minBedrooms} BHK`
        : `${minBedrooms}-${maxBedrooms} BHK`
      : null;

  const statusColors: Record<string, string> = {
    upcoming: "bg-blue-50 text-blue-700 border-blue-200",
    ongoing: "bg-green-50 text-green-700 border-green-200",
    completed: "bg-muted text-muted-foreground border-border",
  };

  return (
    <Link
      href={`/properties/${project.slug}`}
      className="group flex flex-col sm:flex-row border-b border-border transition-colors duration-200 hover:bg-muted/50"
    >
      {/* Image */}
      <div className="relative sm:w-[45%] h-56 sm:h-auto overflow-hidden bg-muted">
        {primaryImage ? (
          <img
            src={getImageUrl(primaryImage.image_path, "card")}
            alt={primaryImage.alt_text || project.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Building2 className="w-12 h-12" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="sm:w-[55%] p-5 sm:p-8 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded-sm border ${
              statusColors[project.status] || statusColors.ongoing
            }`}
          >
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
          {project.property_type && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-sm border border-border text-muted-foreground">
              {project.property_type.charAt(0).toUpperCase() + project.property_type.slice(1)}
            </span>
          )}
        </div>

        <h3 className="font-display text-xl font-semibold text-foreground mb-1 line-clamp-1">
          {project.name}
        </h3>

        {project.builder && (
          <p className="text-sm text-muted-foreground mb-2">by {project.builder.name}</p>
        )}

        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">
            {project.locality ? `${project.locality}, ` : ""}
            {project.city}
          </span>
        </div>

        <p className="text-2xl font-bold text-foreground mb-1">
          {formatPriceRange(project.price_min, project.price_max, project.price_on_request)}
        </p>
        {project.price_per_sqft && (
          <p className="text-xs text-muted-foreground mb-3">{formatPrice(project.price_per_sqft)}/sqft</p>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {bedroomText && (
            <div className="flex items-center">
              <Home className="w-3.5 h-3.5 mr-1" />
              {bedroomText}
            </div>
          )}
          {project.possession_date && (
            <div className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              {formatDate(project.possession_date)}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// Skeleton loader
export function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row border-b border-border">
      <div className="sm:w-[45%] h-56 sm:h-48 skeleton" />
      <div className="sm:w-[55%] p-5 sm:p-8 space-y-3">
        <div className="h-4 w-20 skeleton" />
        <div className="h-6 w-2/3 skeleton" />
        <div className="h-4 w-1/2 skeleton" />
        <div className="h-7 w-1/3 skeleton" />
        <div className="flex gap-4">
          <div className="h-4 w-16 skeleton" />
          <div className="h-4 w-20 skeleton" />
        </div>
      </div>
    </div>
  );
}
