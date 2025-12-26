"use client";
import { useState } from "react";
import { Home, Users, FileText, Folder, MessageCircle, Mail } from "lucide-react";

export function useAdminNavigation() {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'admins', label: 'Admins', icon: Users },
    { id: 'posts', label: 'Blog Posts', icon: FileText },
    { id: 'comments', label: 'Comments', icon: MessageCircle },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'projects', label: 'Projects', icon: Folder },
  ];

  const handleMenuClick = (id) => {
    if (id !== activeMenu) {
      setActiveMenu(id);
    }
  };

  const getActiveMenuItem = () => {
    return menuItems.find(item => item.id === activeMenu) || menuItems[0];
  };

  const getMenuItemById = (id) => {
    return menuItems.find(item => item.id === id);
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
