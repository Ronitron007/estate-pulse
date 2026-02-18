import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getFavorites } from "@/lib/queries/favorites";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Saved Properties | PerfectGhar.in",
  description: "Your saved properties",
};

export default async function SavedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-20 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Sign in to view saved properties</h2>
          <p className="text-gray-500 mb-4">Create an account to save and compare properties</p>
          <Link href="/login?redirectTo=/saved">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const favorites = await getFavorites(user.id);

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Properties</h1>
        <p className="text-gray-500 mb-8">{favorites.length} properties saved</p>

        {favorites.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No saved properties yet</h2>
            <p className="text-gray-500 mb-4">Browse properties and click the heart icon to save them</p>
            <Link href="/properties">
              <Button>Browse Properties</Button>
            </Link>
          </div>
        ) : (
          <PropertyGrid projects={favorites.map(f => f.project)} showPrice={true} />
        )}
      </div>
    </div>
  );
}
