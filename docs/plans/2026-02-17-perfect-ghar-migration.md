# Perfect-Ghar → Estate-Pulse Migration Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Port perfect-ghar's color palette, property detail sections, lead capture form, email notifications, and Framer Motion animations into estate-pulse.

**Architecture:** Six independent workstreams executed in order: (1) design tokens, (2) DB migrations, (3) property detail page enhancements, (4) lead form replacement + email, (5) admin CRM enhancements, (6) Framer Motion. Each task commits independently.

**Tech Stack:** Next.js 16, Supabase, Tailwind CSS v4, Resend (email), Framer Motion, TypeScript

---

## Task 1: Color Palette + Typography Migration

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

**Step 1: Replace CSS variables in globals.css**

Replace the entire `:root` block (and `.dark` block) with:

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --background: 40 20% 98%;
  --foreground: 220 20% 10%;
  --primary: 40 60% 45%;
  --primary-foreground: 0 0% 100%;
  --secondary: 220 15% 95%;
  --secondary-foreground: 220 20% 10%;
  --muted: 40 10% 94%;
  --muted-foreground: 220 10% 45%;
  --accent: 40 70% 50%;
  --accent-foreground: 0 0% 100%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 100%;
  --border: 40 15% 88%;
  --input: 40 15% 88%;
  --ring: 40 60% 45%;
  --radius: 0.5rem;

  /* Custom tokens */
  --gold: 40 60% 45%;
  --gold-light: 40 50% 70%;
  --gold-dark: 40 70% 30%;
  --charcoal: 220 20% 12%;
  --charcoal-light: 220 15% 25%;
  --warm-white: 40 20% 98%;
  --warm-gray: 40 10% 60%;

  --gradient-gold: linear-gradient(135deg, hsl(40 60% 45%), hsl(40 70% 55%));
  --gradient-dark: linear-gradient(135deg, hsl(220 20% 8%), hsl(220 20% 15%));

  --shadow-card: 0 4px 24px -4px hsl(220 20% 10% / 0.08);
  --shadow-card-hover: 0 12px 40px -8px hsl(220 20% 10% / 0.15);
  --shadow-gold: 0 4px 20px -4px hsl(40 60% 45% / 0.3);
}

.dark {
  --background: 220 20% 8%;
  --foreground: 40 10% 95%;
  --primary: 40 60% 50%;
  --primary-foreground: 220 20% 8%;
  --secondary: 220 20% 15%;
  --secondary-foreground: 40 10% 95%;
  --muted: 220 20% 12%;
  --muted-foreground: 220 10% 60%;
  --accent: 40 70% 55%;
  --accent-foreground: 220 20% 8%;
  --border: 220 15% 20%;
  --input: 220 15% 20%;
  --ring: 40 60% 50%;
}
```

Keep all existing animation keyframes and utility classes below — do NOT remove them.

**Step 2: Add font classes to layout.tsx**

In `src/app/layout.tsx`, add `font-sans` to the body className and add a `font-display` class definition. Add to `<html>` tag:

```tsx
// Add to globals.css after the @import line:
body {
  font-family: 'Inter', sans-serif;
}

.font-display {
  font-family: 'Playfair Display', serif;
}
```

**Step 3: Add gradient-gold utility to globals.css**

```css
.bg-gradient-gold {
  background: var(--gradient-gold);
}

.text-gold {
  color: hsl(var(--gold));
}
```

**Step 4: Verify visually**

Run: `cd /Users/rohanmalik/Projects/estate-pulse && npm run dev`

Open `http://localhost:3000` — site should now show warm cream background with gold accents instead of gray/white.

