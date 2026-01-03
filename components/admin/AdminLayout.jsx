"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { LogOut, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAdminContext } from "@/hooks/admin/useAdminContext";
import { useAdminNavigation } from "@/hooks/admin/useAdminNavigation";
import { useAuth } from "@/hooks/admin/useAuth";
import { useOnboarding } from "@/hooks/admin/useOnboarding";
import AdminList from "./admins/AdminList";
import AdminModal from "./admins/AdminModal";
import BlogManager from "./blogs/BlogManager";
import CommentManager from "./comments/CommentManager";
import DashboardOverview from "./dashboard/DashboardOverview";
import MessageManager from "./messages/MessageManager";
import OnboardingDashboard from "./onboarding/OnboardingDashboard";
import ProjectManager from "./projects/ProjectManager";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export default function AdminLayout({ children, isLoading = false }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { activeMenu, menuItems, handleMenuClick } = useAdminNavigation();
  const adminContext = useAdminContext();
  const { completed, isNewUser, loading: onboardingLoading } = useOnboarding();
  const { currentAdmin, logout } = useAuth();

  const sidebarRef = useRef();
  const menuRef = useRef();
  const contentRef = useRef();
  const menuItemRefs = useRef([]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Content rendering based on active menu
  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return (
          <DashboardOverview isDarkMode={isDarkMode} isLoading={isLoading} />
        );

      case "admins":
        return (
          <>
            <AdminList
              admins={adminContext.admins}
              loading={adminContext.adminsLoading}
              error={adminContext.adminsError}
              onRefresh={adminContext.fetchAdmins}
              onAddNew={adminContext.handleAddNewAdmin}
              onEdit={adminContext.handleEditAdmin}
              onDelete={adminContext.handleDeleteAdmin}
            />

            {/* Admin Modal */}
            <AdminModal
              isOpen={adminContext.isModalOpen}
              onClose={adminContext.closeModal}
              editingAdmin={adminContext.editingAdmin}
              showInvitation={adminContext.showInvitation}
              invitationLink={adminContext.invitationLink}
              formData={adminContext.formData}
              onFormDataChange={adminContext.setFormData}
              onSubmit={adminContext.handleSubmit}
              onCopyInvitation={adminContext.handleCopyInvitation}
              onBackFromInvitation={adminContext.handleBackFromInvitation}
            />
          </>
        );

      case "posts":
        return <BlogManager isDarkMode={isDarkMode} />;

      case "comments":
        return <CommentManager isDarkMode={isDarkMode} />;

      case "messages":
        return <MessageManager isDarkMode={isDarkMode} />;

      case "projects":
        return <ProjectManager isDarkMode={isDarkMode} />;

      default:
        return (
          <DashboardOverview isDarkMode={isDarkMode} isLoading={isLoading} />
        );
    }
  };

  const handleMenuClickWrapper = (id) => {
    if (id === activeMenu) return;

    // Content transition animation
    gsap.to(contentRef.current, {
      opacity: 0,
      x: -50,
      duration: 0.3,
      ease: "power2.inOut",
      onComplete: () => {
        handleMenuClick(id);
        gsap.fromTo(
          contentRef.current,
          {
            opacity: 0,
            x: 50,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.3,
            ease: "power2.inOut",
          },
        );
      },
    });
  };

  // Menu animation effect
  useEffect(() => {
    // Reset all menu items
    menuItemRefs.current.forEach((ref) => {
      if (ref) {
        gsap.to(ref, { scale: 1, boxShadow: "none", duration: 0.3 });
        const icon = ref.querySelector("svg");
        if (icon) gsap.to(icon, { rotation: 0, duration: 0.3 });
      }
    });
    // Animate active menu item
    const activeIndex = menuItems.findIndex((item) => item.id === activeMenu);
    if (menuItemRefs.current[activeIndex]) {
      gsap.to(menuItemRefs.current[activeIndex], {
        scale: 1.05,
        boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
        duration: 0.5,
        ease: "back.out(1.7)",
      });
      const icon = menuItemRefs.current[activeIndex].querySelector("svg");
      if (icon) {
        gsap.to(icon, { rotation: 360, duration: 0.5, ease: "power2.out" });
      }
    }
  }, [activeMenu, menuItems.findIndex]);

  // Theme effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Show onboarding for new users who haven't completed it
  if (!onboardingLoading && isNewUser && !completed) {
    return <OnboardingDashboard />;
  }

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "dark-mode-bg text-white" : "bg-slate-50"} font-['Inter','Plus_Jakarta_Sans',sans-serif]`}
    >
      {/* Top Bar */}
      <div
        className={`flex items-center justify-between px-6 py-4 border-b ${isDarkMode ? "dark-mode-topbar" : "bg-white border-slate-200"} shadow-sm dark-mode-separator`}
      >
        <div className="flex items-center space-x-6 flex-1">
          <div className="flex-1" />
        </div>
        <div className="flex items-center space-x-6">
          <Avatar>
            <AvatarImage src="/admin-avatar.jpg" alt="Admin" />
            <AvatarFallback className="bg-blue-500 text-white">
              {currentAdmin?.name?.charAt(0)?.toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              Welcome, {currentAdmin?.name || "Admin"}
            </span>
            <span className="text-xs text-slate-500 capitalize">
              {currentAdmin?.role?.replace("_", " ") || "Admin"}
            </span>
          </div>
          {/* Language switching removed from header — handled inside forms */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className={`flex items-center space-x-2 dark:bg-slate-800 ${isDarkMode ? "text-slate-400" : ""}`}
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span>{isDarkMode ? "Light" : "Dark"}</span>
          </Button>
          <Button
            variant="outline"
            onClick={logout}
            className={`flex items-center space-x-2 dark:bg-slate-800 ${isDarkMode ? "text-slate-400" : ""}`}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className={`w-64 shadow-xl border-r ${isDarkMode ? "dark-mode-sidebar" : "bg-white border-slate-200"}`}
        >
          <div
            className={`p-6 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
          >
            <h2
              className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}
            >
              Admin Panel
            </h2>
          </div>
          <nav ref={menuRef} className="mt-6 px-4">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  ref={(el) => (menuItemRefs.current[index] = el)}
                  variant="ghost"
                  className={`w-full justify-start mb-2 transition-colors duration-200 ${
                    activeMenu === item.id
                      ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
                      : "hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                  onClick={() => handleMenuClickWrapper(item.id)}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div ref={contentRef} className="flex-1 p-10 overflow-auto">
          <h1
            className={`text-3xl font-bold mb-8 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            {menuItems.find((item) => item.id === activeMenu)?.label ||
              "Dashboard"}
          </h1>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
