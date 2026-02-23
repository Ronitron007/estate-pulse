'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  { id: 1, name: 'Rajesh Sharma', text: 'Found our dream 3BHK in Zirakpur within a week. The 3D tour saved us multiple site visits. Highly recommend PerfectGhar.in!', rating: 5, propertyBought: '3 BHK Apartment', location: 'Zirakpur' },
  { id: 2, name: 'Priya Kaur', text: 'As an NRI, the virtual walkthroughs were a game-changer. The team handled everything from documentation to possession smoothly.', rating: 5, propertyBought: '4 BHK Villa', location: 'Mohali' },
  { id: 3, name: 'Amit Gupta', text: 'Transparent pricing with no hidden charges. The RERA verification gave us confidence in our investment decision.', rating: 5, propertyBought: '2 BHK Apartment', location: 'Panchkula' },
  { id: 4, name: 'Neha Verma', text: 'The property advisor was incredibly knowledgeable about the Tricity market. Got a great deal on a premium project.', rating: 4, propertyBought: '3 BHK Apartment', location: 'New Chandigarh' },
  { id: 5, name: 'Sukhwinder Singh', text: 'Best real estate platform in the region. The site visit scheduling feature made the whole process effortless.', rating: 5, propertyBought: 'Commercial Space', location: 'Chandigarh' },
  { id: 6, name: 'Deepika Malhotra', text: 'We compared 15 properties using their detailed listings and found the perfect home. Great experience overall!', rating: 5, propertyBought: '3 BHK Apartment', location: 'Zirakpur' },
];

export function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-primary text-sm font-semibold tracking-wider uppercase mb-2">Testimonials</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">What Our Clients Say</h2>
        </motion.div>

        <div className="max-w-2xl mx-auto divide-y divide-border">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="py-6"
            >
              <Quote className="w-8 h-8 text-primary/30 mb-3" />
              <p className="text-sm text-card-foreground leading-relaxed mb-4">{t.text}</p>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <div>
                <p className="font-semibold text-sm text-card-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.propertyBought} &bull; {t.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
