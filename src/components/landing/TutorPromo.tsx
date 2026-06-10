import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, DollarSign, Globe, Award } from 'lucide-react';

export default function TutorPromo() {
  return (
    <section id="tutor-program" className="py-24 bg-card border-b border-border relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Grid: Illustration / Visuals */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative">
              {/* Outer decorative glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-indigo-500 rounded-3xl blur-2xl opacity-10 pointer-events-none" />

              {/* Main Card */}
              <div className="relative p-8 rounded-3xl border border-border bg-background shadow-xl space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-bold text-foreground">Why Teach with Us?</span>
                </div>

                <div className="space-y-4">
                  {[
                    { title: 'Global Reach', desc: 'Share your clinical expertise with thousands of therapists worldwide.', icon: Globe },
                    { title: 'High Earnings', desc: 'Earn 80% revenue share on every course sale you make.', icon: DollarSign },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-secondary/50 border border-border/60 hover:bg-secondary transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-background border border-border/80 flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-foreground text-sm">{item.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Grid: Content Text */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 lg:pl-6">
            <Badge variant="outline" className="border-indigo-500/30 text-indigo-500 px-3 py-1 font-bold text-xs uppercase tracking-wider rounded-full">
              Tutor Portal
            </Badge>

            <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
              Share Your Knowledge. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">
                Inspire the Next Generation.
              </span>
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Join Camosa Medtech&apos;s elite circle of clinical educators. We provide modern video tools, curriculum structuring assistance, and marketing resources to help you reach professionals globally.
            </p>

            <ul className="space-y-3.5 pt-2">
              {[
                'Access to our custom Course Builder & Quiz Creator',
                'Dedicated 1-on-1 pedagogical review of your curriculum',
                'Automated CEU accreditation processing',
                'Advanced course metrics & student feedback analysis'
              ].map((text, idx) => (
                <li key={idx} className="flex items-center gap-3 font-semibold text-muted-foreground text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/tutor">
                <Button size="lg" className="rounded-full shadow-lg shadow-primary/10 h-13 px-8 font-bold">
                  Apply as a Tutor
                </Button>
              </Link>
              <Link href="#tutor-program">
                <Button variant="ghost" size="lg" className="rounded-full h-13 px-8 font-bold hover:bg-secondary">
                  Learn How It Works
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
