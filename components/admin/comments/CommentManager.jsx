"use client";
import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import CommentFilters from "./CommentFilters";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";

import { useCommentsData } from "@/hooks/admin/useCommentsData";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export default function CommentManager({ isDarkMode = false }) {
  const {
    // State
    comments,
    commentsLoading,
    commentsError,
    isEditingComment,
    currentComment,
    commentFormData,

    // Filters and pagination
    commentSearch,
    commentStatusFilter,
    commentSortBy,
    commentSortOrder,
    commentPage,
    commentPageSize,
    commentTotal,

    // Actions
    fetchComments,
    openCommentForm,
    closeCommentForm,
    handleCommentSubmit,
    handleDeleteComment,

    // Filter handlers
    handleSearchChange,
    handleStatusFilterChange,
    handleSortChange,
    handlePageChange,
    handlePageSizeChange,

    // Form data handler
    setCommentFormData,
  } = useCommentsData();

  const tableRef = useRef();
  const formRef = useRef();

  // Fetch comments when component mounts and when dependencies change
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Animation effects
  useGSAP(() => {
    if (!isEditingComment && tableRef.current) {
      // Table entrance animation
      gsap.fromTo(
        tableRef.current,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        },
      );
    }
  }, [isEditingComment]);

  const openCommentFormWithAnimation = (comment = null) => {
    // Animate table down and form up
    if (tableRef.current) {
      gsap.to(tableRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          openCommentForm(comment);
          if (formRef.current) {
            gsap.fromTo(
              formRef.current,
              {
                y: -50,
                opacity: 0,
              },
              {
                y: 0,
                opacity: 1,
                duration: 0.3,
                ease: "power2.out",
              },
            );
          }
        },
      });
    } else {
      openCommentForm(comment);
    }
  };

  const closeCommentFormWithAnimation = () => {
    // Animate form down and table up
    if (formRef.current) {
      gsap.to(formRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          closeCommentForm();
          if (tableRef.current) {
            gsap.fromTo(
              tableRef.current,
              {
                y: -50,
                opacity: 0,
              },
              {
                y: 0,
                opacity: 1,
                duration: 0.3,
                ease: "power2.out",
              },
            );
          }
        },
      });
    } else {
      closeCommentForm();
    }
  };

  const handleSubmit = (e, formData) => {
    handleCommentSubmit(e, formData);
    // Note: closeCommentFormWithAnimation will be called by the success handler in useCommentsData
  };

  return (
    <>
      {!isEditingComment ? (
        <>
          <CommentFilters
            search={commentSearch}
            statusFilter={commentStatusFilter}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusFilterChange}
          />

          <div ref={tableRef}>
            <CommentList
              comments={comments}
              loading={commentsLoading}
              error={commentsError}
              sortBy={commentSortBy}
              sortOrder={commentSortOrder}
              onSortChange={handleSortChange}
              page={commentPage}
              pageSize={commentPageSize}
              total={commentTotal}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onRefresh={fetchComments}
              onAddNew={() => openCommentFormWithAnimation()}
              onEdit={openCommentFormWithAnimation}
              onDelete={handleDeleteComment}
            />
          </div>
        </>
      ) : (
        <div ref={formRef}>
          <CommentForm
            comment={currentComment}
            formData={commentFormData}
            onSubmit={handleSubmit}
            onCancel={closeCommentFormWithAnimation}
            isDarkMode={isDarkMode}
          />
        </div>
      )}
    </>
  );
}
