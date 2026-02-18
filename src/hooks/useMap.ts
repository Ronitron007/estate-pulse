"use client";

import { useState, useCallback } from "react";

interface MapCenter {
  lat: number;
  lng: number;
}

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export function useMap(initialCenter: MapCenter = { lat: 30.7333, lng: 76.7794 }) {
  const [center, setCenter] = useState<MapCenter>(initialCenter);
  const [zoom, setZoom] = useState(12);
  const [bounds, setBounds] = useState<MapBounds | null>(null);

  const updateCenter = useCallback((newCenter: MapCenter) => {
    setCenter(newCenter);
  }, []);

  const updateZoom = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const updateBounds = useCallback((newBounds: MapBounds) => {
    setBounds(newBounds);
  }, []);

  const resetMap = useCallback(() => {
    setCenter(initialCenter);
    setZoom(12);
    setBounds(null);
  }, [initialCenter]);

  const fitBoundsToMarkers = useCallback(
    (markers: { lat: number; lng: number }[]) => {
      if (markers.length === 0) return;

      if (markers.length === 1) {
        setCenter(markers[0]);
        setZoom(15);
        return;
      }

      const lats = markers.map((m) => m.lat);
      const lngs = markers.map((m) => m.lng);

      const newBounds = {
        north: Math.max(...lats),
        south: Math.min(...lats),
        east: Math.max(...lngs),
        west: Math.min(...lngs),
      };

      setBounds(newBounds);

      // Calculate center
      setCenter({
        lat: (newBounds.north + newBounds.south) / 2,
        lng: (newBounds.east + newBounds.west) / 2,
      });
    },
    []
  );

  return {
    center,
    zoom,
    bounds,
    updateCenter,
    updateZoom,
    updateBounds,
    resetMap,
    fitBoundsToMarkers,
  };
}
