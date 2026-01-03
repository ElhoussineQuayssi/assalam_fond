/**
 * Utility functions for handling multilingual project content
 */

/**
 * Transform translation content back to the same array structure as original content
 */
function transformTranslatedContent(originalContent, translationContent, lang) {
  if (!Array.isArray(originalContent) || !translationContent) {
    return originalContent || [];
  }

  // Deep clone the original content
  const transformedContent = JSON.parse(JSON.stringify(originalContent));

  // Iterate through translation content and replace values
  Object.keys(translationContent).forEach((blockIndex) => {
    const blockTranslations = translationContent[blockIndex];
    if (!blockTranslations || typeof blockTranslations !== "object") return;

    const blockIndexNum = parseInt(blockIndex, 10);
    if (Number.isNaN(blockIndexNum) || !transformedContent[blockIndexNum])
      return;

    // Recursively replace values in the block
    replaceValues(transformedContent[blockIndexNum], blockTranslations, lang);
  });

  return transformedContent;
}

/**
 * Recursively replace values in an object using translation data
 */
function replaceValues(obj, translations, lang) {
  Object.keys(translations).forEach((key) => {
    if (translations[key] && typeof translations[key] === "object") {
      if (translations[key][lang] !== undefined) {
        // This is a translation object with language keys
        obj[key] = translations[key][lang];
      } else {
        // This is a nested object, recurse
        if (obj[key] && typeof obj[key] === "object") {
          replaceValues(obj[key], translations[key], lang);
        }
      }
    }
  });
}

/**
 * Get localized content from a project based on the current locale
 * @param {Object} project - Project object with translation fields
 * @param {string} locale - Current locale ('fr', 'en', 'ar')
 * @param {string} field - Field name ('title', 'excerpt', 'people_helped', 'content')
 * @returns {string|Array} Localized content or fallback to French
 */
export function getLocalizedProjectContent(project, locale, field) {
  if (!project || !field) return "";

  // Special handling for content field
  if (field === "content") {
    // Try to get the localized version first
    const localizedField = `${field}_${locale}`;
    if (project[localizedField]) {
      // Transform the translation content to match original structure
      const langKey = locale === "en" ? "english" : "arabic";
      return transformTranslatedContent(
        project.content,
        project[localizedField],
        langKey,
      );
    }

    // Fallback to the original field (French)
    return project[field] || [];
  }

  // Standard field handling for title, excerpt, people_helped
  // Try to get the localized version first
  const localizedField = `${field}_${locale}`;
  if (project[localizedField]) {
    return project[localizedField];
  }

  // Fallback to the original field (French)
  if (project[field]) {
    return project[field];
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
 * Check if a project has a translation for a specific language
 * @param {Object} project - Project object
 * @param {string} locale - Locale to check ('en', 'ar')
 * @param {string} field - Field name ('title', 'excerpt', 'people_helped')
 * @returns {boolean} True if translation exists
 */
export function hasProjectTranslation(project, locale, field) {
  if (!project || !locale || !field) return false;

  const localizedField = `${field}_${locale}`;
  return Boolean(project[localizedField]?.trim());
}

/**
 * Get translation status for a project
 * @param {Object} project - Project object
 * @returns {Object} Translation status object
 */
export function getProjectTranslationStatus(project) {
  if (!project) return { fr: false, en: false, ar: false };

  return {
    fr: Boolean(project.title && project.excerpt),
    en:
      hasProjectTranslation(project, "en", "title") &&
      hasProjectTranslation(project, "en", "excerpt"),
    ar:
      hasProjectTranslation(project, "ar", "title") &&
      hasProjectTranslation(project, "ar", "excerpt"),
  };
}
