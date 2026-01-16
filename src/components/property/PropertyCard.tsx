import Link from "next/link";
import { MapPin, Building2, Calendar, Home } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatPriceRange, formatDate } from "@/lib/format";
import type { Project } from "@/types/database";

interface PropertyCardProps {
  project: Project;
  showPrice?: boolean;
}

export function PropertyCard({ project, showPrice = false }: PropertyCardProps) {
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

  return (
    <Link href={`/properties/${project.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-100">
          {primaryImage ? (
            <img
              src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_600,h_450,c_fill,f_auto,q_auto/${primaryImage.cloudinary_public_id}`}
              alt={primaryImage.alt_text || project.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Building2 className="w-12 h-12" />
            </div>
          )}

          {/* Status badge */}
          <span
            className={`absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded ${statusColors[project.status]}`}
          >
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>

          {/* Property type badge */}
          {project.property_type && (
            <span className="absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded bg-white/90 text-gray-700">
              {project.property_type.charAt(0).toUpperCase() + project.property_type.slice(1)}
            </span>
          )}
        </div>

        <CardContent className="p-4">
          {/* Price */}
          <div className="mb-2">
            {showPrice ? (
              <p className="text-lg font-semibold text-gray-900">
                {formatPriceRange(project.price_min, project.price_max, project.price_on_request)}
              </p>
            ) : (
              <p className="text-lg font-semibold text-blue-600">Login to see price</p>
            )}
          </div>

          {/* Name */}
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{project.name}</h3>

          {/* Builder */}
          {project.builder && (
            <p className="text-sm text-gray-500 mb-2">by {project.builder.name}</p>
          )}

          {/* Location */}
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">
              {project.locality ? `${project.locality}, ` : ""}
              {project.city}
            </span>
          </div>

          {/* Details row */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {bedroomText && (
              <div className="flex items-center">
                <Home className="w-4 h-4 mr-1" />
                {bedroomText}
              </div>
            )}
            {project.possession_date && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(project.possession_date)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
