"use client";
import { useState, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AnalyticsCharts({ isDarkMode = false }) {
  const chartRef = useRef();
  const barsRef = useRef([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('30d');
  const [chartType, setChartType] = useState('all');

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/analytics/charts?period=${period}&chartType=${chartType}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          setChartData(result.data);
        } else {
          throw new Error(result.error || 'Failed to fetch chart data');
        }
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [period, chartType]);

  // Chart.js configuration for dark/light mode
  const getChartOptions = (type) => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: isDarkMode ? '#e2e8f0' : '#374151',
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
          titleColor: isDarkMode ? '#e2e8f0' : '#374151',
          bodyColor: isDarkMode ? '#e2e8f0' : '#374151',
          borderColor: isDarkMode ? '#334155' : '#e5e7eb',
          borderWidth: 1
        }
      },
      scales: type !== 'doughnut' ? {
        x: {
          ticks: {
            color: isDarkMode ? '#94a3b8' : '#6b7280'
          },
          grid: {
            color: isDarkMode ? '#334155' : '#e5e7eb'
          }
        },
        y: {
          ticks: {
            color: isDarkMode ? '#94a3b8' : '#6b7280'
          },
          grid: {
            color: isDarkMode ? '#334155' : '#e5e7eb'
          }
        }
      } : {}
    };

    return baseOptions;
  };

  // Prepare line chart data for time series
  const getLineChartData = () => {
    if (!chartData?.timeSeries) return null;

    return {
      labels: chartData.timeSeries.labels,
      datasets: [
        {
          label: 'Projects',
          data: chartData.timeSeries.datasets.projects,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.1,
        },
        {
          label: 'Blog Posts',
          data: chartData.timeSeries.datasets.blogPosts,
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.1,
        },
        {
          label: 'Comments',
          data: chartData.timeSeries.datasets.comments,
          borderColor: 'rgb(245, 158, 11)',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.1,
        },
        {
          label: 'Messages',
          data: chartData.timeSeries.datasets.messages,
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.1,
        }
      ]
    };
  };

  // Prepare bar chart data
  const getBarChartData = () => {
    if (!chartData?.timeSeries) return null;

    return {
      labels: chartData.timeSeries.labels,
      datasets: [
        {
          label: 'Total Activity',
          data: chartData.timeSeries.datasets.total,
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1,
        }
      ]
    };
  };

  // Prepare doughnut chart data for categories
  const getDoughnutChartData = () => {
    if (!chartData?.categories) return null;

    const colors = [
      'rgba(59, 130, 246, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(239, 68, 68, 0.8)',
      'rgba(139, 92, 246, 0.8)',
      'rgba(236, 72, 153, 0.8)',
    ];

    return {
      labels: chartData.categories.labels,
      datasets: [
        {
          data: chartData.categories.values,
          backgroundColor: colors,
          borderColor: colors.map(color => color.replace('0.8', '1')),
          borderWidth: 2,
        }
      ]
    };
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {[...Array(2)].map((_, index) => (
          <Card key={index} className={`shadow-lg ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-200'}`}>
            <CardHeader>
              <div className={`h-6 bg-gray-200 rounded animate-pulse ${isDarkMode ? 'bg-slate-700' : ''}`}></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <Loader2 className={`h-8 w-8 animate-spin ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 rounded-lg border border-red-200 bg-red-50 ${isDarkMode ? 'bg-red-900/20 border-red-800' : ''}`}>
        <p className={`text-red-600 ${isDarkMode ? 'text-red-400' : ''}`}>
          Error loading charts: {error}
        </p>
      </div>
    );
  }

  if (!chartData) {
    return null;
  }

  return (
    <div ref={chartRef} className="space-y-6 mb-8">
      {/* Controls */}
      <div className="flex gap-4 items-center">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className={`w-32 ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-200'}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 Days</SelectItem>
            <SelectItem value="30d">30 Days</SelectItem>
            <SelectItem value="3m">3 Months</SelectItem>
            <SelectItem value="1y">1 Year</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={chartType} onValueChange={setChartType}>
          <SelectTrigger className={`w-32 ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-200'}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Charts</SelectItem>
            <SelectItem value="time-series">Time Series</SelectItem>
            <SelectItem value="categories">Categories</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Series Line Chart */}
        {(chartType === 'all' || chartType === 'time-series') && (
          <Card className={`shadow-lg ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-200'}`}>
            <CardHeader>
              <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Activity Trends - {chartData.period}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Line data={getLineChartData()} options={getChartOptions('line')} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bar Chart */}
        {(chartType === 'all' || chartType === 'time-series') && (
          <Card className={`shadow-lg ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-200'}`}>
            <CardHeader>
              <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Total Activity - {chartData.period}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Bar data={getBarChartData()} options={getChartOptions('bar')} />
              </div>
            </CardContent>
          </Card>
        )}


      </div>
    </div>
  );
}