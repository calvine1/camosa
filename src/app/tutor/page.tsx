"use client";

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, DollarSign, TrendingUp, Plus, MoreVertical, Star, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function TutorDashboard() {
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState({ students: 0, courses: 0, earnings: 0, rating: 0 });
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      const supabase = createClient();

      // Load Analytics
      const { data: analytics } = await supabase
        .from('tutor_analytics')
        .select('*')
        .eq('tutor_id', user.id)
        .single();

      if (analytics) {
        setStats({
          students: analytics.total_students || 0,
          courses: analytics.total_courses || 0,
          earnings: 0,
          rating: 0
        });
      }

      // Load Recent Enrollments
      const { data: recentEnrollments } = await supabase
        .from('enrollments')
        .select('*, profiles(name, email), courses(title)')
        .order('enrolled_at', { ascending: false })
        .limit(5);

      if (recentEnrollments) {
        setEnrollments(recentEnrollments);
      }
      setIsLoading(false);
    }
    loadData();
  }, [user]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Tutor Overview</h1>
          <p className="text-muted-foreground font-medium mt-1">Welcome back, {user?.name || 'Instructor'}. Review your course metrics and students.</p>
        </div>
        <Link href="/tutor/courses">
          <Button className="rounded-full shadow-md font-bold h-11 px-6">
            <Plus className="w-5 h-5 mr-2" />
            Create New Course
          </Button>
        </Link>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Students', value: stats.students.toString(), icon: Users, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
          { label: 'Active Courses', value: stats.courses.toString(), icon: BookOpen, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' },
          { label: 'Total Earnings', value: `$${stats.earnings}`, icon: DollarSign, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Course Rating', value: stats.rating.toString(), icon: TrendingUp, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
        ].map((stat, i) => (
          <Card key={i} className="border-border bg-card shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${stat.color.split(' ')[1]} ${stat.color.split(' ')[2]} ${stat.color.split(' ')[0]}`}>
                  <stat.icon className="w-5.5 h-5.5" />
                </div>
              </div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-black text-foreground mt-2 tracking-tight">{isLoading ? '-' : stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Recent Students Table */}
        <Card className="lg:col-span-2 border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/60">
            <div>
              <CardTitle className="text-lg font-bold">Recent Student Enrollments</CardTitle>
              <CardDescription>Latest student registrations for your courses.</CardDescription>
            </div>
            <Link href="/tutor/students">
              <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-secondary">View All</Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-secondary/35 text-muted-foreground text-xs font-bold uppercase tracking-wider border-b border-border/60">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Course</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {enrollments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground font-medium">
                        {isLoading ? "Loading enrollments..." : "No recent enrollments found."}
                      </td>
                    </tr>
                  ) : (
                    enrollments.map((row, i) => (
                      <tr key={i} className="hover:bg-secondary/20 transition-colors">
                        <td className="px-6 py-4.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-secondary border border-border overflow-hidden shrink-0 flex items-center justify-center text-xs font-bold">
                              {row.profiles?.name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <p className="font-bold text-foreground text-sm">{row.profiles?.name || 'Unknown'}</p>
                              <p className="text-xs text-muted-foreground font-semibold">{row.profiles?.email || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4.5 font-semibold text-muted-foreground text-sm">{row.courses?.title || 'Unknown Course'}</td>
                        <td className="px-6 py-4.5 text-muted-foreground text-xs font-semibold">{new Date(row.enrolled_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4.5">
                          <Badge className="bg-emerald-500/10 text-emerald-500 font-black text-[9px] uppercase tracking-widest border-none">
                            Active
                          </Badge>
                        </td>
                        <td className="px-6 py-4.5 text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions / Tips */}
        <div className="space-y-6">
          <Card className="border-primary/20 bg-primary/5 dark:bg-primary/10 shadow-none overflow-hidden relative">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-primary">Tutor Tip</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed font-semibold">
                Courses with video introductions have <span className="font-black text-foreground">40% higher</span> enrollment rates. Try adding a 1-minute intro to your musculoskeletal assessment course.
              </p>
              <Button size="sm" className="rounded-full font-bold shadow-sm">Update Course</Button>
            </CardContent>
            <div className="absolute -bottom-6 -right-6 opacity-10 dark:opacity-5">
              <TrendingUp className="w-24 h-24 text-primary" />
            </div>
          </Card>

          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Recent Student Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="py-6 text-center text-muted-foreground font-medium text-sm">
                No recent feedback available.
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