**Step 5: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "feat: migrate color palette and typography from perfect-ghar"
```

---

## Task 2: DB Migrations — Projects Table New Fields

**Files:**
- Create: `supabase/migrations/20260217000001_project_rich_fields.sql`

**Step 1: Write migration**

```sql
-- Add rich detail fields to projects table
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS booking_amount          BIGINT,
  ADD COLUMN IF NOT EXISTS maintenance_charges     INTEGER,       -- per month in ₹
  ADD COLUMN IF NOT EXISTS price_per_sqft          INTEGER,
  ADD COLUMN IF NOT EXISTS vastu_compliant         BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS gated_community         BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS matterport_url          TEXT,
  ADD COLUMN IF NOT EXISTS video_url               TEXT,
  ADD COLUMN IF NOT EXISTS location_advantages     JSONB DEFAULT '{}'::jsonb,
  -- shape: { airportKm, itParkKm, schoolsKm, hospitalsKm, marketKm }
  ADD COLUMN IF NOT EXISTS project_details_extra   JSONB DEFAULT '{}'::jsonb,
  -- shape: { totalTowers, totalUnits, floors, constructionStatus, facingOptions[] }
  ADD COLUMN IF NOT EXISTS investment_data         JSONB DEFAULT '{}'::jsonb;
  -- shape: { rentalYieldPct, appreciationTrendText, futureInfrastructureText, developerTrackRecordSummary }

COMMENT ON COLUMN projects.location_advantages IS 'JSONB: { airportKm, itParkKm, schoolsKm, hospitalsKm, marketKm }';
COMMENT ON COLUMN projects.project_details_extra IS 'JSONB: { totalTowers, totalUnits, floors, constructionStatus, facingOptions }';
COMMENT ON COLUMN projects.investment_data IS 'JSONB: { rentalYieldPct, appreciationTrendText, futureInfrastructureText, developerTrackRecordSummary }';
```

Note: using `project_details_extra` to avoid collision with existing `configurations` relation.

**Step 2: Apply migration**

```bash
cd /Users/rohanmalik/Projects/estate-pulse
npx supabase db push
# or: npx supabase migration up
```

Expected: migration applied, no errors.

**Step 3: Update TypeScript DB types**

```bash
npx supabase gen types typescript --local > src/lib/database.types.ts
```

**Step 4: Commit**

```bash
git add supabase/migrations/20260217000001_project_rich_fields.sql src/lib/database.types.ts
git commit -m "feat: add rich property detail fields to projects table"
```

---

## Task 3: DB Migrations — Inquiries Table Extended Fields

**Files:**
- Create: `supabase/migrations/20260217000002_inquiry_extended_fields.sql`

**Step 1: Write migration**

```sql
-- Extend inquiries table for richer lead capture
ALTER TABLE inquiries
  ADD COLUMN IF NOT EXISTS budget         TEXT,
  -- values: 'under_50l' | '50l_1cr' | '1cr_2cr' | '2cr_plus'
  ADD COLUMN IF NOT EXISTS timeline       TEXT,
  -- values: 'immediately' | '1_3_months' | '3_6_months' | 'exploring'
  ADD COLUMN IF NOT EXISTS property_title TEXT,
  ADD COLUMN IF NOT EXISTS notes          TEXT;
  -- admin-only internal notes field

-- Extend status enum to include site visit and negotiation stages
-- First check if using enum or text:
-- If status is text column, just update constraints; if enum, alter enum.

-- Add new statuses to existing check constraint if text-based:
ALTER TABLE inquiries
  DROP CONSTRAINT IF EXISTS inquiries_status_check;

ALTER TABLE inquiries
  ADD CONSTRAINT inquiries_status_check CHECK (
    status IN (
      'new',
      'contacted',
      'site_visit_scheduled',
      'site_visit_done',
      'negotiation',
      'qualified',
      'converted',
      'closed',
      'lost'
    )
  );
```

**Step 2: Apply + regen types**

```bash
npx supabase db push
npx supabase gen types typescript --local > src/lib/database.types.ts
```

**Step 3: Update status type in queries file**

In `src/lib/queries/inquiries.ts`, update the status union type:

```typescript
export type InquiryStatus =
  | 'new'
  | 'contacted'
  | 'site_visit_scheduled'
  | 'site_visit_done'
  | 'negotiation'
  | 'qualified'
  | 'converted'
  | 'closed'
  | 'lost';
