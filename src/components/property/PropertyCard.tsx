"use client";

import Link from "next/link";
import { useState } from "react";
import { MapPin, Building2, Calendar, Home, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatPriceRange, formatDate } from "@/lib/format";
import type { Project } from "@/types/database";

interface PropertyCardProps {
  project: Project;
  showPrice?: boolean;
  index?: number; // For staggered animations
}

export function PropertyCard({ project, showPrice = false, index = 0 }: PropertyCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);

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

  const statusColors = {
    upcoming: "bg-blue-100 text-blue-800",
    ongoing: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-800",
  };

  // Stagger delay based on index
  const staggerDelay = Math.min(index * 0.05, 0.4);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    setIsHeartAnimating(true);
    setTimeout(() => setIsHeartAnimating(false), 600);
  };

  return (
    <Link href={`/properties/${project.slug}`}>
      <Card
        className="overflow-hidden cursor-pointer h-full group opacity-0 animate-bounce-in"
        style={{ animationDelay: `${staggerDelay}s` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image with hover zoom */}
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          {primaryImage ? (
            <img
              src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_600,h_450,c_fill,f_auto,q_auto/${primaryImage.cloudinary_public_id}`}
              alt={primaryImage.alt_text || project.name}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Building2 className="w-12 h-12 animate-float" />
            </div>
          )}

          {/* Gradient overlay on hover */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />

          {/* Status badge with subtle pulse for upcoming */}
          <span
            className={`absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded transition-transform duration-200 ${
              statusColors[project.status]
            } ${project.status === "upcoming" ? "badge-pulse" : ""} ${
              isHovered ? "scale-105" : ""
            }`}
          >
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>

          {/* Property type badge */}
          {project.property_type && (
            <span className="absolute top-3 right-12 px-2 py-1 text-xs font-medium rounded bg-white/90 text-gray-700 backdrop-blur-sm transition-transform duration-200 group-hover:scale-105">
              {project.property_type.charAt(0).toUpperCase() + project.property_type.slice(1)}
            </span>
          )}

          {/* Favorite heart button */}
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-110 active:scale-95 ${
              isHeartAnimating ? "animate-heart-beat" : ""
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-colors duration-200 ${
                isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </button>
        </div>

        <CardContent className="p-4">
          {/* Price with subtle entrance animation */}
          <div className="mb-2">
            {showPrice ? (
              <p className="text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover:text-blue-600">
                {formatPriceRange(project.price_min, project.price_max, project.price_on_request)}
              </p>
            ) : (
              <p className="text-lg font-semibold text-blue-600 group-hover:text-blue-700 transition-colors duration-200">
                Login to see price
              </p>
            )}
          </div>

          {/* Name with hover underline effect */}
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
            {project.name}
          </h3>

          {/* Builder */}
          {project.builder && (
            <p className="text-sm text-gray-500 mb-2 transition-colors duration-200 group-hover:text-gray-600">
              by {project.builder.name}
            </p>
          )}

          {/* Location with icon bounce */}
          <div className="flex items-center text-sm text-gray-600 mb-2 transition-colors duration-200 group-hover:text-gray-700">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
            <span className="line-clamp-1">
              {project.locality ? `${project.locality}, ` : ""}
              {project.city}
            </span>
          </div>

          {/* Details row with staggered icon animations */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {bedroomText && (
              <div className="flex items-center transition-transform duration-300 group-hover:translate-x-0.5">
                <Home className="w-4 h-4 mr-1 transition-transform duration-300 group-hover:scale-110" />
                {bedroomText}
              </div>
            )}
            {project.possession_date && (
              <div className="flex items-center transition-transform duration-300 delay-75 group-hover:translate-x-0.5">
                <Calendar className="w-4 h-4 mr-1 transition-transform duration-300 delay-75 group-hover:scale-110" />
                {formatDate(project.possession_date)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Skeleton loader for PropertyCard with shimmer effect
export function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-6 w-1/3 skeleton" />
        <div className="h-5 w-2/3 skeleton" />
        <div className="h-4 w-1/2 skeleton" />
        <div className="h-4 w-3/4 skeleton" />
        <div className="flex gap-4">
          <div className="h-4 w-16 skeleton" />
          <div className="h-4 w-20 skeleton" />
        </div>
      </div>
    </div>
  );
}
