import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

export interface VideoLesson {
  id: string;
  title: string;
  duration: string;
  video_url?: string;
  position?: number;
}

export interface Webinar {
  id: string;
  title: string;
  date: string;
  time: string;
  link: string;
}

export interface Course {
  id: string;
  tutor_id: string;
  title: string;
  instructor: string;
  category: string;
  students: number;
  rating: number;
  price: string;
  status: 'Published' | 'Draft';
  duration: string;
  image: string;
  popular: boolean;
  videos: VideoLesson[];
  webinars: Webinar[];
}

export const INITIAL_COURSES: Course[] = []; // Replaced by Supabase data

interface CourseState {
  courses: Course[];
  isLoading: boolean;
  fetchCourses: () => Promise<void>;
  addCourse: (course: Omit<Course, 'id' | 'students' | 'rating' | 'popular' | 'tutor_id'>, tutorId: string) => Promise<void>;
  updateCourse: (id: string, updates: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  addVideo: (courseId: string, video: VideoLesson) => Promise<void>;
  addWebinar: (courseId: string, webinar: Webinar) => Promise<void>;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: INITIAL_COURSES,
  isLoading: false,

  fetchCourses: async () => {
    set({ isLoading: true });
    const supabase = createClient();
    try {
      const { data: coursesData, error } = await supabase
        .from('courses')
        .select(`
          *,
          course_videos(*),
          course_webinars(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedCourses: Course[] = coursesData.map((c: any) => ({
        id: c.id,
        tutor_id: c.tutor_id,
        title: c.title,
        instructor: c.instructor,
        category: c.category,
        students: 0, // Mocked for now, requires analytics integration
        rating: Number(c.rating) || 0,
        price: c.price,
        status: c.status as 'Published' | 'Draft',
        duration: c.duration,
        image: c.image_url,
        popular: c.popular,
        videos: (c.course_videos || []).map((v: any) => ({
          id: v.id,
          title: v.title,
          duration: v.duration,
          video_url: v.video_url,
          position: v.position
        })),
        webinars: (c.course_webinars || []).map((w: any) => ({
          id: w.id,
          title: w.title,
          date: w.webinar_date,
          time: w.webinar_time,
          link: w.link
        })),
      }));

      set({ courses: formattedCourses, isLoading: false });
    } catch (error) {
      console.error('Error fetching courses:', error);
      set({ isLoading: false });
    }
  },

  addCourse: async (courseData, tutorId) => {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert({
          tutor_id: tutorId,
          title: courseData.title,
          instructor: courseData.instructor,
          category: courseData.category,
          price: courseData.price,
          status: courseData.status,
          duration: courseData.duration,
          image_url: courseData.image,
        })
        .select()
        .single();

      if (error) throw error;
      await get().fetchCourses(); // Refresh
    } catch (error) {
      console.error('Error adding course:', error);
    }
  },

  updateCourse: async (id, updates) => {
    const supabase = createClient();
    try {
      const dbUpdates: any = {};
      if (updates.title) dbUpdates.title = updates.title;
      if (updates.instructor) dbUpdates.instructor = updates.instructor;
      if (updates.category) dbUpdates.category = updates.category;
      if (updates.price) dbUpdates.price = updates.price;
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.duration) dbUpdates.duration = updates.duration;
      if (updates.image) dbUpdates.image_url = updates.image;

      const { error } = await supabase
        .from('courses')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;
      await get().fetchCourses(); // Refresh
    } catch (error) {
      console.error('Error updating course:', error);
    }
  },

  deleteCourse: async (id) => {
    const supabase = createClient();
    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
      await get().fetchCourses(); // Refresh
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  },

  addVideo: async (courseId, video) => {
    const supabase = createClient();
    try {
      const { error } = await supabase.from('course_videos').insert({
        course_id: courseId,
        title: video.title,
        duration: video.duration,
      });
      if (error) throw error;
      await get().fetchCourses(); // Refresh
    } catch (error) {
      console.error('Error adding video:', error);
    }
  },

  addWebinar: async (courseId, webinar) => {
    const supabase = createClient();
    try {
      const { error } = await supabase.from('course_webinars').insert({
        course_id: courseId,
        title: webinar.title,
        webinar_date: webinar.date,
        webinar_time: webinar.time,
        link: webinar.link,
      });
      if (error) throw error;
      await get().fetchCourses(); // Refresh
    } catch (error) {
      console.error('Error adding webinar:', error);
    }
  },
}));
