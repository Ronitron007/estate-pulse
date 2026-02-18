# Estate Pulse - MVP Scope Document

**Date:** 2026-01-15
**Sprint Duration:** 6 days
**Target Launch:** 2026-01-21

---

## Executive Summary

Estate Pulse is a builder-focused real estate platform targeting Indian home buyers seeking new construction projects. Based on validated research:

**Core Differentiators:**
1. Zero lead reselling (direct builder contact only)
2. Price reveal after login (proven 2-5% conversion)
3. Map-first discovery (competitive gap)
4. WhatsApp-first notifications (98% open rates)

**6-Day Goal:** Ship a functional property discovery platform with lead capture. Validate core hypothesis: buyers will trade email/phone for transparent pricing.

**Key Metric:** 50+ leads captured in first week post-launch.

---

## Feature Priority Matrix (MoSCoW)

### MUST Have (P0) - Days 1-4

| Feature | Research Validation | Effort | User Impact | Rationale |
|---------|---------------------|--------|-------------|-----------|
| **Property Listings w/ Search & Filters** | Core value | 1.5 days | Critical | No platform without listings. Filter by: city, price range, BHK, possession date |
| **Google Maps Integration** | STRONG - competitive gap | 1 day | High | Map-first UX differentiates. Show markers, basic clustering |
| **Price Reveal After Login** | STRONG - 2-5% conversion | 0.5 days | Critical | Lead generation engine. Show "Starting from $X", gate full breakdown |
| **User Signup (Google + Phone Number)** | Required for lead capture | 0.5 days | Critical | Low-friction auth. Supabase Auth ready |
| **Mobile-Responsive UI** | 81% of 26-34 use mobile | Included | Critical | Tailwind/shadcn inherently responsive |

**P0 Total Effort:** ~3.5 days

---

### SHOULD Have (P1) - Days 4-5

| Feature | Research Validation | Effort | User Impact | Rationale |
|---------|---------------------|--------|-------------|-----------|
| **Save Properties (Favorites)** | Standard expectation | 0.5 days | Medium | Keeps users returning. Simple bookmark mechanic |
| **Property Detail Page** | Core experience | 0.5 days | High | Photos, description, amenities, location. Required for conversion |
| **Inquiry Form (Lead Capture)** | Business requirement | 0.5 days | High | Capture intent beyond signup. Name, phone, preferred time |
| **WhatsApp Opt-in Checkbox** | VERY STRONG for India | 0.25 days | High | Checkbox at signup/inquiry. Store preference for Phase 2 |

**P1 Total Effort:** ~1.75 days

---

### COULD Have (P2) - Day 6 / Buffer

| Feature | Research Validation | Effort | User Impact | Rationale |
|---------|---------------------|--------|-------------|-----------|
| **Compare Up to 4 Properties** | MODERATE-STRONG | 1 day | Medium | Most competitors limit to 2-3. Defer if tight on time |
| **Basic Admin Panel** | Operational need | 1 day | Internal | Add/edit listings. Can use Supabase dashboard initially |
| **Builder Profile (Basic)** | Trust signal | 0.5 days | Medium | Name, logo, contact. Full profiles deferred |

**P2 Total Effort:** ~2.5 days (exceeds buffer - selective inclusion)

---

### WON'T Have (Deferred to Phase 2)

| Feature | Reason for Deferral |
|---------|---------------------|
| **WhatsApp Notifications (Active)** | Requires Business API setup, message templates, backend queues. Capture opt-in now, send later |
| **Email Notifications** | Resend integration straightforward but not launch-critical |
| **Full Admin Panel** | Use Supabase dashboard for MVP. Build proper admin in Phase 2 |
| **Construction Progress Tracking** | High value but complex. Requires builder data pipeline |
| **Builder Ratings/Reviews** | Need user base before reviews have value |
| **Price Breakdown Calculator** | Valuable but secondary to core flow |
| **Shareable Comparison Cards** | Viral mechanic for Phase 2 growth |
| **Draw-on-Map Search** | Cool differentiator but not MVP-critical |
| **RERA Badge Integration** | Requires manual verification process |

---

## 6-Day Sprint Breakdown

### Day 1: Foundation + Core Data

**Morning:**
- [ ] Supabase schema: properties, users, favorites, inquiries
- [ ] PostGIS extension for geo queries
- [ ] Seed 10-15 sample properties (realistic Bangalore data)

**Afternoon:**
- [ ] Property list API endpoint
- [ ] Search/filter API (city, price_min/max, bhk, possession_year)
- [ ] Basic property card component

**Deliverable:** API returns filtered properties, basic card renders

---

### Day 2: Map + Property Cards

**Morning:**
- [ ] Google Maps integration (display markers)
- [ ] Map/list toggle view
- [ ] Marker click shows property preview

**Afternoon:**
- [ ] Property grid layout
- [ ] Filter sidebar UI (shadcn components)
- [ ] Responsive layout (mobile-first)

**Deliverable:** Users can browse properties on map or list, apply filters

---

### Day 3: Auth + Lead Gate

**Morning:**
- [ ] Supabase Auth setup (email + Google OAuth)
- [ ] Login/signup modals
- [ ] Auth context provider

**Afternoon:**
- [ ] Price reveal logic (blurred until login)
- [ ] "Unlock price" CTA
- [ ] Post-login redirect to same property

**Deliverable:** Price gating works end-to-end, leads captured on signup

---

### Day 4: Property Details + Inquiry

**Morning:**
- [ ] Property detail page (/properties/[id])
- [ ] Image gallery (Cloudinary)
- [ ] Amenities, description, location sections

