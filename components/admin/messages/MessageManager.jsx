"use client";
import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import MessageFilters from "./MessageFilters";
import MessageList from "./MessageList";
import MessageForm from "./MessageForm";

import { useMessagesData } from "@/hooks/admin/useMessagesData";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export default function MessageManager({ isDarkMode = false }) {
  const {
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
  } = useMessagesData();

  const tableRef = useRef();
  const formRef = useRef();

  // Fetch messages when component mounts and when dependencies change
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Animation effects
  useGSAP(() => {
    if (!isEditingMessage && tableRef.current) {
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
  }, [isEditingMessage]);

  const openMessageFormWithAnimation = (message = null) => {
    // Animate table down and form up
    if (tableRef.current) {
      gsap.to(tableRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          openMessageForm(message);
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
      openMessageForm(message);
    }
  };

  const closeMessageFormWithAnimation = () => {
    // Animate form down and table up
    if (formRef.current) {
      gsap.to(formRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          closeMessageForm();
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
      closeMessageForm();
    }
  };

  const handleSubmit = (e, formData) => {
    handleMessageSubmit(e, formData);
    // Note: closeMessageFormWithAnimation will be called by the success handler in useMessagesData
  };

  return (
    <>
      {!isEditingMessage ? (
        <>
          <MessageFilters
            search={messageSearch}
            statusFilter={messageStatusFilter}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusFilterChange}
          />

          <div ref={tableRef}>
            <MessageList
              messages={messages}
              loading={messagesLoading}
              error={messagesError}
              sortBy={messageSortBy}
              sortOrder={messageSortOrder}
              onSortChange={handleSortChange}
              page={messagePage}
              pageSize={messagePageSize}
              total={messageTotal}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onRefresh={fetchMessages}
              onView={(message) => openMessageFormWithAnimation(message)}
              onDelete={handleDeleteMessage}
            />
          </div>
        </>
      ) : (
        <div ref={formRef}>
          <MessageForm
            message={currentMessage}
            formData={messageFormData}
            onSubmit={handleSubmit}
            onCancel={closeMessageFormWithAnimation}
            isDarkMode={isDarkMode}
          />
        </div>
      )}
    </>
  );
}