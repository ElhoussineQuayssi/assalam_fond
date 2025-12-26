"use client";
import { useState, useCallback } from "react";
import { toast } from "sonner";

export function useBlogData() {
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [blogsError, setBlogsError] = useState(null);

  // Form state
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [blogFormData, setBlogFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    status: "draft",
    image: "",
    published_at: "",
    tags: "",
  });

  // Filters and pagination
  const [blogSearch, setBlogSearch] = useState("");
  const [blogStatusFilter, setBlogStatusFilter] = useState("all");
  const [blogCategoryFilter, setBlogCategoryFilter] = useState("all");
  const [blogSortBy, setBlogSortBy] = useState("updated_at");
  const [blogSortOrder, setBlogSortOrder] = useState("desc");
  const [blogPage, setBlogPage] = useState(1);
  const [blogPageSize, setBlogPageSize] = useState(10);
  const [blogTotal, setBlogTotal] = useState(0);

  const fetchBlogs = useCallback(async () => {
    console.log("fetchBlogs called with params:", {
      page: blogPage,
      limit: blogPageSize,
      search: blogSearch,
      status: blogStatusFilter,
      category: blogCategoryFilter,
      sortBy: blogSortBy,
      sortOrder: blogSortOrder,
    });

    setBlogsLoading(true);
    setBlogsError(null);
    try {
      const params = new URLSearchParams({
        page: blogPage.toString(),
        limit: blogPageSize.toString(),
        search: blogSearch,
        status: blogStatusFilter,
        category: blogCategoryFilter,
        sortBy: blogSortBy,
        sortOrder: blogSortOrder,
      });

      console.log("Fetching from URL:", `/api/blog-posts?${params}`);
      const response = await fetch(`/api/blog-posts?${params}`);
      console.log("Response status:", response.status);

      if (!response.ok) throw new Error("Failed to fetch blog posts");
      const data = await response.json();
      console.log("Received data:", data);

      setBlogs(data.blogs || []);
      setBlogTotal(data.total || 0);
    } catch (error) {
      console.error("Error in fetchBlogs:", error);
      setBlogsError(error.message);
      toast.error("Failed to fetch blog posts: " + error.message);
    } finally {
      setBlogsLoading(false);
    }
  }, [
    blogPage,
    blogPageSize,
    blogSearch,
    blogStatusFilter,
    blogCategoryFilter,
    blogSortBy,
    blogSortOrder,
  ]);

  const openBlogForm = useCallback((blog = null) => {
    setCurrentBlog(blog);
    if (blog) {
      setBlogFormData({
        title: blog.title || "",
        slug: blog.slug || "",
        excerpt: blog.excerpt || "",
        content: blog.content || "",
        category: blog.category || "",
        status: blog.status || "draft",
        image: blog.image || "",
        published_at: blog.published_at
          ? new Date(blog.published_at).toISOString().split("T")[0]
          : "",
        tags: blog.tags || "",
      });
    } else {
      setBlogFormData({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "",
        status: "draft",
        image: "",
        published_at: "",
        tags: "",
      });
    }
    setIsEditingBlog(true);
  }, []);

  const closeBlogForm = useCallback(() => {
    setIsEditingBlog(false);
    setCurrentBlog(null);
  }, []);

  const handleBlogSubmit = useCallback(
    async (e, formData) => {
      e.preventDefault();
      try {
        // Handle multilingual form data structure
        const formDataToSubmit = { ...formData };

        // If we have multilingual structure, transform it for the API
        if (
          formDataToSubmit.title &&
          typeof formDataToSubmit.title === "object"
        ) {
          // Use French as the primary language for the main record
          formDataToSubmit.title = formDataToSubmit.title.fr || "";
          formDataToSubmit.excerpt = formDataToSubmit.excerpt.fr || "";
          formDataToSubmit.content = formDataToSubmit.content.fr || "";

          // Add translation fields
          if (formDataToSubmit.title.en) {
            formDataToSubmit.title_en = formDataToSubmit.title.en;
          }
          if (formDataToSubmit.excerpt.en) {
            formDataToSubmit.excerpt_en = formDataToSubmit.excerpt.en;
          }
          if (formDataToSubmit.content.en) {
            formDataToSubmit.content_en = formDataToSubmit.content.en;
          }

          if (formDataToSubmit.title.ar) {
            formDataToSubmit.title_ar = formDataToSubmit.title.ar;
          }
          if (formDataToSubmit.excerpt.ar) {
            formDataToSubmit.excerpt_ar = formDataToSubmit.excerpt.ar;
          }
          if (formDataToSubmit.content.ar) {
            formDataToSubmit.content_ar = formDataToSubmit.content.ar;
          }

          // Remove the object structure
          delete formDataToSubmit.title;
          delete formDataToSubmit.excerpt;
          delete formDataToSubmit.content;
        }

        // Auto-generate slug if not provided
        if (!formDataToSubmit.slug && formDataToSubmit.title) {
          formDataToSubmit.slug = formDataToSubmit.title
            .toLowerCase()
            .replace(/\s+/g, "-");
        }

        // Auto-set published_at if status is published and published_at is not set
        if (
          formDataToSubmit.status === "published" &&
          !formDataToSubmit.published_at
        ) {
          formDataToSubmit.published_at = new Date().toISOString();
        }

        const url = currentBlog
          ? `/api/blog-posts/${currentBlog.id}`
          : "/api/blog-posts";
        const method = currentBlog ? "PUT" : "POST";

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formDataToSubmit),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to save blog post");
        }

        toast.success(
          currentBlog
            ? "Blog post updated successfully!"
            : "Blog post created successfully!",
        );
        fetchBlogs(); // Refresh the list
        closeBlogForm();
      } catch (error) {
        toast.error("Failed to save blog post: " + error.message);
        throw error;
      }
    },
    [currentBlog, fetchBlogs, closeBlogForm],
  );

  const handleDeleteBlog = useCallback(
    async (id) => {
      if (!confirm("Are you sure you want to delete this blog post?")) return;
      try {
        const response = await fetch(`/api/blog-posts/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete blog post");
        toast.success("Blog post deleted successfully!");
        fetchBlogs(); // Refresh the list
      } catch (error) {
        toast.error("Failed to delete blog post: " + error.message);
      }
    },
    [fetchBlogs],
  );

  // Filter and sort handlers
  const handleSearchChange = useCallback((search) => {
    setBlogSearch(search);
    setBlogPage(1); // Reset to first page when searching
  }, []);

  const handleStatusFilterChange = useCallback((status) => {
    setBlogStatusFilter(status);
    setBlogPage(1); // Reset to first page when filtering
  }, []);

  const handleCategoryFilterChange = useCallback((category) => {
    setBlogCategoryFilter(category);
    setBlogPage(1); // Reset to first page when filtering
  }, []);

  const handleSortChange = useCallback((field, order) => {
    setBlogSortBy(field);
    setBlogSortOrder(order);
    setBlogPage(1); // Reset to first page when sorting
  }, []);

  const handlePageChange = useCallback((page) => {
    setBlogPage(page);
  }, []);

  const handlePageSizeChange = useCallback((pageSize) => {
    setBlogPageSize(pageSize);
    setBlogPage(1); // Reset to first page when changing page size
  }, []);

  return {
    // State
    blogs,
    blogsLoading,
    blogsError,
    isEditingBlog,
    currentBlog,
    blogFormData,

    // Filters and pagination
    blogSearch,
    blogStatusFilter,
    blogCategoryFilter,
    blogSortBy,
    blogSortOrder,
    blogPage,
    blogPageSize,
    blogTotal,

    // Actions
    fetchBlogs,
    openBlogForm,
    closeBlogForm,
    handleBlogSubmit,
    handleDeleteBlog,

    // Filter handlers
    handleSearchChange,
    handleStatusFilterChange,
    handleCategoryFilterChange,
    handleSortChange,
    handlePageChange,
    handlePageSizeChange,

    // Form data handler
    setBlogFormData,
  };
}
