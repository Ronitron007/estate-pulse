'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TrendingUp, Building2, MapPin } from 'lucide-react';

const cards = [
  { icon: TrendingUp, title: 'Price Trends', desc: 'Average prices in Tricity have appreciated 12\u201320% YoY across key sectors.', badge: 'Coming Soon' },
  { icon: Building2, title: 'New Launches', desc: 'Track upcoming projects and pre-launch offers from top developers in real-time.', badge: 'Coming Soon' },
  { icon: MapPin, title: 'Area Analysis', desc: 'Detailed micro-market analysis for every sector with rental yield data.', badge: 'Coming Soon' },
];

export function MarketInsights() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-primary text-sm font-semibold tracking-wider uppercase mb-2">Data-Driven</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Market Insights</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card p-6 rounded-lg shadow-card border border-border relative overflow-hidden"
            >
              <span className="absolute top-4 right-4 text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                {card.badge}
              </span>
              <card.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-display text-lg font-semibold text-card-foreground mb-2">{card.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
