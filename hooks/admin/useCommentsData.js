"use client";
import { useState, useCallback } from "react";
import { toast } from "sonner";

export function useCommentsData() {
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState(null);
  
  // Form state
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [currentComment, setCurrentComment] = useState(null);
  const [commentFormData, setCommentFormData] = useState({
    content: '',
    author_name: '',
    author_email: '',
    post_id: '',
    status: 'pending'
  });

  // Filters and pagination
  const [commentSearch, setCommentSearch] = useState('');
  const [commentStatusFilter, setCommentStatusFilter] = useState('all');
  const [commentSortBy, setCommentSortBy] = useState('created_at');
  const [commentSortOrder, setCommentSortOrder] = useState('desc');
  const [commentPage, setCommentPage] = useState(1);
  const [commentPageSize, setCommentPageSize] = useState(10);
  const [commentTotal, setCommentTotal] = useState(0);

  const fetchComments = useCallback(async () => {
    setCommentsLoading(true);
    setCommentsError(null);
    try {
      const params = new URLSearchParams({
        page: commentPage.toString(),
        limit: commentPageSize.toString(),
        search: commentSearch,
        status: commentStatusFilter,
        sortBy: commentSortBy,
        sortOrder: commentSortOrder
      });
      
      const response = await fetch(`/api/comments?${params}`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      
      setComments(data || []);
      setCommentTotal(data.length || 0);
    } catch (error) {
      console.error('Error in fetchComments:', error);
      setCommentsError(error.message);
      toast.error('Failed to fetch comments: ' + error.message);
    } finally {
      setCommentsLoading(false);
    }
  }, [commentPage, commentPageSize, commentSearch, commentStatusFilter, commentSortBy, commentSortOrder]);

  const openCommentForm = useCallback((comment = null) => {
    setCurrentComment(comment);
    if (comment) {
      setCommentFormData({
        content: comment.content || '',
        author_name: comment.author_name || '',
        author_email: comment.author_email || '',
        post_id: comment.post_id || '',
        status: comment.status || 'pending'
      });
    } else {
      setCommentFormData({
        content: '',
        author_name: '',
        author_email: '',
        post_id: '',
        status: 'pending'
      });
    }
    setIsEditingComment(true);
  }, []);

  const closeCommentForm = useCallback(() => {
    setIsEditingComment(false);
    setCurrentComment(null);
  }, []);

  const handleCommentSubmit = useCallback(async (e, formData) => {
    e.preventDefault();
    try {
      const url = currentComment ? `/api/comments/${currentComment.id}` : '/api/comments';
      const method = currentComment ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save comment');
      }

      toast.success(currentComment ? 'Comment updated successfully!' : 'Comment created successfully!');
      fetchComments(); // Refresh the list
      closeCommentForm();
    } catch (error) {
      toast.error('Failed to save comment: ' + error.message);
      throw error;
    }
  }, [currentComment, fetchComments, closeCommentForm]);

  const handleDeleteComment = useCallback(async (id) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      const response = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete comment');
      toast.success('Comment deleted successfully!');
      fetchComments(); // Refresh the list
    } catch (error) {
      toast.error('Failed to delete comment: ' + error.message);
    }
  }, [fetchComments]);

  // Filter and sort handlers
  const handleSearchChange = useCallback((search) => {
    setCommentSearch(search);
    setCommentPage(1); // Reset to first page when searching
  }, []);

  const handleStatusFilterChange = useCallback((status) => {
    setCommentStatusFilter(status);
    setCommentPage(1); // Reset to first page when filtering
  }, []);

  const handleSortChange = useCallback((field, order) => {
    setCommentSortBy(field);
    setCommentSortOrder(order);
    setCommentPage(1); // Reset to first page when sorting
  }, []);

  const handlePageChange = useCallback((page) => {
    setCommentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((pageSize) => {
    setCommentPageSize(pageSize);
    setCommentPage(1); // Reset to first page when changing page size
  }, []);

  return {
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
  };
}