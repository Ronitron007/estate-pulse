'use client';

import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/917719784712?text=Hi%2C%20I%27m%20interested%20in%20a%20property%20in%20Chandigarh%20Tricity"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[hsl(142,70%,40%)] hover:bg-[hsl(142,70%,35%)] flex items-center justify-center shadow-lg transition-colors"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 text-white" />
    </a>
  );
}
