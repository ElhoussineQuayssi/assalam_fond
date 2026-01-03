"use client";
import { Calendar, Mail, MessageSquare, Phone, Tag, User } from "lucide-react";
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

export default function MessageView({ message, onClose, isDarkMode = false }) {
  const [status, setStatus] = useState(message?.status || "unread");
  const [isUpdating, setIsUpdating] = useState(false);

  if (!message) return null;

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/messages/${message.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update message status");
      }

      toast.success("Message status updated successfully!");
      // Update the message object with the new status
      message.status = status;
    } catch (error) {
      toast.error(`Failed to update message status: ${error.message}`);
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
      case "replied":
        return "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400";
      case "read":
        return "bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400";
    }
  };

  const getTypeColor = (_type) => {
    return "bg-gray-100 text-gray-800 dark:bg-gray-500/10 dark:text-gray-400";
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Message Details
        </h2>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className="space-y-6">
        {/* Contact Information Card */}
        <Card className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-slate-800 dark:border-slate-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Contact Information
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
                    {message.first_name && message.last_name
                      ? `${message.first_name} ${message.last_name}`
                      : message.name || "Not provided"}
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
                    {message.email || "Not provided"}
                  </p>
                </div>
              </div>

              {message.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500 dark:text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                      Phone
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {message.phone}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-500 dark:text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    Received
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {formatDate(message.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Message Details Card */}
        <Card className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-slate-800 dark:border-slate-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5" />
              Message Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Subject */}
            {message.subject && (
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">
                  Subject
                </p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {message.subject}
                </p>
              </div>
            )}

            {/* Status and Type */}
            <div className="flex flex-wrap gap-2">
              <Badge className={getStatusColor(message.status)}>
                Status: {message.status || "unread"}
              </Badge>
              {message.type && (
                <Badge className={getTypeColor(message.type)}>
                  <Tag className="h-3 w-3 mr-1" />
                  {message.type}
                </Badge>
              )}
            </div>

            <Separator className="dark:bg-slate-600" />

            {/* Message Content */}
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">
                Message
              </p>
              <div className="bg-gray-50 dark:bg-slate-700 rounded-md p-4">
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {message.message || "No message content"}
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
                  htmlFor="message-status"
                  className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
                >
                  Message Status
                </label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="replied">Replied</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleStatusUpdate}
                disabled={isUpdating || status === message.status}
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
