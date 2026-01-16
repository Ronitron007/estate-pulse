// Cities in the Tricity region (Chandigarh area)
export const CITIES = [
  "Chandigarh",
  "Mohali",
  "Panchkula",
  "Zirakpur",
  "Kharar",
  "Derabassi",
  "New Chandigarh",
] as const;

export type City = (typeof CITIES)[number];

// Property types
export const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "plot", label: "Plot" },
  { value: "commercial", label: "Commercial" },
  { value: "penthouse", label: "Penthouse" },
] as const;

// Project statuses
export const PROJECT_STATUSES = [
  { value: "upcoming", label: "Upcoming" },
  { value: "ongoing", label: "Under Construction" },
  { value: "completed", label: "Ready to Move" },
] as const;

// BHK options
export const BHK_OPTIONS = [1, 2, 3, 4, 5] as const;

// Price ranges (in paise - multiply by 100)
export const PRICE_RANGES = [
  { min: 0, max: 5000000 * 100, label: "Under 50 Lakh" },
  { min: 5000000 * 100, max: 10000000 * 100, label: "50 Lakh - 1 Cr" },
  { min: 10000000 * 100, max: 20000000 * 100, label: "1 Cr - 2 Cr" },
  { min: 20000000 * 100, max: 50000000 * 100, label: "2 Cr - 5 Cr" },
  { min: 50000000 * 100, max: null, label: "5 Cr+" },
] as const;

// Map defaults
export const DEFAULT_MAP_CENTER = {
  lat: 30.7333,
  lng: 76.7794,
} as const;

export const DEFAULT_MAP_ZOOM = 12;

// Amenity categories
export const AMENITY_CATEGORIES = [
  "Fitness",
  "Recreation",
  "Security",
  "Lifestyle",
  "Convenience",
  "Environment",
] as const;

// Common amenities
export const COMMON_AMENITIES = [
  "Swimming Pool",
  "Gym",
  "Clubhouse",
  "Children's Play Area",
  "Landscaped Gardens",
  "24/7 Security",
  "Power Backup",
  "Parking",
  "Lift",
  "Intercom",
  "Fire Safety",
  "CCTV",
  "Jogging Track",
  "Indoor Games",
  "Tennis Court",
  "Basketball Court",
] as const;

// Contact info
export const CONTACT = {
  email: "contact@estatepulse.com",
  phone: "+91 98765 43210",
  whatsapp: "+919876543210",
} as const;

// Social links
export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/estatepulse",
  instagram: "https://instagram.com/estatepulse",
  twitter: "https://twitter.com/estatepulse",
  linkedin: "https://linkedin.com/company/estatepulse",
} as const;

// App URLs
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://estatepulse.in";
