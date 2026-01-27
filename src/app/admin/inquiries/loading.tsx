import { Card, CardContent } from "@/components/ui/card";

export default function InquiriesLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div>
        <div className="h-8 w-28 bg-muted rounded animate-pulse" />
        <div className="h-4 w-52 bg-muted rounded animate-pulse mt-2" />
      </div>

      {/* Filters skeleton */}
      <div className="flex flex-wrap gap-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-8 w-20 bg-muted rounded animate-pulse" />
        ))}
      </div>

      {/* Table skeleton */}
      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <div className="h-5 w-20 bg-muted rounded animate-pulse" />
          </div>
          <div className="divide-y">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-40 bg-muted rounded animate-pulse" />
                </div>
                <div className="hidden md:block space-y-1">
                  <div className="h-3 w-36 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-4 w-28 bg-muted rounded animate-pulse hidden lg:block" />
                <div className="h-6 w-20 bg-muted rounded-full animate-pulse hidden sm:block" />
                <div className="h-4 w-16 bg-muted rounded animate-pulse hidden xl:block" />
                <div className="flex gap-1">
                  <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                  <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
