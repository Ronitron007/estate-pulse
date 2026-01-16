"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { ProjectFilters, PropertyType, ProjectStatus } from "@/types/database";

export function useFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo<ProjectFilters>(() => ({
    city: searchParams.get("city") || undefined,
    locality: searchParams.get("locality") || undefined,
    property_type: (searchParams.get("type") as PropertyType) || undefined,
    status: (searchParams.get("status") as ProjectStatus) || undefined,
    price_min: searchParams.get("price_min") ? Number(searchParams.get("price_min")) : undefined,
    price_max: searchParams.get("price_max") ? Number(searchParams.get("price_max")) : undefined,
    search: searchParams.get("q") || undefined,
  }), [searchParams]);

  const setFilter = useCallback(
    (key: string, value: string | number | undefined) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value !== undefined && value !== "") {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const setFilters = useCallback(
    (newFilters: Partial<ProjectFilters>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newFilters).forEach(([key, value]) => {
        const paramKey = key === "property_type" ? "type" : key === "search" ? "q" : key;

        if (value !== undefined && value !== "") {
          params.set(paramKey, String(value));
        } else {
          params.delete(paramKey);
        }
      });

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const clearFilters = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  const hasFilters = useMemo(
    () => Object.values(filters).some((v) => v !== undefined),
    [filters]
  );

  return {
    filters,
    setFilter,
    setFilters,
    clearFilters,
    hasFilters,
  };
}
