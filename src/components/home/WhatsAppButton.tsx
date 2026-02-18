'use client';

import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919646684712?text=Hi%2C%20I%27m%20interested%20in%20a%20property%20in%20Chandigarh%20Tricity"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[hsl(142,70%,40%)] hover:bg-[hsl(142,70%,35%)] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
    </a>
  );
}
