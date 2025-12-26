"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const AppDataContext = createContext();

export const AppDataProvider = ({ children }) => {
  const supabase = createClient();
  const [blogs, setBlogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [siteConfig, setSiteConfig] = useState(null);
  const [allProjectImages, setAllProjectImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetching Function l-ga3 l-tables
  const fetchData = async () => {
    console.log("fetchData called at", new Date().toISOString());
    setLoading(true);

    let blogsData = [];
    let projectsData = [];
    let configData = null;
    let imagesData = [];

    try {
      const blogsRes = await supabase.from("blog_posts").select("*, comments(*)").order("created_at", { ascending: false });
      blogsData = blogsRes.data || [];
    } catch (error) {
      console.error("Error fetching blog_posts:", error);
      console.error("Error details:", { message: error.message, name: error.name, stack: error.stack });
    }

    try {
      const projectsRes = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      projectsData = projectsRes.data || [];
    } catch (error) {
      console.error("Error fetching projects:", error);
      console.error("Error details:", { message: error.message, name: error.name, stack: error.stack });
    }

    try {
      const configRes = await supabase.from("site_config").select("*").single();
      configData = configRes.data || null;
    } catch (error) {
      console.error("Error fetching site_config:", error);
      console.error("Error details:", { message: error.message, name: error.name, stack: error.stack });
    }

    try {
      const imagesRes = await supabase.from("project_images").select("*");
      imagesData = imagesRes.data || [];
    } catch (error) {
      console.error("Error fetching project_images:", error);
      console.error("Error details:", { message: error.message, name: error.name, stack: error.stack });
    }

    // N-rtbo l-data: kola project n-zido lih tsawer dyalou
    const projectsWithImages = projectsData.map(project => ({
      ...project,
      images: imagesData.filter(img => img.project_id === project.id) || []
    }));

    setBlogs(blogsData);
    setProjects(projectsWithImages);
    setSiteConfig(configData);
    setAllProjectImages(imagesData.map(img => ({ ...img, image_url: img.image_url.replace(/^"|"$/g, '') })));

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Add Comment (Table: comments)
  const addComment = async (commentData) => {
    try {
      const { data, error } = await supabase.from("comments").insert([commentData]).select();
      if (!error) {
        // Update local state derya bach t-ban d l-user
        setBlogs(prev => prev.map(post =>
          post.id === commentData.post_id ? { ...post, comments: [...(post.comments || []), data[0]] } : post
        ));
      }
      return { data, error };
    } catch (error) {
      console.error("Error adding comment:", error);
      console.error("Error details:", { message: error.message, name: error.name, stack: error.stack });
      return { data: null, error };
    }
  };

  // 3. Send Message (Table: messages)
  const sendMessage = async (messageData) => {
    try {
      const { data, error } = await supabase.from("messages").insert([messageData]);
      return { data, error };
    } catch (error) {
      console.error("Error sending message:", error);
      console.error("Error details:", { message: error.message, name: error.name, stack: error.stack });
      return { data: null, error };
    }
  };

  return (
    <AppDataContext.Provider value={{
      blogs,
      projects,
      siteConfig,
      allProjectImages,
      loading,
      addComment,
      sendMessage,
      refreshData: fetchData
    }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => useContext(AppDataContext);