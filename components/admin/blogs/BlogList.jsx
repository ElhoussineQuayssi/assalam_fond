"use client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BlogList({
  blogs = [],
  loading = false,
  error = null,
  // Sorting
  sortBy = "updated_at",
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
  onAddNew,
  onEdit,
  onDelete,
}) {
  const [_tableRowsRef, _setTableRowsRef] = useState([]);

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

  if (loading) {
    return (
      <Card className="rounded-lg border bg-white shadow-sm border-gray-200 dark:bg-[#1A1F2E] dark:shadow-none">
        <CardContent className="p-0">
          <div className="p-6 text-center">Loading blog posts...</div>
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
          Blog Posts Management
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <Button variant="outline" onClick={onRefresh} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={onAddNew}>
            Add New Post
          </Button>
        </div>
      </div>

      <Card className="rounded-lg border bg-white shadow-sm border-gray-200 dark:bg-[#1A1F2E] dark:shadow-none">
        <CardContent className="p-0">
          {blogs.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-slate-500 dark:text-slate-400">
                No blog posts found. Click "Add New Post" to create one.
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
                          onClick={() => handleSort("title")}
                        >
                          <span>Title</span>
                          {getSortIcon("title")}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                        <button
                          className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-slate-100"
                          onClick={() => handleSort("slug")}
                        >
                          <span>Slug</span>
                          {getSortIcon("slug")}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                        <button
                          className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-slate-100"
                          onClick={() => handleSort("category")}
                        >
                          <span>Category</span>
                          {getSortIcon("category")}
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
                          onClick={() => handleSort("views")}
                        >
                          <span>Views</span>
                          {getSortIcon("views")}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                        <button
                          className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-slate-100"
                          onClick={() => handleSort("published_at")}
                        >
                          <span>Published At</span>
                          {getSortIcon("published_at")}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                        <button
                          className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-slate-100"
                          onClick={() => handleSort("updated_at")}
                        >
                          <span>Updated At</span>
                          {getSortIcon("updated_at")}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-600">
                    {blogs.map((blog) => (
                      <tr
                        key={blog.id}
                        className="hover:bg-gray-50 dark:hover:bg-slate-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {blog.title.length > 25
                            ? `${blog.title.substring(0, 25)}...`
                            : blog.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                          {blog.slug.length > 25
                            ? `${blog.slug.substring(0, 25)}...`
                            : blog.slug}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                          {blog.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              blog.status === "published"
                                ? "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400"
                            }`}
                          >
                            {blog.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                          {blog.views}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                          {blog.published_at
                            ? new Date(blog.published_at).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                          {new Date(blog.updated_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit(blog)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => onDelete(blog.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
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
                        onPageSizeChange(parseInt(value, 10))
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
