import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center">
          <SearchX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Page not found</h2>
          <p className="text-gray-600 mb-4">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
          <div className="flex gap-2 justify-center">
            <Link href="/">
              <Button>Go home</Button>
            </Link>
            <Link href="/properties">
              <Button variant="outline">Browse properties</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
