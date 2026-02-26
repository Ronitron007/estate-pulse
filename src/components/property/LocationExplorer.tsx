"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker, InfoWindow, useMap } from "@vis.gl/react-google-maps";
import {
  Train, GraduationCap, Heart, ShoppingBag, UtensilsCrossed,
  Dumbbell, Landmark, MapPin, Star, Home,
} from "lucide-react";

interface Place {
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number | null;
  distance_meters: number;
}

interface LocationExplorerProps {
  lat: number;
  lng: number;
  propertyName: string;
  className?: string;
}

const CATEGORIES = [
  { key: "transport", label: "Transport", icon: Train },
  { key: "education", label: "Education", icon: GraduationCap },
  { key: "healthcare", label: "Healthcare", icon: Heart },
  { key: "shopping", label: "Shopping", icon: ShoppingBag },
  { key: "food", label: "Food & Dining", icon: UtensilsCrossed },
  { key: "lifestyle", label: "Lifestyle", icon: Dumbbell },
  { key: "notable", label: "Notable", icon: Landmark },
] as const;

const CATEGORY_COLORS: Record<string, string> = {
  transport: "#3b82f6",
  education: "#8b5cf6",
  healthcare: "#ef4444",
  shopping: "#f59e0b",
  food: "#f97316",
  lifestyle: "#10b981",
  notable: "#ec4899",
};

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function MapContent({
  lat, lng, propertyName, places, activeCategory, selectedPlace, onSelectPlace,
}: {
  lat: number;
  lng: number;
  propertyName: string;
  places: Place[];
  activeCategory: string | null;
  selectedPlace: Place | null;
  onSelectPlace: (place: Place | null) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedPlace && map) {
      map.panTo({ lat: selectedPlace.lat, lng: selectedPlace.lng });
    }
  }, [selectedPlace, map]);

  const color = activeCategory ? CATEGORY_COLORS[activeCategory] || "#3b82f6" : "#3b82f6";

  return (
    <>
      {/* Property marker */}
      <AdvancedMarker position={{ lat, lng }} zIndex={10}>
        <div className="flex flex-col items-center">
          <div className="bg-foreground text-background text-xs font-semibold px-2 py-1 rounded-sm shadow-md whitespace-nowrap mb-1">
            {propertyName}
          </div>
          <div
            className="w-8 h-8 rounded-full border-[3px] border-white shadow-lg flex items-center justify-center"
            style={{ background: "#000" }}
          >
            <Home size={14} color="white" />
          </div>
        </div>
      </AdvancedMarker>

      {/* POI markers */}
      {places.map((place, i) => (
        <AdvancedMarker
          key={`${place.name}-${i}`}
          position={{ lat: place.lat, lng: place.lng }}
          onClick={() => onSelectPlace(place)}
        >
          <div
            className="w-7 h-7 rounded-full border-2 border-white shadow-md flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
            style={{ background: color }}
          >
            {activeCategory && (() => {
              const cat = CATEGORIES.find(c => c.key === activeCategory);
              if (!cat) return null;
              const Icon = cat.icon;
              return <Icon size={14} color="white" />;
            })()}
          </div>
        </AdvancedMarker>
      ))}

      {/* Info window */}
      {selectedPlace && (
        <InfoWindow
          position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
          onCloseClick={() => onSelectPlace(null)}
          pixelOffset={[0, -35]}
        >
          <div className="p-1 max-w-[200px]">
            <p className="font-semibold text-sm">{selectedPlace.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{selectedPlace.address}</p>
            <div className="flex items-center gap-2 mt-1 text-xs">
              <span className="font-medium">{formatDistance(selectedPlace.distance_meters)}</span>
              {selectedPlace.rating && (
                <span className="flex items-center gap-0.5">
                  <Star size={10} className="fill-yellow-400 text-yellow-400" />
                  {selectedPlace.rating}
                </span>
              )}
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export function LocationExplorer({ lat, lng, propertyName, className }: LocationExplorerProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [placesCache, setPlacesCache] = useState<Record<string, Place[]>>({});
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  const fetchPlaces = useCallback(async (category: string) => {
    if (placesCache[category]) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/nearby-places?lat=${lat}&lng=${lng}&category=${category}`
      );
      const data = await res.json();
      setPlacesCache(prev => ({ ...prev, [category]: data.places || [] }));
    } catch {
      setPlacesCache(prev => ({ ...prev, [category]: [] }));
    } finally {
      setLoading(false);
    }
  }, [lat, lng, placesCache]);

  const handleChipClick = useCallback((category: string) => {
    setSelectedPlace(null);
    if (activeCategory === category) {
      setActiveCategory(null);
      return;
    }
    setActiveCategory(category);
    fetchPlaces(category);
  }, [activeCategory, fetchPlaces]);

  const handleSelectPlace = useCallback((place: Place | null) => {
    setSelectedPlace(place);
    if (place && listRef.current) {
      const idx = (activeCategory ? placesCache[activeCategory] || [] : []).findIndex(
        p => p.name === place.name && p.lat === place.lat
      );
      const el = listRef.current.children[idx];
      el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [activeCategory, placesCache]);

  if (!apiKey) {
    return (
      <div className={`flex items-center justify-center bg-muted rounded-sm ${className}`}>
        <p className="text-muted-foreground text-sm">Map unavailable</p>
      </div>
    );
  }

  const places = activeCategory ? placesCache[activeCategory] || [] : [];

  return (
    <div className={className}>
      {/* Category chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => handleChipClick(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-sm border transition-colors ${
              activeCategory === key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-foreground/30"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Map + Side panel */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Map */}
        <div className={`${activeCategory ? "lg:w-2/3" : "w-full"} h-[400px] rounded-sm overflow-hidden transition-all`}>
          <APIProvider apiKey={apiKey}>
            <Map
              defaultCenter={{ lat, lng }}
              defaultZoom={14}
              mapId="location-explorer"
              gestureHandling="cooperative"
              disableDefaultUI={false}
              zoomControl={true}
              streetViewControl={false}
              mapTypeControl={false}
              fullscreenControl={true}
              className="w-full h-full"
            >
              <MapContent
                lat={lat}
                lng={lng}
                propertyName={propertyName}
                places={places}
                activeCategory={activeCategory}
                selectedPlace={selectedPlace}
                onSelectPlace={handleSelectPlace}
              />
            </Map>
          </APIProvider>
        </div>

        {/* Side panel */}
        {activeCategory && (
          <div className="lg:w-1/3 lg:h-[400px] lg:overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : places.length === 0 ? (
              <p className="text-sm text-muted-foreground p-4">No places found nearby.</p>
            ) : (
              <div ref={listRef} className="space-y-1">
                {places.map((place, i) => {
                  const isSelected = selectedPlace?.name === place.name && selectedPlace?.lat === place.lat;
                  const catConfig = CATEGORIES.find(c => c.key === activeCategory);
                  const Icon = catConfig?.icon || MapPin;

                  return (
                    <button
                      key={`${place.name}-${i}`}
                      type="button"
                      onClick={() => handleSelectPlace(place)}
                      className={`w-full text-left px-3 py-3 rounded-sm transition-colors flex items-start gap-3 ${
                        isSelected
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-muted border border-transparent"
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: CATEGORY_COLORS[activeCategory] + "20" }}
                      >
                        <Icon
                          size={14}
                          style={{ color: CATEGORY_COLORS[activeCategory] }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{place.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{place.address}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-medium text-muted-foreground">
                            {formatDistance(place.distance_meters)}
                          </span>
                          {place.rating && (
                            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                              <Star size={10} className="fill-yellow-400 text-yellow-400" />
                              {place.rating}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
