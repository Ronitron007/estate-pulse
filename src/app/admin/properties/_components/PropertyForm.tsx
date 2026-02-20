"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader } from "./ImageUploader";
import { ConfigurationsEditor } from "./ConfigurationsEditor";
import { AmenitiesSelector } from "./AmenitiesSelector";
import { HighlightsEditor } from "./HighlightsEditor";
import { SpecificationsEditor } from "./SpecificationsEditor";
import { ParkingEditor } from "./ParkingEditor";
import { TowersEditor } from "./TowersEditor";
import { POIsEditor } from "./POIsEditor";
import { propertyFormSchema, transformFormData, type PropertyFormValues, type PropertyFormData } from "./property-schema";
import type { Configuration, ProjectImage, ProjectHighlight, ProjectSpecification, ProjectParking, Tower, PointOfInterest, Icon } from "@/types/database";

interface InitialData extends PropertyFormValues {
  images: Partial<ProjectImage>[];
  configurations: Partial<Configuration>[];
  amenityIds: string[];
  highlights: ProjectHighlight[];
  specifications: ProjectSpecification[];
  parking: ProjectParking | null;
  towers: Partial<Tower>[];
  points_of_interest: PointOfInterest[];
}

interface PropertyFormProps {
  initialData?: InitialData;
  projectId?: string;
  builders: { id: string; name: string }[];
  cities: string[];
  amenities: { id: string; name: string; category: string | null }[];
  icons: Icon[];
  onSubmit: (data: PropertyFormData) => Promise<{ success: boolean; error?: string }>;
  onDelete?: () => Promise<{ success: boolean; error?: string }>;
}

