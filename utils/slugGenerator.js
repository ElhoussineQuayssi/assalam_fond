/**
 * Generate a URL-friendly slug from a title
 * Handles French characters and special characters properly
 */

export const generateSlug = (title, existingSlugs = []) => {
  if (!title || typeof title !== "string") {
    return "";
  }

  let slug = title
    .toLowerCase()
    .trim()
    // Replace French characters
    .replace(/[éèêë]/g, "e")
    .replace(/[àâä]/g, "a")
    .replace(/[îï]/g, "i")
    .replace(/[ôö]/g, "o")
    .replace(/[ùûü]/g, "u")
    .replace(/[ç]/g, "c")
    // Replace other common accented characters
    .replace(/[áàâä]/g, "a")
    .replace(/[íìîï]/g, "i")
    .replace(/[óòôö]/g, "o")
    .replace(/[úùûü]/g, "u")
    .replace(/[ýỳŷÿ]/g, "y")
    .replace(/[ñ]/g, "n")
    // Remove or replace special characters
    .replace(/[^a-z0-9\s-]/g, "")
    // Replace multiple spaces/hyphens with single hyphen
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, "");

  // If slug is empty after processing, provide fallback
  if (!slug) {
    slug = "item";
  }

  // Ensure uniqueness by adding number if needed
  let uniqueSlug = slug;
  let counter = 1;

  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
};

/**
 * Validate if a slug is properly formatted
 */
export const validateSlug = (slug) => {
  if (!slug || typeof slug !== "string") {
    return { isValid: false, error: "Slug is required" };
  }

  // Check length
  if (slug.length < 2) {
    return { isValid: false, error: "Slug must be at least 2 characters long" };
  }

  if (slug.length > 100) {
    return { isValid: false, error: "Slug must be less than 100 characters" };
  }

  // Check for valid characters (lowercase, numbers, hyphens)
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return {
      isValid: false,
      error: "Slug can only contain lowercase letters, numbers, and hyphens",
    };
  }

  // Check for leading/trailing hyphens
  if (slug.startsWith("-") || slug.endsWith("-")) {
    return { isValid: false, error: "Slug cannot start or end with a hyphen" };
  }

  // Check for consecutive hyphens
  if (slug.includes("--")) {
    return { isValid: false, error: "Slug cannot contain consecutive hyphens" };
  }

  return { isValid: true, error: null };
};

/**
 * Copy slug to clipboard
 */
export const copySlugToClipboard = async (slug) => {
  try {
    await navigator.clipboard.writeText(slug);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: "Failed to copy to clipboard" };
  }
};

/**
 * Extract slug from URL
 */
export const extractSlugFromUrl = (url) => {
  if (!url || typeof url !== "string") {
    return "";
  }

  try {
    const pathname = new URL(url).pathname;
    const segments = pathname
      .split("/")
      .filter((segment) => segment.length > 0);
    return segments[segments.length - 1] || "";
  } catch (error) {
    // If URL parsing fails, treat as a path
    const segments = url.split("/").filter((segment) => segment.length > 0);
    return segments[segments.length - 1] || "";
  }
};

/**
 * Format slug for display
 */
export const formatSlugForDisplay = (slug) => {
  if (!slug) return "";
  return slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};
