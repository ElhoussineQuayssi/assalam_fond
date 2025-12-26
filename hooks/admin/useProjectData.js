"use client";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { generateSlug } from "@/utils/slugGenerator";

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
    slug: '',              // Auto-generated from title
    title: '',
    excerpt: '',           // Brief description (maps to DB field)
    
    // Categorization  
    categories: [],        // Array of strings (was single category)
    status: 'draft',
    
    // Project Details
    start_date: '',        // Month/year
    location: '',          // Geographic information  
    people_helped: '',     // Impact metrics
    goals: [],             // Array of objectives
    
    // Content Blocks - NEW: Structured content management
    content: [],           // Array of content blocks (text, services, stats)
    
    // Media
    image: '',             // Main project image
    gallery_images: []     // Gallery images managed locally
  });

  const fetchProjects = useCallback(async () => {
    setProjectsLoading(true);
    setProjectsError(null);
    try {
      const response = await fetch('/api/projects');
      
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
      const processedProjects = safeProjects.map(project => ({
        ...project,
        date: project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'
      }));
      
      setProjects(processedProjects);
      
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjectsError(error.message);
      setProjects([]); // Set empty array on error
      toast.error('Failed to fetch projects: ' + error.message);
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  const openProjectForm = useCallback((project = null) => {
    setCurrentProject(project);
    setProjectValidationErrors({}); // Clear validation errors when opening form
    
    if (project) {
      // Process project data with proper array validation
      const processedData = {
        // Basic Information
        slug: project.slug || '',
        title: project.title || '',
        excerpt: project.excerpt || '',
        
        // Categorization - Ensure arrays
        categories: Array.isArray(project.categories) ? project.categories : [],
        status: project.status || 'draft',
        
        // Project Details
        start_date: project.start_date || '',
        location: project.location || '',
        people_helped: project.people_helped || '',
        goals: Array.isArray(project.goals) ? project.goals : [], // Array of objectives
        
        // Content Blocks - NEW: Structured content management
        content: Array.isArray(project.content) ? project.content : [], // Array of content blocks
        
        // Media
        image: project.image || '',             // Main project image
        gallery_images: []                      // Gallery images will be loaded separately
      };
      setProjectFormData(processedData);
    } else {
      setProjectFormData({
        // Basic Information
        slug: '',
        title: '',
        excerpt: '',
        
        // Categorization
        categories: [],
        status: 'draft',
        
        // Project Details
        start_date: '',
        location: '',
        people_helped: '',
        goals: [],
        
        // Content Blocks - NEW: Structured content management
        content: [],
        
        // Media
        image: '',
        gallery_images: []
      });
    }
    setIsEditingProject(true);
  }, []);

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
      errors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      errors.title = 'Title must be 200 characters or less';
    }
    
    if (!formData.excerpt?.trim()) {
      errors.excerpt = 'Excerpt is required';
    } else if (formData.excerpt.length > 500) {
      errors.excerpt = 'Excerpt must be 500 characters or less';
    }
    
    if (!formData.slug?.trim()) {
      errors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
    }
    
    // Array fields validation
    if (!formData.categories || formData.categories.length === 0) {
      errors.categories = 'At least one category is required';
    }
    
    if (!formData.goals || formData.goals.length === 0) {
      errors.goals = 'At least one goal is required';
    }
    
    // Content blocks validation
    if (formData.content && formData.content.length > 0) {
      formData.content.forEach((block, index) => {
        if (block.type === 'text') {
          if (!block.content?.heading?.trim()) {
            errors[`content_${index}_heading`] = 'Heading is required for text blocks';
          }
          if (!block.content?.text?.trim()) {
            errors[`content_${index}_text`] = 'Text content is required';
          }
        }
        // Add more content block validations as needed
      });
    }
    
    return errors;
  }, []);

  const handleProjectSubmit = useCallback(async (e, formData) => {
    e.preventDefault();
    
    // Client-side validation
    const validationErrors = validateProjectForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setProjectValidationErrors(validationErrors);
      toast.error('Please fix the validation errors before submitting.');
      return;
    }
    
    try {
      // Ensure all arrays are properly formatted before submission
      const formDataToSubmit = {
        ...formData,
        // Ensure arrays are arrays
        categories: Array.isArray(formData.categories) ? formData.categories : [],
        goals: Array.isArray(formData.goals) ? formData.goals : [],
        content: Array.isArray(formData.content) ? formData.content : [],
        gallery_images: Array.isArray(formData.gallery_images) ? formData.gallery_images : [],
      };
      
      // Auto-generate slug if not provided
      if (!formDataToSubmit.slug && formDataToSubmit.title) {
        formDataToSubmit.slug = formDataToSubmit.title.toLowerCase().replace(/\s+/g, '-');
      }

      const dataForDb = formDataToSubmit;

      const url = currentProject ? `/api/projects/${currentProject.id}` : '/api/projects';
      const method = currentProject ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataForDb),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save project');
      }

      toast.success(currentProject ? 'Project updated successfully!' : 'Project created successfully!');
      fetchProjects(); // Refresh the list
      closeProjectForm();
      setProjectValidationErrors({}); // Clear validation errors
    } catch (error) {
      toast.error('Failed to save project: ' + error.message);
      throw error;
    }
  }, [currentProject, fetchProjects, closeProjectForm, validateProjectForm]);

  const handleDeleteProject = useCallback(async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const response = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete project');
      toast.success('Project deleted successfully!');
      fetchProjects(); // Refresh the list
    } catch (error) {
      toast.error('Failed to delete project: ' + error.message);
    }
  }, [fetchProjects]);

  const handleInputChange = useCallback((field, value) => {
    setProjectFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field when user starts typing
    if (projectValidationErrors[field]) {
      setProjectValidationErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [projectValidationErrors]);

  const handleArrayChange = useCallback((field, value) => {
    setProjectFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field when user makes changes
    if (projectValidationErrors[field]) {
      setProjectValidationErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [projectValidationErrors]);

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