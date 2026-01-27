import { Suspense } from "react";
import Link from "next/link";
import { getAllInquiries } from "@/lib/queries/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InquiriesFilters } from "./_components/InquiriesFilters";
import { InquiryRow } from "./_components/InquiryRow";
import type { InquiryStatus } from "@/types/database";

interface Props {
  searchParams: Promise<{
    status?: InquiryStatus;
  }>;
}

export default async function AdminInquiriesPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold">Inquiries</h1>
        <p className="text-muted-foreground">
          Manage customer inquiries and leads
        </p>
      </div>

      {/* Filters */}
      <InquiriesFilters currentStatus={params.status} />

      {/* Inquiries table */}
      <Suspense fallback={<TableSkeleton />}>
        <InquiriesTable status={params.status} />
      </Suspense>
    </div>
  );
}

async function InquiriesTable({ status }: { status?: InquiryStatus }) {
  const inquiries = await getAllInquiries(status);

  if (inquiries.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No inquiries found</p>
          {status && (
            <Button variant="link" asChild className="mt-2">
              <Link href="/admin/inquiries">View all inquiries</Link>
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
          {inquiries.length} {inquiries.length === 1 ? "Inquiry" : "Inquiries"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 font-medium text-sm">Name</th>
                <th className="text-left p-4 font-medium text-sm hidden md:table-cell">
                  Contact
                </th>
                <th className="text-left p-4 font-medium text-sm hidden lg:table-cell">
                  Property
                </th>
                <th className="text-left p-4 font-medium text-sm hidden sm:table-cell">
                  Status
                </th>
                <th className="text-left p-4 font-medium text-sm hidden xl:table-cell">
                  Date
                </th>
                <th className="text-left p-4 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry) => (
                <InquiryRow key={inquiry.id} inquiry={inquiry} />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function TableSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-5 bg-muted rounded w-1/4 animate-pulse" />
              <div className="h-5 bg-muted rounded w-1/4 animate-pulse" />
              <div className="h-5 bg-muted rounded w-1/5 animate-pulse" />
              <div className="h-5 bg-muted rounded w-1/6 animate-pulse" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
