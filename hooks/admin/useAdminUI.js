"use client";
import { useState, useCallback } from "react";

export function useAdminUI() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [showInvitation, setShowInvitation] = useState(false);
  const [invitationLink, setInvitationLink] = useState("");
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [projectValidationErrors, setProjectValidationErrors] = useState({});

  const openModal = useCallback((admin = null) => {
    setEditingAdmin(admin);
    setShowInvitation(false);
    setInvitationLink("");
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingAdmin(null);
  }, []);

  const openBlogForm = useCallback((blog = null) => {
    setCurrentBlog(blog);
    setIsEditingBlog(true);
  }, []);

  const closeBlogForm = useCallback(() => {
    setIsEditingBlog(false);
    setCurrentBlog(null);
  }, []);

  const openProjectForm = useCallback((project = null) => {
    setCurrentProject(project);
    setProjectValidationErrors({});
    setIsEditingProject(true);
  }, []);

  const closeProjectForm = useCallback(() => {
    setIsEditingProject(false);
    setCurrentProject(null);
    setProjectValidationErrors({});
  }, []);

  const setFormData = useCallback(
    (data) => {
      if (editingAdmin) {
        setEditingAdmin({ ...editingAdmin, ...data });
      }
    },
    [editingAdmin],
  );

  const setBlogFormData = useCallback(
    (data) => {
      if (currentBlog) {
        setCurrentBlog({ ...currentBlog, ...data });
      }
    },
    [currentBlog],
  );

  const setProjectFormData = useCallback(
    (data) => {
      if (currentProject) {
        setCurrentProject({ ...currentProject, ...data });
      }
    },
    [currentProject],
  );

  return {
    // Modal state
    isModalOpen,
    editingAdmin,
    showInvitation,
    invitationLink,

    // Blog state
    isEditingBlog,
    currentBlog,

    // Project state
    isEditingProject,
    currentProject,
    projectValidationErrors,

    // Actions
    openModal,
    closeModal,
    openBlogForm,
    closeBlogForm,
    openProjectForm,
    closeProjectForm,
    setFormData,
    setBlogFormData,
    setProjectFormData,
    setProjectValidationErrors,
  };
}
