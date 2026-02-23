'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Box, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function VirtualTourSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-20 bg-charcoal">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <p className="text-primary text-sm font-semibold tracking-wider uppercase mb-2">Immersive Experience</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
              Walk Through Properties<br />
              <span className="text-primary">From Your Couch</span>
            </h2>
            <p className="text-white/60 leading-relaxed mb-8">
              Our Matterport-powered 3D walkthroughs let you explore every room,
              measure spaces, and experience the property as if you were there.
              Perfect for NRIs and busy professionals.
            </p>
            <div className="space-y-4 mb-8">
              {[
                '360\u00B0 immersive tours',
                'Measure rooms virtually',
                'Save time on site visits',
                'Available 24/7 on any device',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-white/70 text-sm">{item}</span>
                </div>
              ))}
            </div>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-sm font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              Explore 3D Tours <Box className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="aspect-video bg-charcoal-light border border-white/10 flex items-center justify-center relative overflow-hidden">
              <div className="text-center">
                <Box className="w-16 h-16 text-primary/40 mx-auto mb-4" />
                <p className="text-white/40 text-sm">3D Tour Preview</p>
                <p className="text-white/20 text-xs mt-1">Matterport Integration Ready</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
