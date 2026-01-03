import {
  createClient as createSupabaseClient,
  type SupabaseClient,
} from "@supabase/supabase-js";
import type { NextRequest, NextResponse } from "next/server";

/**
 * Creates a Supabase client for middleware operations
 * @param request - The incoming request
 * @param _response - The outgoing response (unused)
 * @returns Supabase client instance
 */
export function createClient(
  request: NextRequest,
  _response: NextResponse,
): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase environment variables");
  }

  const supabase = createSupabaseClient(url, key);

  // Extract JWT token from cookies for authentication
  const cookies = request.cookies;
  const accessToken = cookies.get("sb-access-token")?.value;
  const refreshToken = cookies.get("sb-refresh-token")?.value;

  if (accessToken) {
    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  return supabase;
}
