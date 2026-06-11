import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getUserRole } from "@/lib/auth/user";
import {
  REMEMBER_ME_COOKIE,
  REMEMBER_ME_MAX_AGE,
  getRememberMeFromRequest,
  withRememberMeCookieOptions,
} from "@/lib/auth/remember-me";

const AUTH_PATHS = ["/login", "/signup"];
const LEARNER_PATHS = ["/dashboard", "/profile"];

function isLearnerRoute(pathname: string) {
  return LEARNER_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

function isTutorRoute(pathname: string) {
  return pathname === "/tutor" || pathname.startsWith("/tutor/");
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const rememberMe = getRememberMeFromRequest((name) =>
    request.cookies.get(name)?.value
  );

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
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            const isAuthCookie = name.includes("auth-token");
            supabaseResponse.cookies.set(
              name,
              value,
              isAuthCookie
                ? withRememberMeCookieOptions(rememberMe, options)
                : options
            );
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthPath = AUTH_PATHS.includes(pathname);
  const requiresAuth = isLearnerRoute(pathname) || isTutorRoute(pathname);

  if (!user && requiresAuth) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user) {
    const role = getUserRole(user);

    // Check if user needs to change password (new tutors only)
    const needsPasswordChange = user.user_metadata?.needs_password_change === true;
    const isChangePasswordPage = pathname === '/tutor/change-password';

    // Force password change for new tutor accounts
    if (needsPasswordChange && !isChangePasswordPage && isTutorRoute(pathname)) {
      return NextResponse.redirect(new URL('/tutor/change-password', request.url));
    }

    // Allow access to change-password page regardless of role
    if (isChangePasswordPage) {
      return supabaseResponse;
    }

    if (isTutorRoute(pathname) && role !== "tutor") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (isLearnerRoute(pathname) && role !== "learner") {
      return NextResponse.redirect(new URL("/tutor", request.url));
    }

    if (isAuthPath) {
      const destination = role === "tutor" ? "/tutor" : "/dashboard";
      return NextResponse.redirect(new URL(destination, request.url));
    }
  }

  const hostname = request.headers.get("host") || "";
  if (hostname.startsWith("tutor.")) {
    const rewritePath =
      pathname === "/" ? "/tutor" : `/tutor${pathname}`;
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = rewritePath;
    const rewriteResponse = NextResponse.rewrite(rewriteUrl);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      rewriteResponse.cookies.set(cookie);
    });
    return rewriteResponse;
  }

  if (rememberMe) {
    supabaseResponse.cookies.set(REMEMBER_ME_COOKIE, "1", {
      path: "/",
      maxAge: REMEMBER_ME_MAX_AGE,
      sameSite: "lax",
    });
  }

  return supabaseResponse;
}
