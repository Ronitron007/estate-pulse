"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./useAuth";

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch favorites on mount and when user changes
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const response = await fetch("/api/favorites");
        if (response.ok) {
          const data = await response.json();
          setFavorites(data.favorites || []);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const isFavorite = useCallback(
    (projectId: string) => favorites.includes(projectId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (projectId: string) => {
      if (!user) return false;

      const isCurrentlyFavorite = favorites.includes(projectId);

      // Optimistic update
      if (isCurrentlyFavorite) {
        setFavorites((prev) => prev.filter((id) => id !== projectId));
      } else {
        setFavorites((prev) => [...prev, projectId]);
      }

      try {
        const response = await fetch("/api/favorites", {
          method: isCurrentlyFavorite ? "DELETE" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId }),
        });

        if (!response.ok) {
          // Revert on error
          if (isCurrentlyFavorite) {
            setFavorites((prev) => [...prev, projectId]);
          } else {
            setFavorites((prev) => prev.filter((id) => id !== projectId));
          }
          return false;
        }

        return true;
      } catch (error) {
        // Revert on error
        if (isCurrentlyFavorite) {
          setFavorites((prev) => [...prev, projectId]);
        } else {
          setFavorites((prev) => prev.filter((id) => id !== projectId));
        }
        console.error("Error toggling favorite:", error);
        return false;
      }
    },
    [user, favorites]
  );

  return {
    favorites,
    loading,
    isFavorite,
    toggleFavorite,
  };
}
