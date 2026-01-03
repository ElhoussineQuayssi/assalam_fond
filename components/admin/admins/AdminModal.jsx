"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminModal({
  isOpen,
  onClose,
  editingAdmin = null,
  showInvitation = false,
  invitationLink = "",
  formData = { name: "", role: "" },
  onFormDataChange,
  onSubmit,
  onCopyInvitation,
  onBackFromInvitation,
}) {
  const [localFormData, setLocalFormData] = useState(formData);

  // Keep local form data in sync with props
  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e, localFormData);
  };

  const handleInputChange = (field, value) => {
    const newData = { ...localFormData, [field]: value };
    setLocalFormData(newData);
    onFormDataChange?.(newData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">
          {showInvitation
            ? "Invitation Created"
            : editingAdmin
              ? "Edit Admin"
              : "Add New Admin"}
        </h3>

        {showInvitation ? (
          <div>
            <p className="mb-4 text-sm text-gray-600">
              Invitation link for <strong>{localFormData.name}</strong> has been
              generated. Share this link:
            </p>
            <div className="mb-4">
              <Input value={invitationLink} readOnly className="pr-20" />
              <Button className="ml-2" onClick={onCopyInvitation}>
                Copy
              </Button>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onBackFromInvitation}
              >
                Back
              </Button>
              <Button type="button" onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <Input
                id="name"
                value={localFormData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Role
              </label>
              <Select
                value={localFormData.role}
                onValueChange={(value) => handleInputChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="content_manager">
                    Content Manager
                  </SelectItem>
                  <SelectItem value="messages_manager">
                    Messages Manager
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {editingAdmin ? "Update" : "Create Invitation"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
