"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloorPlanLightboxProps {
  src: string;
  alt: string;
  open: boolean;
  onClose: () => void;
}

export function FloorPlanLightbox({ src, alt, open, onClose }: FloorPlanLightboxProps) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm pt-14"
          role="dialog"
          aria-modal="true"
          aria-label="Floor plan viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Button
            variant="ghost"
            size="icon"
            autoFocus
            className="absolute top-4 right-4 h-10 w-10 text-white hover:bg-white/20 rounded-full"
            onClick={onClose}
            aria-label="Close floor plan"
          >
            <X className="w-6 h-6" />
          </Button>
          <motion.img
            src={src}
            alt={alt}
            className="max-w-[90vw] max-h-[80vh] object-contain rounded-sm"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
