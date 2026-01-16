import Link from "next/link";
import { Building2, Heart, ArrowUp } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand section */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <Building2 className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-5deg]" />
              <span className="font-bold text-white">Estate Pulse</span>
            </Link>
            <p className="text-sm">
              Your trusted partner in finding the perfect property.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/properties"
                  className="hover:text-white transition-all duration-200 inline-block hover:translate-x-1"
                >
                  Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/map"
                  className="hover:text-white transition-all duration-200 inline-block hover:translate-x-1"
                >
                  Map View
                </Link>
              </li>
              <li>
                <Link
                  href="/saved"
                  className="hover:text-white transition-all duration-200 inline-block hover:translate-x-1"
                >
                  Saved
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="font-semibold text-white mb-4">Property Types</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/properties?type=apartment"
                  className="hover:text-white transition-all duration-200 inline-block hover:translate-x-1"
                >
                  Apartments
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?type=villa"
                  className="hover:text-white transition-all duration-200 inline-block hover:translate-x-1"
                >
                  Villas
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?type=plot"
                  className="hover:text-white transition-all duration-200 inline-block hover:translate-x-1"
                >
                  Plots
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?type=commercial"
                  className="hover:text-white transition-all duration-200 inline-block hover:translate-x-1"
                >
                  Commercial
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white transition-colors duration-200 cursor-pointer">
                contact@estatepulse.com
              </li>
              <li className="hover:text-white transition-colors duration-200 cursor-pointer">
                +91 98765 43210
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar with fun hover effect */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="flex items-center gap-1">
            Made with{" "}
            <Heart className="w-4 h-4 text-red-500 animate-gentle-pulse" />{" "}
            by Estate Pulse Team
          </p>
          <p>
            &copy; {new Date().getFullYear()} Estate Pulse. All rights reserved.
          </p>
          {/* Scroll to top button */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 pointer-events-none transition-all duration-300 hover:bg-blue-700 hover:scale-110 active:scale-95 [.scrolled_&]:opacity-100 [.scrolled_&]:pointer-events-auto group"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