**Afternoon:**
- [ ] Inquiry form component
- [ ] Lead capture API endpoint
- [ ] WhatsApp opt-in checkbox
- [ ] Confirmation state after inquiry

**Deliverable:** Complete property discovery + inquiry flow

---

### Day 5: Favorites + Polish

**Morning:**
- [ ] Save/unsave property API
- [ ] Favorites list page (/favorites)
- [ ] Heart icon on property cards

**Afternoon:**
- [ ] Loading states (skeletons)
- [ ] Error handling
- [ ] Empty states
- [ ] Mobile testing + fixes

**Deliverable:** Core experience polished, mobile-ready

---

### Day 6: Buffer + Launch Prep

**Morning:**
- [ ] Bug fixes from testing
- [ ] Compare feature (if time permits - P2)
- [ ] Basic admin via Supabase dashboard

**Afternoon:**
- [ ] Vercel deployment
- [ ] Environment variables setup
- [ ] Smoke testing on production
- [ ] Launch checklist completion

**Deliverable:** Live on production URL

---

## Data Model (MVP)

```sql
-- Core tables for MVP

CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  builder_name TEXT NOT NULL,
  city TEXT NOT NULL,
  locality TEXT NOT NULL,
  price_min BIGINT NOT NULL,
  price_max BIGINT,
  price_per_sqft INT,
  bhk_options INT[] NOT NULL, -- e.g., {2, 3, 4}
  sqft_min INT,
  sqft_max INT,
  possession_date DATE,
  status TEXT DEFAULT 'under_construction', -- under_construction, ready_to_move
  amenities TEXT[],
  description TEXT,
  images TEXT[], -- Cloudinary URLs
  location GEOGRAPHY(POINT, 4326), -- PostGIS
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  property_id UUID REFERENCES properties(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp_opt_in BOOLEAN DEFAULT false,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User metadata (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  whatsapp_opt_in BOOLEAN DEFAULT false,
  preferred_city TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Success Metrics

### Launch Week (Days 1-7 Post-Launch)

| Metric | Target | Rationale |
|--------|--------|-----------|
| **Leads Captured (signups)** | 50+ | Validates price-gate converts |
| **Inquiry Submissions** | 25+ | Shows high-intent users |
| **WhatsApp Opt-ins** | 40% of signups | Validates notification channel |
| **Properties Viewed** | 500+ | Basic engagement signal |
| **Bounce Rate** | <60% | Content is engaging |
| **Mobile Usage** | >50% | Confirms mobile-first approach |

### Month 1 Targets

| Metric | Target | Rationale |
|--------|--------|-----------|
| **Total Leads** | 200+ | Growth trajectory |
| **Returning Users** | 30%+ | Favorites/compare driving returns |
| **Inquiry-to-Lead Ratio** | 50%+ | High intent conversion |
| **Builder Inquiries** | 5+ | B2B interest signal |

---

## Risk Mitigation

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| **Google Maps API quota** | Medium | Set billing alerts, cache heavily |
| **Low initial inventory** | High | Seed with 15-20 quality listings from public data |
| **Auth flow friction** | Medium | Google OAuth primary, email secondary |
| **Mobile layout breaks** | Medium | Test on real devices Day 5 |
| **Scope creep on compare** | High | Hard cut if Day 6 morning not available |

---

## Tech Stack Confirmation

| Layer | Technology | Status |
|-------|------------|--------|
| Frontend | Next.js 14 (App Router) | Ready |
| Styling | Tailwind CSS + shadcn/ui | Ready |
| Database | Supabase (Postgres + PostGIS) | Ready |
| Auth | Supabase Auth | Ready |
| Images | Cloudinary | Ready |
| Maps | Google Maps JavaScript API | API key needed |
| Deployment | Vercel | Ready |
| Notifications | WhatsApp Business API | Deferred (opt-in captured) |
| Email | Resend | Deferred |

---

## Deferred Features (Phase 2 Backlog)

### High Priority (Week 2-3)
1. WhatsApp notification sending
2. Email notifications
3. Full admin panel (CRUD for properties)
4. Builder profile pages
5. Compare 4 properties (if not in MVP)

### Medium Priority (Week 4-6)
1. Construction progress timeline
2. Price breakdown calculator
3. Shareable comparison cards
4. Builder ratings/reviews
5. Draw-on-map search

### Low Priority (Post-Launch)
1. RERA badge integration
2. Possession date accuracy tracking
3. Amenity delivery tracking
4. Price trend alerts

---

## Unresolved Questions

1. **Sample data source?** Real Bangalore listings from 99acres/MagicBricks or synthetic?
2. **Google Maps API key** - who owns billing account?
3. **Cloudinary account** - existing or new?
4. **Launch city?** Bangalore assumed - confirm?
5. **WhatsApp Business API** - Twilio vs Meta direct? (Phase 2 but affects schema)
6. **Price display** - show full breakdown or just base in MVP?
7. **SEO pages** - static property pages or dynamic only?

---

## Appendix: Feature Validation Summary

| Feature | Validation Source | Strength |
|---------|-------------------|----------|
| Price reveal after login | Industry data: 2-5% conversion | STRONG |
| Google Maps integration | Competitive gap analysis | STRONG |
| WhatsApp notifications | 98% open rates, India preference | VERY STRONG |
| Compare 4 properties | Competitor limit: 2-3 max | MODERATE-STRONG |
| Zero lead reselling | 95%+ complaint rate on spam | CRITICAL DIFFERENTIATOR |
| Builder profiles | Trust signal request: HIGH | VALIDATED |
| Construction progress | Pain point validated | VALIDATED |

---

*Document Version: 1.0*
*Next Review: Post-Sprint Retrospective*
