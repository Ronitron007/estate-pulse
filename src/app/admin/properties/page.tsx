import { Suspense } from "react";
import Link from "next/link";
import { getAdminProjects, getUniqueCities } from "@/lib/queries/admin";
import { formatPriceRange } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PropertiesFilters } from "./_components/PropertiesFilters";
import type { ProjectStatus } from "@/types/database";

interface Props {
  searchParams: Promise<{
    search?: string;
    status?: ProjectStatus;
    city?: string;
    page?: string;
  }>;
}

export default async function AdminPropertiesPage({ searchParams }: Props) {
  const params = await searchParams;
  const cities = await getUniqueCities();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Properties</h1>
          <p className="text-muted-foreground">
            Manage all properties in the system
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/properties/new">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Property
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <PropertiesFilters
        cities={cities}
        currentFilters={{
          search: params.search,
          status: params.status,
          city: params.city,
        }}
      />

      {/* Properties table */}
      <Suspense fallback={<TableSkeleton />}>
        <PropertiesTable
          filters={{
            search: params.search,
            status: params.status,
            city: params.city,
          }}
        />
      </Suspense>
    </div>
  );
}

async function PropertiesTable({
  filters,
}: {
  filters: {
    search?: string;
    status?: ProjectStatus;
    city?: string;
  };
}) {
  const projects = await getAdminProjects(filters);

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No properties found</p>
          {(filters.search || filters.status || filters.city) && (
            <Button variant="link" asChild className="mt-2">
              <Link href="/admin/properties">Clear filters</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg hover:-translate-y-0">
      <CardHeader>
        <CardTitle className="text-base">
          {projects.length} {projects.length === 1 ? "Property" : "Properties"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 font-medium text-sm">Name</th>
                <th className="text-left p-4 font-medium text-sm hidden md:table-cell">
                  City
                </th>
                <th className="text-left p-4 font-medium text-sm hidden lg:table-cell">
                  Status
                </th>
                <th className="text-left p-4 font-medium text-sm hidden sm:table-cell">
                  Price
                </th>
                <th className="text-left p-4 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-muted-foreground md:hidden">
                        {project.city}
                      </p>
                      {!project.published_at && (
                        <span className="text-xs text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded">
                          Draft
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell text-muted-foreground">
                    {project.city}
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <ProjectStatusBadge status={project.status} />
                  </td>
                  <td className="p-4 hidden sm:table-cell text-muted-foreground">
                    {formatPriceRange(
                      project.price_min,
                      project.price_max,
                      project.price_on_request
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/properties/${project.slug}`} target="_blank">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          <span className="sr-only sm:not-sr-only sm:ml-1">View</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/properties/${project.id}`}>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          <span className="sr-only sm:not-sr-only sm:ml-1">Edit</span>
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectStatusBadge({ status }: { status: string }) {
  const statusStyles: Record<string, string> = {
    upcoming: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    ongoing:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    completed:
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
        statusStyles[status] || statusStyles.upcoming
      }`}
    >
      {status}
    </span>
  );
}

function TableSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-5 bg-muted rounded w-1/3 animate-pulse" />
              <div className="h-5 bg-muted rounded w-1/4 animate-pulse" />
              <div className="h-5 bg-muted rounded w-1/5 animate-pulse" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
