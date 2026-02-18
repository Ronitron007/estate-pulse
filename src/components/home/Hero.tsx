'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Phone } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background — dark overlay, gradient serves as placeholder until a real hero image is added */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--charcoal)] via-[hsl(220,20%,15%)] to-[hsl(220,20%,8%)]" />

      <div className="container mx-auto px-4 relative z-10 py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-white/80 text-xs font-medium tracking-wide uppercase">
              Chandigarh Tricity&apos;s Trusted Platform
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Find Verified Homes in{' '}
            <span className="text-gradient-gold">Chandigarh Tricity</span>
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-xl mb-8 font-light leading-relaxed">
            Premium Listings. 3D Walkthroughs. Zero Spam. RERA-verified
            properties across Chandigarh, Mohali, Panchkula, Zirakpur &amp; New
            Chandigarh.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/properties"
              className="bg-gradient-gold text-white px-8 py-4 rounded-sm font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-gold"
            >
              View Properties <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#contact"
              className="border border-white/30 text-white px-8 py-4 rounded-sm font-semibold text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" /> Schedule Site Visit
            </Link>
            <a
              href="tel:+919646684712"
              className="border border-white/30 text-white px-8 py-4 rounded-sm font-semibold text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2 sm:hidden lg:flex"
            >
              <Phone className="w-4 h-4" /> Talk to Expert
            </a>
          </div>

          <div className="flex gap-8 mt-12 pt-8 border-t border-white/10">
            {[
              { num: '500+', label: 'Verified Listings' },
              { num: '100%', label: 'RERA Approved' },
              { num: '2000+', label: 'Happy Families' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl md:text-3xl font-bold text-primary">
                  {stat.num}
                </p>
                <p className="text-xs text-white/50 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
