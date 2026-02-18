"use client";

import { AdvancedMarker } from "@vis.gl/react-google-maps";

interface UserLocationMarkerProps {
  position: { lat: number; lng: number };
}

export function UserLocationMarker({ position }: UserLocationMarkerProps) {
  return (
    <AdvancedMarker position={position}>
      <div className="relative flex items-center justify-center">
        {/* Static outer ring - accuracy indicator */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(59, 130, 246, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(59, 130, 246, 0.3)",
          }}
        >
          {/* Inner dot */}
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#3b82f6",
              border: "2px solid white",
              boxShadow: "0 1px 4px rgba(0, 0, 0, 0.3)",
            }}
          />
        </div>
      </div>
    </AdvancedMarker>
  );
}
