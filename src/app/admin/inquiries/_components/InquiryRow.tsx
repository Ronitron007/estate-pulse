"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { updateInquiryStatusAction } from "../actions";
import type { Inquiry, InquiryStatus } from "@/types/database";

interface InquiryRowProps {
  inquiry: Inquiry;
}

export function InquiryRow({ inquiry }: InquiryRowProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);

  const handleStatusUpdate = async (newStatus: InquiryStatus) => {
    startTransition(async () => {
      await updateInquiryStatusAction(inquiry.id, newStatus);
      router.refresh();
    });
  };

  return (
    <>
      <tr className="border-b last:border-0 hover:bg-muted/30 transition-colors">
        <td className="p-4">
          <div>
            <p className="font-medium">{inquiry.name}</p>
            <p className="text-sm text-muted-foreground md:hidden">
              {inquiry.email}
            </p>
          </div>
        </td>
        <td className="p-4 hidden md:table-cell">
          <div>
            <p className="text-sm">{inquiry.email}</p>
            <p className="text-sm text-muted-foreground">{inquiry.phone}</p>
          </div>
        </td>
        <td className="p-4 hidden lg:table-cell text-muted-foreground">
          {inquiry.project ? (
            <Link
              href={`/properties/${inquiry.project.slug}`}
              target="_blank"
              className="hover:text-foreground hover:underline"
            >
              {inquiry.project.name}
            </Link>
          ) : (
            <span className="text-muted-foreground/50">General</span>
          )}
        </td>
        <td className="p-4 hidden sm:table-cell">
          <StatusBadge status={inquiry.status} />
        </td>
        <td className="p-4 hidden xl:table-cell text-sm text-muted-foreground">
          {formatDate(inquiry.created_at)}
        </td>
        <td className="p-4">
          <div className="flex items-center gap-1">
            {/* View message */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowModal(true)}
              title="View details"
            >
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
            </Button>

            {/* Quick actions dropdown */}
            <div className="relative group">
              <Button
                variant="ghost"
                size="sm"
                disabled={isPending}
                title="Change status"
              >
                {isPending ? (
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                  >
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
                ) : (
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
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                )}
              </Button>
              <div className="absolute right-0 top-full mt-1 w-36 bg-background border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <div className="py-1">
                  {inquiry.status !== "contacted" && (
                    <button
                      onClick={() => handleStatusUpdate("contacted")}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
                    >
                      Mark Contacted
                    </button>
                  )}
                  {inquiry.status !== "qualified" && (
                    <button
                      onClick={() => handleStatusUpdate("qualified")}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
                    >
                      Mark Qualified
                    </button>
                  )}
                  {inquiry.status !== "converted" && (
                    <button
                      onClick={() => handleStatusUpdate("converted")}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
                    >
                      Mark Converted
                    </button>
                  )}
                  {inquiry.status !== "closed" && (
                    <button
                      onClick={() => handleStatusUpdate("closed")}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors text-muted-foreground"
                    >
                      Close Inquiry
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>

      {/* Modal */}
      {showModal && (
        <InquiryModal inquiry={inquiry} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

function StatusBadge({ status }: { status: InquiryStatus }) {
  const statusStyles: Record<InquiryStatus, string> = {
    new: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    contacted:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    qualified:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    converted:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    closed: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

function InquiryModal({
  inquiry,
  onClose,
}: {
  inquiry: Inquiry;
  onClose: () => void;
}) {
  return (
    <tr>
      <td colSpan={6} className="p-0">
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div
            className="bg-background rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-lg">Inquiry Details</h3>
              <button
                onClick={onClose}
                className="p-1 hover:bg-muted rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{inquiry.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge status={inquiry.status} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a
                    href={`mailto:${inquiry.email}`}
                    className="text-primary hover:underline"
                  >
                    {inquiry.email}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <a
                    href={`tel:${inquiry.phone}`}
                    className="text-primary hover:underline"
                  >
                    {inquiry.phone}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Property</p>
                  <p>
                    {inquiry.project ? (
                      <Link
                        href={`/properties/${inquiry.project.slug}`}
                        target="_blank"
                        className="text-primary hover:underline"
                      >
                        {inquiry.project.name}
                      </Link>
                    ) : (
                      "General Inquiry"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p>{formatDate(inquiry.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp</p>
                  <p>{inquiry.whatsapp_opt_in ? "Opted in" : "Not opted in"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Source</p>
                  <p className="capitalize">{inquiry.source || "website"}</p>
                </div>
              </div>

              {inquiry.message && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Message</p>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">
                      {inquiry.message}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button asChild>
                <a href={`mailto:${inquiry.email}`}>
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Send Email
                </a>
              </Button>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}
