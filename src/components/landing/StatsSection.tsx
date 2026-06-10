import React from 'react';
import { Users, Award, BookOpen, ThumbsUp } from 'lucide-react';

const STATS = [
  {
    label: 'Active Students',
    value: '10,000+',
    description: 'Therapists & clinical students worldwide',
    icon: Users,
    color: 'text-blue-500 bg-blue-500/10',
  },
  {
    label: 'Specialty Courses',
    value: '50+',
    description: 'Expert-led physiotherapy topics',
    icon: BookOpen,
    color: 'text-indigo-500 bg-indigo-500/10',
  },
  {
    label: 'Accreditation Partners',
    value: '15+',
    description: 'Recognized medical board providers',
    icon: Award,
    color: 'text-teal-500 bg-teal-500/10',
  },
  {
    label: 'Satisfaction Rate',
    value: '99.2%',
    description: 'Highly rated clinical lessons',
    icon: ThumbsUp,
    color: 'text-amber-500 bg-amber-500/10',
  },
];

export default function StatsSection() {
  return (
    <section className="py-12 md:py-16 bg-card border-b border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx} 
                className="p-6 rounded-2xl border border-border/80 bg-background/50 hover:bg-background/90 hover:border-primary/20 dark:hover:border-primary/40 transition-all duration-300 group flex items-start gap-4"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.color} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</span>
                  <h3 className="text-3xl font-extrabold text-foreground tracking-tight leading-none pt-1">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-normal pt-1">
                    {stat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
