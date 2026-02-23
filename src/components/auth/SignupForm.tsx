"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SignupFormProps {
  onSuccess?: () => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsappOptIn, setWhatsappOptIn] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  // Password strength indicator
  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { level: 0, text: "" };
    if (pwd.length < 6) return { level: 1, text: "Too short" };
    if (pwd.length < 8) return { level: 2, text: "Fair" };
    if (pwd.length < 12 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return { level: 3, text: "Good" };
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) return { level: 4, text: "Strong" };
    return { level: 2, text: "Fair" };
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthColors = ["", "bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShowError(false);
    setLoading(true);

    // Simulate signup - replace with actual auth
    await new Promise((resolve) => setTimeout(resolve, 1200));

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setShowError(true);
      setLoading(false);
      return;
    }

    if (onSuccess) {
      onSuccess();
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    // Simulate Google OAuth
    console.log("Google signup clicked");
  };

  return (
    <div className="space-y-4">
      {/* Error message with wobble animation */}
      {error && (
        <div
          className={`p-3 text-sm text-red-600 bg-red-50 rounded-sm transition-all duration-200 ${
            showError ? "animate-wobble" : ""
          }`}
          onAnimationEnd={() => setShowError(false)}
        >
          {error}
        </div>
      )}

      {/* Google button */}
      <Button
        type="button"
        variant="outline"
        className="w-full relative overflow-hidden group"
        onClick={handleGoogleSignup}
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 77197 84712"
            required
          />
        </div>

        {/* Password with strength indicator */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
            minLength={6}
            required
          />
          {/* Password strength bar */}
          {password.length > 0 && (
            <div className="space-y-1 animate-fade-in">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      level <= passwordStrength.level
                        ? strengthColors[passwordStrength.level]
                        : "bg-border"
                    }`}
                  />
                ))}
              </div>
              <p
                className={`text-xs transition-colors duration-200 ${
                  passwordStrength.level <= 1
                    ? "text-red-500"
                    : passwordStrength.level === 2
                    ? "text-yellow-600"
                    : passwordStrength.level === 3
                    ? "text-primary"
                    : "text-green-600"
                }`}
              >
                {passwordStrength.text}
              </p>
            </div>
          )}
        </div>

        {/* WhatsApp checkbox with custom animation */}
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => setWhatsappOptIn(!whatsappOptIn)}
            className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
              whatsappOptIn
                ? "bg-blue-600 border-blue-600"
                : "border-gray-300 hover:border-blue-400"
            }`}
          >
            <Check
              className={`w-3 h-3 text-white transition-all duration-200 ${
                whatsappOptIn ? "scale-100 opacity-100" : "scale-0 opacity-0"
              }`}
            />
          </button>
          <Label
            htmlFor="whatsapp"
            className="text-sm text-muted-foreground font-normal cursor-pointer"
            onClick={() => setWhatsappOptIn(!whatsappOptIn)}
          >
            Receive WhatsApp updates about new properties and offers
          </Label>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full relative overflow-hidden group"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              <span className="relative z-10">Create account</span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
