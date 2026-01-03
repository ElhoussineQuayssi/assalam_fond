"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminProvider } from "@/hooks/admin/useAdminContext";
import { useAdminTheme } from "@/hooks/admin/useAdminTheme";
import { AuthProvider, useAuth } from "@/hooks/admin/useAuth";
import AdminLayout from "./AdminLayout";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

function AdminDashboardContent() {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  // Custom hooks
  const { isDarkMode } = useAdminTheme();

  // Check authentication
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/en/admin/login");
      return;
    }
  }, [isAuthenticated, authLoading, router]);

  // Initialize loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Show loading while checking auth
  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminProvider>
      <AdminLayout isLoading={isLoading} />
    </AdminProvider>
  );
}

export default function AdminDashboard() {
  return (
    <AuthProvider>
      <AdminDashboardContent />
    </AuthProvider>
  );
}
