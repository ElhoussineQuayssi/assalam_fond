"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsSummary({ isDarkMode = false }) {
  const summaryData = [
    {
      title: 'Blog Posts This Month',
      value: '156',
      color: 'text-blue-600'
    },
    {
      title: 'New Users',
      value: '42',
      color: 'text-green-600'
    },
    {
      title: 'Projects Completed',
      value: '23',
      color: 'text-orange-600'
    }
  ];

  return (
    <Card className={`shadow-lg ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-200'}`}>
      <CardHeader>
        <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Recent Activity Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {summaryData.map((item, index) => (
            <div key={item.title} className="text-center">
              <div className={`text-3xl font-bold ${item.color}`}>
                {item.value}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                {item.title}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}