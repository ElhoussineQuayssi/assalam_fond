// Import existing controllers instead of creating new Supabase client
import { createProject, updateProject } from "@/controllers/projectsController";
import {
  createBlogPost,
  updateBlogPost,
} from "@/controllers/blogPostsController";

/**
 * Transform multilingual form data to database structure for projects
 */
export const transformProjectFormData = (formData) => {
  const { title, excerpt, content, people_helped, ...sharedFields } = formData;

  // Main project data (French content)
  const mainProject = {
    ...sharedFields,
    title: title.fr,
    excerpt: excerpt.fr,
    content: content.fr,
    people_helped: people_helped.fr,
  };

  // Translation data
  const translations = [];

  // English translation
  if (title.en && title.en.trim() !== "") {
    translations.push({
      lang: "en",
      title: title.en,
      excerpt: excerpt.en,
      content: content.en,
      people_helped: people_helped.en,
    });
  }

  // Arabic translation
  if (title.ar && title.ar.trim() !== "") {
    translations.push({
      lang: "ar",
      title: title.ar,
      excerpt: excerpt.ar,
      content: content.ar,
      people_helped: people_helped.ar,
    });
  }

  return { mainProject, translations };
};

/**
 * Transform multilingual form data to database structure for blogs
 */
export const transformBlogFormData = (formData) => {
  const {
    title,
    excerpt,
    content,
    seo_title,
    seo_description,
    ...sharedFields
  } = formData;

  // Main blog data (French content)
  const mainBlog = {
    ...sharedFields,
    title: title.fr,
    excerpt: excerpt.fr,
    content: content.fr,
    seo_title: seo_title.fr,
    seo_description: seo_description.fr,
  };

  // Translation data
  const translations = [];

  // English translation
  if (title.en && title.en.trim() !== "") {
    translations.push({
      lang: "en",
      title: title.en,
      excerpt: excerpt.en,
      content: content.en,
      seo_title: seo_title.en,
      seo_description: seo_description.en,
    });
  }

  // Arabic translation
  if (title.ar && title.ar.trim() !== "") {
    translations.push({
      lang: "ar",
      title: title.ar,
      excerpt: excerpt.ar,
      content: content.ar,
      seo_title: seo_title.ar,
      seo_description: seo_description.ar,
    });
  }

  return { mainBlog, translations };
};

/**
 * Save project with translations
 * Note: This function should be implemented in the form components
 * using the existing createProject/updateProject functions from projectsController
 */
export const saveProjectWithTranslations = async (
  formData,
  projectId = null,
) => {
  // This is a placeholder - the actual implementation should be in the form components
  // using the existing controller functions to maintain consistency with the existing API
  throw new Error(
    "Implementation should use existing projectsController functions",
  );
};

/**
 * Save blog with translations
 * Note: This function should be implemented in the form components
 * using the existing createBlogPost/updateBlogPost functions from blogPostsController
 */
export const saveBlogWithTranslations = async (formData, blogId = null) => {
  // This is a placeholder - the actual implementation should be in the form components
  // using the existing controller functions to maintain consistency with the existing API
  throw new Error(
    "Implementation should use existing blogPostsController functions",
  );
};

/**
 * Load project with translations
 * Note: This function should be implemented in the form components
 * using the existing getProjectById function from projectsController
 */
export const loadProjectWithTranslations = async (projectId) => {
  // This is a placeholder - the actual implementation should be in the form components
  // using the existing controller functions to maintain consistency with the existing API
  throw new Error(
    "Implementation should use existing projectsController functions",
  );
};

/**
 * Load blog with translations
 * Note: This function should be implemented in the form components
 * using the existing getBlogPostById function from blogPostsController
 */
export const loadBlogWithTranslations = async (blogId) => {
  // This is a placeholder - the actual implementation should be in the form components
  // using the existing controller functions to maintain consistency with the existing API
  throw new Error(
    "Implementation should use existing blogPostsController functions",
  );
};

/**
 * Validate multilingual form data
 */
export const validateMultilingualFormData = (formData, type = "project") => {
  const errors = {};

  // Validate French fields (required)
  if (!formData.title.fr || formData.title.fr.trim() === "") {
    errors.title = { ...errors.title, fr: "French title is required" };
  }
  if (!formData.excerpt.fr || formData.excerpt.fr.trim() === "") {
    errors.excerpt = { ...errors.excerpt, fr: "French excerpt is required" };
  }

  if (type === "project") {
    if (!formData.content.fr || formData.content.fr.length === 0) {
      errors.content = { ...errors.content, fr: "French content is required" };
    }
  } else {
    if (!formData.content.fr || formData.content.fr.trim() === "") {
      errors.content = { ...errors.content, fr: "French content is required" };
    }
  }

  // Validate English fields
  if (formData.title.en && formData.title.en.trim() !== "") {
    if (!formData.excerpt.en || formData.excerpt.en.trim() === "") {
      errors.excerpt = {
        ...errors.excerpt,
        en: "English excerpt is required when English title is provided",
      };
    }
    if (type === "project") {
      if (!formData.content.en || formData.content.en.length === 0) {
        errors.content = {
          ...errors.content,
          en: "English content is required when English title is provided",
        };
      }
    } else {
      if (!formData.content.en || formData.content.en.trim() === "") {
        errors.content = {
          ...errors.content,
          en: "English content is required when English title is provided",
        };
      }
    }
  }

  // Validate Arabic fields
  if (formData.title.ar && formData.title.ar.trim() !== "") {
    if (!formData.excerpt.ar || formData.excerpt.ar.trim() === "") {
      errors.excerpt = {
        ...errors.excerpt,
        ar: "Arabic excerpt is required when Arabic title is provided",
      };
    }
    if (type === "project") {
      if (!formData.content.ar || formData.content.ar.length === 0) {
        errors.content = {
          ...errors.content,
          ar: "Arabic content is required when Arabic title is provided",
        };
      }
    } else {
      if (!formData.content.ar || formData.content.ar.trim() === "") {
        errors.content = {
          ...errors.content,
          ar: "Arabic content is required when Arabic title is provided",
        };
      }
    }
  }

  return errors;
};
