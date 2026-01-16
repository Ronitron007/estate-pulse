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
    <div className="flex gap-2">
      <Link href={`/properties?${params.toString()}`}>
        <Button
          variant={currentView === "list" ? "default" : "outline"}
          size="sm"
          className="flex items-center gap-2"
        >
          <List className="w-4 h-4" />
          List
        </Button>
      </Link>
      <Link href={`/map?${params.toString()}`}>
        <Button
          variant={currentView === "map" ? "default" : "outline"}
          size="sm"
          className="flex items-center gap-2"
        >
          <Map className="w-4 h-4" />
          Map
        </Button>
      </Link>
    </div>
  );
}
