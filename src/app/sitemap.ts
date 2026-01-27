import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://estatepulse.in";

// Build-time client (no cookies needed)
function createBuildTimeClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createBuildTimeClient();

  // Get published project slugs
  const { data: projects } = await supabase
    .from("projects")
    .select("slug, updated_at")
    .not("published_at", "is", null)
    .is("deleted_at", null);

  // Get unique cities
  const { data: citiesData } = await supabase
    .from("projects")
    .select("city")
    .not("published_at", "is", null)
    .is("deleted_at", null);

  const cities = [...new Set(citiesData?.map((p) => p.city) || [])];

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/properties`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/map`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const propertyPages: MetadataRoute.Sitemap = (projects || []).map((project) => ({
    url: `${BASE_URL}/properties/${project.slug}`,
    lastModified: new Date(project.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${BASE_URL}/properties?city=${encodeURIComponent(city)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...propertyPages, ...cityPages];
}
