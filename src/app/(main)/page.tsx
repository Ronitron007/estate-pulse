import Link from "next/link";
import { Search, MapPin, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProjects, getCities } from "@/lib/queries/projects";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const [projects, cities] = await Promise.all([
    getProjects(),
    getCities(),
  ]);

  const featuredProjects = projects.slice(0, 6);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find Your Dream Property
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Browse residential and commercial properties from top builders.
              Search, compare, and find your perfect home.
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-lg p-2 flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center px-3">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search by project name or location..."
                  className="w-full py-2 text-gray-900 focus:outline-none"
                />
              </div>
              <select className="px-4 py-2 text-gray-700 border-l md:border-l md:border-t-0 border-gray-200 focus:outline-none">
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <Link href="/properties">
                <Button size="lg" className="w-full md:w-auto">
                  Search
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-600">{projects.length}+</p>
              <p className="text-gray-600">Properties</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">{cities.length}+</p>
              <p className="text-gray-600">Cities</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">50+</p>
              <p className="text-gray-600">Builders</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">1000+</p>
              <p className="text-gray-600">Happy Customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Properties</h2>
              <p className="text-gray-600">Handpicked properties for you</p>
            </div>
            <Link href="/properties">
              <Button variant="outline">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {featuredProjects.length > 0 ? (
            <PropertyGrid projects={featuredProjects} showPrice={!!user} />
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No properties available yet</p>
              <p className="text-sm text-gray-400">Check back soon for new listings</p>
            </div>
          )}
        </div>
      </section>

      {/* Browse by City */}
      {cities.length > 0 && (
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by City</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cities.slice(0, 8).map((city) => (
                <Link
                  key={city}
                  href={`/properties?city=${encodeURIComponent(city)}`}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">{city}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to find your dream home?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Create an account to save your favorite properties, compare options,
            and get in touch with builders directly.
          </p>
          {!user && (
            <div className="flex gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" variant="secondary">
                  Create Account
                </Button>
              </Link>
              <Link href="/properties">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  Browse Properties
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-6 h-6 text-white" />
                <span className="font-bold text-white">Estate Pulse</span>
              </div>
              <p className="text-sm">
                Your trusted partner in finding the perfect property.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/properties" className="hover:text-white">Properties</Link></li>
                <li><Link href="/map" className="hover:text-white">Map View</Link></li>
                <li><Link href="/builders" className="hover:text-white">Builders</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Property Types</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/properties?type=apartment" className="hover:text-white">Apartments</Link></li>
                <li><Link href="/properties?type=villa" className="hover:text-white">Villas</Link></li>
                <li><Link href="/properties?type=plot" className="hover:text-white">Plots</Link></li>
                <li><Link href="/properties?type=commercial" className="hover:text-white">Commercial</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>contact@estatepulse.com</li>
                <li>+91 98765 43210</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} Estate Pulse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
