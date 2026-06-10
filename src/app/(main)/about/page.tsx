import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, GraduationCap, Globe2, Users, BookOpen, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'About Clinical Portal | Camosa Medtech',
  description: 'Learn about Camosa Medtech\'s accredited clinical education platform — our mission, values, and approach to professional physiotherapy training.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 bg-background border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(59,130,246,0.1),transparent)] pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-4xl">
          <Badge variant="outline" className="border-primary/30 text-primary px-3 py-1 font-bold text-xs uppercase tracking-wider rounded-full mb-6">
            About the Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tight mb-6">
            The Clinical Portal for{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1E5AA8] to-[#2E8B57]">
              Modern Therapists
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
            Camosa Medtech is an accredited digital learning platform built specifically for physiotherapists, occupational therapists, and clinical specialists seeking evidence-based continuing education.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/#courses">
              <Button size="lg" className="rounded-full h-13 px-8 font-bold shadow-lg shadow-primary/20">
                Explore Courses
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" size="lg" className="rounded-full h-13 px-8 font-bold border-border">
                Join Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-card border-b border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="border-indigo-500/30 text-indigo-500 px-3 py-1 font-bold text-xs uppercase tracking-wider rounded-full">
                Our Mission
              </Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                Advancing Clinical Excellence Through Education
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We believe that every physiotherapy professional deserves access to the highest-quality clinical education — regardless of location, institution, or budget. Our platform bridges the gap between elite academic knowledge and real-world clinical practice.
              </p>
              <ul className="space-y-3">
                {[
                  'CEU-accredited courses recognised by major PT boards',
                  'Evidence-based curricula designed by active clinicians',
                  'Flexible, self-paced learning with lifetime access',
                  'Live webinar Q&A with leading physiotherapy researchers',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, label: '10,000+', desc: 'Registered therapists', color: 'bg-blue-500/10 text-blue-500' },
                { icon: BookOpen, label: '50+', desc: 'Clinical courses', color: 'bg-indigo-500/10 text-indigo-500' },
                { icon: Award, label: 'CEU Accredited', desc: 'Recognised boards', color: 'bg-emerald-500/10 text-emerald-500' },
                { icon: Globe2, label: '40+ Countries', desc: 'Global reach', color: 'bg-amber-500/10 text-amber-500' },
              ].map((stat, i) => (
                <Card key={i} className="border-border bg-background shadow-sm">
                  <CardContent className="pt-6 space-y-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-black text-foreground">{stat.label}</p>
                    <p className="text-xs text-muted-foreground font-semibold">{stat.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-background border-b border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center mb-14 space-y-4">
            <Badge variant="outline" className="border-primary/30 text-primary px-3 py-1 font-bold text-xs uppercase tracking-wider rounded-full">
              Our Values
            </Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              What We Stand For
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: 'Clinical Rigour',
                desc: 'Every course is reviewed by practicing clinicians and academic researchers to ensure evidence-based accuracy.',
                color: 'text-blue-500 bg-blue-500/10'
              },
              {
                icon: GraduationCap,
                title: 'Accessible Learning',
                desc: 'We offer flexible pricing, scholarship access, and mobile-friendly content so geography is never a barrier.',
                color: 'text-indigo-500 bg-indigo-500/10'
              },
              {
                icon: Globe2,
                title: 'Global Community',
                desc: 'Connect with physiotherapists from 40+ countries through live sessions, forums, and peer review groups.',
                color: 'text-emerald-500 bg-emerald-500/10'
              },
            ].map((val, i) => (
              <Card key={i} className="border-border bg-card shadow-sm hover:shadow-md transition-shadow group">
                <CardContent className="pt-8 pb-6 px-6 space-y-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${val.color} group-hover:scale-110 transition-transform`}>
                    <val.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{val.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{val.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Ready to Level Up Your Clinical Skills?
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Join thousands of physiotherapists who have advanced their careers with Camosa Medtech&apos;s accredited courses.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/signup">
              <Button size="lg" className="rounded-full h-13 px-10 font-bold shadow-lg shadow-primary/20">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/#courses">
              <Button variant="outline" size="lg" className="rounded-full h-13 px-10 font-bold border-border">
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
