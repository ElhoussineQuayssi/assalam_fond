"use client";
import {
  FileText,
  Folder,
  Home,
  Mail,
  MessageCircle,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useAuth } from "./useAuth";

export function useAdminNavigation() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const { currentAdmin } = useAuth();

  const allMenuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      roles: ["super_admin", "content_manager", "messages_manager"],
    },
    { id: "admins", label: "Admins", icon: Users, roles: ["super_admin"] },
    {
      id: "posts",
      label: "Blog Posts",
      icon: FileText,
      roles: ["super_admin", "content_manager"],
    },
    {
      id: "comments",
      label: "Comments",
      icon: MessageCircle,
      roles: ["super_admin", "messages_manager"],
    },
    {
      id: "messages",
      label: "Messages",
      icon: Mail,
      roles: ["super_admin", "messages_manager"],
    },
    {
      id: "projects",
      label: "Projects",
      icon: Folder,
      roles: ["super_admin", "content_manager"],
    },
  ];

  const menuItems = useMemo(() => {
    if (!currentAdmin?.role) return allMenuItems;

    return allMenuItems.filter((item) =>
      item.roles.includes(currentAdmin.role),
    );
  }, [currentAdmin?.role, allMenuItems]);

  const handleMenuClick = (id) => {
    if (id !== activeMenu) {
      setActiveMenu(id);
    }
  };

  const getActiveMenuItem = () => {
    return menuItems.find((item) => item.id === activeMenu) || menuItems[0];
  };

  const getMenuItemById = (id) => {
    return menuItems.find((item) => item.id === id);
  };

  return {
    activeMenu,
    menuItems,
    setActiveMenu,
    handleMenuClick,
    getActiveMenuItem,
    getMenuItemById,
  };
}
