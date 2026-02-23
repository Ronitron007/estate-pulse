"use client";

import { useEffect, useState, useCallback } from "react";
import { PropertyMap } from "./PropertyMap";
import { LocateMeButton } from "./LocateMeButton";
import { MapListToggle } from "./MapListToggle";
import { useSettings } from "@/components/settings/useSettings";
import type { Project } from "@/types/database";

interface MapWithUserLocationProps {
  projects: Pick<Project, "id" | "slug" | "name" | "location" | "price_min" | "price_max" | "property_type">[];
  defaultCenter: { lat: number; lng: number };
}

export function MapWithUserLocation({ projects, defaultCenter }: MapWithUserLocationProps) {
  const { settings, updateSetting } = useSettings();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        // On error, turn off the setting
        updateSetting("showMyLocation", false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [updateSetting]);

  // Auto-request location if setting is enabled
  useEffect(() => {
    if (settings.showMyLocation && !userLocation) {
      requestLocation();
    }
  }, [settings.showMyLocation, userLocation, requestLocation]);

  const handleToggle = (enabled: boolean) => {
    updateSetting("showMyLocation", enabled);
    if (enabled) {
      requestLocation();
    } else {
      setUserLocation(null);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      <div className="p-4 bg-white border-b flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">Map View</h1>
          <p className="text-sm text-muted-foreground">{projects.length} properties</p>
        </div>
        <div className="flex items-center gap-4">
          <LocateMeButton
            enabled={settings.showMyLocation}
            onToggle={handleToggle}
          />
          <MapListToggle currentView="map" />
        </div>
      </div>
      <div className="flex-1">
        <PropertyMap
          projects={projects}
          center={userLocation || defaultCenter}
          userLocation={settings.showMyLocation ? userLocation : null}
        />
      </div>
    </div>
  );
}
