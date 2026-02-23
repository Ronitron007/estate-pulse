"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

interface MobileNavProps {
  user: { email: string } | null;
}

const navLinks = [
  { label: "Properties", path: "/properties" },
  { label: "Map View", path: "/map" },
];

export function MobileNav({ user }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const overlay = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] bg-background md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Close button */}
          <div className="flex justify-end p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              aria-label="Close menu"
              className="h-10 w-10"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col px-8 pt-8">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
              >
                <Link
                  href={link.path}
                  className="block py-4 font-display text-3xl font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
                  onClick={handleClose}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            {user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
              >
                <Link
                  href="/saved"
                  className="block py-4 font-display text-3xl font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
                  onClick={handleClose}
                >
                  Saved
                </Link>
              </motion.div>
            )}
          </nav>

          {/* Bottom section — auth */}
          <div className="absolute bottom-0 left-0 right-0 px-8 pb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
            >
              {user ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  <Link
                    href="/login"
                    className="block text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    onClick={handleClose}
                  >
                    Sign out
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link href="/login" onClick={handleClose}>
                    <span className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground">
                      Login
                    </span>
                  </Link>
                  <Link href="/signup" onClick={handleClose}>
                    <Button className="w-full h-12 text-base font-semibold">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        className="h-10 w-10"
      >
        <Menu className="w-6 h-6" />
      </Button>

      {mounted && createPortal(overlay, document.body)}
    </div>
  );
}