```

**Step 4: Commit**

```bash
git add supabase/migrations/20260217000002_inquiry_extended_fields.sql src/lib/database.types.ts src/lib/queries/inquiries.ts
git commit -m "feat: extend inquiries table with budget, timeline, notes and extra statuses"
```

---

## Task 4: Replace Lead Capture Form

**Files:**
- Modify: `src/components/property/InquiryForm.tsx`
- Modify: `src/app/api/inquiries/route.ts`

**Step 1: Replace InquiryForm.tsx entirely**

Replace with this new form (drop `message` and `whatsappOptIn`, add `budget`, `timeline`, `propertyTitle`):

```tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle } from 'lucide-react';

const schema = z.object({
  name: z.string().trim().min(1, 'Name required').max(100),
  phone: z.string().trim().regex(/^[0-9+\-\s()]{7,20}$/, 'Invalid phone number'),
  email: z.union([z.literal(''), z.string().trim().email('Invalid email')]),
  budget: z.string().optional(),
  timeline: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface InquiryFormProps {
  projectId?: string;
  propertyTitle?: string;
  compact?: boolean;
}

const BUDGET_OPTIONS = [
  { value: 'under_50l', label: 'Under ₹50 Lakh' },
  { value: '50l_1cr', label: '₹50 Lakh – ₹1 Cr' },
  { value: '1cr_2cr', label: '₹1 Cr – ₹2 Cr' },
  { value: '2cr_plus', label: '₹2 Cr+' },
];

const TIMELINE_OPTIONS = [
  { value: 'immediately', label: 'Immediately' },
  { value: '1_3_months', label: '1–3 Months' },
  { value: '3_6_months', label: '3–6 Months' },
  { value: 'exploring', label: 'Just Exploring' },
];

export function InquiryForm({ projectId, propertyTitle, compact = false }: InquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, projectId, propertyTitle }),
      });
      if (!res.ok) throw new Error('Failed');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      // show inline error
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle className="h-10 w-10 text-green-600" />
        <p className="font-display text-lg font-semibold">Thank you!</p>
        <p className="text-sm text-muted-foreground">Our expert will call you within 30 minutes.</p>
        <a
          href={`https://wa.me/919646684712?text=${encodeURIComponent(`Hi, I'm interested in ${propertyTitle ?? 'a property'}.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 rounded-lg bg-[hsl(142,70%,40%)] px-4 py-2 text-sm font-medium text-white"
        >
          Chat on WhatsApp
        </a>
      </div>
    );
  }

  const p = compact ? 'space-y-3' : 'space-y-4';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={p}>
      <div>
        <input
          {...register('name')}
          placeholder="Full Name *"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
      </div>
      <div>
        <input
          {...register('phone')}
          placeholder="Phone Number *"
          type="tel"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
      </div>
      <input
        {...register('email')}
        placeholder="Email Address (optional)"
        type="email"
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <select
        {...register('budget')}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">Budget Range (optional)</option>
        {BUDGET_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <select
        {...register('timeline')}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">Timeline to Buy (optional)</option>
        {TIMELINE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-gradient-gold px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? 'Sending…' : 'Request Callback'}
      </button>
    </form>
  );
}
```

**Step 2: Update API route to accept new fields**

In `src/app/api/inquiries/route.ts`, update the POST handler body parsing:

```typescript
const { projectId, name, email, phone, budget, timeline, propertyTitle } = await req.json();

// Validation
if (!name || !phone) {
  return NextResponse.json({ error: 'name and phone required' }, { status: 400 });
}

