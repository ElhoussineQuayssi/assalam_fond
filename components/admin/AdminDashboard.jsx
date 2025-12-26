"use client";
import { useState, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import AdminLayout from "./AdminLayout";
import { AdminProvider } from "@/hooks/admin/useAdminContext";

import { useAdminTheme } from "@/hooks/admin/useAdminTheme";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  // Custom hooks
  const { isDarkMode } = useAdminTheme();

  // Initialize loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AdminProvider>
      <AdminLayout isLoading={isLoading} />
    </AdminProvider>
  );
}
