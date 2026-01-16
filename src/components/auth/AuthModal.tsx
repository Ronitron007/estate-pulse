"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: "login" | "signup";
  redirectTo?: string;
}

export function AuthModal({
  isOpen,
  onClose,
  defaultView = "login",
  redirectTo,
}: AuthModalProps) {
  const [view, setView] = useState<"login" | "signup">(defaultView);
  const [isClosing, setIsClosing] = useState(false);

  // Reset view when modal opens
  useEffect(() => {
    if (isOpen) {
      setView(defaultView);
    }
  }, [isOpen, defaultView]);

  // Prevent body scroll when modal is open
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

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with fade animation */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
          isClosing ? "opacity-0" : "animate-fade-in"
        }`}
        onClick={handleClose}
      />

      {/* Modal with scale animation */}
      <Card
        className={`relative z-10 w-full max-w-md mx-4 transition-all duration-300 ${
          isClosing ? "opacity-0 scale-95" : "animate-scale-in"
        }`}
      >
        {/* Close button with rotation on hover */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute top-3 right-3 group"
          onClick={handleClose}
        >
          <X className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
        </Button>

        <CardHeader className="text-center pt-8">
          {/* Animated title transition */}
          <CardTitle className="transition-all duration-300">
            {view === "login" ? "Welcome back" : "Create an account"}
          </CardTitle>
          <CardDescription className="transition-all duration-300">
            {view === "login"
              ? "Sign in to view prices and save properties"
              : "Sign up to view prices and save properties"}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-8">
          {/* Form with smooth view transition */}
          <div
            className={`transition-all duration-300 ${
              view === "login" ? "animate-fade-in" : "animate-fade-in"
            }`}
          >
            {view === "login" ? (
              <>
                <LoginForm redirectTo={redirectTo} onSuccess={onClose} />
                <p className="text-center text-sm text-gray-500 mt-6">
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => setView("signup")}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </>
            ) : (
              <>
                <SignupForm onSuccess={onClose} />
                <p className="text-center text-sm text-gray-500 mt-6">
                  Already have an account?{" "}
                  <button
                    onClick={() => setView("login")}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
