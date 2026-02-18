'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { PropertyCard } from '@/components/property/PropertyCard';
import type { Project } from '@/types/database';

interface FeaturedListingsProps {
  projects: Project[];
  showPrice: boolean;
}

export function FeaturedListings({ projects, showPrice }: FeaturedListingsProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' });
  };

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
          <div className="hidden md:flex gap-2">
            <button onClick={() => scroll('left')} className="p-2 border border-border rounded-sm hover:bg-muted transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scroll('right')} className="p-2 border border-border rounded-sm hover:bg-muted transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none' }}
        >
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="min-w-[320px] max-w-[340px] snap-start flex-shrink-0"
            >
              <PropertyCard project={project} showPrice={showPrice} index={i} />
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