export function PropertyForm({
  initialData,
  projectId,
  builders,
  cities,
  amenities,
  icons,
  onSubmit,
  onDelete,
}: PropertyFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Separate state for related data (not in react-hook-form)
  const [images, setImages] = useState<Partial<ProjectImage>[]>(initialData?.images || []);
  const [configurations, setConfigurations] = useState<Partial<Configuration>[]>(initialData?.configurations || []);
  const [amenityIds, setAmenityIds] = useState<string[]>(initialData?.amenityIds || []);
  const [highlights, setHighlights] = useState<ProjectHighlight[]>(initialData?.highlights || []);
  const [specifications, setSpecifications] = useState<ProjectSpecification[]>(initialData?.specifications || []);
  const [parking, setParking] = useState<ProjectParking | null>(initialData?.parking || null);
  const [towers, setTowers] = useState<Partial<Tower>[]>(initialData?.towers || []);
  const [pois, setPois] = useState<PointOfInterest[]>(initialData?.points_of_interest || []);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: initialData || {
      name: "",
      slug: "",
      description: "",
      tagline: "",
      status: "upcoming",
      property_type: "",
      price_min: "",
      price_max: "",
      price_on_request: false,
      address: "",
      city: "",
      locality: "",
      pincode: "",
      lat: "",
      lng: "",
      total_units: "",
      available_units: "",
      possession_date: "",
      rera_id: "",
      builder_id: "",
      published: false,
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    setError(null);
    startTransition(async () => {
      const fullData = transformFormData(data, images, configurations, amenityIds, highlights, specifications, parking, towers, pois);
      const result = await onSubmit(fullData);
      if (result.success) {
        router.push("/admin/properties");
        router.refresh();
      } else {
        setError(result.error || "Failed to save");
      }
    });
  });

  const handleDelete = () => {
    if (!onDelete || !confirm("Delete this property? This cannot be undone.")) return;
    startTransition(async () => {
      const result = await onDelete();
      if (result.success) {
        router.push("/admin/properties");
        router.refresh();
      } else {
        setError(result.error || "Failed to delete");
      }
    });
  };

  const generateSlug = () => {
    const name = form.getValues("name");
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    form.setValue("slug", slug);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" {...form.register("name")} onBlur={() => !initialData && generateSlug()} />
            {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" {...form.register("slug")} />
            {form.formState.errors.slug && <p className="text-sm text-red-500">{form.formState.errors.slug.message}</p>}
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <textarea id="description" {...form.register("description")} rows={3} className="w-full px-3 py-2 border rounded-md bg-background" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input id="tagline" {...form.register("tagline")} placeholder="Short marketing line, e.g., 'Gateway of Chandigarh'" maxLength={100} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <select id="status" {...form.register("status")} className="w-full px-3 py-2 border rounded-md bg-background">
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="property_type">Property Type</Label>
            <select id="property_type" {...form.register("property_type")} className="w-full px-3 py-2 border rounded-md bg-background">
              <option value="">Select type</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="plot">Plot</option>
              <option value="commercial">Commercial</option>
              <option value="penthouse">Penthouse</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="builder_id">Builder</Label>
            <select id="builder_id" {...form.register("builder_id")} className="w-full px-3 py-2 border rounded-md bg-background">
              <option value="">Select builder</option>
              {builders.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Images</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUploader projectId={projectId} slug={form.watch("slug") || "temp"} images={images as ProjectImage[]} onChange={setImages} />
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Location</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...form.register("address")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input id="city" {...form.register("city")} list="cities" />
            <datalist id="cities">{cities.map((c) => <option key={c} value={c} />)}</datalist>
            {form.formState.errors.city && <p className="text-sm text-red-500">{form.formState.errors.city.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="locality">Locality</Label>
            <Input id="locality" {...form.register("locality")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input id="pincode" {...form.register("pincode")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lat">Latitude</Label>
            <Input id="lat" type="number" step="any" {...form.register("lat")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lng">Longitude</Label>
            <Input id="lng" type="number" step="any" {...form.register("lng")} />
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pricing & Units</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="price_min">Min Price (INR)</Label>
            <Input id="price_min" type="number" {...form.register("price_min")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price_max">Max Price (INR)</Label>
            <Input id="price_max" type="number" {...form.register("price_max")} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="price_on_request" {...form.register("price_on_request")} />
            <Label htmlFor="price_on_request">Price on Request</Label>
          </div>
          <div />
          <div className="space-y-2">
            <Label htmlFor="total_units">Total Units</Label>
            <Input id="total_units" type="number" {...form.register("total_units")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="available_units">Available Units</Label>
            <Input id="available_units" type="number" {...form.register("available_units")} />
          </div>
        </CardContent>
      </Card>

      {/* Configurations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configurations</CardTitle>
        </CardHeader>
        <CardContent>
          <ConfigurationsEditor configurations={configurations} towers={towers} onChange={setConfigurations} />
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <AmenitiesSelector allAmenities={amenities} selected={amenityIds} onChange={setAmenityIds} />
        </CardContent>
      </Card>

      {/* Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Project Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <HighlightsEditor highlights={highlights} icons={icons} onChange={setHighlights} />
        </CardContent>
      </Card>

      {/* Specifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <SpecificationsEditor specifications={specifications} icons={icons} onChange={setSpecifications} />
        </CardContent>
      </Card>

      {/* Towers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Towers</CardTitle>
        </CardHeader>
        <CardContent>
          <TowersEditor towers={towers} onChange={setTowers} />
        </CardContent>
      </Card>

      {/* Parking */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Parking</CardTitle>
        </CardHeader>
        <CardContent>
          <ParkingEditor parking={parking} onChange={setParking} />
        </CardContent>
      </Card>

      {/* Points of Interest */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Points of Interest</CardTitle>
        </CardHeader>
        <CardContent>
          <POIsEditor pois={pois} onChange={setPois} />
        </CardContent>
      </Card>

      {/* Additional */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Additional Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="possession_date">Possession Date</Label>
            <Input id="possession_date" type="date" {...form.register("possession_date")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rera_id">RERA ID</Label>
            <Input id="rera_id" {...form.register("rera_id")} />
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <input type="checkbox" id="published" {...form.register("published")} />
            <Label htmlFor="published">Published (visible to public)</Label>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div>
          {onDelete && (
            <Button type="button" variant="outline" onClick={handleDelete} disabled={isPending}>
              Delete Property
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : projectId ? "Update Property" : "Create Property"}
          </Button>
        </div>
      </div>
    </form>
  );
}
