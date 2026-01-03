"use client";
import { createContext, useContext, useEffect, useState } from "react";

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [admins, setAdmins] = useState([]);
  const [adminsLoading, setAdminsLoading] = useState(false);
  const [adminsError, setAdminsError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [showInvitation, setShowInvitation] = useState(false);
  const [invitationLink, setInvitationLink] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "admin",
  });

  // Fetch admins function
  const fetchAdmins = async () => {
    setAdminsLoading(true);
    try {
      const response = await fetch("/api/admins");
      if (!response.ok) throw new Error("Failed to fetch admins");
      const data = await response.json();
      setAdmins(data);
      setAdminsError(null);
    } catch (error) {
      setAdminsError(error.message);
    } finally {
      setAdminsLoading(false);
    }
  };

  // Auto-fetch admins on component mount
  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // Handle form submission
  const handleSubmit = async (e, data) => {
    e.preventDefault();
    try {
      const url = editingAdmin
        ? `/api/admins/${editingAdmin.id}`
        : "/api/admins";
      const method = editingAdmin ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save admin");

      const result = await response.json();

      if (editingAdmin) {
        setAdmins(
          admins.map((admin) =>
            admin.id === editingAdmin.id ? { ...admin, ...data } : admin,
          ),
        );
      } else {
        setAdmins([...admins, result]);
        if (result.invitationLink) {
          setInvitationLink(result.invitationLink);
          setShowInvitation(true);
        }
      }

      return result;
    } catch (error) {
      setAdminsError(error.message);
      throw error;
    }
  };

  // Handle delete admin
  const handleDeleteAdmin = async (id) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;

    try {
      const response = await fetch(`/api/admins/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete admin");

      setAdmins(admins.filter((admin) => admin.id !== id));
    } catch (error) {
      setAdminsError(error.message);
    }
  };

  // Initialize form data
  const initializeFormData = (admin = null) => {
    if (admin) {
      setFormData({
        name: admin.name || "",
        email: admin.email || "",
        role: admin.role || "admin",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        role: "admin",
      });
    }
  };

  // Open modal
  const openModal = (admin = null) => {
    setEditingAdmin(admin);
    initializeFormData(admin);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAdmin(null);
    setShowInvitation(false);
    setInvitationLink("");
  };

  // Copy invitation to clipboard
  const copyInvitationToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Invitation link copied to clipboard!");
  };

  // Handle add new admin
  const handleAddNewAdmin = () => {
    openModal(null);
  };

  // Handle edit admin
  const handleEditAdmin = (admin) => {
    openModal(admin);
  };

  // Handle back from invitation
  const handleBackFromInvitation = () => {
    setShowInvitation(false);
  };

  // Handle copy invitation
  const handleCopyInvitation = () => {
    copyInvitationToClipboard(invitationLink);
  };

  // Initialize current user (placeholder - implement as needed)
  const initializeCurrentUser = () => {
    // Add logic to initialize current user if needed
  };

  const value = {
    // State
    admins,
    adminsLoading,
    adminsError,
    isModalOpen,
    editingAdmin,
    showInvitation,
    invitationLink,
    formData,

    // Actions
    fetchAdmins,
    handleSubmit,
    handleDeleteAdmin,
    initializeFormData,
    openModal,
    closeModal,
    copyInvitationToClipboard,
    handleAddNewAdmin,
    handleEditAdmin,
    handleBackFromInvitation,
    handleCopyInvitation,
    initializeCurrentUser,
    setFormData,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export function useAdminContext() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminContext must be used within an AdminProvider");
  }
  return context;
}
