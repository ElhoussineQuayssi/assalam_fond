/**
 * Utility functions for handling multilingual blog content
 */

/**
 * Get localized content from a blog post based on the current locale
 * @param {Object} blog - Blog post object with translation fields
 * @param {string} locale - Current locale ('fr', 'en', 'ar')
 * @param {string} field - Field name ('title', 'excerpt', 'content')
 * @returns {string} Localized content or fallback to French
 */
export function getLocalizedBlogContent(blog, locale, field) {
  if (!blog || !field) return "";

  // Try to get the localized version first
  const localizedField = `${field}_${locale}`;
  if (blog[localizedField]) {
    return blog[localizedField];
  }

  // Fallback to the original field (French)
  if (blog[field]) {
    return blog[field];
  }

  // Final fallback
  return "";
}

/**
 * Get the current locale from next-intl
 * This is a client-side hook that should be used in components
 */
export function useCurrentLocale() {
  // This will be implemented in components that need it
  // We can't use hooks in utility functions
  return null;
}

/**
 * Check if a blog post has a translation for a specific language
 * @param {Object} blog - Blog post object
 * @param {string} locale - Locale to check ('en', 'ar')
 * @param {string} field - Field name ('title', 'excerpt', 'content')
 * @returns {boolean} True if translation exists
 */
export function hasTranslation(blog, locale, field) {
  if (!blog || !locale || !field) return false;

  const localizedField = `${field}_${locale}`;
  return Boolean(blog[localizedField]?.trim());
}

/**
 * Get translation status for a blog post
 * @param {Object} blog - Blog post object
 * @returns {Object} Translation status object
 */
export function getTranslationStatus(blog) {
  if (!blog) return { fr: false, en: false, ar: false };

  return {
    fr: Boolean(blog.title && blog.excerpt && blog.content),
    en:
      hasTranslation(blog, "en", "title") &&
      hasTranslation(blog, "en", "excerpt") &&
      hasTranslation(blog, "en", "content"),
    ar:
      hasTranslation(blog, "ar", "title") &&
      hasTranslation(blog, "ar", "excerpt") &&
      hasTranslation(blog, "ar", "content"),
  };
}
