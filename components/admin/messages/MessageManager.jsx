"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { useMessagesData } from "@/hooks/admin/useMessagesData";
import MessageFilters from "./MessageFilters";
import MessageForm from "./MessageForm";
import MessageList from "./MessageList";
import MessageView from "./MessageView";

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
    isViewingMessage,
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
    openMessageView,
    closeMessageView,
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
  const viewRef = useRef();

  // Fetch messages when component mounts and when dependencies change
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Animation effects
  useGSAP(() => {
    if (!isEditingMessage && !isViewingMessage && tableRef.current) {
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
  }, [isEditingMessage, isViewingMessage]);

  const _openMessageFormWithAnimation = (message = null) => {
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
      closeMessageForm();
    }
  };

  const openMessageViewWithAnimation = (message) => {
    // Animate table down and view up
    if (tableRef.current) {
      gsap.to(tableRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          openMessageView(message);
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
      openMessageView(message);
    }
  };

  const closeMessageViewWithAnimation = () => {
    // Animate view down and table up
    if (viewRef.current) {
      gsap.to(viewRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          closeMessageView();
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
      closeMessageView();
    }
  };

  const handleSubmit = (e, formData) => {
    handleMessageSubmit(e, formData);
    // Note: closeMessageFormWithAnimation will be called by the success handler in useMessagesData
  };

  return (
    <>
      {!isEditingMessage && !isViewingMessage ? (
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
              onView={(message) => openMessageViewWithAnimation(message)}
              onDelete={handleDeleteMessage}
            />
          </div>
        </>
      ) : isViewingMessage ? (
        <div ref={viewRef}>
          <MessageView
            message={currentMessage}
            onClose={closeMessageViewWithAnimation}
            isDarkMode={isDarkMode}
          />
        </div>
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
