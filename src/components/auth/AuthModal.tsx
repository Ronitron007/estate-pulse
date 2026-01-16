"use client";

import { useState } from "react";
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <Card className="relative z-10 w-full max-w-md mx-4">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>

        <CardHeader className="text-center">
          <CardTitle>
            {view === "login" ? "Welcome back" : "Create an account"}
          </CardTitle>
          <CardDescription>
            {view === "login"
              ? "Sign in to view prices and save properties"
              : "Sign up to view prices and save properties"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {view === "login" ? (
            <>
              <LoginForm redirectTo={redirectTo} onSuccess={onClose} />
              <p className="text-center text-sm text-gray-500 mt-4">
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => setView("signup")}
                  className="text-blue-600 hover:underline"
                >
                  Sign up
                </button>
              </p>
            </>
          ) : (
            <>
              <SignupForm onSuccess={onClose} />
              <p className="text-center text-sm text-gray-500 mt-4">
                Already have an account?{" "}
                <button
                  onClick={() => setView("login")}
                  className="text-blue-600 hover:underline"
                >
                  Sign in
                </button>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
