"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/useAuthStore';
import { createClient } from '@/lib/supabase/client';
import ProfilePictureUpload from '@/components/profile/ProfilePictureUpload';
import TutorManagement from '@/components/tutor/TutorManagement';
import {
  TUTOR_STAFF_ROLES,
  getTutorStaffLabel,
  type TutorStaffRole,
} from '@/lib/auth/tutor-staff';
import {
  CheckCircle2,
  Loader2,
  Key,
  Building2,
  Phone,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Check,
  AlertCircle
} from 'lucide-react';

type PayoutMethod = 'bank' | 'mpesa';

export default function TutorSettings() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const supabase = createClient();

  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [accountName, setAccountName] = useState(user?.name || '');
  const [accountEmail, setAccountEmail] = useState(user?.email || '');
  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [accountMsg, setAccountMsg] = useState<{ text: string; error: boolean } | null>(null);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isResettingEmail, setIsResettingEmail] = useState(false);
  const [securityMsg, setSecurityMsg] = useState<{ text: string; error: boolean } | null>(null);
  const [staffRole, setStaffRole] = useState<TutorStaffRole>(user?.staffRole ?? 'tutor');
  const [isSavingStaffRole, setIsSavingStaffRole] = useState(false);
  const [staffRoleMsg, setStaffRoleMsg] = useState<{ text: string; error: boolean } | null>(null);

  // Method state
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod>('mpesa');

  // Bank Form states
  const [routing, setRouting] = useState('021000021');
  const [account, setAccount] = useState('*********8920');
  const [bankName, setBankName] = useState('Eury National Bank,');

  // M-Pesa Form states
  const [mpesaPhone, setMpesaPhone] = useState('0712345678');
  const [mpesaName, setMpesaName] = useState('Dr. Callme Eury');
  const [isMpesaLinked, setIsMpesaLinked] = useState(true);

  // STK Push verification simulation states
  const [stkSent, setStkSent] = useState(false);
  const [stkPin, setStkPin] = useState('');
  const [stkVerifying, setStkVerifying] = useState(false);
  const [stkError, setStkError] = useState('');

  // Bio state
  const [bio, setBio] = useState('Board certified orthopedic advisor and clinical researcher with 15+ years experience.');

  React.useEffect(() => {
    if (user?.staffRole) setStaffRole(user.staffRole);
  }, [user?.staffRole]);

  const handleSaveStaffRole = async () => {
    setStaffRoleMsg(null);
    setIsSavingStaffRole(true);

    const { error } = await supabase.auth.updateUser({
      data: {
        staff_role: staffRole,
        role: 'tutor',
        name: user?.name,
        avatar_url: user?.avatarUrl ?? undefined,
      },
    });

    setIsSavingStaffRole(false);

    if (error) {
      setStaffRoleMsg({ text: error.message, error: true });
      return;
    }

    updateUser({ staffRole });
    setStaffRoleMsg({
      text: `Portal role updated to ${getTutorStaffLabel(staffRole)}.`,
      error: false,
    });
  };

  const handleSaveSettings = async () => {
    setMsg(null);
    setIsSaving(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setMsg('Tutor configurations saved successfully.');
  };

  const handleSaveAccountDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountMsg(null);
    const trimmedName = accountName.trim();
    const trimmedEmail = accountEmail.trim();

    if (!trimmedName) {
      setAccountMsg({ text: 'Full name is required.', error: true });
      return;
    }

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setAccountMsg({ text: 'Please provide a valid email address.', error: true });
      return;
    }

    setIsSavingAccount(true);
    const { data: updateData, error } = await supabase.auth.updateUser({
      email: trimmedEmail !== user?.email ? trimmedEmail : undefined,
      data: {
        name: trimmedName,
        role: user?.role,
        staff_role: user?.staffRole ?? staffRole,
        avatar_url: user?.avatarUrl ?? undefined,
      },
    });

    if (error) {
      setIsSavingAccount(false);
      setAccountMsg({ text: error.message, error: true });
      return;
    }

    updateUser({ name: trimmedName, email: trimmedEmail });
    setIsSavingAccount(false);
    if (updateData.user?.email !== user?.email && trimmedEmail !== user?.email) {
      setAccountMsg({ text: 'Profile updated. Please verify your new email from your inbox.', error: false });
    } else {
      setAccountMsg({ text: 'Account details updated successfully.', error: false });
    }
  };

  const handleResetPassword = async () => {
    setSecurityMsg(null);
    setIsResettingPassword(true);
    const { error } = await supabase.auth.resetPasswordForEmail(accountEmail, {
      redirectTo: `${window.location.origin}/login`,
    });
    setIsResettingPassword(false);
    if (error) {
      setSecurityMsg({ text: error.message, error: true });
      return;
    }
    setSecurityMsg({ text: 'Password reset link sent to your email.', error: false });
  };

  const handleResetEmail = async () => {
    setSecurityMsg(null);
    setIsResettingEmail(true);
    const { error } = await supabase.auth.updateUser({
      email: accountEmail.trim(),
    });
    setIsResettingEmail(false);
    if (error) {
      setSecurityMsg({ text: error.message, error: true });
      return;
    }
    setSecurityMsg({ text: 'Email verification/reset link has been sent.', error: false });
  };

  const triggerStkPush = () => {
    setStkError('');
    setStkSent(true);
  };

  const handleVerifyStk = async (e: React.FormEvent) => {
    e.preventDefault();
    setStkError('');

    if (stkPin !== '1234') {
      setStkError('Incorrect M-Pesa PIN. Please enter "1234" to simulate a successful STK response.');
      return;
    }

    setStkVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStkVerifying(false);
    setIsMpesaLinked(true);
    setStkSent(false);
    setStkPin('');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">

      {/* Title */}
      <div className="pb-6 border-b border-border">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Tutor Settings</h1>
        <p className="text-muted-foreground font-medium mt-1">Configure your payout accounts, qualifications, and preferences.</p>
      </div>

      <div className="space-y-8">
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-4 border-b border-border/60">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Tutor Admin Account
            </CardTitle>
            <CardDescription>Edit your tutor admin details and reset account credentials.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {user && (
              <ProfilePictureUpload
                userId={user.id}
                name={user.name}
                role={user.role}
                avatarUrl={user.avatarUrl}
                onUploaded={(url) => updateUser({ avatarUrl: url })}
              />
            )}

            <form onSubmit={handleSaveAccountDetails} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tutorFullName" className="text-sm font-semibold">Full Name</Label>
                  <Input
                    id="tutorFullName"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="h-11 border-border bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tutorEmail" className="text-sm font-semibold">Email Address</Label>
                  <Input
                    id="tutorEmail"
                    type="email"
                    value={accountEmail}
                    onChange={(e) => setAccountEmail(e.target.value)}
                    className="h-11 border-border bg-background"
                  />
                </div>
              </div>

              {accountMsg && (
                <p className={`text-sm font-semibold ${accountMsg.error ? 'text-destructive' : 'text-emerald-500'}`}>
                  {accountMsg.text}
                </p>
              )}

              <Button type="submit" disabled={isSavingAccount} className="rounded-full font-bold">
                {isSavingAccount ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving account...
                  </>
                ) : (
                  'Save Account Details'
                )}
              </Button>
            </form>

            <div className="border-t border-border pt-5 space-y-4">
              <p className="text-sm font-bold text-foreground">Portal role</p>
              <p className="text-xs text-muted-foreground">
                Set how you appear and operate within the tutor administration portal.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {TUTOR_STAFF_ROLES.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setStaffRole(option.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${staffRole === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-border/80 bg-background/50'
                      }`}
                  >
                    <p className="text-sm font-extrabold text-foreground">{option.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                      {option.description}
                    </p>
                  </button>
                ))}
              </div>
              {staffRoleMsg && (
                <p
                  className={`text-sm font-semibold ${staffRoleMsg.error ? 'text-destructive' : 'text-emerald-500'}`}
                >
                  {staffRoleMsg.text}
                </p>
              )}
              <Button
                type="button"
                onClick={handleSaveStaffRole}
                disabled={isSavingStaffRole}
                className="rounded-full font-bold"
              >
                {isSavingStaffRole ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving role...
                  </>
                ) : (
                  'Save portal role'
                )}
              </Button>
            </div>

            <div className="border-t border-border pt-5 space-y-4">
              <p className="text-sm font-semibold text-muted-foreground">Security Actions</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetPassword}
                  disabled={isResettingPassword}
                  className="sm:w-auto w-full"
                >
                  {isResettingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending reset...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetEmail}
                  disabled={isResettingEmail}
                  className="sm:w-auto w-full"
                >
                  {isResettingEmail ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending link...
                    </>
                  ) : (
                    'Reset / Verify Email'
                  )}
                </Button>
              </div>

              {securityMsg && (
                <p className={`text-sm font-semibold ${securityMsg.error ? 'text-destructive' : 'text-emerald-500'}`}>
                  {securityMsg.text}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tutor Management */}
        {(user?.staffRole === 'admin' || user?.staffRole === 'board_member') && (
          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="pb-4 border-b border-border/60">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Manage Tutors
              </CardTitle>
              <CardDescription>Add new tutors and administrators to the portal.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <TutorManagement />
            </CardContent>
          </Card>
        )}

        {/* Payout Information */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-4 border-b border-border/60">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Payout Channels & Accounts
            </CardTitle>
            <CardDescription>Select and configure how you want to receive monthly revenue payouts.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">

            {/* Payout Selector Tabs */}
            <div className="grid grid-cols-2 p-1.5 bg-secondary/30 rounded-xl max-w-md border border-border">
              <button
                type="button"
                onClick={() => setPayoutMethod('mpesa')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${payoutMethod === 'mpesa'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Smartphone className="w-4 h-4 text-emerald-500" />
                M-Pesa (via Paystack)
              </button>
              <button
                type="button"
                onClick={() => setPayoutMethod('bank')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${payoutMethod === 'bank'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Building2 className="w-4 h-4 text-blue-500" />
                Direct Bank Deposit
              </button>
            </div>

            {/* Render M-Pesa Setup Form */}
            {payoutMethod === 'mpesa' && (
              <div className="space-y-5 animate-fade-in">

                {/* Linked Banner */}
                {isMpesaLinked ? (
                  <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <Check className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">Paystack M-Pesa Linked</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Active payouts to {mpesaPhone} ({mpesaName})</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-xs font-bold text-destructive hover:bg-destructive/10"
                      onClick={() => setIsMpesaLinked(false)}
                    >
                      Disconnect Wallet
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-border bg-background/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-foreground">M-Pesa Payouts Not Configured</p>
                      <p className="text-xs text-muted-foreground">Setup Paystack STK Push authentication to verify your mobile number.</p>
                    </div>
                    <Button
                      type="button"
                      onClick={triggerStkPush}
                      className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5"
                    >
                      Setup M-Pesa Wallet
                    </Button>
                  </div>
                )}

                {/* Form fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mpesaNum" className="text-sm font-semibold">M-Pesa Mobile Number</Label>
                    <Input
                      id="mpesaNum"
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      placeholder="e.g. 0712345678"
                      disabled={isMpesaLinked}
                      className="h-11 border-border bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mpesaName" className="text-sm font-semibold">Account Holder Name</Label>
                    <Input
                      id="mpesaName"
                      value={mpesaName}
                      onChange={(e) => setMpesaName(e.target.value)}
                      placeholder="Registered M-Pesa Name"
                      disabled={isMpesaLinked}
                      className="h-11 border-border bg-background"
                    />
                  </div>
                </div>

                {/* M-Pesa STK Push Simulation Panel */}
                {stkSent && (
                  <div className="p-5 border border-primary/20 bg-primary/5 rounded-2xl animate-fade-in grid grid-cols-1 md:grid-cols-5 gap-6 items-center">

                    {/* Simulator Info */}
                    <div className="md:col-span-3 space-y-3">
                      <h4 className="font-extrabold text-sm text-foreground flex items-center gap-1.5">
                        <Smartphone className="w-5 h-5 text-primary" />
                        Paystack M-Pesa STK Push Simulation
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        We have simulated sending an M-Pesa STK Push prompt to your phone <span className="font-bold text-foreground">{mpesaPhone}</span>.
                        Enter the pin below (simulate with pin: <span className="font-black text-primary font-mono bg-secondary/80 px-1.5 py-0.5 rounded">1234</span>) to verify and link your mobile money wallet.
                      </p>

                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter PIN (1234)"
                          value={stkPin}
                          onChange={(e) => setStkPin(e.target.value)}
                          maxLength={4}
                          className="w-40 h-10 border-border bg-background text-center font-bold tracking-widest text-sm"
                        />
                        <Button
                          type="button"
                          onClick={handleVerifyStk}
                          disabled={stkVerifying}
                          className="rounded-lg font-bold"
                        >
                          {stkVerifying ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : 'Confirm M-Pesa Pin'}
                        </Button>
                      </div>

                      {stkError && (
                        <p className="text-xs font-bold text-destructive flex items-center gap-1.5 animate-fade-in">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          {stkError}
                        </p>
                      )}
                    </div>

                    {/* Visual Phone Prompt Screen Mockup */}
                    <div className="md:col-span-2 flex justify-center">
                      <div className="w-56 rounded-3xl border-4 border-slate-700 bg-slate-900 p-3.5 shadow-xl relative aspect-[9/16] overflow-hidden text-white flex flex-col justify-between">

                        {/* Phone Header notch */}
                        <div className="w-20 h-4 bg-slate-700 rounded-b-xl mx-auto absolute top-0 left-1/2 -translate-x-1/2" />

                        <div className="space-y-4 mt-4">
                          {/* Time */}
                          <div className="text-[10px] text-center font-bold text-slate-400">10:14 AM</div>

                          {/* STK Dialog Box */}
                          <div className="bg-slate-800 rounded-xl p-3 border border-slate-700 space-y-3.5 text-center shadow-lg">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                              <Smartphone className="w-4 h-4" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-black tracking-wide text-emerald-400 uppercase">M-PESA Prompt</p>
                              <p className="text-[9px] text-slate-200 leading-normal">
                                Do you want to authorize Camosa Medtech payout linkage via Paystack?
                              </p>
                            </div>
                            <div className="w-full bg-slate-900 border border-slate-700 rounded-md p-1 text-[9px] font-mono text-center text-slate-400">
                              {stkPin ? '••••' : 'Enter 4-digit PIN'}
                            </div>
                          </div>
                        </div>

                        {/* Phone bottom bar indicator */}
                        <div className="w-20 h-1 bg-slate-700 rounded-full mx-auto" />
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* Render Direct Bank Deposit Form */}
            {payoutMethod === 'bank' && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName" className="text-sm font-semibold">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="h-11 border-border bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="routingNumber" className="text-sm font-semibold">Routing Number (9 Digits)</Label>
                    <Input
                      id="routingNumber"
                      value={routing}
                      onChange={(e) => setRouting(e.target.value)}
                      className="h-11 border-border bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber" className="text-sm font-semibold">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    className="h-11 border-border bg-background"
                  />
                </div>
              </div>
            )}

          </CardContent>
        </Card>

        {/* Board Verification */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-4 border-b border-border/60">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              Board Verification & Bio
            </CardTitle>
            <CardDescription>Your public qualifications displayed on course listings.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tutorBio" className="text-sm font-semibold">Instructor Bio</Label>
              <textarea
                id="tutorBio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-border bg-background text-foreground p-3 text-sm focus-visible:ring-1 focus-visible:ring-primary/20 outline-none"
              />
            </div>

            <div className="p-4 rounded-xl border border-border bg-background/50 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-foreground">APTA Board Certification</p>
                <p className="text-xs text-muted-foreground mt-0.5">Verified license number: APTA-89032-MA</p>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[9px] uppercase tracking-widest px-2.5 py-1">
                Verified
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Save button and status messages */}
        <div className="flex items-center gap-4">
          <Button type="button" onClick={handleSaveSettings} disabled={isSaving} className="rounded-full font-bold shadow-md h-11 px-8">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving preferences...
              </>
            ) : (
              'Save Preferences'
            )}
          </Button>

          {msg && (
            <p className="text-sm font-bold text-emerald-500 flex items-center gap-1.5 animate-fade-in">
              <CheckCircle2 className="w-4.5 h-4.5" />
              {msg}
            </p>
          )}
        </div>

      </div>

    </div>
  );
}
