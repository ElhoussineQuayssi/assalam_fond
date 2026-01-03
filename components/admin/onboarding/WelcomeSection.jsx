"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  ArrowRight,
  BarChart3,
  FileText,
  Heart,
  Play,
  Users,
} from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export default function WelcomeSection({ admin, onComplete, onboardingData }) {
  const containerRef = useRef();
  const cardsRef = useRef([]);

  // Handle section completion
  const handleGetStarted = () => {
    onComplete({
      welcomeViewed: true,
      startTime: new Date().toISOString(),
    });
  };

  // Animation effects
  useGSAP(() => {
    // Title animation
    gsap.fromTo(
      ".welcome-title",
      {
        opacity: 0,
        y: -30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
      },
    );

    // Subtitle animation
    gsap.fromTo(
      ".welcome-subtitle",
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.3,
        ease: "power2.out",
      },
    );

    // Cards staggered animation
    gsap.fromTo(
      cardsRef.current,
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
        delay: 0.8,
        ease: "back.out(1.7)",
      },
    );

    // CTA button animation
    gsap.fromTo(
      ".cta-button",
      {
        opacity: 0,
        scale: 0.8,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        delay: 2,
        ease: "back.out(1.7)",
      },
    );
  }, []);

  const features = [
    {
      icon: Users,
      title: "Team Management",
      description:
        "Invite and manage admin team members with role-based access control.",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      icon: FileText,
      title: "Content Management",
      description:
        "Create and manage multilingual blog posts and project portfolios.",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      icon: Heart,
      title: "Impact Tracking",
      description:
        "Monitor and showcase the real-world impact of your projects.",
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/30",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Track engagement, monitor content performance, and analyze trends.",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
  ];

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="welcome-title">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Welcome to Your Admin Panel, {admin?.name?.split(" ")[0] || "Admin"}
            ! 👋
          </h2>
        </div>

        <div className="welcome-subtitle">
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            You're now part of a powerful platform designed to manage nonprofit
            projects, engage communities, and create lasting impact. Let's get
            you started on your journey.
          </p>
        </div>

        {/* Quick Video Intro */}
        <div className="mt-8">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Play className="h-6 w-6 text-white ml-1" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Quick Platform Overview
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Watch a 2-minute introduction to the admin panel features
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Watch Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card
              key={feature.title}
              ref={(el) => (cardsRef.current[index] = el)}
              className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${feature.bgColor}`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Mission Statement */}
      <Card className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-slate-200 dark:border-slate-600">
        <CardContent className="p-8 text-center">
          <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Our Mission
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            This platform empowers nonprofits and charities to amplify their
            impact through digital storytelling, community engagement, and
            transparent reporting. Every feature is designed to help you connect
            with supporters and drive meaningful change.
          </p>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center cta-button">
        <Button
          onClick={handleGetStarted}
          size="lg"
          className="px-8 py-3 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          Let's Get Started
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
          This will take about 10 minutes to complete
        </p>
      </div>
    </div>
  );
}
