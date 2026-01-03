// Note: Sharp can only be used server-side, not in client components
// This utility is for reference - actual conversion happens in API routes

/**
 * Check if file is a supported image format
 * @param {string} filename - Filename or MIME type
 * @returns {boolean}
 */
export function isSupportedImageFormat(filename) {
  const supportedFormats = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const supportedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

  // Check MIME type
  if (supportedFormats.includes(filename)) {
    return true;
  }

  // Check file extension
  const lowerFilename = filename.toLowerCase();
  return supportedExtensions.some((ext) => lowerFilename.endsWith(ext));
}

/**
 * Generate unique filename for uploaded image
 * @param {string} originalFilename - Original filename
 * @param {string} prefix - Optional prefix for the filename
 * @returns {string} Unique filename with .webp extension
 */
export function generateUniqueFilename(originalFilename, prefix = "") {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  const baseName = originalFilename
    .split(".")
    .slice(0, -1)
    .join(".")
    .replace(/[^a-zA-Z0-9]/g, "-");
  const prefixStr = prefix ? `${prefix}-` : "";

  return `${prefixStr}${timestamp}-${random}-${baseName}.webp`;
}
