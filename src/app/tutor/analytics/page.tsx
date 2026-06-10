"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, BarChart3, TrendingUp, Users, ArrowUpRight, GraduationCap } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { createClient } from '@/lib/supabase/client';

export default function TutorAnalytics() {
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState({ students: 0, courses: 0, earnings: 0, rating: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      const supabase = createClient();
      
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
      setIsLoading(false);
    }
    loadData();
  }, [user]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="pb-6 border-b border-border">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Earnings & Analytics</h1>
        <p className="text-muted-foreground font-medium mt-1">Analyze payouts, monthly course performance, and student retention.</p>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border bg-card shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Gross Revenue (YTD)</p>
                <p className="text-3xl font-black text-foreground mt-2">{isLoading ? '-' : `$0.00`}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-card shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Average Monthly Sales</p>
                <p className="text-3xl font-black text-foreground mt-2">{isLoading ? '-' : `$0.00`}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                <BarChart3 className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Enrolled Users</p>
                <p className="text-3xl font-black text-foreground mt-2">{isLoading ? '-' : stats.students}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Earnings chart placeholder */}
        <Card className="lg:col-span-2 border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Monthly Sales Performance</CardTitle>
            <CardDescription>Monthly gross payouts.</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center pt-6 border-t border-border/80 text-muted-foreground text-sm font-medium">
            No sales data available for this period.
          </CardContent>
        </Card>

        {/* Top selling courses list */}
        <Card className="border-border bg-card shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-4 border-b border-border/60">
            <CardTitle className="text-lg font-bold">Top Selling Categories</CardTitle>
            <CardDescription>Topic distributions of gross revenue.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 flex items-center justify-center text-muted-foreground text-sm font-medium">
            Not enough data to determine top categories.
          </CardContent>
        </Card>
      </div>

      {/* Payout Table */}
      <Card className="border-border bg-card shadow-sm overflow-hidden">
        <CardHeader className="pb-4 border-b border-border/60">
          <CardTitle className="text-lg font-bold">Recent Payouts</CardTitle>
          <CardDescription>History of monthly payout transfers.</CardDescription>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/35 text-muted-foreground text-xs font-bold uppercase tracking-wider border-b border-border">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Period</th>
                <th className="px-6 py-4">Payout Method</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground font-medium">
                  No payout history available.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}
