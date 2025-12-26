"use client";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export function useAdminData() {
  const [admins, setAdmins] = useState([]);
  const [adminsLoading, setAdminsLoading] = useState(false);
  const [adminsError, setAdminsError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', role: '' });

  const fetchAdmins = useCallback(async () => {
    setAdminsLoading(true);
    setAdminsError(null);
    try {
      const response = await fetch('/api/admins');
      if (!response.ok) throw new Error('Failed to fetch admins');
      const data = await response.json();
      setAdmins(data);
    } catch (error) {
      setAdminsError(error.message);
      toast.error('Failed to fetch admins: ' + error.message);
    } finally {
      setAdminsLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(async (e, data) => {
    e.preventDefault();
    try {
      const dataToSend = data.editingAdmin ? { ...data } : { ...data, created_by: currentUser?.id };
      if (!dataToSend.name || !dataToSend.role) {
        toast.error('Name and Role are required');
        return;
      }

      const url = data.editingAdmin ? `/api/admins/${data.editingAdmin.id}` : '/api/admins';
      const method = data.editingAdmin ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save admin');
      }

      const result = await response.json();

      if (data.editingAdmin) {
        await fetchAdmins(); // Refresh the list for edits
        toast.success('Admin updated successfully!');
      } else {
        // For new admin, show invitation link
        toast.success('Admin invitation created successfully!');
        setFormData({ name: '', role: '' });
      }
      
      return result;
    } catch (error) {
      toast.error('Error saving admin: ' + error.message);
      throw error;
    }
  }, [currentUser, fetchAdmins]);

  const handleDeleteAdmin = useCallback(async (id) => {
    if (!confirm('Are you sure you want to delete this admin?')) return;
    try {
      const response = await fetch(`/api/admins/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete admin');
      await fetchAdmins(); // Refresh the list
      toast.success('Admin deleted successfully!');
    } catch (error) {
      toast.error('Error deleting admin: ' + error.message);
    }
  }, [fetchAdmins]);

  const initializeFormData = useCallback((admin = null) => {
    if (admin) {
      setFormData({ name: admin.name || '', role: admin.role || '' });
    } else {
      setFormData({ name: '', role: '' });
    }
  }, []);

  const copyInvitationToClipboard = useCallback(async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Invitation link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy invitation link');
    }
  }, []);

  // Initialize current user
  const initializeCurrentUser = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  }, []);

  return {
    // State
    admins,
    adminsLoading,
    adminsError,
    currentUser,
    formData,
    
    // Actions
    fetchAdmins,
    handleSubmit,
    handleDeleteAdmin,
    initializeFormData,
    copyInvitationToClipboard,
    initializeCurrentUser,
    setFormData,
  };
}