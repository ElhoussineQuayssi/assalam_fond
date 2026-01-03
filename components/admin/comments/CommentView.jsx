"use client";
import { Calendar, FileText, Mail, MessageSquare, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function CommentView({ comment, onClose, isDarkMode = false }) {
  const [status, setStatus] = useState(comment?.status || "pending");
  const [isUpdating, setIsUpdating] = useState(false);

  if (!comment) return null;

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update comment status");
      }

      toast.success("Comment status updated successfully!");
      // Update the comment object with the new status
      comment.status = status;
    } catch (error) {
      toast.error(`Failed to update comment status: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Comment Details
        </h2>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className="space-y-6">
        {/* Author Information Card */}
        <Card className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-slate-800 dark:border-slate-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Author Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-500 dark:text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    Name
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {comment.author_name || comment.name || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500 dark:text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    Email
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {comment.author_email || comment.email || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-gray-500 dark:text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    Post ID
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {comment.post_id || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-500 dark:text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    Submitted
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {formatDate(comment.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comment Content Card */}
        <Card className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-slate-800 dark:border-slate-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5" />
              Comment Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status */}
            <div className="flex flex-wrap gap-2">
              <Badge className={getStatusColor(comment.status)}>
                Status: {comment.status || "pending"}
              </Badge>
            </div>

            <Separator className="dark:bg-slate-600" />

            {/* Comment Content */}
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">
                Comment
              </p>
              <div className="bg-gray-50 dark:bg-slate-700 rounded-md p-4">
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {comment.content || "No comment content"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Update Card */}
        <Card className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-slate-800 dark:border-slate-600">
          <CardHeader>
            <CardTitle className="text-lg">Update Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="comment-status"
                  className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
                >
                  Comment Status
                </label>
                <Select value={status} onValueChange={setStatus}>
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

            <div className="flex justify-end">
              <Button
                onClick={handleStatusUpdate}
                disabled={isUpdating || status === comment.status}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isUpdating ? "Updating..." : "Update Status"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
