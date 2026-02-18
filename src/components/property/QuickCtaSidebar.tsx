'use client';

import { Phone, MessageCircle, Calendar, ShieldCheck, FileCheck, Building2 } from 'lucide-react';

interface QuickCtaSidebarProps {
  projectId: string;
  propertyTitle: string;
  price?: string;
  specs?: string;
  phone?: string;
}

export function QuickCtaSidebar({ propertyTitle, price, specs, phone = '919646684712' }: QuickCtaSidebarProps) {
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
