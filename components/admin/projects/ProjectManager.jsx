"use client";
import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import ProjectList from "./ProjectList";
import ProjectForm from "./ProjectForm";

import { useProjectData } from "@/hooks/admin/useProjectData";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export default function ProjectManager({ isDarkMode = false }) {
  const {
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
  } = useProjectData();

  const tableRef = useRef();
  const formRef = useRef();

  // Fetch projects when component mounts
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Animation effects
  useGSAP(() => {
    if (!isEditingProject && tableRef.current) {
      // Table entrance animation
      gsap.fromTo(tableRef.current, {
        y: 50,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  }, [isEditingProject]);

  const openProjectFormWithAnimation = (project = null) => {
    // Animate table down and form up
    if (tableRef.current) {
      gsap.to(tableRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          openProjectForm(project);
          if (formRef.current) {
            gsap.fromTo(formRef.current, {
              y: -50,
              opacity: 0
            }, {
              y: 0,
              opacity: 1,
              duration: 0.3,
              ease: "power2.out"
            });
          }
        }
      });
    } else {
      openProjectForm(project);
    }
  };

  const closeProjectFormWithAnimation = () => {
    // Animate form down and table up
    if (formRef.current) {
      gsap.to(formRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          closeProjectForm();
          if (tableRef.current) {
            gsap.fromTo(tableRef.current, {
              y: -50,
              opacity: 0
            }, {
              y: 0,
              opacity: 1,
              duration: 0.3,
              ease: "power2.out"
            });
          }
        }
      });
    } else {
      closeProjectForm();
    }
  };

  const handleSubmit = (e, formData) => {
    handleProjectSubmit(e, formData);
    // Note: closeProjectFormWithAnimation will be called by the success handler in useProjectData
  };

  return (
    <>
      {!isEditingProject ? (
        <div ref={tableRef}>
          <ProjectList
            projects={projects}
            loading={projectsLoading}
            error={projectsError}
            onRefresh={fetchProjects}
            onAddNew={() => openProjectFormWithAnimation()}
            onEdit={openProjectFormWithAnimation}
            onDelete={handleDeleteProject}
          />
        </div>
      ) : (
        <div ref={formRef}>
          <ProjectForm
            project={currentProject}
            formData={projectFormData}
            validationErrors={projectValidationErrors}
            onSubmit={handleSubmit}
            onCancel={closeProjectFormWithAnimation}
            isDarkMode={isDarkMode}
            existingProjects={projects}
          />
        </div>
      )}
    </>
  );
}