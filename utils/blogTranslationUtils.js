import { createAdminClient } from "@/utils/supabase/client";

// Lazy initialize Supabase client
let supabase = null;
const getSupabaseClient = () => {
  if (!supabase) {
    try {
      supabase = createAdminClient();
    } catch (error) {
      console.error("Failed to initialize Supabase client:", error);
      throw error;
    }
  }
  return supabase;
};

/**
 * Save blog post with translations
 */
export const saveBlogWithTranslations = async (formData, blogId = null) => {
  // Transform multilingual data to database structure
  const mainBlog = {
    title: formData.title.fr,
    excerpt: formData.excerpt.fr,
    content: formData.content.fr,
    slug: formData.slug,
    category: formData.category,
    status: formData.status,
    published_at: formData.published_at,
    tags: formData.tags,
    image: formData.image,
  };

  // Prepare translation data
  const translations = [];

  // English translation
  if (formData.title.en && formData.title.en.trim() !== "") {
    translations.push({
      lang: "en",
      title: formData.title.en,
      excerpt: formData.excerpt.en,
      content: formData.content.en,
      blog_id: blogId, // Will be set after main blog creation
    });
  }

  // Arabic translation
  if (formData.title.ar && formData.title.ar.trim() !== "") {
    translations.push({
      lang: "ar",
      title: formData.title.ar,
      excerpt: formData.excerpt.ar,
      content: formData.content.ar,
      blog_id: blogId, // Will be set after main blog creation
    });
  }

  try {
    const supabase = getSupabaseClient();
    let result;

    if (blogId) {
      // Update existing blog
      const { data, error } = await supabase
        .from("blog_posts")
        .update(mainBlog)
        .eq("id", blogId)
        .select();

      if (error) throw error;
      result = data[0];
    } else {
      // Create new blog
      const { data, error } = await supabase
        .from("blog_posts")
        .insert([mainBlog])
        .select();

      if (error) throw error;
      result = data[0];
    }

    // Save translations
    if (translations.length > 0) {
      const translationData = translations.map((translation) => ({
        ...translation,
        blog_id: result.id,
      }));

      const { error: translationError } = await supabase
        .from("blogs_translation")
        .upsert(translationData, { onConflict: ["blog_id", "lang"] });

      if (translationError) throw translationError;
    }

    return result;
  } catch (error) {
    console.error("Error saving blog with translations:", error);
    throw error;
  }
};

/**
 * Load blog post with translations
 */
export const loadBlogWithTranslations = async (blogId) => {
  try {
    const supabase = getSupabaseClient();

    // Get main blog
    const { data: mainBlog, error: mainError } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", blogId)
      .single();

    if (mainError) throw mainError;

    // Get translations
    const { data: translations, error: translationError } = await supabase
      .from("blogs_translation")
      .select("*")
      .eq("blog_id", blogId);

    if (translationError) throw translationError;

    // Transform to multilingual structure
    const multilingualData = {
      // Shared fields
      slug: mainBlog.slug,
      category: mainBlog.category,
      status: mainBlog.status,
      published_at: mainBlog.published_at,
      tags: mainBlog.tags || "",
      image: mainBlog.image,

      // Multilingual fields
      title: {
        fr: mainBlog.title || "",
        en: "",
        ar: "",
      },
      excerpt: {
        fr: mainBlog.excerpt || "",
        en: "",
        ar: "",
      },
      content: {
        fr: mainBlog.content || "",
        en: "",
        ar: "",
      },
    };

    // Fill in translation data
    translations.forEach((translation) => {
      if (translation.lang === "en") {
        multilingualData.title.en = translation.title || "";
        multilingualData.excerpt.en = translation.excerpt || "";
        multilingualData.content.en = translation.content || "";
      } else if (translation.lang === "ar") {
        multilingualData.title.ar = translation.title || "";
        multilingualData.excerpt.ar = translation.excerpt || "";
        multilingualData.content.ar = translation.content || "";
      }
    });

    return multilingualData;
  } catch (error) {
    console.error("Error loading blog with translations:", error);
    throw error;
  }
};

/**
 * Validate multilingual blog form data
 */
export const validateMultilingualBlogFormData = (formData) => {
  const errors = {};

  // Validate French fields (required)
  if (!formData.title.fr || formData.title.fr.trim() === "") {
    errors.title = { ...errors.title, fr: "French title is required" };
  }
  if (!formData.excerpt.fr || formData.excerpt.fr.trim() === "") {
    errors.excerpt = { ...errors.excerpt, fr: "French excerpt is required" };
  }
  if (!formData.content.fr || formData.content.fr.trim() === "") {
    errors.content = { ...errors.content, fr: "French content is required" };
  }

  // Validate English fields
  if (formData.title.en && formData.title.en.trim() !== "") {
    if (!formData.excerpt.en || formData.excerpt.en.trim() === "") {
      errors.excerpt = {
        ...errors.excerpt,
        en: "English excerpt is required when English title is provided",
      };
    }
    if (!formData.content.en || formData.content.en.trim() === "") {
      errors.content = {
        ...errors.content,
        en: "English content is required when English title is provided",
      };
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
    if (!formData.content.ar || formData.content.ar.trim() === "") {
      errors.content = {
        ...errors.content,
        ar: "Arabic content is required when Arabic title is provided",
      };
    }
  }

  // Validate shared fields
  if (!formData.category) {
    errors.category = "Category is required";
  }

  return errors;
};
