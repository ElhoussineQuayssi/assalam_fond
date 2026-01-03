"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight, CheckCircle, SkipForward, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOnboarding } from "@/hooks/admin/useOnboarding";
import FeatureShowcase from "./FeatureShowcase";
import QuickStartCards from "./QuickStartCards";
import WelcomeSection from "./WelcomeSection";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export default function OnboardingDashboard() {
  const {
    completed,
    step,
    data,
    admin,
    loading,
    error,
    completeOnboarding,
    updateProgress,
    skipOnboarding,
    progressPercentage,
  } = useOnboarding();

  const [currentSection, setCurrentSection] = useState(0);
  const containerRef = useRef();
  const progressRef = useRef();

  // Sections configuration
  const sections = [
    {
      id: "welcome",
      title: "Welcome",
      component: WelcomeSection,
      progressWeight: 10,
    },
    {
      id: "quickstart",
      title: "Quick Start",
      component: QuickStartCards,
      progressWeight: 40,
    },
    {
      id: "features",
      title: "Explore Features",
      component: FeatureShowcase,
      progressWeight: 30,
    },
    {
      id: "complete",
      title: "Ready to Go!",
      component: () => <CompletionSection onComplete={completeOnboarding} />,
      progressWeight: 20,
    },
  ];

  // Handle section completion
  const handleSectionComplete = async (sectionId, sectionData = {}) => {
    const sectionIndex = sections.findIndex((s) => s.id === sectionId);
    const newStep = Math.min((sectionIndex + 1) * (100 / sections.length), 100);

    await updateProgress(newStep, {
      completedSections: {
        ...data.completedSections,
        [sectionId]: true,
        ...sectionData,
      },
    });

    // Move to next section or stay on current if it's the last
    if (sectionIndex < sections.length - 1) {
      setCurrentSection(sectionIndex + 1);
    }
  };

  // Handle section navigation
  const navigateToSection = (sectionIndex) => {
    setCurrentSection(sectionIndex);
  };

  // Animation effects
  useGSAP(() => {
    if (!loading) {
      // Container entrance animation
      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0,
          y: 30,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
        },
      );

      // Progress bar animation
      gsap.fromTo(
        progressRef.current,
        { width: "0%" },
        {
          width: `${progressPercentage}%`,
          duration: 1.5,
          ease: "power2.out",
          delay: 0.5,
        },
      );
    }
  }, [loading, progressPercentage]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            Loading your personalized onboarding experience...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Something went wrong</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const CurrentSectionComponent = sections[currentSection].component;

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
    >
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Welcome to Admin Panel
                </h1>
              </div>
              {admin && (
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Hello, {admin.name}!
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={skipOnboarding}
                className="text-slate-600 hover:text-slate-900 dark:text-slate-400"
              >
                <SkipForward className="h-4 w-4 mr-2" />
                Skip Onboarding
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Onboarding Progress
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {progressPercentage}% Complete
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div
                ref={progressRef}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: "0%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Section Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Getting Started</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sections.map((section, index) => {
                  const isCompleted = data.completedSections?.[section.id];
                  const isCurrent = index === currentSection;

                  return (
                    <button
                      key={section.id}
                      onClick={() => navigateToSection(index)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                        isCurrent
                          ? "bg-blue-100 dark:bg-blue-900/50 border border-blue-300 dark:border-blue-600"
                          : isCompleted
                            ? "bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50"
                            : "hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                            isCompleted
                              ? "bg-green-500 text-white"
                              : isCurrent
                                ? "bg-blue-500 text-white"
                                : "bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <span className="text-xs font-medium">
                              {index + 1}
                            </span>
                          )}
                        </div>
                        <div>
                          <p
                            className={`text-sm font-medium ${
                              isCurrent
                                ? "text-blue-900 dark:text-blue-100"
                                : isCompleted
                                  ? "text-green-900 dark:text-green-100"
                                  : "text-slate-900 dark:text-slate-100"
                            }`}
                          >
                            {section.title}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Section Content */}
          <div className="lg:col-span-3">
            <CurrentSectionComponent
              admin={admin}
              onComplete={(data) =>
                handleSectionComplete(sections[currentSection].id, data)
              }
              onboardingData={data}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Completion Section Component
function CompletionSection({ onComplete }) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <CardTitle className="text-2xl">You're All Set!</CardTitle>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          You've completed the onboarding process and are ready to start
          managing your content.
        </p>
      </CardHeader>
      <CardContent className="text-center">
        <Button onClick={onComplete} size="lg" className="px-8">
          Enter Admin Panel
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
          You can always return to this onboarding experience from the help
          menu.
        </p>
      </CardContent>
    </Card>
  );
}
