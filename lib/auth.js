import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

/**
 * Middleware function to require admin authentication for API routes
 * @param {Request} request - The incoming request
 * @param {string} requiredRole - Required role ('admin' or 'super_admin')
 * @returns {Object} - { user } on success, { error, status } on failure
 */
export async function requireAdminAuth(request, requiredRole = "admin") {
  try {
    // Check for authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return {
        error: "Missing or invalid authorization header",
        status: 401,
      };
    }

    // Extract token
    const token = authHeader.substring(7);
    if (!token) {
      return {
        error: "Missing access token",
        status: 401,
      };
    }

    // Verify token with Supabase
    const {
      data: { user },
      error: tokenError,
    } = await supabase.auth.getUser(token);
    if (tokenError || !user) {
      console.error("Token verification failed:", tokenError);
      return {
        error: "Invalid or expired token",
        status: 401,
      };
    }

    // Verify user is an admin in the database
    const { data: adminData, error: adminError } = await supabase
      .from("admins")
      .select("id, name, email, role")
      .eq("id", user.id)
      .single();

    if (adminError || !adminData) {
      console.error("Admin verification failed:", adminError);
      return {
        error: "Admin access required",
        status: 403,
      };
    }

    // Check role requirements
    if (requiredRole === "super_admin" && adminData.role !== "super_admin") {
      return {
        error: "Super admin access required",
        status: 403,
      };
    }

    return { user: adminData };
  } catch (error) {
    console.error("Authentication middleware error:", error);
    return {
      error: "Authentication failed",
      status: 500,
    };
  }
}

/**
 * Higher-order function to wrap API handlers with admin authentication
 * @param {Function} handler - The original API handler function
 * @param {string} requiredRole - Required role ('admin' or 'super_admin')
 * @returns {Function} - Wrapped handler function
 */
export function withAdminAuth(handler, requiredRole = "admin") {
  return async (request, context) => {
    const auth = await requireAdminAuth(request, requiredRole);
    if (auth.error) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status },
      );
    }

    // Call the original handler with authenticated user data
    return handler(request, context, auth.user);
  };
}
