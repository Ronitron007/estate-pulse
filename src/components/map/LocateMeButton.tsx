"use client";

import { useState } from "react";
import { Locate, LocateOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocateMeButtonProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function LocateMeButton({ enabled, onToggle }: LocateMeButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    if (enabled) {
      // Toggle off
      onToggle(false);
      setError(null);
      return;
    }

    // Toggle on - check geolocation support first
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      () => {
        setLoading(false);
        onToggle(true);
      },
      (err) => {
        setLoading(false);
        let msg = "Unable to get location";
        if (err.code === err.PERMISSION_DENIED) {
          msg = "Location access denied";
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = "Location unavailable";
        } else if (err.code === err.TIMEOUT) {
          msg = "Location request timed out";
        }
        setError(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <Button
        variant={enabled ? "default" : "outline"}
        size="sm"
        onClick={handleClick}
        disabled={loading}
        className="gap-2"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : enabled ? (
          <LocateOff className="w-4 h-4" />
        ) : (
          <Locate className="w-4 h-4" />
        )}
        {loading ? "Locating..." : enabled ? "Hide my location" : "Show my location"}
      </Button>
      {error && (
        <p className="text-xs text-red-500 max-w-[200px]">{error}</p>
      )}
    </div>
  );
}
