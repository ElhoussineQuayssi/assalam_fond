import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { createClient } from "./utils/supabase/middleware";

// Create the intl middleware
const intlMiddleware = createMiddleware(routing);

// Custom middleware wrapper
export default async function middleware(request) {
  // First run the intl middleware
  const response = await intlMiddleware(request);

  // Add security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  // Add HSTS for HTTPS
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }

  // Get locale from the request (after intl middleware processing)
  const pathname = request.nextUrl.pathname;
  const locale = pathname.split("/")[1] || "fr"; // Default to 'fr'

  // Admin route protection
  if (pathname.startsWith(`/${locale}/admin`)) {
    try {
      const supabase = createClient(request, response);

      // Check for valid session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // Redirect to login if no session
        const loginUrl = new URL(`/${locale}/login`, request.url);
        return NextResponse.redirect(loginUrl);
      }

      // Verify user is an admin
      const { data: adminData, error } = await supabase
        .from("admins")
        .select("id, role")
        .eq("id", session.user.id)
        .single();

      if (error || !adminData) {
        // Not an admin, redirect to general login with error
        const loginUrl = new URL(`/${locale}/login?error=access_denied`, request.url);
        return NextResponse.redirect(loginUrl);
      }

      // Add admin info to headers for components to use
      response.headers.set("x-admin-role", adminData.role || "admin");
    } catch (error) {
      console.error("Middleware auth error:", error);
      const loginUrl = new URL(`/${locale}/login?error=auth_error`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Rate limiting for API routes (basic implementation)
  if (pathname.startsWith("/api/")) {
    // Simple rate limiting based on IP
    const clientIP =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // You could implement more sophisticated rate limiting here
    // For now, just log the request
    console.log(`API request from ${clientIP} to ${pathname}`);
  }

  return response;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
