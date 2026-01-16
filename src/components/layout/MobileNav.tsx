"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Building2, Map, Heart, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface MobileNavProps {
  user: SupabaseUser | null;
}

export function MobileNav({ user }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
        <Menu className="w-6 h-6" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <Building2 className="w-6 h-6 text-blue-600" />
                <span className="font-bold">Estate Pulse</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <nav className="p-4 space-y-2">
              <Link
                href="/properties"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <Building2 className="w-5 h-5 text-gray-600" />
                <span>Properties</span>
              </Link>

              <Link
                href="/map"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <Map className="w-5 h-5 text-gray-600" />
                <span>Map View</span>
              </Link>

              {user && (
                <Link
                  href="/saved"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <Heart className="w-5 h-5 text-gray-600" />
                  <span>Saved</span>
                </Link>
              )}

              <div className="border-t my-4" />

              {user ? (
                <>
                  <div className="flex items-center gap-3 p-3">
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-600 truncate">
                      {user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 w-full text-left text-red-600"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="w-5 h-5 text-gray-600" />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
