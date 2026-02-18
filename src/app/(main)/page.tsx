import { getProjects } from '@/lib/queries/projects';
import { createClient } from '@/lib/supabase/server';
import { Hero } from '@/components/home/Hero';
import { FeaturedListings } from '@/components/home/FeaturedListings';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { VirtualTourSection } from '@/components/home/VirtualTourSection';
import { MarketInsights } from '@/components/home/MarketInsights';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { WhatsAppButton } from '@/components/home/WhatsAppButton';
import { InquiryForm } from '@/components/property/InquiryForm';

export default async function Home() {
  const [projects] = await Promise.all([getProjects()]);
  const featuredProjects = projects.slice(0, 8);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <FeaturedListings projects={featuredProjects} showPrice={!!user} />
      <WhyChooseUs />
      <VirtualTourSection />
      <MarketInsights />
      <TestimonialsSection />

      {/* Contact / Lead Capture */}
      <section id="contact" className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-10">
            <p className="text-primary text-sm font-semibold tracking-wider uppercase mb-2">Get Started</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Find Your Dream Home</h2>
            <p className="text-muted-foreground mt-2">Share your requirements and our expert will guide you.</p>
          </div>
          <InquiryForm />
        </div>
      </section>

      <WhatsAppButton />
    </div>
  );
}
