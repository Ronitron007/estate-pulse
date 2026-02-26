"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-midnight text-white/80">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="PerfectGhar.in" width={36} height={36} className="h-9 w-auto" />
              <span className="font-display text-xl font-semibold text-white">PerfectGhar.in</span>
            </Link>
            <p className="text-sm leading-relaxed text-white/60">
              Premium verified real estate listings across Chandigarh Tricity.
              Transparent pricing, 3D walkthroughs, and RERA-approved properties.
            </p>
          </div>

          <div>
            <h4 className="font-display text-lg text-white mb-4">Quick Links</h4>
            <div className="space-y-2">
              {[
                { label: "Properties", href: "/properties" },
                { label: "Map View", href: "/map" },
                { label: "About Us", href: "/#why-us" },
                { label: "Contact", href: "/#contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-white/60 hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg text-white mb-4">Locations</h4>
            <div className="space-y-2">
              {["Chandigarh", "Mohali", "Panchkula", "Zirakpur", "New Chandigarh"].map((loc) => (
                <Link
                  key={loc}
                  href={`/properties?city=${encodeURIComponent(loc)}`}
                  className="flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors"
                >
                  <MapPin className="w-3 h-3" /> {loc}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg text-white mb-4">Contact Us</h4>
            <div className="space-y-3">
              <a
                href="tel:+917719784712"
                className="flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" /> +91 77197 84712
              </a>
              <a
                href="mailto:hello@perfectghar.in"
                className="flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" /> hello@perfectghar.in
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} PerfectGhar.in. All rights reserved.
          </p>
          <p className="text-xs text-white/40">RERA Registered | Transparent Real Estate</p>
        </div>
      </div>
    </footer>
  );
}
