'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, BadgeCheck, IndianRupee, Eye } from 'lucide-react';

const usps = [
  { icon: BadgeCheck, title: 'Verified Listings', desc: 'Every property is personally verified by our team with site visits and document checks.' },
  { icon: IndianRupee, title: 'Transparent Pricing', desc: 'No hidden charges. What you see is what you pay. Complete cost breakdown included.' },
  { icon: Shield, title: 'RERA Compliant', desc: '100% RERA-registered properties only. Your investment is legally protected.' },
  { icon: Eye, title: '3D Virtual Tours', desc: 'Walk through properties from home with immersive Matterport 3D tours before visiting.' },
];

export function WhyChooseUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="why-us" ref={ref} className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-primary text-sm font-semibold tracking-wider uppercase mb-2">Our Promise</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Why Choose Estate Pulse</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {usps.map((usp, i) => (
            <motion.div
              key={usp.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card p-6 rounded-lg shadow-card border border-border hover:border-primary/30 hover:shadow-card-hover transition-all group text-center"
            >
              <div className="w-14 h-14 bg-gradient-gold rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <usp.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display text-lg font-semibold text-card-foreground mb-2">{usp.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{usp.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
