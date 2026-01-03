import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Whether the operation was successful
 * @property {*} data - The response data
 * @property {string} [error] - Error message if operation failed
 */

/**
 * @typedef {Object} BlogPost
 * @property {string} id
 * @property {string} title
 * @property {string} content
 * @property {string} excerpt
 * @property {string} status
 * @property {string} category
 * @property {string} [image]
 * @property {string} [slug]
 */

/**
 * Get authorization headers for authenticated API requests
 * @returns {Promise<Object>} Headers object with authorization token
 */
export async function getAuthHeaders() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error("No active session found");
    }

    return {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    };
  } catch (error) {
    console.error("Error getting auth headers:", error);
    throw error;
  }
}

/**
 * Make an authenticated API request
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options (method, body, etc.)
 * @returns {Promise<Response>} Fetch response
 */
export async function authenticatedFetch(url, options = {}) {
  const headers = await getAuthHeaders();

  return fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });
}
