"use client";

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  BookOpen, 
  Award, 
  Lock, 
  Download, 
  CheckCircle2, 
  Loader2, 
  Calendar, 
  Mail, 
  Shield,
  FileCheck,
  TrendingUp
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProfilePictureUpload from '@/components/profile/ProfilePictureUpload';
import UserAvatar from '@/components/profile/UserAvatar';

interface Certificate {
  id: string;
  courseTitle: string;
  earnedDate: string;
  hours: number;
}

const CERTIFICATES: Certificate[] = [
  { id: 'cert-101', courseTitle: 'Evidence-Based Orthopedics Level 1', earnedDate: 'April 14, 2026', hours: 15 },
  { id: 'cert-102', courseTitle: 'Manual Therapy for Spine Disorders', earnedDate: 'May 02, 2026', hours: 12 },
  { id: 'cert-103', courseTitle: 'Advanced Musculoskeletal Assessment', earnedDate: 'May 18, 2026', hours: 8 }
];

export default function StudentProfile() {
  const { user, updateUser } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'progress' | 'password' | 'certs'>('profile');
  
  // Downloaded certificates map state
  const [downloadedCerts, setDownloadedCerts] = useState<Record<string, boolean>>({});
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passMessage, setPassMessage] = useState<{ text: string; error: boolean } | null>(null);

  // Profile fields state (for simulation)
  const [bio, setBio] = useState('Resident physical therapist specializing in orthopedic rehab and sports medicine.');
  const [specialty, setSpecialty] = useState('Orthopedics & Manual Therapy');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (mounted && !user) {
      router.push('/login');
    }
  }, [user, mounted, router]);

  useEffect(() => {
    // Load downloaded certificates from localStorage
    const saved = localStorage.getItem('camosa-downloaded-certs');
    if (saved) {
      try {
        setDownloadedCerts(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground font-semibold">Loading profile details...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Handle Certificate Printing (Download Once)
  const handleDownloadCert = (cert: Certificate) => {
    if (downloadedCerts[cert.id]) return; // Enforce download once

    // Create a new map, write to localStorage & React state
    const updated = { ...downloadedCerts, [cert.id]: true };
    localStorage.setItem('camosa-downloaded-certs', JSON.stringify(updated));
    setDownloadedCerts(updated);

    // Open print window with a premium certificate template
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to download/print certificates.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Certificate of Completion - ${cert.courseTitle}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;800&family=Montserrat:wght@400;600;800&display=swap');
          body {
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            font-family: 'Montserrat', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .certificate {
            width: 900px;
            height: 620px;
            padding: 40px;
            box-sizing: border-box;
            border: 24px solid #1e40af;
            outline: 6px double #3b82f6;
            outline-offset: -15px;
            background-color: #fafaf9;
            background-image: radial-gradient(circle, #f5f5f4 1px, transparent 1px);
            background-size: 20px 20px;
            text-align: center;
            position: relative;
          }
          .header {
            font-family: 'Cinzel', serif;
            color: #1e3a8a;
            font-size: 40px;
            font-weight: 800;
            letter-spacing: 2px;
            margin-top: 20px;
            text-transform: uppercase;
          }
          .sub-header {
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 4px;
            color: #4b5563;
            margin-top: 10px;
            font-weight: 600;
          }
          .present-to {
            font-size: 14px;
            color: #6b7280;
            margin-top: 40px;
            font-style: italic;
          }
          .name {
            font-family: 'Cinzel', serif;
            font-size: 38px;
            font-weight: 700;
            color: #111827;
            border-bottom: 2px solid #3b82f6;
            display: inline-block;
            padding-bottom: 8px;
            min-width: 450px;
            margin-top: 15px;
          }
          .description {
            font-size: 15px;
            line-height: 1.8;
            color: #374151;
            margin: 30px auto 0 auto;
            max-w: 600px;
          }
          .course {
            font-weight: 800;
            color: #1e40af;
          }
          .footer-section {
            display: flex;
            justify-content: space-between;
            margin-top: 60px;
            padding: 0 50px;
          }
          .sign-block {
            text-align: center;
            width: 200px;
          }
          .signature {
            font-family: 'Cinzel', serif;
            font-size: 18px;
            font-weight: 600;
            font-style: italic;
            color: #1e3a8a;
            border-bottom: 1px solid #d1d5db;
            padding-bottom: 5px;
            margin-bottom: 5px;
          }
          .sign-label {
            font-size: 11px;
            text-transform: uppercase;
            color: #6b7280;
            font-weight: 600;
            letter-spacing: 1px;
          }
          .badge {
            width: 100px;
            height: 100px;
            background: #1e40af;
            border-radius: 50%;
            border: 4px solid #3b82f6;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #ffffff;
            font-weight: 800;
            font-size: 10px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          }
          .badge span {
            font-size: 7px;
            letter-spacing: 1px;
            text-transform: uppercase;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="header">Certificate</div>
          <div class="sub-header">Of Course Completion</div>
          
          <div class="present-to">This is proudly presented to</div>
          <div class="name">${user.name}</div>
          
          <div class="description">
            for successfully satisfying all board requirements and completing the professional training curriculum for <br>
            <span class="course">"${cert.courseTitle}"</span> <br>
            representing <span class="course">${cert.hours} Hours</span> of Continuing Clinical Education.
          </div>
          
          <div class="footer-section">
            <div class="sign-block">
              <div class="signature">Dr. Sarah Jenkins</div>
              <div class="sign-label">Program Director</div>
            </div>
            
            <div class="badge">
              <div>CAMOSA</div>
              <span>VERIFIED</span>
              <div style="font-size: 7px; margin-top: 2px;">ID: ${cert.id.toUpperCase()}</div>
            </div>
            
            <div class="sign-block">
              <div class="signature">${cert.earnedDate}</div>
              <div class="sign-label">Award Date</div>
            </div>
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 1000);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Password reset submit handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMessage(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPassMessage({ text: 'All fields are required.', error: true });
      return;
    }

    if (newPassword.length < 6) {
      setPassMessage({ text: 'New password must be at least 6 characters.', error: true });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassMessage({ text: 'New passwords do not match.', error: true });
      return;
    }

    setIsChangingPass(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsChangingPass(false);

    setPassMessage({ text: 'Password changed successfully!', error: false });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Profile update submit handler
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setIsUpdatingProfile(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsUpdatingProfile(false);
    setProfileMsg('Profile bio updated successfully.');
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      {/* Top Title Section */}
      <div className="mb-8 pb-6 border-b border-border">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Student Profile</h1>
        <p className="text-muted-foreground font-medium mt-1">Manage your professional credentials, details, and certifications.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Navigation Tabs Sidebar */}
        <div className="lg:col-span-3 space-y-3">
          {[
            { id: 'profile', label: 'Profile Details', icon: User },
            { id: 'progress', label: 'Course Progress', icon: TrendingUp },
            { id: 'password', label: 'Change Password', icon: Lock },
            { id: 'certs', label: 'My Certificates', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary bg-transparent border border-transparent'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* Quick summary card */}
          <Card className="border-border bg-card mt-6 p-5 space-y-4">
            <div className="flex items-center gap-3.5">
              <UserAvatar
                userId={user.id}
                name={user.name}
                role={user.role}
                avatarUrl={user.avatarUrl}
                size="lg"
              />
              <div>
                <p className="font-extrabold text-foreground text-sm leading-none">{user.name}</p>
                <Badge className="bg-primary/15 text-primary dark:bg-primary/25 dark:text-blue-300 font-bold border-none mt-1.5 text-[10px] uppercase tracking-wider">
                  {user.role}
                </Badge>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground font-semibold space-y-2 pt-2 border-t border-border/80">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-primary" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>Joined May 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span>ID: {user.id.toUpperCase()}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Active Tab Content Area */}
        <div className="lg:col-span-9">
          
          {/* TAB 1: PROFILE DETAILS */}
          {activeTab === 'profile' && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Profile Information</CardTitle>
                <CardDescription>Update your public details and clinical focus areas.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ProfilePictureUpload
                  userId={user.id}
                  name={user.name}
                  role={user.role}
                  avatarUrl={user.avatarUrl}
                  onUploaded={(url) => updateUser({ avatarUrl: url })}
                />

                <form onSubmit={handleUpdateProfile} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold">Full Name</Label>
                      <Input id="name" value={user.name} disabled className="bg-secondary/40 text-muted-foreground cursor-not-allowed" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                      <Input id="email" type="email" value={user.email} disabled className="bg-secondary/40 text-muted-foreground cursor-not-allowed" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialty" className="text-sm font-semibold">Clinical Field/Focus</Label>
                    <Input 
                      id="specialty" 
                      value={specialty} 
                      onChange={(e) => setSpecialty(e.target.value)} 
                      className="border-border bg-background text-foreground h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-semibold">Professional Biography</Label>
                    <textarea 
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      className="w-full rounded-lg border border-border bg-background text-foreground p-3 text-sm focus-visible:ring-1 focus-visible:ring-primary/20 outline-none"
                    />
                  </div>

                  {profileMsg && (
                    <p className="text-sm font-bold text-emerald-500 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      {profileMsg}
                    </p>
                  )}

                  <Button type="submit" disabled={isUpdatingProfile} className="rounded-full font-bold shadow-md">
                    {isUpdatingProfile ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving changes...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* TAB 2: COURSE PROGRESS */}
          {activeTab === 'progress' && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Clinical Learning Progress</CardTitle>
                <CardDescription>Track your active courses and credit accomplishments.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Visual stats cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-border bg-background/50 text-center space-y-1">
                    <BookOpen className="w-5 h-5 text-blue-500 mx-auto" />
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Enrolled</p>
                    <p className="text-2xl font-black text-foreground">2 Courses</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-background/50 text-center space-y-1">
                    <FileCheck className="w-5 h-5 text-indigo-500 mx-auto" />
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Completed</p>
                    <p className="text-2xl font-black text-foreground">3 Courses</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-background/50 text-center space-y-1">
                    <Award className="w-5 h-5 text-emerald-500 mx-auto" />
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">CEU Credits</p>
                    <p className="text-2xl font-black text-foreground">35 Hours</p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <h3 className="font-bold text-foreground text-sm">Enrolled Courses Detail</h3>
                  
                  {[
                    { title: 'Advanced Musculoskeletal Assessment', progress: 65, lectures: '13 of 20 completed', rate: 'In Progress' },
                    { title: 'Neurological Rehabilitation Techniques', progress: 20, lectures: '3 of 15 completed', rate: 'In Progress' }
                  ].map((course, idx) => (
                    <div key={idx} className="p-5 rounded-2xl border border-border bg-background/30 flex flex-col justify-between gap-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-foreground text-sm">{course.title}</h4>
                        <Badge className="bg-primary/10 text-primary border-none font-bold text-[10px]">{course.rate}</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                        <span>{course.lectures}</span>
                        <span>{course.progress}%</span>
                      </div>

                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

              </CardContent>
            </Card>
          )}

          {/* TAB 3: CHANGE PASSWORD */}
          {activeTab === 'password' && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Security Credentials</CardTitle>
                <CardDescription>Update your password to secure your Camosa Medtech account.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="currPass" className="text-sm font-semibold">Current Password</Label>
                    <Input 
                      id="currPass" 
                      type="password" 
                      value={currentPassword} 
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="border-border bg-background h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPass" className="text-sm font-semibold">New Password</Label>
                    <Input 
                      id="newPass" 
                      type="password" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="border-border bg-background h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPass" className="text-sm font-semibold">Confirm New Password</Label>
                    <Input 
                      id="confirmPass" 
                      type="password" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="border-border bg-background h-11"
                    />
                  </div>

                  {passMessage && (
                    <p className={`text-sm font-semibold ${passMessage.error ? 'text-destructive' : 'text-emerald-500'}`}>
                      {passMessage.text}
                    </p>
                  )}

                  <Button type="submit" disabled={isChangingPass} className="rounded-full font-bold shadow-md mt-2">
                    {isChangingPass ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Changing password...
                      </>
                    ) : (
                      'Change Password'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* TAB 4: CERTIFICATES (DOWNLOAD ONCE RESTRICTION) */}
          {activeTab === 'certs' && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Earned Board Certificates</CardTitle>
                <CardDescription>
                  Download and print your clinical certifications. 
                  <span className="font-bold text-destructive block mt-1.5">
                    ⚠️ Policy Notice: Each certificate is generated dynamically and can only be downloaded ONCE for audit compliance.
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border/80 text-muted-foreground text-xs font-bold uppercase tracking-wider bg-secondary/30">
                        <th className="px-4 py-3">Course / Curricula</th>
                        <th className="px-4 py-3 text-center">Audited Hours</th>
                        <th className="px-4 py-3">Awarded Date</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {CERTIFICATES.map((cert) => {
                        const isDownloaded = !!downloadedCerts[cert.id];
                        return (
                          <tr key={cert.id} className="hover:bg-secondary/10 transition-colors">
                            <td className="px-4 py-4 font-bold text-foreground">
                              {cert.courseTitle}
                              <span className="block text-[10px] text-muted-foreground font-semibold mt-1">ID: {cert.id.toUpperCase()}</span>
                            </td>
                            <td className="px-4 py-4 text-center font-bold text-muted-foreground">{cert.hours} hrs</td>
                            <td className="px-4 py-4 font-medium text-muted-foreground">{cert.earnedDate}</td>
                            <td className="px-4 py-4 text-right">
                              <Button 
                                onClick={() => handleDownloadCert(cert)}
                                disabled={isDownloaded}
                                size="sm" 
                                className={`rounded-full font-bold h-9 px-4 ${
                                  isDownloaded 
                                    ? 'bg-secondary text-muted-foreground cursor-not-allowed border-none' 
                                    : 'bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm'
                                }`}
                              >
                                {isDownloaded ? (
                                  <>
                                    <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-500" />
                                    <span>Downloaded</span>
                                  </>
                                ) : (
                                  <>
                                    <Download className="w-4 h-4 mr-1.5" />
                                    <span>Download Once</span>
                                  </>
                                )}
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

              </CardContent>
            </Card>
          )}

        </div>

      </div>
    </div>
  );
}