// DB insert
const { error } = await supabase.from('inquiries').insert({
  project_id: projectId ?? null,
  name,
  email: email || null,
  phone,
  budget: budget || null,
  timeline: timeline || null,
  property_title: propertyTitle || null,
  status: 'new',
  source: 'website',
});
```

Remove `message`, `whatsapp_opt_in` from the insert.

**Step 3: Commit**

```bash
git add src/components/property/InquiryForm.tsx src/app/api/inquiries/route.ts
git commit -m "feat: replace inquiry form with budget/timeline fields, remove message field"
```

---

## Task 5: Inquiry Email Notifications via Resend

**Files:**
- Create: `src/lib/email.ts`
- Modify: `src/app/api/inquiries/route.ts`
- Modify: `.env.example`

**Step 1: Install Resend SDK**

```bash
cd /Users/rohanmalik/Projects/estate-pulse && npm install resend
```

**Step 2: Create email helper**

Create `src/lib/email.ts`:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface InquiryEmailData {
  name: string;
  phone: string;
  email?: string;
  budget?: string;
  timeline?: string;
  propertyTitle?: string;
}

const BUDGET_LABELS: Record<string, string> = {
  under_50l: 'Under ₹50 Lakh',
  '50l_1cr': '₹50 Lakh – ₹1 Cr',
  '1cr_2cr': '₹1 Cr – ₹2 Cr',
  '2cr_plus': '₹2 Cr+',
};

const TIMELINE_LABELS: Record<string, string> = {
  immediately: 'Immediately',
  '1_3_months': '1–3 Months',
  '3_6_months': '3–6 Months',
  exploring: 'Just Exploring',
};

export async function sendInquiryNotification(data: InquiryEmailData) {
  const to = process.env.INQUIRY_NOTIFICATION_EMAIL;
  if (!to) {
    console.warn('INQUIRY_NOTIFICATION_EMAIL not set — skipping email');
    return;
  }

  const subject = data.propertyTitle
    ? `New Inquiry: ${data.propertyTitle}`
    : 'New Property Inquiry';

  const html = `
    <h2 style="font-family: sans-serif; color: #1a1a2e;">New Inquiry Received</h2>
    <table style="font-family: sans-serif; border-collapse: collapse; width: 100%; max-width: 480px;">
      <tr><td style="padding: 8px 0; color: #666; width: 140px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${data.name}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0; font-weight: 600;">${data.phone}</td></tr>
      ${data.email ? `<tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;">${data.email}</td></tr>` : ''}
      ${data.propertyTitle ? `<tr><td style="padding: 8px 0; color: #666;">Property</td><td style="padding: 8px 0;">${data.propertyTitle}</td></tr>` : ''}
      ${data.budget ? `<tr><td style="padding: 8px 0; color: #666;">Budget</td><td style="padding: 8px 0;">${BUDGET_LABELS[data.budget] ?? data.budget}</td></tr>` : ''}
      ${data.timeline ? `<tr><td style="padding: 8px 0; color: #666;">Timeline</td><td style="padding: 8px 0;">${TIMELINE_LABELS[data.timeline] ?? data.timeline}</td></tr>` : ''}
    </table>
    <p style="font-family: sans-serif; color: #999; font-size: 12px; margin-top: 24px;">Sent from Estate Pulse inquiry form</p>
  `;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'inquiries@estatepulse.in',
    to,
    subject,
    html,
  });
}
```

**Step 3: Wire into API route**

In `src/app/api/inquiries/route.ts`, after the DB insert succeeds:

```typescript
import { sendInquiryNotification } from '@/lib/email';

// After successful insert:
try {
  await sendInquiryNotification({ name, phone, email, budget, timeline, propertyTitle });
} catch (emailErr) {
  // Don't fail the request if email fails — just log
  console.error('Inquiry email failed:', emailErr);
}
```

**Step 4: Update .env.example**

Add to `.env.example`:
```
INQUIRY_NOTIFICATION_EMAIL=you@example.com
RESEND_FROM_EMAIL=inquiries@yourdomain.com
```

**Step 5: Commit**

```bash
git add src/lib/email.ts src/app/api/inquiries/route.ts .env.example package.json package-lock.json
git commit -m "feat: send email notification on new inquiry via Resend"
```

---

## Task 6: Property Detail Page — Missing Sections

**Files:**
- Modify: `src/app/(main)/properties/[slug]/page.tsx`
- Create: `src/components/property/LocationAdvantages.tsx`
- Create: `src/components/property/InvestmentInsights.tsx`
- Create: `src/components/property/ProjectDetailStats.tsx`
- Create: `src/components/property/QuickCtaSidebar.tsx`
- Modify: `src/lib/queries/projects.ts`

