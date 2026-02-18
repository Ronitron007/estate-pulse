'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  { value: 'under_50l', label: 'Under \u20B950 Lakh' },
  { value: '50l_1cr', label: '\u20B950 Lakh \u2013 \u20B91 Cr' },
  { value: '1cr_2cr', label: '\u20B91 Cr \u2013 \u20B92 Cr' },
  { value: '2cr_plus', label: '\u20B92 Cr+' },
];

const TIMELINE_OPTIONS = [
  { value: 'immediately', label: 'Immediately' },
  { value: '1_3_months', label: '1\u20133 Months' },
  { value: '3_6_months', label: '3\u20136 Months' },
  { value: 'exploring', label: 'Just Exploring' },
];

export function InquiryForm({ projectId, propertyTitle, compact = false }: InquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, projectId, propertyTitle }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || 'Failed to submit');
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="flex flex-col items-center gap-3 py-6 text-center"
      >
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
      </motion.div>
    );
  }

  const spacing = compact ? 'space-y-3' : 'space-y-4';
  const inputClass = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={spacing}>
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      )}
      <div>
        <input {...register('name')} placeholder="Full Name *" className={inputClass} />
        {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
      </div>
      <div>
        <input {...register('phone')} placeholder="Phone Number *" type="tel" className={inputClass} />
        {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
      </div>
      <input {...register('email')} placeholder="Email Address (optional)" type="email" className={inputClass} />
      <select
        {...register('budget')}
        className={`${inputClass} text-muted-foreground`}
      >
        <option value="">Budget Range (optional)</option>
        {BUDGET_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <select
        {...register('timeline')}
        className={`${inputClass} text-muted-foreground`}
      >
        <option value="">Timeline to Buy (optional)</option>
        {TIMELINE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-gradient-gold px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? 'Sending\u2026' : 'Request Callback'}
      </button>
    </form>
  );
}
