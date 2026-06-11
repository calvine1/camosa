import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail, generateTutorWelcomeEmail } from "@/lib/email/service";

export async function POST(request: NextRequest) {
  try {
    const { email, name, staffRole } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 }
      );
    }

    // Get the authenticated user's info
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

    // Check if user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Auth error:", userError?.message);
      return NextResponse.json(
        { error: "Unauthorized - please log in" },
        { status: 401 }
      );
    }

    // Check if user has admin or board member role
    const userRole = user.user_metadata?.staff_role;
    if (userRole !== "admin" && userRole !== "board_member") {
      return NextResponse.json(
        { error: "Only admins and board members can create tutors" },
        { status: 403 }
      );
    }

    // Create admin client for user management
    const { createClient } = await import("@supabase/supabase-js");
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check if email already exists
    let existingUsers: any;
    try {
      const result = await adminSupabase.auth.admin.listUsers();
      existingUsers = result.data;
    } catch (listError: any) {
      console.error("Error listing users:", listError?.message);
      return NextResponse.json(
        { error: "Failed to check existing users - service error" },
        { status: 500 }
      );
    }

    const userExists = existingUsers?.users?.some((u: any) => u.email === email);

    if (userExists) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-12);

    // Create new tutor account with flag for password change
    let newUser: any;
    try {
      const result = await adminSupabase.auth.admin.createUser({
        email,
        password: tempPassword,
        user_metadata: {
          name,
          role: "tutor",
          staff_role: staffRole || "tutor",
          needs_password_change: true,
        },
        email_confirm: true,
      });

      if (result.error) {
        console.error("Error creating user:", result.error.message);
        return NextResponse.json(
          { error: result.error.message || "Failed to create tutor" },
          { status: 400 }
        );
      }

      newUser = result.data?.user;

      if (!newUser) {
        return NextResponse.json(
          { error: "Failed to create tutor - no user returned" },
          { status: 400 }
        );
      }
    } catch (createError: any) {
      console.error("Error creating user:", createError?.message);
      return NextResponse.json(
        { error: "Failed to create tutor account" },
        { status: 400 }
      );
    }

    // Send welcome email with temporary password
    const emailTemplate = generateTutorWelcomeEmail({
      tutorName: name,
      email,
      tempPassword,
      role: staffRole || "Tutor",
    });

    const emailResult = await sendEmail({
      to: email,
      subject: emailTemplate.subject,
      htmlBody: emailTemplate.htmlBody,
      textBody: emailTemplate.textBody,
    });

    if (!emailResult.success) {
      console.warn("Email send failed:", emailResult.error);
      // Still return success but notify about email issue
      return NextResponse.json({
        success: true,
        tutor: {
          id: newUser.id,
          email: newUser.email,
          name: name,
          staffRole: staffRole || "tutor",
        },
        message: `Tutor created successfully. However, welcome email could not be sent (${emailResult.error}). You may need to manually inform the tutor of their credentials.`,
        emailSent: false,
      });
    }

    // Return success
    return NextResponse.json({
      success: true,
      tutor: {
        id: newUser.id,
        email: newUser.email,
        name: name,
        staffRole: staffRole || "tutor",
      },
      message: `Tutor account created successfully! Welcome email sent to ${email} with login instructions and temporary password.`,
      emailSent: true,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error in POST /api/tutors:", errorMessage);
    return NextResponse.json(
      { error: "Internal server error - " + errorMessage },
      { status: 500 }
    );
  }
}
