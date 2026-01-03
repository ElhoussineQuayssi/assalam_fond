"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table } from "@/components/ui/table";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export default function DashboardOverview({ isDarkMode = false }) {
  const cardsRef = useRef([]);
  const countersRef = useRef([]);
  const tableRowsRef = useRef([]);

  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState({
    counts: {
      totalProjects: 0,
      totalBlogPosts: 0,
      totalComments: 0,
      totalMessages: 0,
      totalAdmins: 0,
      totalProjectImages: 0,
    },
    recentActivities: [],
    dailyActivity: [],
    summary: {
      totalItems: 0,
      activeContent: 0,
      userInteractions: 0,
    },
  });

  // Fetch dashboard metrics
  const fetchMetrics = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/dashboard/metrics");
      if (!response.ok) {
        throw new Error(`Failed to fetch metrics: ${response.statusText}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch dashboard metrics");
      }

      setMetrics(result.data);
    } catch (err) {
      console.error("Error fetching dashboard metrics:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  // Counter animation function
  const animateCounter = (element, target) => {
    gsap.fromTo(
      element,
      { innerText: 0 },
      {
        innerText: target,
        duration: 2,
        ease: "power2.out",
        snap: { innerText: 1 },
        onUpdate: () => {
          element.innerText = Math.floor(
            gsap.getProperty(element, "innerText"),
          );
        },
      },
    );
  };

  // Animation effect for dashboard content
  useGSAP(() => {
    if (!isLoading && !error) {
      // Cards entrance animation
      gsap.fromTo(
        cardsRef.current,
        {
          scale: 0.8,
          opacity: 0,
          y: 30,
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          delay: 0.8,
          ease: "back.out(1.7)",
        },
      );

      // Animate counters
      const counts = [
        metrics.counts.totalProjects,
        metrics.counts.totalBlogPosts,
        metrics.counts.totalComments,
        metrics.counts.totalMessages,
        metrics.counts.totalAdmins,
        metrics.counts.totalProjectImages,
      ];
      countersRef.current.forEach((counter, index) => {
        if (counter && counts[index] !== undefined) {
          setTimeout(
            () => animateCounter(counter, counts[index]),
            1200 + index * 200,
          );
        }
      });

      // Table rows staggered entrance
      gsap.fromTo(
        tableRowsRef.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          delay: 1.5,
          ease: "power2.out",
        },
      );
    }
  }, [isLoading, error, metrics]);

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 p-8">
        <AlertCircle
          className={`h-12 w-12 mb-4 ${isDarkMode ? "text-red-400" : "text-red-500"}`}
        />
        <h3
          className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}
        >
          Failed to load dashboard data
        </h3>
        <p
          className={`text-sm text-center mb-4 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
        >
          {error}
        </p>
        <Button onClick={fetchMetrics} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            className={`shadow-lg ${isDarkMode ? "dark-mode-card" : "bg-white border-slate-200"}`}
          >
            <CardHeader>
              <div
                className={`h-4 bg-slate-300 rounded animate-pulse ${isDarkMode ? "bg-slate-600" : ""}`}
              ></div>
            </CardHeader>
            <CardContent>
              <div
                className={`h-8 bg-slate-300 rounded animate-pulse mb-2 ${isDarkMode ? "bg-slate-600" : ""}`}
              ></div>
              <div
                className={`h-6 bg-slate-300 rounded animate-pulse ${isDarkMode ? "bg-slate-600" : ""}`}
              ></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Dashboard Header with Refresh Button */}
      <div className="flex justify-between items-center mb-6">
        <h2
          className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}
        >
          Dashboard Overview
        </h2>
        <Button
          onClick={fetchMetrics}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card
          ref={(el) => (cardsRef.current[0] = el)}
          className={`shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer ${isDarkMode ? "bg-slate-800 border-slate-600" : "bg-white border-slate-200"}`}
          onMouseEnter={(e) =>
            gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2 })
          }
          onMouseLeave={(e) =>
            gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })
          }
        >
          <CardHeader>
            <CardTitle
              className={`text-lg ${isDarkMode ? "text-white" : "text-slate-700"}`}
            >
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              ref={(el) => (countersRef.current[0] = el)}
              className={`text-4xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}
            >
              {metrics.counts.totalProjects}
            </p>
            <div className="h-8">
              <div
                className={`w-full h-0.5 mt-2 ${isDarkMode ? "bg-white" : "bg-black"}`}
              ></div>
              <p
                className={`text-xs mt-3 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                All projects in system
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          ref={(el) => (cardsRef.current[1] = el)}
          className={`shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer ${isDarkMode ? "bg-slate-800 border-slate-600" : "bg-white border-slate-200"}`}
          onMouseEnter={(e) =>
            gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2 })
          }
          onMouseLeave={(e) =>
            gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })
          }
        >
          <CardHeader>
            <CardTitle
              className={`text-lg ${isDarkMode ? "text-white" : "text-slate-700"}`}
            >
              Blog Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              ref={(el) => (countersRef.current[1] = el)}
              className={`text-4xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}
            >
              {metrics.counts.totalBlogPosts}
            </p>
            <div className="h-8">
              <div
                className={`w-full h-0.5 mt-2 ${isDarkMode ? "bg-white" : "bg-black"}`}
              ></div>
              <p
                className={`text-xs mt-3 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                Published blog posts
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          ref={(el) => (cardsRef.current[2] = el)}
          className={`shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer ${isDarkMode ? "bg-slate-800 border-slate-600" : "bg-white border-slate-200"}`}
          onMouseEnter={(e) =>
            gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2 })
          }
          onMouseLeave={(e) =>
            gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })
          }
        >
          <CardHeader>
            <CardTitle
              className={`text-lg ${isDarkMode ? "text-white" : "text-slate-700"}`}
            >
              Comments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              ref={(el) => (countersRef.current[2] = el)}
              className={`text-4xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}
            >
              {metrics.counts.totalComments}
            </p>
            <div className="h-8">
              <div
                className={`w-full h-0.5 mt-2 ${isDarkMode ? "bg-white" : "bg-black"}`}
              ></div>
              <p
                className={`text-xs mt-3 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                Total comments
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          ref={(el) => (cardsRef.current[3] = el)}
          className={`shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer ${isDarkMode ? "bg-slate-800 border-slate-600" : "bg-white border-slate-200"}`}
          onMouseEnter={(e) =>
            gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2 })
          }
          onMouseLeave={(e) =>
            gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })
          }
        >
          <CardHeader>
            <CardTitle
              className={`text-lg ${isDarkMode ? "text-white" : "text-slate-700"}`}
            >
              Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              ref={(el) => (countersRef.current[3] = el)}
              className={`text-4xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}
            >
              {metrics.counts.totalMessages}
            </p>
            <div className="h-8">
              <div
                className={`w-full h-0.5 mt-2 ${isDarkMode ? "bg-white" : "bg-black"}`}
              ></div>
              <p
                className={`text-xs mt-3 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                Contact messages
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          ref={(el) => (cardsRef.current[4] = el)}
          className={`shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer ${isDarkMode ? "bg-slate-800 border-slate-600" : "bg-white border-slate-200"}`}
          onMouseEnter={(e) =>
            gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2 })
          }
          onMouseLeave={(e) =>
            gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })
          }
        >
          <CardHeader>
            <CardTitle
              className={`text-lg ${isDarkMode ? "text-white" : "text-slate-700"}`}
            >
              Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              ref={(el) => (countersRef.current[4] = el)}
              className={`text-4xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}
            >
              {metrics.counts.totalAdmins}
            </p>
            <div className="h-8">
              <div
                className={`w-full h-0.5 mt-2 ${isDarkMode ? "bg-white" : "bg-black"}`}
              ></div>
              <p
                className={`text-xs mt-3 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                System administrators
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          ref={(el) => (cardsRef.current[5] = el)}
          className={`shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer ${isDarkMode ? "bg-slate-800 border-slate-600" : "bg-white border-slate-200"}`}
          onMouseEnter={(e) =>
            gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2 })
          }
          onMouseLeave={(e) =>
            gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })
          }
        >
          <CardHeader>
            <CardTitle
              className={`text-lg ${isDarkMode ? "text-white" : "text-slate-700"}`}
            >
              Project Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              ref={(el) => (countersRef.current[5] = el)}
              className={`text-4xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}
            >
              {metrics.counts.totalProjectImages}
            </p>
            <div className="h-8">
              <div
                className={`w-full h-0.5 mt-2 ${isDarkMode ? "bg-white" : "bg-black"}`}
              ></div>
              <p
                className={`text-xs mt-3 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                Gallery images
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities Table */}
      <Card
        className={`rounded-lg shadow-lg border ${isDarkMode ? "bg-slate-800 border-slate-600" : "bg-white border-slate-200"}`}
      >
        <CardHeader>
          <CardTitle
            className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-slate-800"}`}
          >
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table
            columns={[
              { key: "activity", label: "Activity" },
              { key: "user", label: "User" },
              { key: "time", label: "Time" },
              {
                key: "status",
                label: "Status",
                render: (row) => {
                  const statusConfig = {
                    Success: {
                      bg: "bg-emerald-100 dark:bg-emerald-500/10",
                      text: "text-emerald-800 dark:text-emerald-400",
                    },
                    Pending: {
                      bg: "bg-blue-100 dark:bg-blue-500/10",
                      text: "text-blue-800 dark:text-blue-400",
                    },
                    Review: {
                      bg: "bg-amber-100 dark:bg-amber-500/10",
                      text: "text-amber-800 dark:text-amber-400",
                    },
                  };
                  const config =
                    statusConfig[row.status] || statusConfig.Review;
                  return (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
                    >
                      {row.status}
                    </span>
                  );
                },
              },
            ]}
            data={
              metrics.recentActivities.length > 0
                ? metrics.recentActivities
                : [
                    {
                      activity: "No recent activities",
                      user: "System",
                      time: "N/A",
                      status: "Review",
                    },
                  ]
            }
            rowRefs={tableRowsRef}
          />
        </CardContent>
      </Card>
    </>
  );
}
