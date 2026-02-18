# Project: Estate Pulse

## Current Phase: 1 (Foundation)
## Last Updated: 2026-01-12

---

## PRD Summary
Real estate listings website showcasing builder projects with search, maps, comparisons, and lead capture.

**Target User:** Home buyers looking for new residential projects
**Core Problem:** Fragmented info about builder projects, hard to compare options
**Key Differentiator:** Clean UI, all projects on map, easy comparison, login-gated pricing

---

## MVP Features
- [ ] Property listings with search/filters
- [ ] Google Maps integration (all properties on map)
- [ ] User signup (email + Google)
- [ ] Price reveal after login
- [ ] Save properties (favorites)
- [ ] Compare up to 4 properties
- [ ] Inquiry form with lead capture
- [ ] Admin panel for managing listings
- [ ] Email + WhatsApp notifications for leads

---

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Supabase (Postgres + PostGIS)
- **Auth:** Supabase Auth (email + Google)
- **Images:** Cloudinary
- **Maps:** Google Maps Platform
- **Email:** Resend
- **Notifications:** WhatsApp Business API
- **Deployment:** Vercel

---

## Database Schema

### Core Tables
| Table | Purpose |
|-------|---------|
| `projects` | Main listings with PostGIS location |
| `configurations` | Unit types (2BHK, 3BHK, etc) |
| `project_images` | Cloudinary public_ids |
| `builders` | Developer/builder profiles |
| `amenities` | Gym, pool, parking, etc |
| `project_amenities` | Junction table |

### User Tables
| Table | Purpose |
|-------|---------|
| `user_profiles` | Extends auth.users |
| `saved_properties` | User favorites |
| `comparison_lists` | Compare up to 4 |
| `inquiries` | Lead capture |
| `admin_users` | Role-based access |

---

## Key Decisions
| Decision | Choice | Rationale |
|----------|--------|-----------|
| Backend | Supabase | All-in-one, PostGIS, good DX |
| Images | Cloudinary | Auto optimization, CDN |
| Pricing | Login-gated | Lead generation |
| Admin | Custom forms | Simpler than CMS |
| Notifications | Email + WhatsApp | User preference |

---

## Active Constraints
- **Scale:** 100-1000 properties
- **Admin:** Single admin initially, may add editor later
- **Budget:** Free tiers where possible, minimal paid services

---

## Handoff Notes
**Last Agent:** backend-architect (designed schema + architecture)
**Next Agent:** rapid-prototyper (scaffold Next.js app)
**Context:** Schema designed, stack decided, ready to scaffold
