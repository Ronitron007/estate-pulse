'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', phone: '', email: '', budget: '', timeline: '' },
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

  const gap = compact ? 'space-y-3' : 'space-y-4';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={gap}>
      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
          {error}
        </div>
      )}

      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="inquiry-name">Full Name <span className="text-destructive">*</span></Label>
        <Input
          id="inquiry-name"
          placeholder="Enter your full name"
          aria-invalid={!!errors.name}
          {...register('name')}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <Label htmlFor="inquiry-phone">Phone Number <span className="text-destructive">*</span></Label>
        <Input
          id="inquiry-phone"
          type="tel"
          placeholder="e.g. +91 98765 43210"
          aria-invalid={!!errors.phone}
          {...register('phone')}
        />
        {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="inquiry-email">Email <span className="text-muted-foreground font-normal">(optional)</span></Label>
        <Input
          id="inquiry-email"
          type="email"
          placeholder="you@example.com"
          {...register('email')}
        />
      </div>

      {/* Budget */}
      <div className="space-y-1.5">
        <Label>Budget Range <span className="text-muted-foreground font-normal">(optional)</span></Label>
        <Controller
          control={control}
          name="budget"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                {BUDGET_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Timeline */}
      <div className="space-y-1.5">
        <Label>Timeline to Buy <span className="text-muted-foreground font-normal">(optional)</span></Label>
        <Controller
          control={control}
          name="timeline"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select timeline" />
              </SelectTrigger>
              <SelectContent>
                {TIMELINE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-gold hover:opacity-90 text-white font-semibold shadow-gold"
        size="lg"
      >
        <Send className="w-4 h-4 mr-2" />
        {loading ? 'Sending\u2026' : 'Request Callback'}
      </Button>
    </form>
  );
}
