"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { useCourseStore } from '@/store/useCourseStore';
import { useEnrollmentStore } from '@/store/useEnrollmentStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen, Clock, Award, PlayCircle, ChevronRight, User, ArrowRight,
  Search, Star, Users, X, ExternalLink, Calendar
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LearnerDashboard() {
  const user = useAuthStore((state) => state.user);
  const courses = useCourseStore((state) => state.courses);
  const fetchCourses = useCourseStore((state) => state.fetchCourses);
  const { enrollments, enrollCourse, updateProgress, fetchEnrollments } = useEnrollmentStore();
  const router = useRouter();

  const [showCourseModal, setShowCourseModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Redirect if not logged in or wrong role
  React.useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'learner') {
      router.push('/tutor');
    }
  }, [user, router]);

  // Fetch from Supabase on mount
  React.useEffect(() => {
    fetchCourses();
    fetchEnrollments();
  }, [fetchCourses, fetchEnrollments]);

  if (!user) return null;

  // Published courses from the shared store
  const publishedCourses = courses.filter((c) => c.status === 'Published');
  const categories = ['All', ...Array.from(new Set(publishedCourses.map((c) => c.category)))];
  const filteredCourses =
    activeCategory === 'All'
      ? publishedCourses
      : publishedCourses.filter((c) => c.category === activeCategory);
  const searchResults = filteredCourses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Enrolled courses computed from actual store
  const userEnrollments = enrollments.filter(e => e.userId === user.id);
  const enrolledCourses = courses
    .filter(c => userEnrollments.some(e => e.courseId === c.id))
    .map(c => {
      const enrollment = userEnrollments.find(e => e.courseId === c.id)!;
      return {
        ...c,
        progress: enrollment.progress,
        nextLesson: enrollment.nextLesson
      };
    });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Welcome back, {user.name}!
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            Track your progress and continue your physical therapy education.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/profile">
            <Button variant="outline" className="rounded-full border-border h-11 hover:bg-accent font-semibold">
              <User className="w-4 h-4 mr-2" />
              Manage Profile &amp; Certs
            </Button>
          </Link>
          <Button
            className="rounded-full shadow-md font-semibold h-11 px-6"
            onClick={() => setShowCourseModal(true)}
          >
            Explore New Courses
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="border-border bg-blue-500/10 dark:bg-blue-500/5 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Active Courses</p>
                <p className="text-3xl font-black text-foreground mt-1">{enrolledCourses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-indigo-500/10 dark:bg-indigo-500/5 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500 text-white flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Hours Learned</p>
                <p className="text-3xl font-black text-foreground mt-1">24.5</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-emerald-500/10 dark:bg-emerald-500/5 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Certificates</p>
                <p className="text-3xl font-black text-foreground mt-1">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Continue Learning */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-foreground tracking-tight">Continue Learning</h2>
          <div className="space-y-4">
            {enrolledCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden border-border bg-card shadow-sm group hover:border-primary/20 dark:hover:border-primary/40 transition-all duration-300">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-48 h-36 overflow-hidden relative">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                      />
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-primary uppercase tracking-widest">In Progress</span>
                          <span className="text-xs font-bold text-muted-foreground">{course.progress}% Completed</span>
                        </div>
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1">
                          {course.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5 font-medium">
                          <PlayCircle className="w-4 h-4 text-primary" />
                          <span>Next Lesson: {course.nextLesson}</span>
                        </p>
                      </div>
                      
                      <div>
                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-4">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-1000" 
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <Button
                          size="sm"
                          className="rounded-full h-9 px-5 font-bold shadow-sm"
                          onClick={() => {
                            const newProgress = Math.min(course.progress + 15, 100);
                            let nextLesson = course.nextLesson;
                            if (newProgress >= 100) {
                              nextLesson = "Course Completed!";
                            } else if (course.videos && course.videos.length > 0) {
                              const randomVid = course.videos[Math.floor(Math.random() * course.videos.length)];
                              nextLesson = randomVid.title;
                            } else {
                              nextLesson = "Next Module";
                            }
                            updateProgress(user.id, course.id, newProgress, nextLesson);
                          }}
                        >
                          Resume Course
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {enrolledCourses.length === 0 && (
              <div className="text-center py-16 border border-dashed border-border rounded-2xl">
                <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-semibold text-muted-foreground">No courses enrolled yet.</p>
                <Button className="mt-4 rounded-full" onClick={() => setShowCourseModal(true)}>
                  Browse Courses
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar widgets */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight mb-6">Upcoming Sessions</h2>
            <div className="space-y-4">
              {[
                { time: 'Today, 4:00 PM', title: 'Q&A: Shoulder Impingement', host: 'Dr. Sarah' },
                { time: 'Tomorrow, 10:00 AM', title: 'Live Rehab Demo', host: 'Michael C.' },
              ].map((session, i) => (
                <div key={i} className="p-4 rounded-2xl border border-border bg-card hover:bg-secondary/40 transition-all cursor-pointer group">
                  <p className="text-xs font-bold text-primary mb-1">{session.time}</p>
                  <h4 className="font-bold text-foreground group-hover:text-primary transition-colors text-sm">{session.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 font-semibold">with {session.host}</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="bg-slate-950 border-border text-white overflow-hidden relative">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Upgrade to Premium</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Get unlimited access to all courses, live sessions, and accredited certifications.
              </p>
              <Button variant="secondary" className="w-full rounded-full font-bold group bg-white text-slate-950 hover:bg-white/90">
                View Plans
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          </Card>
        </div>
      </div>

      {/* Explore New Courses Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-2xl border border-border bg-card shadow-2xl my-8">
            
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-border bg-card rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Explore Courses</h2>
                <p className="text-muted-foreground text-sm font-medium mt-0.5">
                  {publishedCourses.length} courses available — browse and enroll
                </p>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setShowCourseModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Search & Category Filter */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    placeholder="Search courses or instructors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 h-11 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:ring-1 focus:ring-primary/20"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                        activeCategory === cat
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Courses Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((course) => (
                  <div
                    key={course.id}
                    className="group rounded-xl border border-border bg-background overflow-hidden hover:border-primary/30 hover:shadow-md transition-all duration-200"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <Badge className="absolute top-2 left-2 bg-white/95 text-slate-900 font-bold text-[10px] uppercase border border-slate-200">
                        {course.category}
                      </Badge>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-foreground text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs text-muted-foreground font-medium">{course.instructor}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground font-semibold">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          {course.rating || 'New'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {course.students}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {course.duration}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="font-black text-foreground text-sm">{course.price}</span>
                        {userEnrollments.some((e) => e.courseId === course.id) ? (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="rounded-full h-8 px-4 text-xs font-bold"
                            disabled
                          >
                            Enrolled
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="rounded-full h-8 px-4 text-xs font-bold"
                            onClick={() => {
                              enrollCourse(user.id, course.id, course.videos?.[0]?.title || 'Introduction Module');
                              setShowCourseModal(false);
                            }}
                          >
                            Enroll Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {searchResults.length === 0 && (
                <div className="text-center py-12">
                  <Search className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground font-semibold">No courses match your search.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
