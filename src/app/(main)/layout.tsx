"use client";

import React from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, User, Menu } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import CamosaLogo from '@/components/brand/CamosaLogo';
import { BRAND } from '@/lib/brand';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Sticky Glassmorphic Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="group hover:opacity-90 transition-opacity">
            <CamosaLogo size="md" />
          </Link>
          
          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
            <Link href="/#courses" className="hover:text-primary transition-colors">All Courses</Link>
            <Link href="/#tutor-program" className="hover:text-primary transition-colors">Tutor Program</Link>
            <Link href="/about" className="hover:text-primary transition-colors">About Clinical Portal</Link>
          </nav>
          
          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <ThemeToggle />
            
            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Dashboard Link */}
                <Link href={user?.role === 'tutor' ? '/tutor' : '/dashboard'}>
                  <Button variant="ghost" size="sm" className="gap-2 text-sm font-semibold h-10 px-4 rounded-full hover:bg-secondary">
                    <LayoutDashboard className="w-4 h-4 text-primary" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Button>
                </Link>
                
                {/* Profile Link (Visible for learners) */}
                {user?.role === 'learner' && (
                  <Link href="/profile">
                    <Button variant="ghost" size="sm" className="gap-2 text-sm font-semibold h-10 px-4 rounded-full hover:bg-secondary">
                      <User className="w-4 h-4 text-primary" />
                      <span className="hidden sm:inline">My Profile</span>
                    </Button>
                  </Link>
                )}

                <div className="h-6 w-px bg-border" />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLogout}
                  className="w-10 h-10 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </Button>
              </div>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-sm font-bold text-muted-foreground hover:text-foreground hidden sm:inline-block px-4 py-2 transition-colors"
                >
                  Log in
                </Link>
                <Link href="/signup">
                  <Button className="h-10 px-6 rounded-full font-bold shadow-md shadow-primary/10 hover:shadow-lg transition-all duration-300">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
            
            {/* Mobile Menu Icon */}
            <Button variant="ghost" size="icon" className="md:hidden rounded-full w-10 h-10" aria-label="Menu">
              <Menu className="w-5 h-5" />
            </Button>
          </div>

        </div>
      </header>

      {/* Main Sections */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Modern Footer */}
      <footer className="bg-card py-16 border-t border-border">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          
          {/* Logo and Info */}
          <div className="md:col-span-5 space-y-4">
            <CamosaLogo size="sm" />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Empowering therapy professionals worldwide with evidence-based, accredited clinical education. Learn from elite researchers.
            </p>
          </div>
          
          {/* Learn Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-bold text-sm text-foreground uppercase tracking-widest">Learn</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground font-semibold">
              <li><a href="#" className="hover:text-primary transition-colors">Orthopedics</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Neurology</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pediatric Care</a></li>
            </ul>
          </div>
          
          {/* Platform Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-bold text-sm text-foreground uppercase tracking-widest">Platform</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground font-semibold">
              <li><a href="#" className="hover:text-primary transition-colors">Become a Tutor</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Accreditation Info</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Support</a></li>
            </ul>
          </div>
          
          {/* Legal Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-bold text-sm text-foreground uppercase tracking-widest">Legal</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground font-semibold">
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cookie Preferences</a></li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {BRAND.legalName}. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Facebook</a>
            <a href="#" className="hover:text-foreground">LinkedIn</a>
            <a href="#" className="hover:text-foreground">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
