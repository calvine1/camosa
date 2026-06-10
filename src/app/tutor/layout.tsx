"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/useAuthStore';
import ThemeToggle from '@/components/ThemeToggle';
import { createClient } from '@/lib/supabase/client';
import UserAvatar from '@/components/profile/UserAvatar';
import { getTutorStaffLabel } from '@/lib/auth/tutor-staff';
import CamosaLogo from '@/components/brand/CamosaLogo';

const sidebarLinks = [
  { href: '/tutor', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/tutor/courses', icon: BookOpen, label: 'My Courses' },
  { href: '/tutor/students', icon: Users, label: 'Students' },
  { href: '/tutor/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/tutor/settings', icon: Settings, label: 'Settings' },
];

export default function TutorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const supabase = createClient();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'tutor') {
      router.push('/dashboard');
    }
  }, [mounted, user, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    router.push('/login');
  };

  if (!mounted || !user || user.role !== 'tutor') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 border-r border-border bg-card">
        <div className="p-6 border-b border-border/60 flex items-center gap-2">
          <CamosaLogo size="sm" />
          <span className="text-[10px] bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-300 px-1.5 py-0.5 font-bold uppercase rounded-md">
            Tutor
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive ? 'bg-primary text-primary-foreground shadow-md shadow-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-secondary bg-transparent'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/80">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4.5 py-3 rounded-xl text-sm font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-0" onClick={() => setMobileMenuOpen(false)} />
          <aside className="relative flex w-64 max-w-xs flex-col border-r border-border bg-card p-6 shadow-xl animate-fade-in">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 rounded-full" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
              <X className="w-5 h-5" />
            </Button>
            <div className="pb-6 border-b border-border/80 mb-6 flex items-center gap-2">
              <CamosaLogo size="sm" />
              <span className="text-[10px] font-bold uppercase text-primary">Tutor</span>
            </div>
            <nav className="flex-grow space-y-1.5">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-secondary bg-transparent'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-border/80 pt-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-3 px-4.5 py-3 rounded-xl text-sm font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="flex-1 lg:pl-64 flex flex-col">
        <header className="h-16 border-b border-border bg-card sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3 lg:hidden">
            <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(true)} aria-label="Open sidebar">
              <Menu className="w-5.5 h-5.5" />
            </Button>
            <Link href="/" className="group">
              <CamosaLogo size="sm" />
            </Link>
          </div>

          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
              <Input placeholder="Search students, clinical topics..." className="pl-10 h-10 bg-background border-border text-sm focus-visible:ring-1 focus-visible:ring-primary/20 text-foreground" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative rounded-full w-10 h-10">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-card" />
            </Button>
            <div className="h-6 w-px bg-border hidden sm:block mx-1" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-extrabold text-foreground leading-none">{user?.name || 'Tutor Admin'}</p>
                <p className="text-[10px] text-muted-foreground mt-1 font-semibold uppercase tracking-wider">
                  {getTutorStaffLabel(user.staffRole ?? 'tutor')}
                </p>
              </div>
              <UserAvatar
                userId={user.id}
                name={user.name}
                role={user.role}
                avatarUrl={user.avatarUrl}
                size="md"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 md:p-8 bg-background">{children}</main>
      </div>
    </div>
  );
}
