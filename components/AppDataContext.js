"use client";
import { useParams } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient } from "@/utils/supabase/client";

const AppDataContext = createContext();

/**
 * @typedef {Object} AppDataContextType
 * @property {Array} blogs - Blog posts data
 * @property {Array} projects - Projects data
 * @property {Object|null} siteConfig - Site configuration
 * @property {Array} allProjectImages - All project images
 * @property {boolean} loading - Loading state
 * @property {string} selectedLanguage - Selected language
 * @property {Function} setSelectedLanguage - Function to set selected language
 * @property {Function} addComment - Function to add a comment
 * @property {Function} sendMessage - Function to send a message
 * @property {Function} refreshData - Function to refresh data
 */

export const AppDataProvider = ({ children, initialData = {} }) => {
  const supabase = createClient();
  const { locale } = useParams();

  // Initialize state with server-provided data to prevent hydration mismatch
  const [blogs, setBlogs] = useState(initialData.blogs || []);
  const [projects, setProjects] = useState(initialData.projects || []);
  const [siteConfig, setSiteConfig] = useState(initialData.siteConfig || null);
  const [allProjectImages, setAllProjectImages] = useState(initialData.allProjectImages || []);
  const [loading, setLoading] = useState(!initialData.blogs); // Only loading if no initial data

  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    if (typeof window === "undefined") return "fr";
    try {
      return localStorage.getItem("admin_selected_language") || "fr";
    } catch (_e) {
      return "fr";
    }
  });

  // 1. Fetching Function l-ga3 l-tables
  const fetchData = useCallback(async () => {
    console.log("fetchData called at", new Date().toISOString());
    setLoading(true);

    let blogsData = [];
    let projectsData = [];
    let configData = null;
    let imagesData = [];

    try {
      console.time("fetchBlogs");
      const blogsRes = await fetch(
        `/api/blog-posts?locale=${locale || ""}&limit=1000`,
      );
      const data = await blogsRes.json();
      blogsData = data.blogs || [];
      console.timeEnd("fetchBlogs");
      console.log(`Fetched ${blogsData.length} blog posts`);
      if (blogsData.length > 0) {
        const totalComments = blogsData.reduce(
          (sum, post) => sum + (post.comments?.length || 0),
          0,
        );
        console.log(`Total comments across all posts: ${totalComments}`);
      }
    } catch (error) {
      console.error("Error fetching blog_posts:", error);
      console.error("Error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
    }

    try {
      // Fetch projects
      const { data: projectsList, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (projectsError) throw projectsError;

      projectsData = projectsList;

      // If locale is specified, fetch and merge translations
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
          projectsData = projectsList.map((project) => {
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
    } catch (error) {
      console.error("Error fetching projects:", error);
      console.error("Error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
    }

    try {
      const configRes = await supabase.from("site_config").select("*").single();
      configData = configRes.data || null;
    } catch (error) {
      console.error("Error fetching site_config:", error);
      console.error("Error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
    }

    try {
      const imagesRes = await supabase.from("project_images").select("*");
      imagesData = imagesRes.data || [];
    } catch (error) {
      console.error("Error fetching project_images:", error);
      console.error("Error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
    }

    // N-rtbo l-data: kola project n-zido lih tsawer dyalou
    const projectsWithImages = projectsData.map((project) => ({
      ...project,
      images: imagesData.filter((img) => img.project_id === project.id) || [],
    }));

    setBlogs(blogsData);
    setProjects(projectsWithImages);
    setSiteConfig(configData);
    setAllProjectImages(
      imagesData.map((img) => ({
        ...img,
        image_url: img.image_url.replace(/^"|"$/g, ""),
      })),
    );

    setLoading(false);
  }, [locale, supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("admin_selected_language", selectedLanguage);
    } catch (_e) {
      // ignore
    }
  }, [selectedLanguage]);

  // 2. Add Comment (Table: comments)
  const addComment = async (commentData) => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .insert([commentData])
        .select();
      if (!error) {
        // Update local state derya bach t-ban d l-user
        setBlogs((prev) =>
          prev.map((post) =>
            post.id === commentData.post_id
              ? { ...post, comments: [...(post.comments || []), data[0]] }
              : post,
          ),
        );
      }
      return { data, error };
    } catch (error) {
      console.error("Error adding comment:", error);
      console.error("Error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
      return { data: null, error };
    }
  };

  // 3. Send Message (Table: messages)
  const sendMessage = async (messageData) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .insert([messageData]);
      return { data, error };
    } catch (error) {
      console.error("Error sending message:", error);
      console.error("Error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
      return { data: null, error };
    }
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    blogs,
    projects,
    siteConfig,
    allProjectImages,
    loading,
    selectedLanguage,
    setSelectedLanguage,
    addComment,
    sendMessage,
    refreshData: fetchData,
  }), [
    blogs,
    projects,
    siteConfig,
    allProjectImages,
    loading,
    selectedLanguage,
    setSelectedLanguage,
    addComment,
    sendMessage,
    fetchData,
  ]);

  return (
    <AppDataContext.Provider value={contextValue}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => useContext(AppDataContext);
