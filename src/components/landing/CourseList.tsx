"use client";

import React, { useState } from 'react';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Star, Users, ArrowRight } from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore';

const CATEGORIES = ['All', 'Assessment', 'Rehab', 'Sports'];

export default function CourseList() {
  const [activeCategory, setActiveCategory] = useState('All');
  const courses = useCourseStore((state) => state.courses);
  const fetchCourses = useCourseStore((state) => state.fetchCourses);

  React.useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Only show published courses on the landing page
  const publishedCourses = courses.filter((c) => c.status === 'Published');
  const filteredCourses =
    activeCategory === 'All'
      ? publishedCourses
      : publishedCourses.filter((course) => course.category === activeCategory);

  return (
    <section id="courses" className="py-24 bg-background border-b border-border relative">
      {/* Background Decorator */}
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-indigo-500/5 dark:bg-indigo-500/2 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6">
        
        {/* Title Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl space-y-4">
            <Badge variant="outline" className="border-primary/30 text-primary px-3 py-1 font-bold text-xs uppercase tracking-wider rounded-full">
              Explore Our Catalog
            </Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              Featured Clinical Courses
            </h2>
            <p className="text-lg text-muted-foreground">
              Expand your clinical expertise with highest-rated courses taught by leading physiotherapy practitioners.
            </p>
          </div>
          <Button variant="outline" className="hidden md:inline-flex rounded-full border-border hover:bg-accent font-semibold h-11 px-6">
            View Full Catalog
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-2 mb-10 pb-2 border-b border-border/80">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer relative ${
                activeCategory === category
                  ? 'text-primary-foreground bg-primary shadow-lg shadow-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary bg-transparent'
              }`}
            >
              {category}
              {activeCategory === category && (
                <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map(course => (
            <Card 
              key={course.id} 
              className="overflow-hidden border-border bg-card shadow-sm hover:shadow-xl hover:border-primary/20 dark:hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 flex flex-col group relative"
            >
              {/* Image Banner */}
              <div className="relative h-52 overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Float Category Badge */}
                <Badge className="absolute top-4 left-4 bg-white/95 text-slate-900 hover:bg-white backdrop-blur-md font-bold text-xs uppercase tracking-wider shadow-md rounded-lg border border-slate-200">
                  {course.category}
                </Badge>

                {/* Popularity Badge */}
                {course.popular && (
                  <Badge className="absolute top-4 right-4 bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-widest shadow-md rounded-lg border-none">
                    Best Seller
                  </Badge>
                )}
              </div>
              
              {/* Card Header Info */}
              <CardHeader className="pb-4 pt-5 flex-grow space-y-3">
                <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
                  <div className="flex items-center gap-1 hover:text-amber-500 transition-colors">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>{course.rating || 'New'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>{course.students} enrolled</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                  {course.instructor}
                </p>
              </CardHeader>
              
              {/* Card Footer Price & Action */}
              <CardFooter className="pt-4 pb-5 border-t border-border/80 bg-background/30 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Price</span>
                  <span className="text-2xl font-black text-foreground">{course.price}</span>
                </div>
                <Button className="rounded-full shadow-md bg-primary text-primary-foreground hover:bg-primary/95 group/btn font-semibold">
                  Course Details
                  <ArrowRight className="ml-1.5 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* Mobile View All Button */}
        <div className="mt-10 text-center md:hidden">
          <Button variant="outline" className="w-full rounded-full border-border h-12">
            View All Courses
          </Button>
        </div>

      </div>
    </section>
  );
}
