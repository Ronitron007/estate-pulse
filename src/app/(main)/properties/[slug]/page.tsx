import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Building2, Calendar, Check, ChevronRight, Car } from "lucide-react";
import { getProjectBySlug, getProjectSlugs } from "@/lib/queries/projects";
import { formatPrice, formatPriceRange, formatDate } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LocationMap } from "@/components/map/LocationMap";
import { getImageUrl } from "@/lib/image-urls";
import { LocationAdvantages } from "@/components/property/LocationAdvantages";
import { PointsOfInterest } from "@/components/property/PointsOfInterest";
import { InvestmentInsights } from "@/components/property/InvestmentInsights";
import { ProjectDetailStats } from "@/components/property/ProjectDetailStats";
import { QuickCtaSidebar } from "@/components/property/QuickCtaSidebar";
import { InquiryForm } from "@/components/property/InquiryForm";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { UnitShowcase } from "@/components/property/UnitShowcase";
import { MobileCtaBar } from "@/components/property/MobileCtaBar";
import { SectionNav } from "@/components/property/SectionNav";

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
    title: project.meta_title || `${project.name} - ${project.city} | PerfectGhar.in`,
    description: project.meta_description || project.description?.slice(0, 160),
    openGraph: {
      title: project.name,
      description: project.description || undefined,
      type: "website",
    },
  };
}

