"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { InquiryStatus } from "@/types/database";

interface InquiriesFiltersProps {
  currentStatus?: InquiryStatus;
}

const statuses: { value: InquiryStatus | ""; label: string }[] = [
  { value: "", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "site_visit_scheduled", label: "Visit Scheduled" },
  { value: "site_visit_done", label: "Visit Done" },
  { value: "negotiation", label: "Negotiation" },
  { value: "qualified", label: "Qualified" },
  { value: "converted", label: "Converted" },
  { value: "closed", label: "Closed" },
  { value: "lost", label: "Lost" },
];

export function InquiriesFilters({ currentStatus }: InquiriesFiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (status: string) => {
    startTransition(() => {
      if (status) {
        router.push(`/admin/inquiries?status=${status}`);
      } else {
        router.push("/admin/inquiries");
      }
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map(({ value, label }) => (
        <Button
          key={value}
          variant={currentStatus === value || (!currentStatus && !value) ? "default" : "outline"}
          size="sm"
          onClick={() => handleStatusChange(value)}
          disabled={isPending}
          className={cn(
            "transition-all",
            isPending && "opacity-70"
          )}
        >
          {label}
        </Button>
      ))}

      {isPending && (
        <div className="flex items-center ml-2">
          <svg className="w-4 h-4 animate-spin text-muted-foreground" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
