"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { MobileNav } from "./MobileNav";

const navLinks = [
  { label: "Properties", path: "/properties" },
  { label: "Map", path: "/map" },
  { label: "About", path: "/#why-us" },
];

export function Header() {
  const { user, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  // On homepage: transparent when at top, solid on scroll
  // On other pages: always solid
  const showSolid = !isHome || scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
        showSolid
          ? "bg-card/95 backdrop-blur-md border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="PerfectGhar.in"
            width={40}
            height={40}
            className="h-8 w-auto md:h-10"
          />
          <span
            className={`font-display text-xl font-semibold tracking-tight transition-colors ${
              showSolid ? "text-foreground" : "text-white"
            }`}
          >
            PerfectGhar.in
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                showSolid ? "text-foreground" : "text-white/90"
              } ${pathname === link.path ? "text-primary" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="w-20 h-8 bg-muted rounded-sm animate-pulse" />
          ) : user ? (
            <>
              <Link
                href="/saved"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  showSolid ? "text-foreground" : "text-white/90"
                }`}
              >
                Saved
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="group">
                <LogOut className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-0.5" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className={showSolid ? "" : "text-white hover:text-white hover:bg-white/10"}
                >
                  Login
                </Button>
              </Link>
              <Link
                href="/properties"
                className="bg-primary text-white px-5 py-2 rounded-sm text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                View Properties
              </Link>
            </>
          )}
        </div>

        {/* Mobile nav */}
        <MobileNav user={user ? { email: user.email ?? "" } : null} />
      </div>
    </header>
  );
}
