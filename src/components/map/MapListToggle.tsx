"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Map, List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapListToggleProps {
  currentView: "map" | "list";
}

export function MapListToggle({ currentView }: MapListToggleProps) {
  const searchParams = useSearchParams();

  // Preserve existing search params when switching views
  const params = new URLSearchParams(searchParams.toString());

  return (
    <div className="inline-flex rounded-sm border bg-background p-1 shadow-xs">
      <Link href={`/properties?${params.toString()}`}>
        <Button
          variant={currentView === "list" ? "default" : "ghost"}
          size="sm"
          className={`flex items-center gap-2 rounded-md transition-all duration-200 ${
            currentView === "list"
              ? "shadow-sm"
              : "hover:bg-gray-100"
          }`}
        >
          <List
            className={`w-4 h-4 transition-transform duration-200 ${
              currentView === "list" ? "scale-110" : ""
            }`}
          />
          <span className="hidden sm:inline">List</span>
        </Button>
      </Link>
      <Link href={`/map?${params.toString()}`}>
        <Button
          variant={currentView === "map" ? "default" : "ghost"}
          size="sm"
          className={`flex items-center gap-2 rounded-md transition-all duration-200 ${
            currentView === "map"
              ? "shadow-sm"
              : "hover:bg-gray-100"
          }`}
        >
          <Map
            className={`w-4 h-4 transition-transform duration-200 ${
              currentView === "map" ? "scale-110" : ""
            }`}
          />
          <span className="hidden sm:inline">Map</span>
        </Button>
      </Link>

      {/* Animated indicator (alternative design - commented out) */}
      {/* <div
        className={`absolute bottom-1 h-0.5 bg-blue-600 rounded-full transition-all duration-300 ease-out ${
          currentView === "list" ? "left-1 w-12" : "left-14 w-11"
        }`}
      /> */}
    </div>
  );
}

// Animated toggle variant with sliding background
export function MapListToggleAnimated({ currentView }: MapListToggleProps) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  return (
    <div className="relative inline-flex rounded-full border bg-gray-100 p-1">
      {/* Sliding background pill */}
      <div
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm transition-all duration-300 ease-out ${
          currentView === "list" ? "left-1" : "left-[calc(50%+2px)]"
        }`}
      />

      <Link
        href={`/properties?${params.toString()}`}
        className={`relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
          currentView === "list" ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <List className="w-4 h-4" />
        <span className="hidden sm:inline">List</span>
      </Link>

      <Link
        href={`/map?${params.toString()}`}
        className={`relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
          currentView === "map" ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <Map className="w-4 h-4" />
        <span className="hidden sm:inline">Map</span>
      </Link>
    </div>
  );
}
