import { createAdminClient } from "@/utils/supabase/client";

const supabase = createAdminClient();

export const getAllBlogPosts = async (filters = {}) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    status = "all",
    category = "all",
    sortBy = "updated_at",
    sortOrder = "desc",
  } = filters;

  console.log("getAllBlogPosts called with filters:", filters);

  let query = supabase.from("blog_posts").select("*", { count: "exact" });

  // Apply search filter
  if (search) {
    query = query.or(
      `title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`,
    );
  }

  // Apply status filter
  if (status !== "all") {
    query = query.eq("status", status);
  }

  // Apply category filter
  if (category !== "all") {
    query = query.eq("category", category);
  }

  // Apply sorting
  const ascending = sortOrder === "asc";
  query = query.order(sortBy, { ascending });

  // Apply pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  console.log("Executing query:", query);

  const { data, error, count } = await query;

  console.log("Query result:", { data, error, count });

  if (error) throw error;

  return {
    blogs: data,
    total: count,
    page,
    limit,
  };
};

export const createBlogPost = async (blogPostData) => {
  const processedData = { ...blogPostData };

  // Extract translation data if present
  const translations = [];
  if (
    processedData.title_en ||
    processedData.excerpt_en ||
    processedData.content_en
  ) {
    translations.push({
      lang: "en",
      title: processedData.title_en,
      excerpt: processedData.excerpt_en,
      content: processedData.content_en,
    });
  }
  if (
    processedData.title_ar ||
    processedData.excerpt_ar ||
    processedData.content_ar
  ) {
    translations.push({
      lang: "ar",
      title: processedData.title_ar,
      excerpt: processedData.excerpt_ar,
      content: processedData.content_ar,
    });
  }

  // Remove translation fields from main data
  delete processedData.title_en;
  delete processedData.excerpt_en;
  delete processedData.content_en;
  delete processedData.title_ar;
  delete processedData.excerpt_ar;
  delete processedData.content_ar;

  // Auto-generate slug from title if not provided
  if (!processedData.slug && processedData.title) {
    processedData.slug = processedData.title.toLowerCase().replace(/\s+/g, "-");
  }

  // Initialize views to 0 if not provided
  processedData.views = processedData.views || 0;

  const { data, error } = await supabase
    .from("blog_posts")
    .insert([processedData])
    .select();

  if (error) throw error;
  const blogPost = data[0];

  // Save translations
  if (translations.length > 0) {
    const translationData = translations.map((translation) => ({
      ...translation,
      blog_id: blogPost.id,
    }));

    const { error: translationError } = await supabase
      .from("blog_translations")
      .insert(translationData);

    if (translationError) throw translationError;
  }

  return blogPost;
};

export const getBlogPostById = async (id) => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*, comments(*)")
    .eq("id", id)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Blog post not found");
  return data;
};

export const getBlogPostWithTranslations = async (id) => {
  // Get main blog
  const { data: mainBlog, error: mainError } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (mainError) throw mainError;
  if (!mainBlog) throw new Error("Blog post not found");

  // Get translations
  const { data: translations, error: translationError } = await supabase
    .from("blog_translations")
    .select("*")
    .eq("blog_id", id);

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
};

export const updateBlogPost = async (id, updateData) => {
  const processedData = { ...updateData };

  // Extract translation data if present
  const translations = [];
  if (
    processedData.title_en !== undefined ||
    processedData.excerpt_en !== undefined ||
    processedData.content_en !== undefined
  ) {
    translations.push({
      lang: "en",
      title: processedData.title_en,
      excerpt: processedData.excerpt_en,
      content: processedData.content_en,
    });
  }
  if (
    processedData.title_ar !== undefined ||
    processedData.excerpt_ar !== undefined ||
    processedData.content_ar !== undefined
  ) {
    translations.push({
      lang: "ar",
      title: processedData.title_ar,
      excerpt: processedData.excerpt_ar,
      content: processedData.content_ar,
    });
  }

  // Remove translation fields from main data
  delete processedData.title_en;
  delete processedData.excerpt_en;
  delete processedData.content_en;
  delete processedData.title_ar;
  delete processedData.excerpt_ar;
  delete processedData.content_ar;

  const { data, error } = await supabase
    .from("blog_posts")
    .update(processedData)
    .eq("id", id)
    .select();

  if (error) throw error;
  if (!data || data.length === 0) throw new Error("Blog post not found");

  const blogPost = data[0];

  // Save/update translations
  if (translations.length > 0) {
    for (const translation of translations) {
      const { error: translationError } = await supabase
        .from("blog_translations")
        .upsert(
          {
            blog_id: id,
            lang: translation.lang,
            title: translation.title,
            excerpt: translation.excerpt,
            content: translation.content,
          },
          { onConflict: ["blog_id", "lang"] },
        );

      if (translationError) throw translationError;
    }
  }

  return blogPost;
};

export const deleteBlogPost = async (id) => {
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) throw error;
};
