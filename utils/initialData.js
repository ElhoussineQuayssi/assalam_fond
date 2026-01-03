import { createAdminClient } from "./supabase/client";
import { getAllBlogPosts } from "../controllers/blogPostsController";

const supabase = createAdminClient();

/**
 * Fetches initial application data on the server side
 * @param {string} locale - The current locale
 * @returns {Promise<Object>} Initial data object
 */
export async function getInitialAppData(locale = "") {
  try {
    console.log("Fetching initial app data for locale:", locale);

    // Fetch blogs using the controller (includes translations)
    const blogsData = await getAllBlogPosts({
      page: 1,
      limit: 100, // Reasonable limit for initial load
      locale,
      sortBy: "published_at",
      sortOrder: "desc",
      status: "published",
    });

    // Fetch projects and images
    const [projectsRes, configRes, imagesRes] = await Promise.all([
      supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50),
      supabase.from("site_config").select("*").single(),
      supabase.from("project_images").select("*"),
    ]);

    let projectsData = projectsRes.data || [];
    const configData = configRes.data || null;
    const imagesData = imagesRes.data || [];

    // Process translations if locale is specified
    if (locale) {
      const { data: translationsData, error: translationsError } = await supabase
        .from("project_translations")
        .select("project_id, title, excerpt, content, lang")
        .eq("lang", locale);

      if (!translationsError && translationsData) {
        // Create a map of project_id -> translation
        const translationsMap = {};
        translationsData.forEach((translation) => {
          translationsMap[translation.project_id] = translation;
        });

        // Merge translations into projects
        projectsData = projectsData.map((project) => {
          const translation = translationsMap[project.id];
          return {
            ...project,
            title: translation?.title || project.title,
            description: translation?.excerpt || project.excerpt,
            content: translation?.content || project.content,
          };
        });
      }
    }

    // Associate images with projects
    const projectsWithImages = projectsData.map((project) => ({
      ...project,
      images: imagesData.filter((img) => img.project_id === project.id) || [],
    }));

    return {
      blogs: blogsData.blogs || [],
      projects: projectsWithImages,
      siteConfig: configData,
      allProjectImages: imagesData.map((img) => ({
        ...img,
        image_url: img.image_url.replace(/^"|"$/g, ""),
      })),
    };
  } catch (error) {
    console.error("Error fetching initial app data:", error);
    // Return empty data to prevent app crash
    return {
      blogs: [],
      projects: [],
      siteConfig: null,
      allProjectImages: [],
    };
  }
}
