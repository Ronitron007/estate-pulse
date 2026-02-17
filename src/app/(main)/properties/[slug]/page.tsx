import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Building2, Calendar, Home, Check, ChevronRight } from "lucide-react";
import { getProjectBySlug, getProjectSlugs } from "@/lib/queries/projects";
import { createClient } from "@/lib/supabase/server";
import { formatPriceRange, formatArea, formatDate } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LocationMap } from "@/components/map/LocationMap";
import { getImageUrl } from "@/lib/image-urls";
import { LocationAdvantages } from "@/components/property/LocationAdvantages";
import { InvestmentInsights } from "@/components/property/InvestmentInsights";
import { ProjectDetailStats } from "@/components/property/ProjectDetailStats";
import { QuickCtaSidebar } from "@/components/property/QuickCtaSidebar";
import { InquiryForm } from "@/components/property/InquiryForm";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Property Not Found" };
  }

  return {
    title: project.meta_title || `${project.name} - ${project.city} | Estate Pulse`,
    description: project.meta_description || project.description?.slice(0, 160),
    openGraph: {
      title: project.name,
      description: project.description || undefined,
      type: "website",
    },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // Check if user is logged in
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const primaryImage = project.images?.find((img) => img.is_primary) || project.images?.[0];
  const galleryImages = project.images?.filter((img) => !img.is_primary).slice(0, 4) || [];

  const statusColors = {
    upcoming: "bg-blue-100 text-blue-800",
    ongoing: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-[400px] bg-gray-200">
        {primaryImage ? (
          <img
            src={getImageUrl(primaryImage.image_path, "hero")}
            alt={primaryImage.alt_text || project.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Building2 className="w-24 h-24" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto">
            <span className={`inline-block px-3 py-1 text-sm font-medium rounded mb-3 ${statusColors[project.status]}`}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{project.name}</h1>
            {project.builder && (
              <p className="text-white/80">by {project.builder.name}</p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/properties" className="hover:text-foreground transition-colors">Properties</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">{project.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Info */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Price Range</p>
                    {user ? (
                      <p className="font-semibold">
                        {formatPriceRange(project.price_min, project.price_max, project.price_on_request)}
                      </p>
                    ) : (
                      <p className="font-semibold text-blue-600">Login to view</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Property Type</p>
                    <p className="font-semibold capitalize">{project.property_type || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Possession</p>
                    <p className="font-semibold">{formatDate(project.possession_date) || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Units</p>
                    <p className="font-semibold">
                      {project.available_units !== null && project.total_units
                        ? `${project.available_units}/${project.total_units} available`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  {project.address && `${project.address}, `}
                  {project.locality && `${project.locality}, `}
                  {project.city}
                  {project.pincode && ` - ${project.pincode}`}
                </p>
                {project.rera_id && (
                  <p className="text-sm text-gray-500">RERA ID: {project.rera_id}</p>
                )}
                {project.location && (
                  <LocationMap
                    lat={project.location.lat}
                    lng={project.location.lng}
                    propertyType={project.property_type}
                    className="h-64 w-full rounded-lg overflow-hidden"
                  />
                )}
              </CardContent>
            </Card>

            {/* Description */}
            {project.description && (
              <Card>
                <CardHeader>
                  <CardTitle>About this Project</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-line">{project.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Location Advantages */}
            {project.location_advantages && Object.keys(project.location_advantages).length > 0 && (
              <LocationAdvantages data={project.location_advantages} />
            )}

            {/* Project Details */}
            {project.project_details_extra && (
              <ProjectDetailStats data={project.project_details_extra} vastuCompliant={project.vastu_compliant} />
            )}

            {/* Investment Insights */}
            {project.investment_data && (
              <InvestmentInsights data={project.investment_data} />
            )}

            {/* 3D Walkthrough */}
            {(project.matterport_url || project.video_url) && (
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-display text-lg font-semibold mb-4">3D Walkthrough</h3>
                <div className="aspect-video rounded-lg bg-muted" />
              </div>
            )}

            {/* Configurations */}
            {project.configurations && project.configurations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Unit Configurations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 font-medium">Type</th>
                          <th className="text-left py-2 font-medium">Carpet Area</th>
                          <th className="text-left py-2 font-medium">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {project.configurations.map((config) => (
                          <tr key={config.id} className="border-b last:border-0">
                            <td className="py-3">{config.config_name || `${config.bedrooms} BHK`}</td>
                            <td className="py-3">{formatArea(config.carpet_area_sqft)}</td>
                            <td className="py-3">
                              {user ? (
                                config.price ? formatPriceRange(config.price, null, false) : "On Request"
                              ) : (
                                <span className="text-blue-600">Login to view</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Amenities */}
            {project.amenities && project.amenities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {project.amenities.map((amenity) => (
                      <div key={amenity.id} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Gallery */}
            {galleryImages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {galleryImages.map((image) => (
                      <div key={image.id} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={getImageUrl(image.image_path, "thumbnail")}
                          alt={image.alt_text || "Property image"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick CTA */}
            <div className="sticky top-4 space-y-6">
              <QuickCtaSidebar
                projectId={project.id}
                propertyTitle={project.name}
                price={user ? formatPriceRange(project.price_min, project.price_max, project.price_on_request) : undefined}
              />

              {/* Inquiry Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Request Callback</CardTitle>
                </CardHeader>
                <CardContent>
                  <InquiryForm
                    projectId={project.id}
                    propertyTitle={project.name}
                    compact
                  />
                </CardContent>
              </Card>
            </div>

            {/* Builder Info */}
            {project.builder && (
              <Card>
                <CardHeader>
                  <CardTitle>About the Builder</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold">{project.builder.name}</p>
                  {project.builder.established_year && (
                    <p className="text-sm text-muted-foreground">
                      Established {project.builder.established_year}
                    </p>
                  )}
                  {project.builder.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                      {project.builder.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
