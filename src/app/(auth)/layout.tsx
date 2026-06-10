import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import CamosaLogo from '@/components/brand/CamosaLogo';
import { BRAND } from '@/lib/brand';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left side: Form */}
      <div className="flex items-center justify-center p-8 bg-background border-r border-border/40">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-12 lg:mb-16 block group hover:opacity-90 transition-opacity">
            <CamosaLogo size="lg" />
          </Link>
          {children}
        </div>
      </div>

      {/* Right side: Branding/Image */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-[#1B2838] relative overflow-hidden">
        {/* Background Decorators */}
        <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2E8B57] rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10">
          <Badge variant="secondary" className="mb-6 bg-white/10 text-white border-white/20 px-4 py-1.5 backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 mr-2" />
            Join 10,000+ Professionals
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            Master the art of <br />
            <span className="text-primary-foreground/80">Clinical Excellence.</span>
          </h2>
          <p className="text-lg text-slate-300 max-w-md leading-relaxed">
            {BRAND.fullName} provides the tools and education clinicians need to advance their careers and deliver superior patient care.
          </p>
        </div>

        <div className="relative z-10 mt-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-900 overflow-hidden bg-slate-800">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User" />
                </div>
              ))}
            </div>
            <p className="text-white text-sm font-medium">
              <span className="text-primary-foreground font-bold">4.9/5</span> rating from our community
            </p>
          </div>
          <div className="text-slate-400 text-sm">
            © {new Date().getFullYear()} {BRAND.legalName}. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}

// Internal helper for Badge if needed since we are in layout
function Badge({ children, className, variant }: any) {
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
            {children}
        </span>
    );
}
