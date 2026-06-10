import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PlayCircle, ArrowRight, ShieldCheck, GraduationCap, Search, Star, CheckCircle } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pt-20 pb-28 md:pt-28 md:pb-36 border-b border-border">
      {/* Premium Gradient Background Grids */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.12),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.2),rgba(8,12,20,0))]" />
      
      {/* Glowing Floating Blobs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-primary/20 dark:bg-primary/10 rounded-full blur-[100px] animate-blob" />
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-indigo-500/15 dark:bg-indigo-500/5 rounded-full blur-[120px] animate-blob-delayed" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 text-left max-w-3xl space-y-6 md:space-y-8">
            <Badge variant="secondary" className="bg-primary/10 text-primary dark:bg-primary/25 dark:text-blue-300 border-none px-4 py-1.5 shadow-sm text-sm font-semibold rounded-full animate-fade-in">
              <ShieldCheck className="w-4.5 h-4.5 mr-2 text-primary dark:text-blue-400" />
              Trusted by 10,000+ Physiotherapists
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground">
              Master the Art of <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1E5AA8] via-[#1E5AA8] to-[#2E8B57]">
                Clinical Excellence
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
              Access accredited online courses, earn CEUs, and master advanced physical therapy methodologies guided by leading industry experts.
            </p>
            
            {/* Embedded Search Input */}
            <div className="relative max-w-lg shadow-xl shadow-primary/5 dark:shadow-none bg-card p-1.5 rounded-full border border-border flex items-center">
              <Search className="absolute left-4 text-muted-foreground w-5 h-5" />
              <Input 
                className="pl-12 pr-32 h-12 w-full border-none focus-visible:ring-0 shadow-none text-base bg-transparent" 
                placeholder="Search orthopedic rehab, sports..." 
              />
              <Button className="absolute right-1.5 rounded-full h-11 px-6 font-semibold bg-primary text-primary-foreground hover:bg-primary/95 transition-all">
                Search
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button size="lg" className="h-14 px-8 rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:translate-y-[-1px] transition-all duration-300 text-base font-semibold">
                Explore All Courses
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="h-14 px-8 rounded-full border-border bg-card/60 backdrop-blur-sm hover:bg-accent text-base font-semibold transition-all duration-300">
                <PlayCircle className="mr-2 w-5 h-5 text-primary" />
                Watch Platform Demo
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted-foreground font-semibold">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                <span>Board Accredited (CEU)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />
                <span>Self-Paced Lifetime Access</span>
              </div>
            </div>
          </div>
          
          {/* Right Image/Mockup Column */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              
              {/* Decorative Frame Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-indigo-500 rounded-3xl blur-2xl opacity-20 dark:opacity-30 pointer-events-none transform -rotate-3 scale-95" />
              
              {/* Hero Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/80 bg-card aspect-[4/3] group z-10 animate-float">
                <img 
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Clinical Physiotherapy Training Session" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
              </div>
              
              {/* Floating Widget 1: Rating */}
              <div className="absolute -top-6 -right-4 bg-card/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-border flex items-center gap-3.5 z-20 hover:scale-105 transition-transform duration-300">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                </div>
                <div>
                  <p className="font-extrabold text-foreground leading-none text-base">4.9 / 5.0</p>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">User Satisfaction Rate</p>
                </div>
              </div>
              
              {/* Floating Widget 2: Live Badges */}
              <div className="absolute -bottom-6 -left-6 bg-card/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-border flex items-center gap-4.5 z-20 hover:scale-105 transition-transform duration-300">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-card overflow-hidden bg-slate-800">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user_${i}`} alt="Therapist User" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-extrabold text-foreground leading-none text-sm">Join 5,000+ Students</p>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">Enrolling in learning portal</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
