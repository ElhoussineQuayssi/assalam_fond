"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const AuthContext = createContext();

const supabase = createClient();

export function AuthProvider({ children }) {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await loadAdminData(session.user.id);
      } else {
        setCurrentAdmin(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [checkUser, loadAdminData]);

  const checkUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        await loadAdminData(session.user.id);
      }
    } catch (error) {
      console.error("Error checking auth session:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAdminData = async (userId) => {
    try {
      const { data: adminData, error } = await supabase
        .from("admins")
        .select("*")
        .eq("id", userId)
        .single();

      if (error || !adminData) {
        console.error("Admin not found in database:", error);
        await supabase.auth.signOut();
        setCurrentAdmin(null);
        return;
      }

      setCurrentAdmin(adminData);
    } catch (error) {
      console.error("Error loading admin data:", error);
      setCurrentAdmin(null);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      // First authenticate with Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) throw authError;

      // Then check if user is an admin
      const { data: adminData, error: adminError } = await supabase
        .from("admins")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (adminError || !adminData) {
        // Not an admin, sign out
        await supabase.auth.signOut();
        throw new Error("Access denied. Admin privileges required.");
      }

      setCurrentAdmin(adminData);
      return { success: true };
    } catch (error) {
      setCurrentAdmin(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setCurrentAdmin(null);
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentAdmin,
    loading,
    login,
    logout,
    isAuthenticated: !!currentAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
