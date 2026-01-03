"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  Clock,
  FileText,
  Globe,
  Image,
  Link,
  MessageSquare,
  Phone,
  Plus,
  Settings,
  Star,
  Users,
} from "lucide-react";
import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/admin/useAuth";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export default function QuickStartCards({ admin, onComplete, onboardingData }) {
  const [completedActions, setCompletedActions] = useState(
    onboardingData?.quickStartCompleted || {},
  );
  const [currentAction, setCurrentAction] = useState(null);
  const cardsRef = useRef([]);
  const progressRef = useRef();

  const { currentAdmin } = useAuth();

  const quickStartActions = [
    {
      id: "create_project",
      title: "Create Your First Project",
      description:
        "Set up a project to showcase your organization's work and impact.",
      icon: Plus,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      estimatedTime: "5 min",
      difficulty: "Easy",
      action: () => handleActionClick("create_project"),
    },
    {
      id: "write_blog_post",
      title: "Write a Welcome Blog Post",
      description:
        "Share your organization's story and mission with your audience.",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      estimatedTime: "8 min",
      difficulty: "Medium",
      action: () => handleActionClick("write_blog_post"),
    },
    {
      id: "invite_team",
      title: "Invite Team Members",
      description: "Bring your colleagues on board to help manage content.",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      estimatedTime: "3 min",
      difficulty: "Easy",
      action: () => handleActionClick("invite_team"),
    },
    {
      id: "explore_analytics",
      title: "Explore Analytics",
      description: "Learn how to track engagement and measure your impact.",
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      estimatedTime: "4 min",
      difficulty: "Easy",
      action: () => handleActionClick("explore_analytics"),
    },
    {
      id: "customize_settings",
      title: "Customize Your Settings",
      description: "Set up your preferences and personalize your experience.",
      icon: Settings,
      color: "text-slate-600",
      bgColor: "bg-slate-100 dark:bg-slate-700",
      estimatedTime: "6 min",
      difficulty: "Easy",
      action: () => handleActionClick("customize_settings"),
    },
    {
      id: "review_messages",
      title: "Review Contact Messages",
      description:
        "Learn how to respond to inquiries and manage communications.",
      icon: Settings,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      estimatedTime: "4 min",
      difficulty: "Easy",
      action: () => handleActionClick("review_messages"),
    },
    {
      id: "setup_media_links",
      title: "Setup Media Links",
      description:
        "Configure your social media profiles and external website links.",
      icon: Link,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
      estimatedTime: "3 min",
      difficulty: "Easy",
      action: () => handleActionClick("setup_media_links"),
    },
    {
      id: "configure_contact_info",
      title: "Configure Contact Information",
      description:
        "Set up your organization's contact details and location information.",
      icon: Phone,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
      estimatedTime: "5 min",
      difficulty: "Easy",
      action: () => handleActionClick("configure_contact_info"),
    },
    {
      id: "upload_gallery_images",
      title: "Upload Gallery Images",
      description:
        "Add photos and images to showcase your projects and impact.",
      icon: Image,
      color: "text-pink-600",
      bgColor: "bg-pink-100 dark:bg-pink-900/30",
      estimatedTime: "7 min",
      difficulty: "Easy",
      action: () => handleActionClick("upload_gallery_images"),
    },
    {
      id: "setup_multilingual",
      title: "Set up Multilingual Content",
      description: "Configure language settings to reach a global audience.",
      icon: Globe,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      estimatedTime: "6 min",
      difficulty: "Medium",
      action: () => handleActionClick("setup_multilingual"),
    },
    {
      id: "create_testimonials",
      title: "Create Testimonials",
      description:
        "Add client feedback and success stories to build credibility.",
      icon: MessageSquare,
      color: "text-amber-600",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      estimatedTime: "8 min",
      difficulty: "Easy",
      action: () => handleActionClick("create_testimonials"),
    },
  ];

  // Filter actions based on user role
  const filteredActions = quickStartActions.filter((action) => {
    if (!currentAdmin?.role) return true; // Show all if no role defined

    switch (currentAdmin.role) {
      case "messages_manager":
        // Show only messages and comments related tasks
        return ["review_messages"].includes(action.id);
      case "content_manager":
        // Show only projects and blogs related tasks
        return ["create_project", "write_blog_post"].includes(action.id);
      default:
        // Show all actions for super admin and fallback
        return true;
    }
  });

  // Handle action clicks
  const handleActionClick = (actionId) => {
    setCurrentAction(actionId);

    // Simulate action completion (in real implementation, this would navigate to the actual feature)
    setTimeout(() => {
      const newCompletedActions = {
        ...completedActions,
        [actionId]: true,
      };
      setCompletedActions(newCompletedActions);

      // Check if all filtered actions are completed
      const allCompleted = filteredActions.every(
        (action) => newCompletedActions[action.id],
      );

      if (allCompleted) {
        onComplete({
          quickStartCompleted: newCompletedActions,
          allActionsCompleted: true,
        });
      }

      setCurrentAction(null);
    }, 2000); // Simulate 2-second action
  };

  // Calculate progress based on filtered actions
  const completedCount = filteredActions.filter(
    (action) => completedActions[action.id],
  ).length;
  const totalActions = filteredActions.length;
  const progressPercentage =
    totalActions > 0 ? (completedCount / totalActions) * 100 : 0;

  // Animation effects
  useGSAP(() => {
    // Cards staggered animation
    gsap.fromTo(
      cardsRef.current,
      {
        opacity: 0,
        y: 30,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)",
      },
    );

    // Progress bar animation
    gsap.fromTo(
      progressRef.current,
      { width: "0%" },
      {
        width: `${progressPercentage}%`,
        duration: 1,
        ease: "power2.out",
        delay: 0.5,
      },
    );
  }, [progressPercentage]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Hard":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          Quick Start Guide
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Complete these essential tasks to get your admin panel ready for
          action. Each task is designed to help you understand key features and
          set up your workspace.
        </p>

        {/* Progress Overview */}
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Progress
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {completedCount} of {totalActions} completed
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
              <div
                ref={progressRef}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{ width: "0%" }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredActions.map((action, index) => {
          const Icon = action.icon;
          const isCompleted = completedActions[action.id];
          const isInProgress = currentAction === action.id;

          return (
            <Card
              key={action.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className={`relative transition-all duration-300 hover:shadow-lg ${
                isCompleted
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                  : "hover:scale-105 cursor-pointer"
              }`}
              onClick={!isCompleted ? action.action : undefined}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div
                    className={`p-3 rounded-lg ${action.bgColor} ${
                      isCompleted ? "bg-green-100 dark:bg-green-900/30" : ""
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <Icon className={`h-6 w-6 ${action.color}`} />
                    )}
                  </div>
                  {isCompleted && (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      ✓ Done
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {action.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {action.estimatedTime}
                    </span>
                  </div>
                  <Badge
                    className={`text-xs ${getDifficultyColor(action.difficulty)}`}
                  >
                    {action.difficulty}
                  </Badge>
                </div>

                <Button
                  className={`w-full ${
                    isCompleted
                      ? "bg-green-600 hover:bg-green-700"
                      : isInProgress
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  disabled={isCompleted || isInProgress}
                  onClick={!isCompleted ? action.action : undefined}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completed
                    </>
                  ) : isInProgress ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      In Progress...
                    </>
                  ) : (
                    <>
                      Start Task
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Completion Message */}
      {completedCount === totalActions && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Excellent Work! 🎉
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
              You've completed all the essential setup tasks. You're now ready
              to explore the advanced features of your admin panel.
            </p>
            <Button
              onClick={() =>
                onComplete({
                  quickStartCompleted: completedActions,
                  allActionsCompleted: true,
                })
              }
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              Continue to Feature Exploration
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tips Section */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Star className="h-6 w-6 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                Pro Tips
              </h4>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li>
                  • You can always return to these tasks from the help menu
                </li>
                <li>
                  • Take your time - there's no rush to complete everything at
                  once
                </li>
                <li>• Each task includes helpful guidance and examples</li>
                <li>
                  • Don't hesitate to explore and experiment with features
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
