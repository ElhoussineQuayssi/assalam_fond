"use client";
import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import BlogFilters from "./BlogFilters";
import BlogList from "./BlogList";
import BlogForm from "./BlogForm";

import { useBlogData } from "@/hooks/admin/useBlogData";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export default function BlogManager({ isDarkMode = false }) {
  const {
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
  } = useBlogData();

  const tableRef = useRef();
  const formRef = useRef();

  // Fetch blogs when component mounts and when dependencies change
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Animation effects
  useGSAP(() => {
    if (!isEditingBlog && tableRef.current) {
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
  }, [isEditingBlog]);

  const openBlogFormWithAnimation = (blog = null) => {
    // Animate table down and form up
    if (tableRef.current) {
      gsap.to(tableRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          openBlogForm(blog);
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
      openBlogForm(blog);
    }
  };

  const closeBlogFormWithAnimation = () => {
    // Animate form down and table up
    if (formRef.current) {
      gsap.to(formRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          closeBlogForm();
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
      closeBlogForm();
    }
  };

  const handleSubmit = (e, formData) => {
    handleBlogSubmit(e, formData);
    // Note: closeBlogFormWithAnimation will be called by the success handler in useBlogData
  };

  return (
    <>
      {!isEditingBlog ? (
        <>
          <BlogFilters
            search={blogSearch}
            statusFilter={blogStatusFilter}
            categoryFilter={blogCategoryFilter}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusFilterChange}
            onCategoryChange={handleCategoryFilterChange}
          />

          <div ref={tableRef}>
            <BlogList
              blogs={blogs}
              loading={blogsLoading}
              error={blogsError}
              sortBy={blogSortBy}
              sortOrder={blogSortOrder}
              onSortChange={handleSortChange}
              page={blogPage}
              pageSize={blogPageSize}
              total={blogTotal}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onRefresh={fetchBlogs}
              onAddNew={() => openBlogFormWithAnimation()}
              onEdit={openBlogFormWithAnimation}
              onDelete={handleDeleteBlog}
            />
          </div>
        </>
      ) : (
        <div ref={formRef}>
          <BlogForm
            blog={currentBlog}
            formData={blogFormData}
            onSubmit={handleSubmit}
            onCancel={closeBlogFormWithAnimation}
            isDarkMode={isDarkMode}
          />
        </div>
      )}
    </>
  );
}