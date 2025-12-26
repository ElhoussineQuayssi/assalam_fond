"use client";
import { useState, useCallback } from "react";
import { toast } from "sonner";

export function useMessagesData() {
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  
  // Message management (read-only for most fields, but we can update status)
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [messageFormData, setMessageFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    status: 'unread'
  });

  // Filters and pagination
  const [messageSearch, setMessageSearch] = useState('');
  const [messageStatusFilter, setMessageStatusFilter] = useState('all');
  const [messageSortBy, setMessageSortBy] = useState('created_at');
  const [messageSortOrder, setMessageSortOrder] = useState('desc');
  const [messagePage, setMessagePage] = useState(1);
  const [messagePageSize, setMessagePageSize] = useState(10);
  const [messageTotal, setMessageTotal] = useState(0);

  const fetchMessages = useCallback(async () => {
    setMessagesLoading(true);
    setMessagesError(null);
    try {
      const params = new URLSearchParams({
        page: messagePage.toString(),
        limit: messagePageSize.toString(),
        search: messageSearch,
        status: messageStatusFilter,
        sortBy: messageSortBy,
        sortOrder: messageSortOrder
      });
      
      const response = await fetch(`/api/messages?${params}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      
      // Debug logging to check API response structure
      console.log('API Response data:', data);
      console.log('API Response data type:', typeof data);
      console.log('API Response data length:', data?.length);
      if (data && data.length > 0) {
        console.log('First message object:', data[0]);
        console.log('First message subject:', data[0]?.subject);
      }
      
      // Ensure data is an array
      const messagesArray = Array.isArray(data) ? data : [];
      setMessages(messagesArray);
      setMessageTotal(messagesArray.length);
    } catch (error) {
      console.error('Error in fetchMessages:', error);
      setMessagesError(error.message);
      toast.error('Failed to fetch messages: ' + error.message);
    } finally {
      setMessagesLoading(false);
    }
  }, [messagePage, messagePageSize, messageSearch, messageStatusFilter, messageSortBy, messageSortOrder]);

  const openMessageForm = useCallback((message = null) => {
    setCurrentMessage(message);
    if (message) {
      setMessageFormData({
        name: message.name || '',
        email: message.email || '',
        subject: message.subject || '',
        message: message.message || '',
        status: message.status || 'unread'
      });
    } else {
      setMessageFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        status: 'unread'
      });
    }
    setIsEditingMessage(true);
  }, []);

  const closeMessageForm = useCallback(() => {
    setIsEditingMessage(false);
    setCurrentMessage(null);
  }, []);

  const handleMessageSubmit = useCallback(async (e, formData) => {
    e.preventDefault();
    try {
      // For messages, we can only update the status field
      const updateData = {
        status: formData.status
      };

      const url = currentMessage ? `/api/messages/${currentMessage.id}` : '/api/messages';
      const method = currentMessage ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update message');
      }

      toast.success('Message status updated successfully!');
      fetchMessages(); // Refresh the list
      closeMessageForm();
    } catch (error) {
      toast.error('Failed to update message: ' + error.message);
      throw error;
    }
  }, [currentMessage, fetchMessages, closeMessageForm]);

  const handleDeleteMessage = useCallback(async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const response = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete message');
      toast.success('Message deleted successfully!');
      fetchMessages(); // Refresh the list
    } catch (error) {
      toast.error('Failed to delete message: ' + error.message);
    }
  }, [fetchMessages]);

  // Filter and sort handlers
  const handleSearchChange = useCallback((search) => {
    setMessageSearch(search);
    setMessagePage(1); // Reset to first page when searching
  }, []);

  const handleStatusFilterChange = useCallback((status) => {
    setMessageStatusFilter(status);
    setMessagePage(1); // Reset to first page when filtering
  }, []);

  const handleSortChange = useCallback((field, order) => {
    setMessageSortBy(field);
    setMessageSortOrder(order);
    setMessagePage(1); // Reset to first page when sorting
  }, []);

  const handlePageChange = useCallback((page) => {
    setMessagePage(page);
  }, []);

  const handlePageSizeChange = useCallback((pageSize) => {
    setMessagePageSize(pageSize);
    setMessagePage(1); // Reset to first page when changing page size
  }, []);

  return {
    // State
    messages,
    messagesLoading,
    messagesError,
    isEditingMessage,
    currentMessage,
    messageFormData,
    
    // Filters and pagination
    messageSearch,
    messageStatusFilter,
    messageSortBy,
    messageSortOrder,
    messagePage,
    messagePageSize,
    messageTotal,
    
    // Actions
    fetchMessages,
    openMessageForm,
    closeMessageForm,
    handleMessageSubmit,
    handleDeleteMessage,
    
    // Filter handlers
    handleSearchChange,
    handleStatusFilterChange,
    handleSortChange,
    handlePageChange,
    handlePageSizeChange,
    
    // Form data handler
    setMessageFormData,
  };
}