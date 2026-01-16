import Link from "next/link";
import { Building2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-6 h-6 text-white" />
              <span className="font-bold text-white">Estate Pulse</span>
            </div>
            <p className="text-sm">
              Your trusted partner in finding the perfect property.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/properties" className="hover:text-white">
                  Properties
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-white">
                  Map View
                </Link>
              </li>
              <li>
                <Link href="/saved" className="hover:text-white">
                  Saved
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Property Types</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/properties?type=apartment" className="hover:text-white">
                  Apartments
                </Link>
              </li>
              <li>
                <Link href="/properties?type=villa" className="hover:text-white">
                  Villas
                </Link>
              </li>
              <li>
                <Link href="/properties?type=plot" className="hover:text-white">
                  Plots
                </Link>
              </li>
              <li>
                <Link href="/properties?type=commercial" className="hover:text-white">
                  Commercial
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>contact@estatepulse.com</li>
              <li>+91 98765 43210</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Estate Pulse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
