"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { useAuth } from "./AuthProvider";

interface FavoritesContextType {
  favorites: string[];
  loading: boolean;
  isFavorite: (projectId: string) => boolean;
  toggleFavorite: (projectId: string) => Promise<boolean>;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  loading: true,
  isFavorite: () => false,
  toggleFavorite: async () => false,
});

export function useFavorites() {
  return useContext(FavoritesContext);
}

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <FavoritesContext.Provider value={{ favorites, loading, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}
