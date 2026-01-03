"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  BarChart3,
  ChevronRight,
  Eye,
  FileText,
  Folder,
  Globe,
  MessageCircle,
  Palette,
  Play,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export default function FeatureShowcase({ admin, onComplete, onboardingData }) {
  const [_activeFeature, setActiveFeature] = useState(null);
  const featuresRef = useRef([]);
  const showcaseRef = useRef();

  // Feature categories
  const featureCategories = [
    {
      id: "content",
      title: "Content Management",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      features: [
        {
          title: "Multilingual Blog Posts",
          description:
            "Create and manage blog content in English, French, and Arabic with automatic translation support.",
          icon: Globe,
          highlight: "3 Languages Supported",
        },
        {
          title: "Advanced Project Editor",
          description:
            "Build rich project pages with 8 different content blocks including timelines, statistics, and media galleries.",
          icon: Folder,
          highlight: "8 Content Block Types",
        },
        {
          title: "Content Scheduling",
          description:
            "Schedule posts for future publication and manage content workflow with draft/published states.",
          icon: Zap,
          highlight: "Automated Publishing",
        },
      ],
    },
    {
      id: "team",
      title: "Team & Collaboration",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      features: [
        {
          title: "Admin User Management",
          description:
            "Invite team members, manage permissions, and track admin activities with comprehensive audit logs.",
          icon: Shield,
          highlight: "Role-Based Access",
        },
        {
          title: "Content Collaboration",
          description:
            "Multiple admins can work together with clear attribution and version history for all content.",
          icon: Users,
          highlight: "Team Workflow",
        },
        {
          title: "Activity Monitoring",
          description:
            "Track who made what changes and when, ensuring accountability and transparency.",
          icon: Eye,
          highlight: "Complete Audit Trail",
        },
      ],
    },
    {
      id: "analytics",
      title: "Analytics & Insights",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      features: [
        {
          title: "Real-Time Metrics",
          description:
            "Monitor visitor engagement, content performance, and user interactions with live dashboards.",
          icon: BarChart3,
          highlight: "Live Data Updates",
        },
        {
          title: "Impact Tracking",
          description:
            "Measure the real-world impact of your projects with customizable metrics and goal tracking.",
          icon: Zap,
          highlight: "Impact Measurement",
        },
        {
          title: "Performance Analytics",
          description:
            "Understand what content resonates with your audience through detailed engagement analytics.",
          icon: Eye,
          highlight: "Audience Insights",
        },
      ],
    },
    {
      id: "communication",
      title: "Communication Tools",
      icon: MessageCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      features: [
        {
          title: "Contact Form Management",
          description:
            "Handle inquiries, donations, and volunteer applications through an integrated contact system.",
          icon: MessageCircle,
          highlight: "Automated Responses",
        },
        {
          title: "Comment Moderation",
          description:
            "Manage blog comments with approval workflows and spam protection.",
          icon: Shield,
          highlight: "Smart Moderation",
        },
        {
          title: "Notification System",
          description:
            "Stay informed about important activities with customizable email and in-app notifications.",
          icon: Zap,
          highlight: "Instant Alerts",
        },
      ],
    },
  ];

  // Handle feature exploration
  const handleExploreFeature = (featureId) => {
    setActiveFeature(featureId);
    // In a real implementation, this might open a modal or navigate to a demo
  };

  // Handle completion
  const handleCompleteExploration = () => {
    onComplete({
      featuresExplored: true,
      explorationTime: new Date().toISOString(),
    });
  };

  // Animation effects
  useGSAP(() => {
    // Category cards animation
    gsap.fromTo(
      featuresRef.current,
      {
        opacity: 0,
        y: 40,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
      },
    );

    // Showcase area animation
    gsap.fromTo(
      showcaseRef.current,
      {
        opacity: 0,
        x: 50,
      },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        delay: 0.5,
        ease: "power2.out",
      },
    );
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          Explore Your Admin Panel
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
          Discover the powerful features designed to help you manage your
          nonprofit's digital presence. Each category includes tools tailored
          for charitable organizations and impact-driven work.
        </p>
      </div>

      {/* Feature Categories */}
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {featureCategories.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex items-center space-x-2"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{category.title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {featureCategories.map((category, categoryIndex) => (
          <TabsContent
            key={category.id}
            value={category.id}
            className="space-y-6"
          >
            {/* Category Header */}
            <Card className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${category.bgColor}`}>
                    <category.icon className={`h-8 w-8 ${category.color}`} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {category.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Powerful tools designed for nonprofit success
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.features.map((feature, featureIndex) => {
                const FeatureIcon = feature.icon;

                return (
                  <Card
                    key={`${category.id}-${featureIndex}`}
                    ref={(el) => {
                      if (!featuresRef.current[categoryIndex]) {
                        featuresRef.current[categoryIndex] = [];
                      }
                      featuresRef.current[categoryIndex][featureIndex] = el;
                    }}
                    className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
                    onClick={() =>
                      handleExploreFeature(`${category.id}-${featureIndex}`)
                    }
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                          <FeatureIcon className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600" />
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          {feature.highlight}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        {feature.description}
                      </p>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Try It Out
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Interactive Showcase Area */}
      <Card
        ref={showcaseRef}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800"
      >
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-blue-600" />
            <span>Live Feature Demo</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900 dark:text-white">
                Try These Features Live
              </h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Create a Sample Blog Post
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Folder className="h-4 w-4 mr-2" />
                  Build a Project Showcase
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Send an Admin Invitation
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics Dashboard
                </Button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Interactive demo area</p>
                <p className="text-sm">Click any feature above to try it out</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardContent className="p-6">
            <Palette className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
              Nonprofit Focused
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Designed specifically for charities and impact organizations
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <Globe className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
              Multilingual Ready
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Full support for English, French, and Arabic content
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <Zap className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
              Easy to Use
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Intuitive interface with powerful automation features
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Completion Section */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Ready to Start Creating Impact?
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
            You've explored the powerful features of your admin panel. Now it's
            time to put them to work for your organization's mission. Remember,
            you can always return to this showcase from the help menu.
          </p>
          <Button
            onClick={handleCompleteExploration}
            size="lg"
            className="bg-green-600 hover:bg-green-700"
          >
            I'm Ready to Get Started!
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
