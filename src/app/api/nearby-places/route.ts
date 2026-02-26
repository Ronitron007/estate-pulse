import { NextRequest, NextResponse } from "next/server";

const CATEGORY_TO_TYPES: Record<string, string[]> = {
  transport: ["transit_station", "bus_station", "train_station"],
  education: ["school", "university"],
  healthcare: ["hospital", "pharmacy"],
  shopping: ["shopping_mall", "supermarket"],
  food: ["restaurant", "cafe"],
  lifestyle: ["gym", "park", "movie_theater"],
  notable: ["tourist_attraction", "place_of_worship"],
};

interface PlaceResult {
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number | null;
  distance_meters: number;
}

function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const category = searchParams.get("category");

  if (!lat || !lng || !category) {
    return NextResponse.json(
      { error: "lat, lng, and category are required" },
      { status: 400 }
    );
  }

  const types = CATEGORY_TO_TYPES[category];
  if (!types) {
    return NextResponse.json(
      { error: `Invalid category. Valid: ${Object.keys(CATEGORY_TO_TYPES).join(", ")}` },
      { status: 400 }
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Maps API key not configured" }, { status: 500 });
  }

  try {
    const allPlaces: PlaceResult[] = [];

    for (const type of types) {
      const body = {
        includedTypes: [type],
        maxResultCount: 5,
        locationRestriction: {
          circle: {
            center: { latitude: parseFloat(lat), longitude: parseFloat(lng) },
            radius: 5000.0,
          },
        },
      };

      const res = await fetch(
        "https://places.googleapis.com/v1/places:searchNearby",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask":
              "places.displayName,places.formattedAddress,places.location,places.rating",
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) continue;

      const data = await res.json();
      const places = data.places || [];

      for (const p of places) {
        allPlaces.push({
          name: p.displayName?.text || "Unknown",
          address: p.formattedAddress || "",
          lat: p.location?.latitude || 0,
          lng: p.location?.longitude || 0,
          rating: p.rating || null,
          distance_meters: haversineDistance(
            parseFloat(lat), parseFloat(lng),
            p.location?.latitude || 0, p.location?.longitude || 0
          ),
        });
      }
    }

    allPlaces.sort((a, b) => a.distance_meters - b.distance_meters);
    const results = allPlaces.slice(0, 10);

    return NextResponse.json(
      { places: results },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
        },
      }
    );
  } catch (err) {
    console.error("Nearby places error:", err);
    return NextResponse.json({ error: "Failed to fetch nearby places" }, { status: 500 });
  }
}
