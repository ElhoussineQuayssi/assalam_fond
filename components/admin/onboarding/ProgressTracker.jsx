"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CheckCircle, Circle, Clock } from "lucide-react";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export default function ProgressTracker({
  progress,
  completedSections = {},
  currentSection,
}) {
  const progressRef = useRef();

  // Define onboarding steps
  const steps = [
    {
      id: "welcome",
      title: "Welcome",
      description: "Introduction to the platform",
      estimatedTime: "2 min",
    },
    {
      id: "quickstart",
      title: "Quick Start",
      description: "Complete essential setup tasks",
      estimatedTime: "15 min",
    },
    {
      id: "features",
      title: "Explore Features",
      description: "Discover platform capabilities",
      estimatedTime: "10 min",
    },
    {
      id: "complete",
      title: "Get Started",
      description: "Ready to use the admin panel",
      estimatedTime: "1 min",
    },
  ];

  // Calculate progress for each step
  const getStepProgress = (stepId) => {
    const stepIndex = steps.findIndex((s) => s.id === stepId);
    if (completedSections[stepId]) return 100;
    if (stepIndex < steps.findIndex((s) => s.id === currentSection)) return 100;
    if (stepId === currentSection)
      return Math.max(0, progress - stepIndex * 25);
    return 0;
  };

  // Get step status
  const getStepStatus = (stepId) => {
    if (completedSections[stepId]) return "completed";
    if (stepId === currentSection) return "current";
    const currentIndex = steps.findIndex((s) => s.id === currentSection);
    const stepIndex = steps.findIndex((s) => s.id === stepId);
    if (stepIndex < currentIndex) return "completed";
    return "pending";
  };

  // Animation effects
  useGSAP(() => {
    // Animate progress bars
    const progressBars = progressRef.current?.querySelectorAll(".progress-bar");
    progressBars?.forEach((bar, index) => {
      const stepId = steps[index].id;
      const stepProgress = getStepProgress(stepId);

      gsap.fromTo(
        bar,
        { width: "0%" },
        {
          width: `${stepProgress}%`,
          duration: 1,
          delay: index * 0.2,
          ease: "power2.out",
        },
      );
    });
  }, [progress, completedSections, currentSection]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6" ref={progressRef}>
        <div className="space-y-6">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            const stepProgress = getStepProgress(step.id);

            return (
              <div key={step.id} className="relative">
                {/* Step connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-slate-200 dark:bg-slate-700 -z-10" />
                )}

                <div className="flex items-start space-x-4">
                  {/* Step indicator */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        status === "completed"
                          ? "bg-green-100 dark:bg-green-900/30"
                          : status === "current"
                            ? "bg-blue-100 dark:bg-blue-900/30"
                            : "bg-slate-100 dark:bg-slate-700"
                      }`}
                    >
                      {status === "completed" ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : status === "current" ? (
                        <div className="w-6 h-6 rounded-full bg-blue-600 animate-pulse" />
                      ) : (
                        <Circle className="h-6 w-6 text-slate-400 dark:text-slate-500" />
                      )}
                    </div>
                  </div>

                  {/* Step content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4
                        className={`font-semibold ${
                          status === "completed"
                            ? "text-green-900 dark:text-green-100"
                            : status === "current"
                              ? "text-blue-900 dark:text-blue-100"
                              : "text-slate-900 dark:text-slate-100"
                        }`}
                      >
                        {step.title}
                      </h4>
                      <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                        <Clock className="h-4 w-4" />
                        <span>{step.estimatedTime}</span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      {step.description}
                    </p>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className={`progress-bar h-2 rounded-full transition-all duration-300 ${
                          status === "completed"
                            ? "bg-green-500"
                            : status === "current"
                              ? "bg-blue-500"
                              : "bg-slate-300 dark:bg-slate-600"
                        }`}
                        style={{ width: "0%" }}
                      />
                    </div>

                    {/* Status text */}
                    <div className="mt-2 text-xs">
                      {status === "completed" && (
                        <span className="text-green-600 dark:text-green-400">
                          ✓ Completed
                        </span>
                      )}
                      {status === "current" && (
                        <span className="text-blue-600 dark:text-blue-400">
                          In Progress - {Math.round(stepProgress)}%
                        </span>
                      )}
                      {status === "pending" && (
                        <span className="text-slate-500 dark:text-slate-400">
                          Not Started
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Overall progress summary */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-slate-900 dark:text-white">
              Overall Progress
            </h4>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between mt-2 text-sm text-slate-500 dark:text-slate-400">
            <span>Getting Started</span>
            <span>Ready to Use Admin Panel</span>
          </div>
        </div>

        {/* Motivational message */}
        <div className="mt-6 text-center">
          {progress < 25 && (
            <p className="text-slate-600 dark:text-slate-400">
              🚀 Let's start your admin journey! Complete the welcome section to
              begin.
            </p>
          )}
          {progress >= 25 && progress < 75 && (
            <p className="text-slate-600 dark:text-slate-400">
              💪 Great progress! You're building a strong foundation for
              managing your nonprofit.
            </p>
          )}
          {progress >= 75 && progress < 100 && (
            <p className="text-slate-600 dark:text-slate-400">
              🎯 Almost there! Just a few more steps to unlock your full admin
              capabilities.
            </p>
          )}
          {progress === 100 && (
            <p className="text-green-600 dark:text-green-400 font-semibold">
              🎉 Congratulations! You're now ready to create amazing impact with
              your admin panel.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