**Step 1: Update getProjectBySlug query to include new fields**

In `src/lib/queries/projects.ts`, ensure the select includes:
```typescript
`..., booking_amount, maintenance_charges, price_per_sqft, vastu_compliant, gated_community, matterport_url, video_url, location_advantages, project_details_extra, investment_data`
```

**Step 2: Create LocationAdvantages component**

Create `src/components/property/LocationAdvantages.tsx`:

```tsx
import { Plane, Building2, GraduationCap, Heart, ShoppingBag } from 'lucide-react';

const ICONS = {
  airportKm: { icon: Plane, label: 'Airport' },
  itParkKm: { icon: Building2, label: 'IT Park' },
  schoolsKm: { icon: GraduationCap, label: 'Schools' },
  hospitalsKm: { icon: Heart, label: 'Hospitals' },
  marketKm: { icon: ShoppingBag, label: 'Market' },
};

type LocationAdvantagesData = Partial<Record<keyof typeof ICONS, number>>;

export function LocationAdvantages({ data }: { data: LocationAdvantagesData }) {
  const entries = Object.entries(ICONS).filter(([key]) => data[key as keyof typeof ICONS] != null);
  if (!entries.length) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="font-display text-lg font-semibold mb-4">Location Advantages</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {entries.map(([key, { icon: Icon, label }]) => (
          <div key={key} className="flex flex-col items-center gap-1 rounded-lg bg-muted p-3 text-center">
            <Icon className="h-5 w-5 text-primary" />
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-sm font-semibold">{data[key as keyof typeof ICONS]} km</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Step 3: Create InvestmentInsights component**

Create `src/components/property/InvestmentInsights.tsx`:

```tsx
import { TrendingUp, Landmark, MapPin, Building } from 'lucide-react';

interface InvestmentData {
  rentalYieldPct?: number;
  appreciationTrendText?: string;
  futureInfrastructureText?: string;
  developerTrackRecordSummary?: string;
}

