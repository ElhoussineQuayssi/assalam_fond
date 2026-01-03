"use client";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { generateSlug } from "@/utils/slugGenerator";
import { createClient } from "@/utils/supabase/client";

export function useProjectData() {
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState(null);

  // Form state
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [projectValidationErrors, setProjectValidationErrors] = useState({});
  const [projectFormData, setProjectFormData] = useState({
    // Basic Information
    slug: "", // Auto-generated from title
    title: "",
    excerpt: "", // Brief description (maps to DB field)

    // Categorization
    categories: [], // Array of strings (was single category)
    status: "draft",

    // Project Details
    start_date: "", // Month/year
    location: "", // Geographic information
    people_helped: "", // Impact metrics
    goals: [], // Array of objectives

    // Content Blocks - NEW: Structured content management
    content: [], // Array of content blocks (text, services, stats)

    // Media
    image: "", // Main project image
    gallery_images: [], // Gallery images managed locally
  });

  const fetchProjects = useCallback(async () => {
    setProjectsLoading(true);
    setProjectsError(null);
    try {
      const response = await fetch("/api/projects");

      // Ensure we get a proper response
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      // Extract the projects array from the response
      const projectsArray = responseData?.data || responseData?.projects || [];

      // Ensure it's always an array
      const safeProjects = Array.isArray(projectsArray) ? projectsArray : [];

      // Process projects with proper date formatting
      const processedProjects = safeProjects.map((project) => ({
        ...project,
        date: project.created_at
          ? new Date(project.created_at).toLocaleDateString()
          : "N/A",
      }));

      setProjects(processedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjectsError(error.message);
      setProjects([]); // Set empty array on error
      toast.error(`Failed to fetch projects: ${error.message}`);
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  const openProjectForm = useCallback(
    async (project = null) => {
      setProjectValidationErrors({}); // Clear validation errors when opening form

      // Prevent unnecessary re-initialization if same project
      if (currentProject?.id === project?.id) {
        return;
      }

      if (project) {
        try {
          // Load all translations for this project
          const translationsResponse = await fetch(
            `/api/project-translations?project_id=${project.id}`,
          );
          let translationsRows = [];
          if (translationsResponse.ok) {
            const translationsData = await translationsResponse.json();
            translationsRows = translationsData?.data || [];
          }

          // Load existing gallery images for this project
          let existingGalleryImages = [];
          try {
            const galleryResponse = await fetch(
              `/api/project-images?project_id=${project.id}`,
            );
            if (galleryResponse.ok) {
              const galleryData = await galleryResponse.json();
              existingGalleryImages = Array.isArray(galleryData)
                ? galleryData.map((img, index) => ({
                    id: img.id,
                    image_url: decodeURI(img.image_url), // Fix double-encoded URLs
                    caption: img.alt_text || "",
                    order: index,
                    action: "keep",
                  }))
                : [];
            }
          } catch (galleryError) {
            console.warn(
              "Failed to load existing gallery images:",
              galleryError,
            );
            existingGalleryImages = [];
          }

          // Merge translations into a single translations object
          const translations = translationsRows.reduce(
            (acc, row) => {
              acc[row.lang] = {
                title: row.title || "",
                excerpt: row.excerpt || "",
                people_helped: row.people_helped || "",
                content: Array.isArray(row.content) ? row.content : [],
                slug: row.slug || "",
                metadata: row.metadata || {},
              };
              return acc;
            },
            { fr: {}, en: {}, ar: {} },
          );

          // Ensure French data comes from the main projects table
          translations.fr = {
            title: project.title || "",
            excerpt: project.excerpt || "",
            people_helped: project.people_helped || "",
            content: Array.isArray(project.content) ? project.content : [],
            slug: project.slug || "",
            metadata: {},
          };

          // Create merged project object
          const mergedProject = {
            id: project.id,
            slug: project.slug || "",
            status: project.status || "draft",
            start_date: project.start_date || "",
            location: project.location || "",
            categories: Array.isArray(project.categories)
              ? project.categories
              : [],
            goals: Array.isArray(project.goals) ? project.goals : [],
            image: project.image || "",
            gallery_images: existingGalleryImages,
            translations, // All language data merged here
          };

          setCurrentProject(mergedProject);
          // Form data will be set dynamically in ProjectForm based on currentLanguage
        } catch (error) {
          console.error("Error loading project translations:", error);
          // Fallback to basic project data without translations
          const mergedProject = {
            id: project.id,
            slug: project.slug || "",
            status: project.status || "draft",
            start_date: project.start_date || "",
            location: project.location || "",
            categories: Array.isArray(project.categories)
              ? project.categories
              : [],
            goals: Array.isArray(project.goals) ? project.goals : [],
            image: project.image || "",
            gallery_images: [],
            translations: {
              fr: {
                title: project.title || "",
                excerpt: project.excerpt || "",
                people_helped: project.people_helped || "",
                content: Array.isArray(project.content) ? project.content : [],
                slug: project.slug || "",
                metadata: {},
              },
              en: {
                title: "",
                excerpt: "",
                people_helped: "",
                content: [],
                slug: "",
                metadata: {},
              },
              ar: {
                title: "",
                excerpt: "",
                people_helped: "",
                content: [],
                slug: "",
                metadata: {},
              },
            },
          };
          setCurrentProject(mergedProject);
        }
      } else {
        // New project - create empty translations structure
        const mergedProject = {
          id: null,
          slug: "",
          status: "draft",
          start_date: "",
          location: "",
          categories: [],
          goals: [],
          image: "",
          gallery_images: [],
          translations: {
            fr: {
              title: "",
              excerpt: "",
              people_helped: "",
              content: [],
              slug: "",
              metadata: {},
            },
            en: {
              title: "",
              excerpt: "",
              people_helped: "",
              content: [],
              slug: "",
              metadata: {},
            },
            ar: {
              title: "",
              excerpt: "",
              people_helped: "",
              content: [],
              slug: "",
              metadata: {},
            },
          },
        };
        setCurrentProject(mergedProject);
      }
      setIsEditingProject(true);
    },
    [currentProject?.id],
  );

  const closeProjectForm = useCallback(() => {
    setIsEditingProject(false);
    setCurrentProject(null);
    setProjectValidationErrors({});
  }, []);

  // Client-side validation for project form
  const validateProjectForm = useCallback((formData) => {
    const errors = {};

    // Required fields validation
    if (!formData.title?.trim()) {
      errors.title = "Title is required";
    } else if (formData.title.length > 200) {
      errors.title = "Title must be 200 characters or less";
    }

    if (!formData.excerpt?.trim()) {
      errors.excerpt = "Excerpt is required";
    } else if (formData.excerpt.length > 500) {
      errors.excerpt = "Excerpt must be 500 characters or less";
    }

    if (!formData.slug?.trim()) {
      errors.slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug =
        "Slug must contain only lowercase letters, numbers, and hyphens";
    }

    // Array fields validation
    if (!formData.categories || formData.categories.length === 0) {
      errors.categories = "At least one category is required";
    }

    if (!formData.goals || formData.goals.length === 0) {
      errors.goals = "At least one goal is required";
    }

    // Content blocks validation
    if (formData.content && formData.content.length > 0) {
      formData.content.forEach((block, index) => {
        if (block.type === "text") {
          if (!block.content?.heading?.trim()) {
            errors[`content_${index}_heading`] =
              "Heading is required for text blocks";
          }
          if (!block.content?.text?.trim()) {
            errors[`content_${index}_text`] = "Text content is required";
          }
        }
        // Add more content block validations as needed
      });
    }

    return errors;
  }, []);

  const handleProjectSubmit = useCallback(
    async (e, formData, editingLanguage = "fr") => {
      e.preventDefault();

      // Build a canonical payload for validation and projects table (use French as canonical)
      const canonical = {
        ...formData,
        title: formData.translations?.fr?.title || "",
        excerpt: formData.translations?.fr?.excerpt || "",
        content: formData.translations?.fr?.content || [],
        people_helped: formData.translations?.fr?.people_helped || "",
      };

      // Client-side validation (on canonical French data)
      const validationErrors = validateProjectForm(canonical);
      if (Object.keys(validationErrors).length > 0) {
        setProjectValidationErrors(validationErrors);
        toast.error("Please fix the validation errors before submitting.");
        return;
      }

      try {
        // Ensure arrays are properly formatted before submission
        const sharedData = {
          categories: Array.isArray(formData.categories)
            ? formData.categories
            : [],
          goals: Array.isArray(formData.goals) ? formData.goals : [],
          image: formData.image || "",
          status: formData.status || "draft",
          start_date: formData.start_date || "",
          location: formData.location || "",
        };

        // Auto-generate slug if not provided (use existing slug or generate from French title)
        let slug = formData.slug;
        if (!slug) {
          const base = (formData.translations?.fr?.title || "").toLowerCase();
          slug = base.replace(/\s+/g, "-") || generateSlug(canonical.title, []);
        }

        // If updating an existing project
        let projectId = currentProject?.id || null;
        if (currentProject) {
          // If editing French, update projects table canonical fields
          if (editingLanguage === "fr") {
            const updatePayload = {
              ...sharedData,
              title: canonical.title,
              excerpt: canonical.excerpt,
              content: canonical.content,
              people_helped: canonical.people_helped,
              slug,
              updated_at: new Date().toISOString(),
            };

            const response = await fetch(`/api/projects/${projectId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updatePayload),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || "Failed to update project");
            }
          }
        } else {
          // Creating new project: always create canonical projects row using French data
          const createPayload = {
            ...sharedData,
            title: canonical.title,
            excerpt: canonical.excerpt,
            content: canonical.content,
            people_helped: canonical.people_helped,
            slug,
            status: sharedData.status || "draft",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          const response = await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(createPayload),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to create project");
          }

          const respJson = await response.json();
          projectId =
            respJson?.data?.id ||
            (Array.isArray(respJson?.data) ? respJson.data[0]?.id : null);
        }

        // Upsert translations for English and Arabic only (French stays in projects table)
        const translationLanguages = ["en", "ar"];
        for (const lang of translationLanguages) {
          // Only save translation if there's actual content for this language
          const hasContent =
            formData.translations?.[lang]?.title?.trim() ||
            formData.translations?.[lang]?.excerpt?.trim() ||
            (formData.translations?.[lang]?.content &&
              formData.translations[lang].content.length > 0);

          if (hasContent) {
            const translationPayload = {
              project_id: projectId,
              lang,
              title: formData.translations?.[lang]?.title || null,
              excerpt: formData.translations?.[lang]?.excerpt || null,
              people_helped:
                formData.translations?.[lang]?.people_helped || null,
              content: formData.translations?.[lang]?.content || null,
              slug: `${slug}-${lang}`, // All translations get suffixed slugs
              metadata: {},
            };

            // Use translations API
            const transResp = await fetch("/api/project-translations", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(translationPayload),
            });

            if (!transResp.ok) {
              console.log(
                `Translation save failed for ${lang}, status:`,
                transResp.status,
              );
              const errorText = await transResp.text();
              console.log(`Error response text:`, errorText);
              let errorData;
              try {
                errorData = JSON.parse(errorText);
              } catch (_e) {
                errorData = {};
              }
              console.error(`Failed to save ${lang} translation:`, errorData);
              // Continue with other languages even if one fails
            }
          }
        }

        // Synchronize gallery images after project is created/updated
        if (formData.gallery_images && formData.gallery_images.length > 0) {
          try {
            const galleryResult = await synchronizeGalleryImages(
              projectId,
              formData.gallery_images,
            );
            if (galleryResult) {
              const { updated, created, deleted } = galleryResult;
              console.log(
                `Gallery sync completed: ${updated} updated, ${created} created, ${deleted} deleted`,
              );
            }
          } catch (galleryError) {
            console.error("Gallery synchronization failed:", galleryError);
            // Don't fail the entire operation, but log the error
            toast.error(
              "Project saved but gallery synchronization failed. Please try updating the gallery separately.",
            );
          }
        }

        toast.success(
          currentProject
            ? "Project updated successfully!"
            : "Project created successfully!",
        );
        fetchProjects(); // Refresh the list
        closeProjectForm();
        setProjectValidationErrors({}); // Clear validation errors
      } catch (error) {
        toast.error(`Failed to save project: ${error.message}`);
        throw error;
      }
    },
    [
      currentProject,
      fetchProjects,
      closeProjectForm,
      validateProjectForm,
      synchronizeGalleryImages,
    ],
  );

  const handleDeleteProject = useCallback(
    async (id) => {
      if (!confirm("Are you sure you want to delete this project?")) return;
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete project");
        toast.success("Project deleted successfully!");
        fetchProjects(); // Refresh the list
      } catch (error) {
        toast.error(`Failed to delete project: ${error.message}`);
      }
    },
    [fetchProjects],
  );

  const handleInputChange = useCallback(
    (field, value) => {
      setProjectFormData((prev) => ({ ...prev, [field]: value }));

      // Clear validation error for this field when user starts typing
      if (projectValidationErrors[field]) {
        setProjectValidationErrors((prev) => ({ ...prev, [field]: null }));
      }
    },
    [projectValidationErrors],
  );

  const handleArrayChange = useCallback(
    (field, value) => {
      setProjectFormData((prev) => ({ ...prev, [field]: value }));

      // Clear validation error for this field when user makes changes
      if (projectValidationErrors[field]) {
        setProjectValidationErrors((prev) => ({ ...prev, [field]: null }));
      }
    },
    [projectValidationErrors],
  );

  // Helper function to chunk arrays
  const chunkArray = useCallback((array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }, []);

  // Gallery synchronization function with batch processing
  const synchronizeGalleryImages = useCallback(
    async (projectId, galleryImages, onProgress) => {
      if (!projectId || !galleryImages || galleryImages.length === 0) {
        return 0;
      }

      const supabase = createClient();
      const batchSize = 5; // Process 5 images at a time
      const batches = chunkArray(galleryImages, batchSize);
      let totalUpdated = 0;
      let totalCreated = 0;
      let totalDeleted = 0;

      for (const batch of batches) {
        // Process batch in parallel
        await Promise.all(
          batch.map(async (image) => {
            try {
              if (image.action === "create") {
                // Upload new file and create database record
                if (!image.file) {
                  console.error("Missing file for create action:", image);
                  return;
                }

                // Upload image via server-side API for WebP conversion
                const formData = new FormData();
                formData.append("file", image.file);
                formData.append("bucket", "projects");

                const uploadPromise = fetch("/api/upload/project-image", {
                  method: "POST",
                  body: formData,
                }).then(async (response) => {
                  if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Upload failed");
                  }
                  const result = await response.json();
                  return result.url;
                });

                const timeoutPromise = new Promise((_, reject) =>
                  setTimeout(() => reject(new Error("Upload timeout")), 30000),
                );

                const publicUrl = await Promise.race([
                  uploadPromise,
                  timeoutPromise,
                ]);

                // Create database record with timeout
                const createPromise = fetch("/api/project-images", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    project_id: projectId,
                    image_url: publicUrl,
                    alt_text: image.caption || null,
                  }),
                });

                const createTimeout = new Promise((_, reject) =>
                  setTimeout(() => reject(new Error("Create timeout")), 10000),
                );

                const createResponse = await Promise.race([
                  createPromise,
                  createTimeout,
                ]);

                if (!createResponse.ok) {
                  // Clean up uploaded file if database insert fails
                  await supabase.storage.from("projects").remove([filePath]);
                  console.error("Failed to create gallery image record");
                  return;
                }

                totalCreated++;
              } else if (image.action === "keep") {
                // Update existing record (caption changes only)
                if (!image.id) {
                  console.error("Missing ID for keep action:", image);
                  return;
                }

                // Update with timeout protection
                const updatePromise = fetch(`/api/project-images/${image.id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    alt_text: image.caption || null,
                  }),
                });

                const updateTimeout = new Promise((_, reject) =>
                  setTimeout(() => reject(new Error("Update timeout")), 10000),
                );

                const updateResponse = await Promise.race([
                  updatePromise,
                  updateTimeout,
                ]);

                if (!updateResponse.ok) {
                  console.error(
                    "Failed to update gallery image:",
                    image.id,
                    await updateResponse.text(),
                  );
                  return;
                }

                totalUpdated++;
              } else if (image.action === "delete") {
                // Delete existing record and file
                if (!image.id) {
                  console.error("Missing ID for delete action:", image);
                  return;
                }

                // Get image details first with timeout
                const getPromise = fetch(`/api/project-images/${image.id}`);
                const getTimeout = new Promise((_, reject) =>
                  setTimeout(() => reject(new Error("Get timeout")), 5000),
                );

                const getResponse = await Promise.race([
                  getPromise,
                  getTimeout,
                ]);

                if (!getResponse.ok) {
                  console.error(
                    "Failed to get image details for deletion:",
                    image.id,
                  );
                  return;
                }

                const imageData = await getResponse.json();

                // Delete from database with timeout
                const deletePromise = fetch(`/api/project-images/${image.id}`, {
                  method: "DELETE",
                });

                const deleteTimeout = new Promise((_, reject) =>
                  setTimeout(() => reject(new Error("Delete timeout")), 10000),
                );

                const deleteResponse = await Promise.race([
                  deletePromise,
                  deleteTimeout,
                ]);

                if (!deleteResponse.ok) {
                  console.error(
                    "Failed to delete gallery image record:",
                    image.id,
                  );
                  return;
                }

                // Delete file from storage
                if (imageData.image_url) {
                  try {
                    // Extract file path from Supabase URL
                    const urlParts = imageData.image_url.split(
                      "/storage/v1/object/public/projects/",
                    );
                    if (urlParts.length === 2) {
                      const filePath = urlParts[1];
                      await supabase.storage
                        .from("projects")
                        .remove([filePath]);
                    }
                  } catch (storageError) {
                    console.warn(
                      "Failed to delete file from storage:",
                      storageError,
                    );
                  }
                }

                totalDeleted++;
              }

              // Call progress callback
              if (onProgress) {
                onProgress(
                  totalUpdated + totalCreated + totalDeleted,
                  galleryImages.length,
                );
              }
            } catch (error) {
              console.error("Error processing gallery image:", image, error);
              // Continue processing other images rather than failing completely
            }
          }),
        );
      }

      return {
        updated: totalUpdated,
        created: totalCreated,
        deleted: totalDeleted,
      };
    },
    [chunkArray],
  );

  return {
    // State
    projects,
    projectsLoading,
    projectsError,
    isEditingProject,
    currentProject,
    projectValidationErrors,
    projectFormData,

    // Actions
    fetchProjects,
    openProjectForm,
    closeProjectForm,
    handleProjectSubmit,
    handleDeleteProject,

    // Form handlers
    handleInputChange,
    handleArrayChange,
    setProjectFormData,
    setProjectValidationErrors,

    // Validation
    validateProjectForm,
  };
}
