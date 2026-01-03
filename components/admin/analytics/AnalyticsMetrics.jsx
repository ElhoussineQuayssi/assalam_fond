"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsMetrics({
  isDarkMode = false,
  period = "30d",
}) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/analytics/overview?period=${period}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setMetrics(result.data.metrics);
        } else {
          throw new Error(result.error || "Failed to fetch metrics");
        }
      } catch (err) {
        console.error("Error fetching analytics metrics:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [period]);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatGrowthRate = (rate) => {
    const formatted = Math.abs(rate).toFixed(1);
    const sign = rate >= 0 ? "+" : "-";
    return `${sign}${formatted}%`;
  };

  const getChangeType = (rate) => {
    return rate >= 0 ? "positive" : "negative";
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <Card
            key={index}
            className={`shadow-lg ${isDarkMode ? "bg-slate-800 border-slate-600" : "bg-white border-slate-200"}`}
          >
            <CardHeader className="pb-2">
              <div
                className={`h-4 bg-gray-200 rounded animate-pulse ${isDarkMode ? "bg-slate-700" : ""}`}
              ></div>
            </CardHeader>
            <CardContent>
              <div
                className={`h-8 bg-gray-200 rounded animate-pulse mb-2 ${isDarkMode ? "bg-slate-700" : ""}`}
              ></div>
              <div
                className={`h-3 bg-gray-200 rounded animate-pulse w-2/3 ${isDarkMode ? "bg-slate-700" : ""}`}
              ></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`p-4 rounded-lg border border-red-200 bg-red-50 ${isDarkMode ? "bg-red-900/20 border-red-800" : ""}`}
      >
        <p className={`text-red-600 ${isDarkMode ? "text-red-400" : ""}`}>
          Error loading metrics: {error}
        </p>
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  const metricsData = [
    {
      title: "Total Content",
      value: formatNumber(metrics.totalContent.value),
      change: formatGrowthRate(metrics.totalContent.growthRate),
      changeType: getChangeType(metrics.totalContent.growthRate),
      period: "from previous period",
    },
    {
      title: "Total Engagement",
      value: formatNumber(metrics.totalEngagement.value),
      change: formatGrowthRate(metrics.totalEngagement.growthRate),
      changeType: getChangeType(metrics.totalEngagement.growthRate),
      period: "from previous period",
    },
    {
      title: "Total Projects",
      value: formatNumber(metrics.totalProjects.value),
      change: formatGrowthRate(metrics.totalProjects.growthRate),
      changeType: getChangeType(metrics.totalProjects.growthRate),
      period: "from previous period",
    },
    {
      title: "Blog Posts",
      value: formatNumber(metrics.totalBlogPosts.value),
      change: formatGrowthRate(metrics.totalBlogPosts.growthRate),
      changeType: getChangeType(metrics.totalBlogPosts.growthRate),
      period: "from previous period",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metricsData.map((metric, _index) => (
        <Card
          key={metric.title}
          className={`shadow-lg transition-all duration-200 hover:shadow-xl ${isDarkMode ? "bg-slate-800 border-slate-600" : "bg-white border-slate-200"}`}
        >
          <CardHeader className="pb-2">
            <CardTitle
              className={`text-sm font-medium ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}
            >
              {metric.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
            >
              {metric.value}
            </div>
            <p
              className={`text-xs flex items-center gap-1 ${
                metric.changeType === "positive"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <span>{metric.change}</span>
              <span>{metric.period}</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