function buildSpecs(project: NonNullable<Awaited<ReturnType<typeof getProjectBySlug>>>) {
  const parts: string[] = [];
  if (project.configurations?.length) {
    const bhks = [...new Set(project.configurations.map(c => c.bedrooms).filter(Boolean))].sort();
    if (bhks.length === 1) {
      parts.push(`${bhks[0]} BHK`);
    } else if (bhks.length > 1) {
      parts.push(`${bhks[0]}–${bhks[bhks.length - 1]} BHK`);
    }
    const areas = project.configurations.map(c => c.carpet_area_sqft).filter(Boolean) as number[];
    if (areas.length === 1) {
      parts.push(`${areas[0]} sq.ft`);
    } else if (areas.length > 1) {
      parts.push(`${Math.min(...areas)}–${Math.max(...areas)} sq.ft`);
    }
  }
  if (project.locality) parts.push(project.locality);
  else if (project.city) parts.push(project.city);
  return parts.length ? parts.join(' \u2022 ') : undefined;
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const primaryImage = project.images?.find((img) => img.is_primary) || project.images?.[0];
  const galleryImages = project.images?.filter((img) => !img.is_primary).slice(0, 4) || [];

  const statusColors = {
    upcoming: "bg-blue-100 text-blue-800",
    ongoing: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-800",
  };

  // Build section nav tabs conditionally
  const hasConfigurations = project.configurations && project.configurations.length > 0;
  const hasAmenities = project.amenities && project.amenities.length > 0;
  const hasSpecs = (project.specifications && project.specifications.length > 0) || project.parking;
  const hasInvestment = !!project.investment_data;
  const hasGallery = galleryImages.length > 0;
  const hasLocationContent = !!(
    project.points_of_interest?.length ||
    (project.location_advantages && Object.keys(project.location_advantages).length) ||
    project.project_details_extra
  );

  const sections = [
    { id: "overview", label: "Overview" },
    ...(hasConfigurations ? [{ id: "configurations", label: "Configurations" }] : []),
    ...(hasAmenities ? [{ id: "amenities", label: "Amenities" }] : []),
    ...(hasSpecs ? [{ id: "specifications", label: "Specs" }] : []),
    { id: "location", label: "Location" },
    ...(hasInvestment ? [{ id: "pricing", label: "Pricing" }] : []),
    ...(hasGallery ? [{ id: "gallery", label: "Gallery" }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      {/* Hero Image */}
      <div id="hero" className="relative h-[400px] bg-gray-200">
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

      {/* Section Nav — sticky, full-width */}
      <SectionNav sections={sections} />

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

            {/* ── OVERVIEW ── */}
            <section id="overview" className="scroll-mt-28 md:scroll-mt-32 space-y-6">
              {/* Quick Info */}
              <AnimateIn>
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Price Range</p>
                        <p className="font-semibold">
                          {formatPriceRange(project.price_min, project.price_max, project.price_on_request)}
                        </p>
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
                      {project.price_per_sqft && (
                        <div>
                          <p className="text-sm text-gray-500">Price / Sq Ft</p>
                          <p className="font-semibold">{formatPrice(project.price_per_sqft)}/sqft</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </AnimateIn>

              {/* Highlights */}
              {project.highlights?.length > 0 && (
                <AnimateIn delay={0.05}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Highlights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {project.highlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                            <span className="text-primary mt-0.5">
                              <DynamicIcon name={h.icon_name || "circle-check"} className="w-5 h-5" />
                            </span>
                            <span>{h.text}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </AnimateIn>
              )}

              {/* About */}
              {project.description && (
                <AnimateIn delay={0.1}>
                  <Card>
                    <CardHeader>
                      <CardTitle>About this Project</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 whitespace-pre-line">{project.description}</p>
                    </CardContent>
                  </Card>
                </AnimateIn>
              )}
            </section>

            {/* ── CONFIGURATIONS ── */}
            {hasConfigurations && (
              <section id="configurations" className="scroll-mt-28 md:scroll-mt-32">
                <AnimateIn delay={0.15}>
                  <UnitShowcase
                    configurations={project.configurations!}
                    towers={project.towers}
                  />
                </AnimateIn>
              </section>
            )}

            {/* ── AMENITIES ── */}
            {hasAmenities && (
              <section id="amenities" className="scroll-mt-28 md:scroll-mt-32">
                <AnimateIn delay={0.18}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Amenities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {project.amenities!.map((amenity) => (
                          <div key={amenity.id} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-600" />
                            <span>{amenity.name}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </AnimateIn>
              </section>
            )}

            {/* ── SPECIFICATIONS + PARKING ── */}
            {hasSpecs && (
              <section id="specifications" className="scroll-mt-28 md:scroll-mt-32 space-y-6">
                {project.specifications && project.specifications.length > 0 && (
                  <AnimateIn delay={0.2}>
                    <Card>
                      <CardHeader>
                        <CardTitle>Specifications</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="divide-y">
                          {project.specifications.map((spec, i) => (
                            <div key={i} className="flex items-center justify-between py-3">
                              <div className="flex items-center gap-2 text-gray-600">
                                <DynamicIcon name={spec.icon_name || "circle"} className="w-4 h-4" />
                                <span>{spec.label}</span>
                              </div>
                              <span className="font-medium">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </AnimateIn>
                )}

                {project.parking && (
                  <AnimateIn delay={0.22}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Car className="w-5 h-5" />
                          Parking
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          {project.parking.types?.length > 0 && (
                            <div>
                              <p className="text-sm text-gray-500">Parking Types</p>
                              <p className="font-medium capitalize">{project.parking.types.join(", ")}</p>
                            </div>
                          )}
                          {project.parking.basement_levels && (
                            <div>
                              <p className="text-sm text-gray-500">Basement Levels</p>
                              <p className="font-medium">{project.parking.basement_levels}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-sm text-gray-500">Guest Parking</p>
                            <p className="font-medium">{project.parking.guest_parking ? "Yes" : "No"}</p>
                          </div>
                          {project.parking.allotment && (
                            <div>
                              <p className="text-sm text-gray-500">Per Unit Allotment</p>
                              <p className="font-medium">{project.parking.allotment}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </AnimateIn>
                )}
              </section>
            )}

            {/* ── LOCATION + POIs + PROJECT DETAILS ── */}
            <section id="location" className="scroll-mt-28 md:scroll-mt-32 space-y-6">
              <AnimateIn delay={0.25}>
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
              </AnimateIn>

              {/* POIs / Location Advantages */}
              {project.points_of_interest?.length > 0 ? (
                <AnimateIn delay={0.27}>
                  <PointsOfInterest pois={project.points_of_interest} />
                </AnimateIn>
              ) : project.location_advantages && Object.keys(project.location_advantages).length > 0 ? (
                <AnimateIn delay={0.27}>
                  <LocationAdvantages data={project.location_advantages} />
                </AnimateIn>
              ) : null}

              {/* Project Details */}
              {project.project_details_extra && (
                <AnimateIn delay={0.29}>
                  <ProjectDetailStats data={project.project_details_extra} vastuCompliant={project.vastu_compliant} />
                </AnimateIn>
              )}
            </section>

            {/* ── PRICING (Investment Insights) ── */}
            {hasInvestment && (
              <section id="pricing" className="scroll-mt-28 md:scroll-mt-32">
                <AnimateIn delay={0.3}>
                  <InvestmentInsights data={project.investment_data!} />
                </AnimateIn>
              </section>
            )}

            {/* 3D Walkthrough (no nav tab) */}
            {(project.matterport_url || project.video_url) && (
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-display text-lg font-semibold mb-4">3D Walkthrough</h3>
                <div className="aspect-video rounded-lg bg-muted" />
              </div>
            )}

            {/* ── GALLERY ── */}
            {hasGallery && (
              <section id="gallery" className="scroll-mt-28 md:scroll-mt-32">
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
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <AnimateIn direction="right">
            <div className="sticky top-28 md:top-32 space-y-6">
              <QuickCtaSidebar
                projectId={project.id}
                propertyTitle={project.name}
                price={formatPriceRange(project.price_min, project.price_max, project.price_on_request)}
                specs={buildSpecs(project)}
              />

              {/* Inquiry Form */}
              <Card id="inquiry-form">
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
            </AnimateIn>
          </div>
        </div>
      </div>

      {/* Floating mobile CTA */}
      <MobileCtaBar
        propertyTitle={project.name}
        observeId="inquiry-form"
      />
    </div>
  );
}
