"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Loader2, CheckCircle2 } from 'lucide-react';
import type { TutorStaffRole } from '@/lib/auth/tutor-staff';

interface TutorFormData {
  email: string;
  name: string;
  staffRole: TutorStaffRole;
}

interface CreateTutorResponse {
  success: boolean;
  tutor: {
    id: string;
    email: string;
    name: string;
    staffRole: TutorStaffRole;
  };
  message: string;
  emailSent: boolean;
}

export default function TutorManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<CreateTutorResponse | null>(null);

  const [formData, setFormData] = useState<TutorFormData>({
    email: '',
    name: '',
    staffRole: 'tutor',
  });

  const resetForm = () => {
    setFormData({ email: '', name: '', staffRole: 'tutor' });
    setError(null);
    setSuccess(null);
  };

  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/tutors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create tutor');
        setIsLoading(false);
        return;
      }

      setSuccess(data);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (success?.tempPassword) {
      await navigator.clipboard.writeText(success.tempPassword);
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    }
  };

  return (
    <>
      <Button
        onClick={handleOpenModal}
        className="gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Tutor/Admin
      </Button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add New Tutor</CardTitle>
              <CardDescription>Create a new tutor account and assign a role</CardDescription>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="space-y-4">
                  <div className={`rounded-lg p-4 text-sm border ${
                    success.emailSent
                      ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
                      : 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800'
                  }`}>
                    <div className="flex gap-2 items-start">
                      <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        success.emailSent
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-yellow-600 dark:text-yellow-400'
                      }`} />
                      <div>
                        <p className={`font-semibold ${
                          success.emailSent
                            ? 'text-green-900 dark:text-green-100'
                            : 'text-yellow-900 dark:text-yellow-100'
                        }`}>
                          {success.emailSent ? 'Tutor created successfully!' : 'Tutor created (Email issue)'}
                        </p>
                        <p className={`mt-1 text-xs leading-relaxed ${
                          success.emailSent
                            ? 'text-green-800 dark:text-green-200'
                            : 'text-yellow-800 dark:text-yellow-200'
                        }`}>
                          {success.message}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 bg-muted p-4 rounded-lg">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Email</p>
                      <p className="font-mono text-sm">{success.tutor.email}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Name</p>
                      <p className="text-sm">{success.tutor.name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Role</p>
                      <p className="text-sm capitalize">{success.tutor.staffRole}</p>
                    </div>
                  </div>

                  {!success.emailSent && (
                    <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-xs text-red-800 dark:text-red-200">
                        <strong>Note:</strong> The welcome email could not be sent. Contact support or manually share the login credentials.
                      </p>
                    </div>
                  )}

                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-xs text-blue-800 dark:text-blue-200">
                      <strong>Next Steps:</strong> The tutor will receive an email with their login credentials. 
                      They must change their password on first login.
                    </p>
                  </div>

                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleCloseModal}
                  >
                    Done
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tutor@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="staffRole">Role</Label>
                    <select
                      id="staffRole"
                      value={formData.staffRole}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          staffRole: e.target.value as TutorStaffRole,
                        })
                      }
                      className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                    >
                      <option value="tutor">Tutor</option>
                      <option value="admin">Admin</option>
                      <option value="board_member">Board Member</option>
                    </select>
                  </div>

                  {error && (
                    <p className="text-sm text-destructive font-semibold">{error}</p>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={handleCloseModal}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Tutor'
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
