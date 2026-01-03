"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { useCommentsData } from "@/hooks/admin/useCommentsData";
import CommentFilters from "./CommentFilters";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import CommentView from "./CommentView";

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
    isViewingComment,
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
    openCommentView,
    closeCommentView,
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
  const viewRef = useRef();

  // Fetch comments when component mounts and when dependencies change
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Animation effects
  useGSAP(() => {
    if (!isEditingComment && !isViewingComment && tableRef.current) {
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
  }, [isEditingComment, isViewingComment]);

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

  const openCommentViewWithAnimation = (comment) => {
    // Animate table down and view up
    if (tableRef.current) {
      gsap.to(tableRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          openCommentView(comment);
          if (viewRef.current) {
            gsap.fromTo(
              viewRef.current,
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
      openCommentView(comment);
    }
  };

  const closeCommentViewWithAnimation = () => {
    // Animate view down and table up
    if (viewRef.current) {
      gsap.to(viewRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          closeCommentView();
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
      closeCommentView();
    }
  };

  const handleSubmit = (e, formData) => {
    handleCommentSubmit(e, formData);
    // Note: closeCommentFormWithAnimation will be called by the success handler in useCommentsData
  };

  return (
    <>
      {!isEditingComment && !isViewingComment ? (
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
              onEdit={openCommentViewWithAnimation}
              onDelete={handleDeleteComment}
            />
          </div>
        </>
      ) : isViewingComment ? (
        <div ref={viewRef}>
          <CommentView
            comment={currentComment}
            onClose={closeCommentViewWithAnimation}
            isDarkMode={isDarkMode}
          />
        </div>
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