export function InvestmentInsights({ data }: { data: InvestmentData }) {
  if (!data || !Object.values(data).some(Boolean)) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="font-display text-lg font-semibold mb-4">Investment Insights</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {data.rentalYieldPct != null && (
          <div className="flex gap-3">
            <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Rental Yield</p>
              <p className="font-semibold">{data.rentalYieldPct}%</p>
            </div>
          </div>
        )}
        {data.appreciationTrendText && (
          <div className="flex gap-3">
            <Landmark className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Appreciation Trend</p>
              <p className="text-sm">{data.appreciationTrendText}</p>
            </div>
          </div>
        )}
        {data.futureInfrastructureText && (
          <div className="flex gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Future Infrastructure</p>
              <p className="text-sm">{data.futureInfrastructureText}</p>
            </div>
          </div>
        )}
        {data.developerTrackRecordSummary && (
          <div className="flex gap-3">
            <Building className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Developer Track Record</p>
              <p className="text-sm">{data.developerTrackRecordSummary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 4: Create ProjectDetailStats component**

Create `src/components/property/ProjectDetailStats.tsx`:

```tsx
import { Building2, Home, Layers, CheckCircle } from 'lucide-react';

interface ProjectDetailsExtra {
  totalTowers?: number;
  totalUnits?: number;
  floors?: number;
  constructionStatus?: string;
  facingOptions?: string[];
}

export function ProjectDetailStats({ data, vastuCompliant }: { data: ProjectDetailsExtra; vastuCompliant?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="font-display text-lg font-semibold mb-4">Project Details</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {data.totalTowers != null && (
          <div className="text-center">
            <Building2 className="mx-auto mb-1 h-5 w-5 text-primary" />
            <p className="text-lg font-bold">{data.totalTowers}</p>
            <p className="text-xs text-muted-foreground">Towers</p>
          </div>
        )}
        {data.totalUnits != null && (
          <div className="text-center">
            <Home className="mx-auto mb-1 h-5 w-5 text-primary" />
            <p className="text-lg font-bold">{data.totalUnits}</p>
            <p className="text-xs text-muted-foreground">Total Units</p>
          </div>
        )}
        {data.floors != null && (
          <div className="text-center">
            <Layers className="mx-auto mb-1 h-5 w-5 text-primary" />
            <p className="text-lg font-bold">{data.floors}</p>
            <p className="text-xs text-muted-foreground">Floors</p>
          </div>
        )}
        {vastuCompliant && (
          <div className="text-center">
            <CheckCircle className="mx-auto mb-1 h-5 w-5 text-green-600" />
            <p className="text-sm font-semibold text-green-600">Vastu</p>
            <p className="text-xs text-muted-foreground">Compliant</p>
          </div>
        )}
      </div>
      {data.facingOptions?.length ? (
        <p className="mt-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Facing:</span> {data.facingOptions.join(', ')}
        </p>
      ) : null}
    </div>
  );
}
```

**Step 5: Create QuickCtaSidebar component**

Create `src/components/property/QuickCtaSidebar.tsx`:

```tsx
'use client';

import { Phone, MessageCircle, Calendar, ShieldCheck, FileCheck, Building2 } from 'lucide-react';

interface QuickCtaSidebarProps {
  projectId: string;
  propertyTitle: string;
  price?: string;
  specs?: string; // e.g. "3 BHK • 1200 sqft • Mumbai"
  phone?: string; // contact phone, default fallback
}

export function QuickCtaSidebar({ projectId, propertyTitle, price, specs, phone = '919646684712' }: QuickCtaSidebarProps) {
  const waMessage = encodeURIComponent(`Hi, I'm interested in ${propertyTitle}.`);

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      {price && (
        <div>
          <p className="font-display text-2xl font-bold text-primary">{price}</p>
          {specs && <p className="text-sm text-muted-foreground mt-0.5">{specs}</p>}
        </div>
      )}

      <div className="space-y-2">
        <a
          href={`tel:+${phone}`}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-gold px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Phone className="h-4 w-4" /> Call Now
        </a>
        <a
          href={`https://wa.me/${phone}?text=${waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[hsl(142,70%,40%)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
        <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted">
          <Calendar className="h-4 w-4" /> Schedule Visit
        </button>
      </div>

      <div className="border-t border-border pt-3 space-y-2">
        {[
          { icon: ShieldCheck, text: 'RERA Verified' },
          { icon: FileCheck, text: 'Document Verified' },
          { icon: Building2, text: 'Site Visit Available' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon className="h-3.5 w-3.5 text-primary" />
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Step 6: Wire new sections into property detail page**

In `src/app/(main)/properties/[slug]/page.tsx`, import and render the new components in the main content column, between the existing Description and Unit Configurations sections:

```tsx
import { LocationAdvantages } from '@/components/property/LocationAdvantages';
import { InvestmentInsights } from '@/components/property/InvestmentInsights';
import { ProjectDetailStats } from '@/components/property/ProjectDetailStats';
import { QuickCtaSidebar } from '@/components/property/QuickCtaSidebar';

// In the JSX, add after description card:
{project.location_advantages && Object.keys(project.location_advantages).length > 0 && (
  <LocationAdvantages data={project.location_advantages} />
)}
{project.project_details_extra && (
  <ProjectDetailStats data={project.project_details_extra} vastuCompliant={project.vastu_compliant} />
)}
{project.investment_data && (
  <InvestmentInsights data={project.investment_data} />
)}
{project.matterport_url || project.video_url ? (
  <div className="rounded-xl border border-border bg-card p-6">
    <h3 className="font-display text-lg font-semibold mb-4">3D Walkthrough</h3>
    <div className="aspect-video rounded-lg bg-muted" />
  </div>
) : null}
```

Also replace/supplement the sidebar with QuickCtaSidebar above the existing inquiry card.

**Step 7: Add breadcrumb at top of page**

```tsx
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

// At top of page content, before hero:
<nav className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
  <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
  <ChevronRight className="h-3.5 w-3.5" />
  <Link href="/properties" className="hover:text-foreground transition-colors">Properties</Link>
  <ChevronRight className="h-3.5 w-3.5" />
  <span className="text-foreground">{project.name}</span>
</nav>
```

**Step 8: Commit**

```bash
git add src/app/(main)/properties/[slug]/page.tsx src/components/property/LocationAdvantages.tsx src/components/property/InvestmentInsights.tsx src/components/property/ProjectDetailStats.tsx src/components/property/QuickCtaSidebar.tsx src/lib/queries/projects.ts
git commit -m "feat: add location advantages, investment insights, project stats, quick CTA sidebar to property detail"
```

---

## Task 7: Admin CRM — Enhanced Lead Management

**Files:**
- Modify: `src/app/admin/inquiries/page.tsx` (or wherever the admin inquiry table lives)
- Modify relevant admin components

**Step 1: Update status badge colors/labels**

In the admin inquiries component, update the status color map:

```typescript
const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  new:                    { label: 'New',                   className: 'bg-blue-100 text-blue-700' },
  contacted:              { label: 'Contacted',             className: 'bg-amber-100 text-amber-700' },
  site_visit_scheduled:   { label: 'Site Visit Scheduled',  className: 'bg-violet-100 text-violet-700' },
  site_visit_done:        { label: 'Site Visit Done',       className: 'bg-indigo-100 text-indigo-700' },
  negotiation:            { label: 'Negotiation',           className: 'bg-orange-100 text-orange-700' },
  qualified:              { label: 'Qualified',             className: 'bg-purple-100 text-purple-700' },
  converted:              { label: 'Converted',             className: 'bg-green-100 text-green-700' },
  closed:                 { label: 'Closed',                className: 'bg-gray-100 text-gray-700' },
  lost:                   { label: 'Lost',                  className: 'bg-red-100 text-red-700' },
};
```

**Step 2: Add WhatsApp + Call buttons to admin lead detail view**

In the admin lead detail modal/sidebar, add:

```tsx
import { Phone, MessageCircle } from 'lucide-react';

// In lead detail view:
<div className="flex gap-2 mt-4">
  <a
    href={`tel:${inquiry.phone}`}
    className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-2 text-sm font-medium hover:bg-muted/80"
  >
    <Phone className="h-4 w-4" /> Call
  </a>
  <a
    href={`https://wa.me/${inquiry.phone.replace(/\D/g, '')}`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-1.5 rounded-lg bg-[hsl(142,70%,40%)] px-3 py-2 text-sm font-medium text-white hover:opacity-90"
  >
    <MessageCircle className="h-4 w-4" /> WhatsApp
  </a>
</div>
```

**Step 3: Add Notes field to admin lead detail view**

```tsx
import { updateInquiryNotes } from '@/lib/queries/inquiries';

// Notes textarea in lead detail:
<div>
  <label className="text-xs font-medium text-muted-foreground">Internal Notes</label>
  <textarea
    defaultValue={inquiry.notes ?? ''}
    onBlur={async (e) => {
      await updateInquiryNotes(inquiry.id, e.target.value);
    }}
    placeholder="Add internal notes..."
    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
    rows={3}
  />
</div>
```

**Step 4: Add updateInquiryNotes server action**

In `src/lib/queries/inquiries.ts`:

```typescript
export async function updateInquiryNotes(id: string, notes: string) {
  'use server';
  const supabase = await createClient();
  const { error } = await supabase
    .from('inquiries')
    .update({ notes })
    .eq('id', id);
  if (error) throw error;
}
```

**Step 5: Show budget/timeline in admin table**

Add Budget and Timeline columns (hidden on mobile) to the inquiries table, reading from `inquiry.budget` and `inquiry.timeline`.

**Step 6: Commit**

```bash
git add src/app/admin/inquiries/ src/lib/queries/inquiries.ts
git commit -m "feat: admin CRM — 9 statuses, notes autosave, WhatsApp/call buttons, budget/timeline columns"
```

---

## Task 8: Framer Motion — Scroll Animations

**Files:**
- Modify: `package.json` (add framer-motion)
- Create: `src/components/ui/AnimateIn.tsx`
- Modify: `src/app/(main)/properties/page.tsx`
- Modify: `src/app/(main)/properties/[slug]/page.tsx`
- Modify: `src/components/property/PropertyCard.tsx`

**Step 1: Install Framer Motion**

```bash
cd /Users/rohanmalik/Projects/estate-pulse && npm install framer-motion
```

**Step 2: Create reusable AnimateIn wrapper**

Create `src/components/ui/AnimateIn.tsx`:

```tsx
'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface AnimateInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
  className?: string;
}

export function AnimateIn({ children, delay = 0, direction = 'up', className }: AnimateInProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const initial = {
    opacity: 0,
    y: direction === 'up' ? 20 : 0,
    x: direction === 'left' ? -24 : direction === 'right' ? 24 : 0,
  };

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : initial}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

**Step 3: Wrap property cards in staggered AnimateIn**

In `src/app/(main)/properties/page.tsx`, wrap the property grid items:

```tsx
import { AnimateIn } from '@/components/ui/AnimateIn';

// In the grid:
{properties.map((property, i) => (
  <AnimateIn key={property.id} delay={i * 0.05}>
    <PropertyCard property={property} />
  </AnimateIn>
))}
```

**Step 4: Wrap property detail sections in AnimateIn**

In `src/app/(main)/properties/[slug]/page.tsx`, wrap each major section:

```tsx
<AnimateIn delay={0}>   {/* hero/title block */}
<AnimateIn delay={0.1}> {/* key metrics */}
<AnimateIn delay={0.15}>{/* pricing breakdown */}
<AnimateIn delay={0.2}> {/* description */}
<AnimateIn delay={0.25}>{/* amenities */}
<AnimateIn delay={0}>   {/* sidebar — no delay */}
```

**Step 5: Add AnimatePresence to mobile nav (if applicable)**

In the mobile nav component (if exists), wrap with AnimatePresence:

```tsx
import { AnimatePresence, motion } from 'framer-motion';

<AnimatePresence>
  {open && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* nav links */}
    </motion.div>
  )}
</AnimatePresence>
```

**Step 6: Add scale animation to form success modal**

In `src/components/property/InquiryForm.tsx`, wrap the success state:

```tsx
import { motion, AnimatePresence } from 'framer-motion';

<AnimatePresence>
  {submitted && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center gap-3 py-6 text-center"
    >
      {/* success content */}
    </motion.div>
  )}
</AnimatePresence>
```

**Step 7: Commit**

```bash
git add src/components/ui/AnimateIn.tsx src/app/(main)/properties/page.tsx src/app/(main)/properties/[slug]/page.tsx src/components/property/InquiryForm.tsx package.json package-lock.json
git commit -m "feat: add Framer Motion scroll animations — stagger cards, section fade-in, success modal scale"
```

---

## Final Verification

```bash
cd /Users/rohanmalik/Projects/estate-pulse
npm run build
```

Expected: Build completes with no type errors. Check:
- [ ] Property detail page loads with all new sections
- [ ] Inquiry form submits and sends email
- [ ] Admin lead view shows new status options, notes, WhatsApp/call
- [ ] Color palette is gold/cream throughout
- [ ] Cards animate on scroll

---

## Unresolved Questions

- What phone number should the `QuickCtaSidebar` call/WhatsApp link default to? Currently hardcoded `919646684712` from perfect-ghar — should it be configurable via env var?
- Should `RESEND_FROM_EMAIL` be a verified domain email or is Resend's sandbox `onboarding@resend.dev` acceptable for now?
- The `price_per_sqft` field on projects — should it be auto-computed from `configurations` table or manually entered by admin?
- Does estate-pulse already have a mobile nav component that needs the AnimatePresence treatment, or is mobile nav not implemented yet?
