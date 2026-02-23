"use client";

import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { MapMarker } from "./MapMarker";
import type { PropertyType } from "@/types/database";

interface LocationMapProps {
  lat: number;
  lng: number;
  propertyType?: PropertyType | null;
  zoom?: number;
  className?: string;
}

export function LocationMap({ lat, lng, propertyType, zoom = 15, className }: LocationMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  if (!apiKey) {
    return (
      <div className={`flex items-center justify-center bg-muted rounded-sm ${className}`}>
        <p className="text-muted-foreground text-sm">Map unavailable</p>
      </div>
    );
  }

  const position = { lat, lng };

  // Create a minimal project object for MapMarker
  const markerProject = {
    id: "location-marker",
    location: position,
    property_type: propertyType ?? null,
  };

  return (
    <div className={className}>
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={position}
          defaultZoom={zoom}
          mapId="map-dark"
          gestureHandling="cooperative"
          disableDefaultUI={false}
          zoomControl={true}
          streetViewControl={false}
          mapTypeControl={false}
          fullscreenControl={true}
          className="w-full h-full rounded-sm"
        >
          <MapMarker project={markerProject} />
        </Map>
      </APIProvider>
    </div>
  );
}
