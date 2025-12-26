"use client";
import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

if (typeof window !== "undefined") {
  import("gsap");
}

export default function MessageForm({ 
  message = null, 
  formData = {},
  onSubmit,
  onCancel,
  isDarkMode = false 
}) {
  const [localFormData, setLocalFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    message: '',
    type: 'inquiry',
    status: 'unread',
    ...formData
  });

  const formRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e, localFormData);
  };

  const handleInputChange = (field, value) => {
    setLocalFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {message ? 'View Message' : 'Message Details'}
        </h2>
        <Button variant="outline" onClick={onCancel}>Close</Button>
      </div>

      <Card ref={formRef} className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-slate-800 dark:border-slate-600">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information (Read-only) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  First Name
                </label>
                <Input
                  value={localFormData.first_name}
                  readOnly
                  className="dark:bg-slate-700 dark:border-slate-600 dark:text-white bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Last Name
                </label>
                <Input
                  value={localFormData.last_name}
                  readOnly
                  className="dark:bg-slate-700 dark:border-slate-600 dark:text-white bg-gray-50"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Phone
                </label>
                <Input
                  value={localFormData.phone}
                  readOnly
                  className="dark:bg-slate-700 dark:border-slate-600 dark:text-white bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <Input
                  value={localFormData.email}
                  readOnly
                  className="dark:bg-slate-700 dark:border-slate-600 dark:text-white bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Message Type
              </label>
              <Input
                value={localFormData.type}
                readOnly
                className="dark:bg-slate-700 dark:border-slate-600 dark:text-white bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Message Content
              </label>
              <Textarea
                value={localFormData.message}
                readOnly
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white bg-gray-50"
              />
            </div>

            {/* Status Update Section */}
            <div className="border-t pt-6 dark:border-slate-600">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Message Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="message-status" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    Update Status
                  </label>
                  <Select value={localFormData.status} onValueChange={(value) => handleInputChange('status', value)}>
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
                <div>
                  <label htmlFor="message-type" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    Message Type
                  </label>
                  <Select value={localFormData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger className="dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inquiry">Inquiry</SelectItem>
                      <SelectItem value="volunteer">Volunteer</SelectItem>
                      <SelectItem value="donation">Donation</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Close
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Update Status
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}