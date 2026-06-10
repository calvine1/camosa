import type { SupabaseClient } from "@supabase/supabase-js";

export type TutorCourseStatus = "Published" | "Draft";

export type CourseCategory = {
  id: number;
  name: string;
};

export type TutorCourse = {
  id: number;
  title: string;
  category_id: number;
  price: string | null;
  duration: string | null;
  status: TutorCourseStatus;
  cover_url: string | null;
};

export async function getTutorCategories(supabase: SupabaseClient, tutorId: number) {
  const { data, error } = await supabase
    .from("course_categories")
    .select("id,name")
    .eq("tutor_id", tutorId)
    .order("name");

  if (error) throw error;
  return (data ?? []).map((c) => ({ id: c.id, name: c.name }));
}

export async function createTutorCategory(
  supabase: SupabaseClient,
  tutorId: number,
  name: string
) {
  const { data, error } = await supabase
    .from("course_categories")
    .insert({ tutor_id: tutorId, name })
    .select("id,name")
    .single();

  if (error) throw error;
  return { id: data.id, name: data.name };
}

export async function listTutorCourses(
  supabase: SupabaseClient,
  tutorId: number
) {
  const { data, error } = await supabase
    .from("courses")
    .select(
      "id,title,category_id,price,duration,status,cover_url,category:category_id(name)"
    )
    .eq("tutor_id", tutorId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Note: `category:category_id(name)` may not be supported depending on schema; fallback.
  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    category_id: row.category_id,
    price: row.price,
    duration: row.duration,
    status: row.status as TutorCourseStatus,
    cover_url: row.cover_url,
  })) as TutorCourse[];
}

export async function createTutorCourse(
  supabase: SupabaseClient,
  tutorId: number,
  input: {
    title: string;
    category_id: number;
    price: string | null;
    duration: string | null;
    status: TutorCourseStatus;
    cover_url: string | null;
  }
) {
  const { data, error } = await supabase
    .from("courses")
    .insert({ tutor_id: tutorId, ...input })
    .select("id,title,category_id,price,duration,status,cover_url")
    .single();

  if (error) throw error;
  return data as TutorCourse;
}

export async function updateTutorCourse(
  supabase: SupabaseClient,
  tutorId: number,
  courseId: number,
  input: {
    title: string;
    category_id: number;
    price: string | null;
    duration: string | null;
    status: TutorCourseStatus;
    cover_url: string | null;
  }
) {
  const { data, error } = await supabase
    .from("courses")
    .update(input)
    .eq("id", courseId)
    .eq("tutor_id", tutorId)
    .select("id,title,category_id,price,duration,status,cover_url")
    .single();

  if (error) throw error;
  return data as TutorCourse;
}

export async function deleteTutorCourse(
  supabase: SupabaseClient,
  tutorId: number,
  courseId: number
) {
  const { error } = await supabase
    .from("courses")
    .delete()
    .eq("id", courseId)
    .eq("tutor_id", tutorId);

  if (error) throw error;
}

