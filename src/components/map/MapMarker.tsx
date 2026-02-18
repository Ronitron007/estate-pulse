"use client";

import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { Building2, Home, Grid3X3, Briefcase, Crown } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import type { Project, PropertyType } from "@/types/database";

interface MapMarkerProps {
  project: Pick<Project, "id" | "location" | "property_type">;
  onClick?: () => void;
}

// Type-safe config for each property type
interface MarkerConfig {
  icon: typeof Building2;
  gradient: string;
  shadow: string;
  glow: string;
}

const markerConfigs: Record<PropertyType, MarkerConfig> = {
  apartment: {
    icon: Building2,
    gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    shadow: "0 4px 14px -2px rgba(59, 130, 246, 0.5)",
    glow: "rgba(59, 130, 246, 0.4)",
  },
  villa: {
    icon: Home,
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    shadow: "0 4px 14px -2px rgba(16, 185, 129, 0.5)",
    glow: "rgba(16, 185, 129, 0.4)",
  },
  plot: {
    icon: Grid3X3,
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    shadow: "0 4px 14px -2px rgba(245, 158, 11, 0.5)",
    glow: "rgba(245, 158, 11, 0.4)",
  },
  commercial: {
    icon: Briefcase,
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    shadow: "0 4px 14px -2px rgba(139, 92, 246, 0.5)",
    glow: "rgba(139, 92, 246, 0.4)",
  },
  penthouse: {
    icon: Crown,
    gradient: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
    shadow: "0 4px 14px -2px rgba(236, 72, 153, 0.5)",
    glow: "rgba(236, 72, 153, 0.4)",
  },
};

const defaultConfig: MarkerConfig = {
  icon: Building2,
  gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  shadow: "0 4px 14px -2px rgba(59, 130, 246, 0.5)",
  glow: "rgba(59, 130, 246, 0.4)",
};

export function MapMarker({ project, onClick }: MapMarkerProps) {
  const [isHovered, setIsHovered] = useState(false);

  const config = useMemo(() => {
    return project.property_type
      ? markerConfigs[project.property_type]
      : defaultConfig;
  }, [project.property_type]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  if (!project.location) return null;

  const Icon = config.icon;

  return (
    <AdvancedMarker
      position={{ lat: project.location.lat, lng: project.location.lng }}
      onClick={onClick}
    >
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered ? "scale(1.15) translateY(-4px)" : "scale(1)",
          transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
          cursor: "pointer",
        }}
      >
        {/* Outer glow ring - visible on hover */}
        <div
          style={{
            position: "absolute",
            inset: -6,
            borderRadius: "50%",
            background: config.glow,
            opacity: isHovered ? 0.6 : 0,
            transform: isHovered ? "scale(1.2)" : "scale(0.8)",
            transition: "all 0.3s ease-out",
            filter: "blur(8px)",
          }}
        />

        {/* Main marker container */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Marker body */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50% 50% 50% 0",
              background: config.gradient,
              transform: "rotate(-45deg)",
              boxShadow: isHovered
                ? `${config.shadow}, 0 8px 25px -4px rgba(0,0,0,0.3)`
                : config.shadow,
              transition: "box-shadow 0.2s ease-out",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "3px solid rgba(255,255,255,0.9)",
            }}
          >
            {/* Icon container - counter-rotate to keep icon upright */}
            <div
              style={{
                transform: "rotate(45deg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon
                size={20}
                color="white"
                strokeWidth={2.5}
                style={{
                  filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))",
                }}
              />
            </div>
          </div>

          {/* Bottom pointer shadow */}
          <div
            style={{
              width: 12,
              height: 4,
              background: "rgba(0,0,0,0.15)",
              borderRadius: "50%",
              marginTop: 4,
              filter: "blur(2px)",
              transform: isHovered ? "scale(1.3)" : "scale(1)",
              opacity: isHovered ? 0.8 : 0.5,
              transition: "all 0.2s ease-out",
            }}
          />
        </div>
      </div>
    </AdvancedMarker>
  );
}

// Memoized version for better performance with many markers
export { MapMarker as default };
