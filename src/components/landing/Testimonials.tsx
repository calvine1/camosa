import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const TESTIMONIALS = [
  {
    name: 'Dr. Marcus Vance, DPT',
    role: 'Orthopedic Specialist',
    location: 'Chicago, IL',
    review: 'The Musculoskeletal Assessment course was incredibly detailed. The special shoulder tests highlighted here changed how I evaluate my patients in the clinic. Very high production quality!',
    rating: 5,
    avatarId: 44,
  },
  {
    name: 'Sarah Lindqvist, PT',
    role: 'Sports Physiotherapist',
    location: 'Stockholm, SE',
    review: 'Having lifetime access to these lectures is fantastic. Camosa Medtech makes tracking my continuing education units (CEUs) completely seamless. Highly recommend this for busy clinicians.',
    rating: 5,
    avatarId: 32,
  },
  {
    name: 'Michael K. Oconnor, PT, ATC',
    role: 'Athletic Trainer',
    location: 'Boston, MA',
    review: 'The instructors are elite clinical researchers. The neurological rehabilitation course was filled with evidence-based techniques that are directly applicable to sports rehab.',
    rating: 5,
    avatarId: 21,
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-background border-b border-border relative overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Title Area */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <Badge variant="outline" className="border-primary/30 text-primary px-3 py-1 font-bold text-xs uppercase tracking-wider rounded-full">
            Success Stories
          </Badge>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Loved by Therapists Worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            Hear from orthopedic specialists, athletic trainers, and therapists who have advanced their careers using Camosa Medtech.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, idx) => (
            <Card 
              key={idx} 
              className="border-border bg-card shadow-sm hover:shadow-lg hover:border-primary/20 dark:hover:border-primary/40 transition-all duration-300 relative flex flex-col justify-between"
            >
              <CardContent className="p-8 space-y-6">
                
                {/* Rating Stars and Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-500">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-primary/10 rotate-180" />
                </div>

                {/* Review Text */}
                <p className="text-muted-foreground leading-relaxed italic text-sm md:text-base">
                  "{testimonial.review}"
                </p>

                {/* Divider */}
                <div className="w-full h-px bg-border" />

                {/* User Info */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-border overflow-hidden bg-secondary">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=therapist_${testimonial.avatarId}`} 
                      alt={testimonial.name} 
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-foreground text-sm leading-none">{testimonial.name}</h4>
                      <span title="Verified Professional">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground font-semibold">{testimonial.role}</p>
                    <p className="text-[10px] text-muted-foreground/60">{testimonial.location}</p>
                  </div>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
}
