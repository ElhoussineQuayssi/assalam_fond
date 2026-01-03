"use client";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

if (typeof window !== "undefined") {
  import("gsap");
}

export default function CommentForm({
  comment = null,
  formData = {},
  onSubmit,
  onCancel,
  isDarkMode = false,
}) {
  const [localFormData, setLocalFormData] = useState({
    content: "",
    name: "",
    email: "",
    post_id: "",
    status: "pending",
    ...formData,
  });

  const formRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e, localFormData);
  };

  const handleInputChange = useCallback((field, value) => {
    setLocalFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleStatusChange = useCallback(
    (value) => {
      handleInputChange("status", value);
    },
    [handleInputChange],
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {comment ? "Edit Comment" : "Add New Comment"}
        </h2>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      <Card
        ref={formRef}
        className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-slate-800 dark:border-slate-600"
      >
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="comment-author-name"
                  className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
                >
                  Author Name *
                </label>
                <Input
                  id="comment-author-name"
                  value={localFormData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="comment-author-email"
                  className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
                >
                  Author Email *
                </label>
                <Input
                  id="comment-author-email"
                  type="email"
                  value={localFormData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="comment-content"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
              >
                Comment Content *
              </label>
              <Textarea
                id="comment-content"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                rows={6}
                value={localFormData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="Write the comment content here..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="comment-post-id"
                  className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
                >
                  Related Post ID
                </label>
                <Input
                  id="comment-post-id"
                  value={localFormData.post_id}
                  onChange={(e) => handleInputChange("post_id", e.target.value)}
                  placeholder="Blog post ID (optional)"
                  disabled
                  className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="comment-status"
                  className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
                >
                  Status
                </label>
                <Select
                  value={localFormData.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {comment ? "Update Comment" : "Create Comment"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
