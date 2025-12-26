"use client";
import AnalyticsMetrics from "./AnalyticsMetrics";
import AnalyticsCharts from "./AnalyticsCharts";
import AnalyticsSummary from "./AnalyticsSummary";

export default function AnalyticsOverview({ isDarkMode = false }) {
  return (
    <div className="space-y-8">
      <AnalyticsMetrics isDarkMode={isDarkMode} />
      <AnalyticsCharts isDarkMode={isDarkMode} />
      <AnalyticsSummary isDarkMode={isDarkMode} />
    </div>
  );
}
