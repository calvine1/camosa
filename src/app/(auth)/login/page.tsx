"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toAppUser } from '@/lib/auth/user';
import {
  readRememberMePreference,
  setRememberMePreference,
} from '@/lib/auth/remember-me';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function getSafeRedirect(path: string | null, role: 'tutor' | 'learner') {
  if (!path || !path.startsWith('/') || path.startsWith('//')) {
    return role === 'tutor' ? '/tutor' : '/dashboard';
  }
  if (path.startsWith('/tutor') && role !== 'tutor') return '/dashboard';
  if ((path === '/dashboard' || path.startsWith('/profile')) && role !== 'learner') {
    return '/tutor';
  }
  return path;
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSendingReset, setIsSendingReset] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [infoMessage, setInfoMessage] = React.useState<string | null>(null);
  const [rememberMe, setRememberMe] = React.useState(true);

  React.useEffect(() => {
    setRememberMe(readRememberMePreference());
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    setInfoMessage(null);

    setRememberMePreference(rememberMe);

    const supabase = createClient();
    const { data: signInData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error || !signInData.user) {
      setAuthError(error?.message || 'Unable to sign in.');
      setIsLoading(false);
      return;
    }

    const appUser = toAppUser(signInData.user);
    login(appUser);

    const redirectTo = searchParams.get('redirectTo');
    router.push(getSafeRedirect(redirectTo, appUser.role));

    setIsLoading(false);
  };

  const handleForgotPassword = async () => {
    const email = (document.getElementById('email') as HTMLInputElement | null)?.value?.trim();
    setAuthError(null);
    setInfoMessage(null);

    if (!email) {
      setAuthError('Enter your email address first, then click Forgot password.');
      return;
    }

    setIsSendingReset(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    setIsSendingReset(false);

    if (error) {
      setAuthError(error.message);
      return;
    }

    setInfoMessage('Password reset link sent. Check your inbox.');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground font-medium">Enter your credentials to access your account.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground/90 font-semibold text-sm">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            className="h-12 border-border focus-visible:ring-1 focus-visible:ring-primary/20 bg-background text-foreground"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-destructive font-semibold mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-foreground/90 font-semibold text-sm">Password</Label>
            <button type="button" onClick={handleForgotPassword} disabled={isSendingReset} className="text-xs font-bold text-primary hover:underline disabled:opacity-70">
              {isSendingReset ? 'Sending reset link...' : 'Forgot password?'}
            </button>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="h-12 border-border focus-visible:ring-1 focus-visible:ring-primary/20 bg-background text-foreground"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm text-destructive font-semibold mt-1">{errors.password.message}</p>
          )}
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
          />
          <span className="text-sm font-semibold text-muted-foreground">
            Remember me for 7 days
          </span>
        </label>

        {authError && (
          <p className="text-sm text-destructive font-semibold">{authError}</p>
        )}
        {infoMessage && (
          <p className="text-sm text-emerald-500 font-semibold">{infoMessage}</p>
        )}

        <Button type="submit" className="w-full h-12 text-base font-bold shadow-md shadow-primary/10 mt-2" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground font-semibold">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-bold text-primary hover:underline">
          Sign up for free
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <LoginPageContent />
    </React.Suspense>
  );
}
