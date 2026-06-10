"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2, User, GraduationCap } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toAppUser } from '@/lib/auth/user';
import { setRememberMePreference } from '@/lib/auth/remember-me';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['learner', 'tutor']),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [infoMessage, setInfoMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: 'learner',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    setInfoMessage(null);

    setRememberMePreference(true);

    const supabase = createClient();
    const { data: signUpData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          role: data.role,
          staff_role: data.role === 'tutor' ? 'tutor' : undefined,
        },
      },
    });

    if (error) {
      setAuthError(error.message);
      setIsLoading(false);
      return;
    }

    if (signUpData.user && signUpData.session) {
      login(toAppUser(signUpData.user));
      if (data.role === 'tutor') {
        router.push('/tutor');
      } else {
        router.push('/dashboard');
      }
    } else {
      setInfoMessage('Account created. Please verify your email, then sign in.');
      router.push('/login');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Create an account</h1>
        <p className="text-muted-foreground font-medium">Join Camosa Medtech and start your clinical journey today.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div 
            onClick={() => setValue('role', 'learner')}
            className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
              selectedRole === 'learner' 
              ? 'border-primary bg-primary/5 dark:bg-primary/10' 
              : 'border-border hover:border-border/80 bg-card text-muted-foreground hover:text-foreground'
            }`}
          >
            <User className={`w-6 h-6 ${selectedRole === 'learner' ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className={`text-sm font-bold ${selectedRole === 'learner' ? 'text-primary' : 'text-muted-foreground'}`}>Learner</span>
          </div>
          <div 
            onClick={() => setValue('role', 'tutor')}
            className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
              selectedRole === 'tutor' 
              ? 'border-primary bg-primary/5 dark:bg-primary/10' 
              : 'border-border hover:border-border/80 bg-card text-muted-foreground hover:text-foreground'
            }`}
          >
            <GraduationCap className={`w-6 h-6 ${selectedRole === 'tutor' ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className={`text-sm font-bold ${selectedRole === 'tutor' ? 'text-primary' : 'text-muted-foreground'}`}>Tutor</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name" className="text-foreground/90 font-semibold text-sm">Full name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            className="h-12 border-border focus-visible:ring-1 focus-visible:ring-primary/20 bg-background text-foreground"
            {...register('name')}
          />
          {errors.name && (
            <p className="text-sm text-destructive font-semibold mt-1">{errors.name.message}</p>
          )}
        </div>

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
          <Label htmlFor="password" className="text-foreground/90 font-semibold text-sm">Password</Label>
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

        <Button type="submit" className="w-full h-12 text-base font-bold shadow-md shadow-primary/10 mt-4" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </Button>
        {authError && (
          <p className="text-sm text-destructive font-semibold">{authError}</p>
        )}
        {infoMessage && (
          <p className="text-sm text-emerald-500 font-semibold">{infoMessage}</p>
        )}
      </form>

      <div className="text-center text-sm text-muted-foreground font-semibold">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-primary hover:underline">
          Log in
        </Link>
      </div>
    </div>
  );
}
