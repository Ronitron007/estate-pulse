"use client";

import Link from "next/link";
import { Building2, Map, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function Header() {
  const { user, loading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <header
      className={`bg-white border-b sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo with hover animation */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
          >
            <Building2
              className={`w-8 h-8 text-blue-600 transition-all duration-300 ${
                logoHovered ? "scale-110 rotate-[-5deg]" : ""
              }`}
            />
            <span className="font-bold text-xl transition-colors duration-200 group-hover:text-blue-600">
              Estate Pulse
            </span>
          </Link>

          {/* Navigation with underline animation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/properties"
              className="text-gray-600 hover:text-gray-900 nav-link-hover py-1"
            >
              Properties
            </Link>
            <Link
              href="/map"
              className="text-gray-600 hover:text-gray-900 flex items-center gap-1.5 nav-link-hover py-1 group"
            >
              <Map className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
              Map View
            </Link>
          </nav>

          {/* Auth buttons with hover effects */}
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="w-20 h-8 bg-gray-100 rounded animate-pulse" />
            ) : user ? (
              <>
                <Link
                  href="/saved"
                  className="text-gray-600 hover:text-gray-900 nav-link-hover py-1 hidden sm:block"
                >
                  Saved
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="group"
                >
                  <LogOut className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-0.5" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="relative overflow-hidden group">
                    <span className="relative z-10">Sign Up</span>
                    {/* Subtle shine effect on hover */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <Button variant="ghost" size="icon-sm" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
