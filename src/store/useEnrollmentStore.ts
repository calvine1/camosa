import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

export interface Enrollment {
  id: string; // From supabase UUID
  userId: string;
  courseId: string;
  progress: number;
  nextLesson: string;
  enrolledAt: string;
}

interface EnrollmentState {
  enrollments: Enrollment[];
  isLoading: boolean;
  fetchEnrollments: () => Promise<void>;
  enrollCourse: (userId: string, courseId: string, firstLessonTitle: string) => Promise<void>;
  updateProgress: (userId: string, courseId: string, progress: number, nextLesson?: string) => Promise<void>;
  getUserEnrollments: (userId: string) => Enrollment[];
}

export const useEnrollmentStore = create<EnrollmentState>((set, get) => ({
  enrollments: [],
  isLoading: false,

  fetchEnrollments: async () => {
    set({ isLoading: true });
    const supabase = createClient();
    try {
      // The RLS policies ensure users only fetch their own enrollments,
      // or tutors fetch enrollments for their courses.
      const { data, error } = await supabase
        .from('enrollments')
        .select('*');

      if (error) throw error;

      const formatted: Enrollment[] = data.map((e: any) => ({
        id: e.id,
        userId: e.user_id,
        courseId: e.course_id,
        progress: e.progress_percent,
        nextLesson: e.next_lesson,
        enrolledAt: e.enrolled_at
      }));

      set({ enrollments: formatted, isLoading: false });
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      set({ isLoading: false });
    }
  },

  enrollCourse: async (userId, courseId, firstLessonTitle) => {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from('enrollments')
        .insert({
          user_id: userId,
          course_id: courseId,
          progress_percent: 0,
          next_lesson: firstLessonTitle
        });

      if (error) throw error;
      await get().fetchEnrollments();
    } catch (error) {
      console.error('Error enrolling course:', error);
    }
  },

  updateProgress: async (userId, courseId, progress, nextLesson) => {
    const supabase = createClient();
    try {
      const updates: any = { progress_percent: Math.min(progress, 100) };
      if (nextLesson !== undefined) {
        updates.next_lesson = nextLesson;
      }

      const { error } = await supabase
        .from('enrollments')
        .update(updates)
        .match({ user_id: userId, course_id: courseId });

      if (error) throw error;
      await get().fetchEnrollments();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  },

  getUserEnrollments: (userId) => get().enrollments.filter((e) => e.userId === userId),
}));
