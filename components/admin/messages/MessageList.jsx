"use client";
import { useState } from "react";
import { ChevronUp, ChevronDown, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MessageList({
  messages = [],
  loading = false,
  error = null,
  // Sorting
  sortBy = "created_at",
  sortOrder = "desc",
  onSortChange,
  // Pagination
  page = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
  onPageSizeChange,
  // Actions
  onRefresh,
  onView,
  onDelete,
}) {
  const [tableRowsRef, setTableRowsRef] = useState([]);

  const handleSort = (field) => {
    if (sortBy === field) {
      onSortChange(field, sortOrder === "asc" ? "desc" : "asc");
    } else {
      onSortChange(field, "desc");
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const getTotalPages = () => Math.ceil(total / pageSize);

  // Helper function to safely get message subject with fallback
  const getMessageSubject = (message) => {
    return message?.subject || "No subject";
  };

  // Helper function to safely truncate subject text
  const getTruncatedSubject = (message) => {
    const subject = getMessageSubject(message);
    if (!subject || typeof subject !== "string") {
      return "No subject";
    }
    return subject.length > 40 ? subject.substring(0, 40) + "..." : subject;
  };

  // Helper function to safely get message status with fallback
  const getMessageStatus = (message) => {
    return message?.status || "unread";
  };

  // Helper function to safely get message name with fallback
  const getMessageName = (message) => {
    return message?.name || "Unknown";
  };

  // Helper function to safely get message email with fallback
  const getMessageEmail = (message) => {
    return message?.email || "No email";
  };

  if (loading) {
    return (
      <Card className="rounded-lg border bg-white shadow-sm border-gray-200 dark:bg-[#1A1F2E] dark:shadow-none">
        <CardContent className="p-0">
          <div className="p-6 text-center">Loading messages...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-400">
          Contact Messages Management
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <Button variant="outline" onClick={onRefresh} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </div>

      <Card className="rounded-lg border bg-white shadow-sm border-gray-200 dark:bg-[#1A1F2E] dark:shadow-none">
        <CardContent className="p-0">
          {messages.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-slate-500 dark:text-slate-400">
                No messages found.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                        <button
                          className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-slate-100"
                          onClick={() => handleSort("name")}
                        >
                          <span>Name</span>
                          {getSortIcon("name")}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                        <button
                          className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-slate-100"
                          onClick={() => handleSort("email")}
                        >
                          <span>Email</span>
                          {getSortIcon("email")}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                        <button
                          className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-slate-100"
                          onClick={() => handleSort("subject")}
                        >
                          <span>Subject</span>
                          {getSortIcon("subject")}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                        <button
                          className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-slate-100"
                          onClick={() => handleSort("status")}
                        >
                          <span>Status</span>
                          {getSortIcon("status")}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                        <button
                          className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-slate-100"
                          onClick={() => handleSort("created_at")}
                        >
                          <span>Received</span>
                          {getSortIcon("created_at")}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-600">
                    {(Array.isArray(messages) ? messages : []).map(
                      (message) => {
                        // Ensure message is an object
                        if (!message || typeof message !== "object") {
                          console.warn("Invalid message object:", message);
                          return null;
                        }

                        // Debug logging to identify undefined subject issue
                        if (
                          typeof window !== "undefined" &&
                          process.env.NODE_ENV === "development"
                        ) {
                          console.log("Message object:", message);
                          console.log("Message subject:", message?.subject);
                          console.log(
                            "Message subject type:",
                            typeof message?.subject,
                          );
                        }

                        return (
                          <tr
                            key={message.id || message.email || Math.random()}
                            className="hover:bg-gray-50 dark:hover:bg-slate-700"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {getMessageName(message)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                              {getMessageEmail(message)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-300">
                              <div
                                className="max-w-xs truncate"
                                title={getMessageSubject(message)}
                              >
                                {getTruncatedSubject(message)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  getMessageStatus(message) === "replied"
                                    ? "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400"
                                    : getMessageStatus(message) === "read"
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400"
                                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400"
                                }`}
                              >
                                {getMessageStatus(message)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                              {message?.created_at
                                ? new Date(
                                    message.created_at,
                                  ).toLocaleDateString()
                                : "Unknown date"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onView(message)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() =>
                                    onDelete(
                                      message?.id ||
                                        message?.email ||
                                        Math.random(),
                                    )
                                  }
                                  disabled={!message?.id && !message?.email}
                                >
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      },
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700 dark:text-slate-300">
                      Show
                    </span>
                    <Select
                      value={pageSize.toString()}
                      onValueChange={(value) =>
                        onPageSizeChange(parseInt(value))
                      }
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-gray-700 dark:text-slate-300">
                      per page
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(Math.max(1, page - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-700 dark:text-slate-300">
                      Page {page} of {getTotalPages()}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(page + 1)}
                      disabled={page >= getTotalPages()}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
