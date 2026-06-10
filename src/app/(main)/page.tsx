"use client";

import React from 'react';
import HeroSection from '@/components/landing/HeroSection';
import CourseList from '@/components/landing/CourseList';
import StatsSection from '@/components/landing/StatsSection';
import TutorPromo from '@/components/landing/TutorPromo';
import Testimonials from '@/components/landing/Testimonials';

export default function Home() {
  return (
    <div className="space-y-0">
      <HeroSection />
      <StatsSection />
      <CourseList />
      <TutorPromo />
      <Testimonials />
    </div>
  );
}
