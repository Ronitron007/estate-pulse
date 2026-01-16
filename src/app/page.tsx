"use client";

import { useState, Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { AuthModal } from "@/components/auth/AuthModal";
import { MapListToggle, MapListToggleAnimated } from "@/components/map/MapListToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Project } from "@/types/database";

// Mock data for demonstration
const mockProjects: Project[] = [
  {
    id: "1",
    slug: "skyline-heights",
    name: "Skyline Heights",
    description: "Luxury apartments with stunning city views",
    status: "ongoing",
    price_min: 7500000000,
    price_max: 15000000000,
    price_on_request: false,
    address: "123 Main Street",
    city: "Mumbai",
    locality: "Bandra West",
    pincode: "400050",
    location: { lat: 19.0596, lng: 72.8295 },
    property_type: "apartment",
    total_units: 200,
    available_units: 45,
    possession_date: "2025-12-01",
    rera_id: "P51800012345",
    builder_id: "b1",
    meta_title: null,
    meta_description: null,
    created_at: "2024-01-01",
    updated_at: "2024-01-15",
    published_at: "2024-01-02",
    builder: { id: "b1", name: "Premier Builders", slug: "premier-builders", logo_cloudinary_id: null, description: null, website: null, established_year: 1995, created_at: "2024-01-01" },
    configurations: [
      { id: "c1", project_id: "1", bedrooms: 2, bathrooms: 2, config_name: "2 BHK", carpet_area_sqft: 850, built_up_area_sqft: 1100, price: 7500000000, floor_plan_cloudinary_id: null },
      { id: "c2", project_id: "1", bedrooms: 3, bathrooms: 3, config_name: "3 BHK", carpet_area_sqft: 1200, built_up_area_sqft: 1500, price: 12000000000, floor_plan_cloudinary_id: null },
    ],
    images: [],
  },
  {
    id: "2",
    slug: "green-valley-villas",
    name: "Green Valley Villas",
    description: "Eco-friendly villas surrounded by nature",
    status: "upcoming",
    price_min: 25000000000,
    price_max: 40000000000,
    price_on_request: false,
    address: "Plot 45, Green Zone",
    city: "Pune",
    locality: "Kothrud",
    pincode: "411038",
    location: { lat: 18.5074, lng: 73.8077 },
    property_type: "villa",
    total_units: 50,
    available_units: 50,
    possession_date: "2026-06-01",
    rera_id: "P52100067890",
    builder_id: "b2",
    meta_title: null,
    meta_description: null,
    created_at: "2024-02-01",
    updated_at: "2024-02-10",
    published_at: "2024-02-05",
    builder: { id: "b2", name: "EcoHomes Ltd", slug: "ecohomes", logo_cloudinary_id: null, description: null, website: null, established_year: 2010, created_at: "2024-01-01" },
    configurations: [
      { id: "c3", project_id: "2", bedrooms: 4, bathrooms: 4, config_name: "4 BHK Villa", carpet_area_sqft: 2500, built_up_area_sqft: 3200, price: 25000000000, floor_plan_cloudinary_id: null },
    ],
    images: [],
  },
  {
    id: "3",
    slug: "metro-plaza",
    name: "Metro Plaza Commercial",
    description: "Premium commercial spaces in prime location",
    status: "completed",
    price_min: 5000000000,
    price_max: 20000000000,
    price_on_request: false,
    address: "Metro Station Road",
    city: "Delhi",
    locality: "Connaught Place",
    pincode: "110001",
    location: { lat: 28.6315, lng: 77.2167 },
    property_type: "commercial",
    total_units: 100,
    available_units: 12,
    possession_date: "2024-03-01",
    rera_id: null,
    builder_id: "b3",
    meta_title: null,
    meta_description: null,
    created_at: "2023-06-01",
    updated_at: "2024-03-01",
    published_at: "2023-06-15",
    builder: { id: "b3", name: "Metro Developers", slug: "metro-developers", logo_cloudinary_id: null, description: null, website: null, established_year: 1985, created_at: "2024-01-01" },
    configurations: [],
    images: [],
  },
];

export default function WhimsyDemo() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-bounce-in">
              Estate Pulse
            </h1>
            <p className="text-xl text-gray-600 mb-8 opacity-0 animate-bounce-in stagger-2">
              Discover your dream property with delightful interactions
            </p>
            <div className="flex gap-4 justify-center opacity-0 animate-bounce-in stagger-3">
              <Button size="lg" onClick={() => setIsAuthModalOpen(true)}>
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={handleLoadingDemo}>
                {isLoading ? "Loading..." : "See Loading State"}
              </Button>
            </div>
          </div>
        </section>

        {/* UI Components Demo */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Whimsy Components Demo</h2>

            {/* Toggle Demo */}
            <div className="mb-12">
              <h3 className="text-lg font-semibold mb-4">Map/List Toggle</h3>
              <div className="flex gap-8 items-center">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Standard</p>
                  <Suspense fallback={<div className="h-10 w-32 skeleton rounded-lg" />}>
                    <MapListToggle currentView="list" />
                  </Suspense>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Animated Pill</p>
                  <Suspense fallback={<div className="h-10 w-32 skeleton rounded-full" />}>
                    <MapListToggleAnimated currentView="map" />
                  </Suspense>
                </div>
              </div>
            </div>

            {/* Form Components Demo */}
            <div className="mb-12">
              <h3 className="text-lg font-semibold mb-4">Form Components</h3>
              <Card className="max-w-md">
                <CardHeader>
                  <CardTitle>Input Focus Effects</CardTitle>
                  <CardDescription>Try focusing on the inputs below</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="demo-email">Email</Label>
                    <Input id="demo-email" type="email" placeholder="you@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="demo-password">Password</Label>
                    <Input id="demo-password" type="password" placeholder="Enter password" />
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1">Cancel</Button>
                    <Button className="flex-1">Submit</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Button Variants Demo */}
            <div className="mb-12">
              <h3 className="text-lg font-semibold mb-4">Button Press Effects</h3>
              <div className="flex flex-wrap gap-3">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link Style</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Property Grid Demo */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Featured Properties</h2>
              <p className="text-gray-500">Hover over cards to see animations</p>
            </div>
            <PropertyGrid projects={isLoading ? [] : mockProjects} showPrice={true} isLoading={isLoading} />
          </div>
        </section>

        {/* Empty State Demo */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Empty State Animation</h2>
            <PropertyGrid projects={[]} showPrice={true} />
          </div>
        </section>

        {/* Animation Showcase */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Animation Classes</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-6 bg-white rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full animate-float flex items-center justify-center">
                  <span className="text-2xl">~</span>
                </div>
                <p className="text-sm font-medium">animate-float</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-red-100 rounded-full animate-gentle-pulse flex items-center justify-center">
                  <span className="text-2xl">*</span>
                </div>
                <p className="text-sm font-medium">animate-gentle-pulse</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full animate-bounce-in flex items-center justify-center">
                  <span className="text-2xl">+</span>
                </div>
                <p className="text-sm font-medium">animate-bounce-in</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 mx-auto mb-3 skeleton rounded-full" />
                <p className="text-sm font-medium">skeleton shimmer</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultView="login"
      />
    </div>
  );
}
