'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { PropertyCard } from '@/components/property/PropertyCard';
import type { Project } from '@/types/database';

interface FeaturedListingsProps {
  projects: Project[];
}

export function FeaturedListings({ projects }: FeaturedListingsProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  if (projects.length === 0) return null;

  return (
    <section ref={ref} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-primary text-sm font-semibold tracking-wider uppercase mb-2">Curated Selection</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Featured Properties</h2>
          </div>
        </motion.div>

        <div className="space-y-0 border-t border-border">
          {projects.slice(0, 4).map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <PropertyCard project={project} index={i} />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/properties" className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline">
            View All Properties <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
