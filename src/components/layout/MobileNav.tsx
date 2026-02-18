"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Building2, Map, Heart, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

interface MobileNavProps {
  user: { email: string } | null;
}

export function MobileNav({ user }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => setIsOpen(false);

  const handleSignOut = async () => {
    // Simulate sign out
    handleClose();
  };

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="group"
      >
        <Menu className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50">
            {/* Backdrop with fade animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleClose}
            />

            {/* Drawer with slide animation */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl"
            >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <Link
                href="/"
                className="flex items-center gap-2 group"
                onClick={handleClose}
              >
                <Image src="/logo.png" alt="PerfectGhar.in" width={28} height={28} className="h-7 w-auto" />
                <span className="font-bold">PerfectGhar.in</span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="group hover:bg-gray-100"
              >
                <X className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" />
              </Button>
            </div>

            {/* Navigation links with staggered entrance */}
            <nav className="p-4 space-y-1">
              <Link
                href="/properties"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-all duration-200 opacity-0 animate-bounce-in group"
                style={{ animationDelay: "0.1s" }}
                onClick={handleClose}
              >
                <Building2 className="w-5 h-5 text-gray-600 transition-transform duration-200 group-hover:scale-110" />
                <span>Properties</span>
              </Link>

              <Link
                href="/map"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-all duration-200 opacity-0 animate-bounce-in group"
                style={{ animationDelay: "0.15s" }}
                onClick={handleClose}
              >
                <Map className="w-5 h-5 text-gray-600 transition-transform duration-200 group-hover:scale-110" />
                <span>Map View</span>
              </Link>

              {user && (
                <Link
                  href="/saved"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-all duration-200 opacity-0 animate-bounce-in group"
                  style={{ animationDelay: "0.2s" }}
                  onClick={handleClose}
                >
                  <Heart className="w-5 h-5 text-gray-600 transition-transform duration-200 group-hover:scale-110 group-hover:text-red-500" />
                  <span>Saved</span>
                </Link>
              )}

              <div
                className="border-t my-4 opacity-0 animate-fade-in"
                style={{ animationDelay: "0.25s" }}
              />

              {user ? (
                <>
                  <div
                    className="flex items-center gap-3 p-3 opacity-0 animate-bounce-in"
                    style={{ animationDelay: "0.3s" }}
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-600 truncate">
                      {user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 w-full text-left text-red-600 transition-all duration-200 opacity-0 animate-bounce-in group"
                    style={{ animationDelay: "0.35s" }}
                  >
                    <LogOut className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
                    <span>Sign out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-all duration-200 opacity-0 animate-bounce-in group"
                    style={{ animationDelay: "0.3s" }}
                    onClick={handleClose}
                  >
                    <User className="w-5 h-5 text-gray-600 transition-transform duration-200 group-hover:scale-110" />
                    <span>Login</span>
                  </Link>
                  <div
                    className="opacity-0 animate-bounce-in px-3 pt-2"
                    style={{ animationDelay: "0.35s" }}
                  >
                    <Link href="/signup" onClick={handleClose}>
                      <Button className="w-full relative overflow-hidden group">
                        <span className="relative z-10">Sign Up</span>
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
