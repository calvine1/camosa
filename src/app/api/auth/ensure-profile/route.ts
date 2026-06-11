import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

/**
 * Ensures a user profile exists in the profiles table.
 * Called after signup or on first login to create the profile record.
 * This is necessary because courses.tutor_id has a FK to profiles.id
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, name, role, staffRole } = await request.json();

    if (!userId || !role) {
      return NextResponse.json(
        { error: "userId and role are required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
          },
        },
      }
    );

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    if (existingProfile) {
      return NextResponse.json({
        success: true,
        message: "Profile already exists",
        profile: existingProfile,
      });
    }

    // Create new profile
    const { data: profile, error } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        name: name || "User",
        role: role,
        staff_role: staffRole || role,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating profile:", error);
      return NextResponse.json(
        { error: error.message || "Failed to create profile" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile created successfully",
      profile,
    });
  } catch (error) {
    console.error("Error in ensure-profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
