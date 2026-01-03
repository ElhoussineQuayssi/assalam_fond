"use client";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  GraduationCap,
  Settings,
  TrendingUp,
  Type,
} from "lucide-react";
import { memo, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContentBlockManager from "./ContentBlockManager";

const ContentBlockEditor = memo(
  ({ content = [], onChange, isDarkMode = false, projectId = null }) => {
    const [_activeTab, _setActiveTab] = useState("blocks");
    const [showPreview, setShowPreview] = useState(false);

    // Prevent unnecessary re-renders by memoizing content comparison
    const _contentKey = useMemo(() => {
      try {
        return JSON.stringify(content);
      } catch (_e) {
        // Fallback for non-serializable content
        return `${content.length}-${content.map((block) => block.id).join(",")}`;
      }
    }, [content]);

    // Helper function to generate preview of all content blocks
    const renderContentPreview = () => {
      return (
        <div className="space-y-6">
          {content.length === 0 ? (
            <div
              className={`text-center py-12 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}
            >
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No content blocks added yet</p>
              <p className="text-sm">Add content blocks to see the preview</p>
            </div>
          ) : (
            content.map((block) => {
              const { type, content: blockContent, id } = block;

              switch (type) {
                case "text":
                  return (
                    <div key={id} className="py-6 max-w-3xl mx-auto px-6">
                      {blockContent.heading && (
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-3 border-l-4 border-blue-500 pl-4">
                          {blockContent.heading}
                        </h2>
                      )}
                      {blockContent.text && (
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {blockContent.text}
                        </p>
                      )}
                    </div>
                  );

                case "services":
                  return (
                    <div key={id} className="py-10 max-w-5xl mx-auto px-6">
                      {blockContent.heading && (
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-8 text-center">
                          {blockContent.heading}
                        </h3>
                      )}
                      <div className="space-y-6">
                        {blockContent.categories?.map((category, index) => (
                          <div key={index} className="space-y-4">
                            {category.name && (
                              <h4 className="text-md font-semibold text-blue-600 dark:text-blue-400">
                                {category.name}
                              </h4>
                            )}
                            <div className="grid gap-3">
                              {category.services?.map(
                                (service, serviceIndex) => (
                                  <div
                                    key={serviceIndex}
                                    className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg"
                                  >
                                    {service.name && (
                                      <h5 className="text-sm font-bold text-slate-800 dark:text-white mb-1">
                                        {service.name}
                                      </h5>
                                    )}
                                    {service.description && (
                                      <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {service.description}
                                      </p>
                                    )}
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );

                case "stats":
                  return (
                    <div key={id} className="py-10 max-w-5xl mx-auto px-6">
                      {blockContent.heading && (
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-8 text-center">
                          {blockContent.heading}
                        </h3>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {blockContent.stats?.map((stat, index) => (
                          <div
                            key={index}
                            className="p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-center"
                          >
                            <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                              <BarChart3 size={14} className="text-blue-500" />
                            </div>
                            {stat.label && (
                              <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-2">
                                {stat.label}
                              </h4>
                            )}
                            {stat.value && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">
                                {stat.value}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );

                case "programme":
                  return (
                    <div key={id} className="py-10 max-w-5xl mx-auto px-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/4 bg-blue-600 text-white p-6 rounded-3xl shadow-lg shadow-blue-100">
                          <h3 className="text-md font-bold mb-4">
                            {blockContent.heading}
                          </h3>
                          <div className="flex items-center gap-2 text-xs">
                            {blockContent.duration}
                          </div>
                        </div>
                        <div className="md:w-3/4 grid gap-3">
                          {blockContent.modules?.map((m, i) => (
                            <div
                              key={i}
                              className="p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 transition-colors"
                            >
                              <h4 className="text-xs font-bold text-blue-600 uppercase mb-1">
                                {m.title}
                              </h4>
                              <p className="text-xs text-slate-500 leading-snug">
                                {m.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );

                case "impact":
                case "sponsorship":
                  return (
                    <div key={id} className="py-10 max-w-5xl mx-auto px-6">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8 text-center">
                        {blockContent.heading}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(blockContent.impacts || blockContent.formulas)?.map(
                          (item, i) => (
                            <div
                              key={i}
                              className="p-6 bg-white border border-slate-100 rounded-[2rem] text-center hover:shadow-md transition-shadow"
                            >
                              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <TrendingUp
                                  size={14}
                                  className="text-blue-500"
                                />
                              </div>
                              <h4 className="text-xs font-bold text-slate-800 mb-2">
                                {item.description || item.name}
                              </h4>
                              <p className="text-[11px] text-slate-500 leading-relaxed uppercase">
                                {item.value || item.amount}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  );

                case "timeline":
                  return (
                    <div key={id} className="py-10 max-w-3xl mx-auto px-6">
                      <h3 className="text-sm font-black mb-6 text-blue-600 uppercase">
                        {blockContent.heading}
                      </h3>
                      <div className="space-y-6 border-l-2 border-blue-50 ml-2">
                        {blockContent.events?.map((ev, i) => (
                          <div key={i} className="relative pl-8">
                            <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-blue-500" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                              {ev.year}
                            </span>
                            <h4 className="text-sm font-bold text-slate-800">
                              {ev.title}
                            </h4>
                            <p className="text-xs text-slate-500">
                              {ev.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );

                case "list":
                  return (
                    <div key={id} className="py-10 max-w-5xl mx-auto px-6">
                      {blockContent.heading && (
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-8 text-center">
                          {blockContent.heading}
                        </h3>
                      )}
                      <div className="space-y-4">
                        {(blockContent.items || []).map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg"
                          >
                            <div className="w-6 h-6 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle2
                                size={14}
                                className="text-blue-500"
                              />
                            </div>
                            <div className="flex-1">
                              {item.title && (
                                <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">
                                  {item.title}
                                </h4>
                              )}
                              {item.description && (
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );

                default:
                  return (
                    <div
                      key={id}
                      className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded"
                    >
                      <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                        Unknown block type: {type}
                      </p>
                    </div>
                  );
              }
            })
          )}
        </div>
      );
    };

    // Calculate stats
    const blockStats = useMemo(
      () => ({
        total: content.length,
        text: content.filter((b) => b.type === "text").length,
        services: content.filter((b) => b.type === "services").length,
        stats: content.filter((b) => b.type === "stats").length,
        programme: content.filter((b) => b.type === "programme").length,
        impact: content.filter((b) => b.type === "impact").length,
        sponsorship: content.filter((b) => b.type === "sponsorship").length,
        timeline: content.filter((b) => b.type === "timeline").length,
        list: content.filter((b) => b.type === "list").length,
      }),
      [content],
    );

    return (
      <div className="space-y-6">
        <Card
          className={`${isDarkMode ? "bg-slate-800 border-slate-600" : "bg-white border-gray-200"}`}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle
                  className={`${isDarkMode ? "text-white" : "text-gray-800"} flex items-center gap-2`}
                >
                  <FileText className="h-5 w-5" />
                  Content Block Editor
                </CardTitle>
                <p
                  className={`text-sm mt-1 ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}
                >
                  Manage and organize project content using structured blocks
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className={
                    isDarkMode ? "border-slate-600 text-slate-300" : ""
                  }
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {showPreview ? "Edit Blocks" : "Preview All"}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <div
                className={`p-3 rounded-lg text-center ${isDarkMode ? "bg-slate-700" : "bg-gray-50"}`}
              >
                <div className="text-lg font-bold text-blue-600">
                  {blockStats.total}
                </div>
                <div
                  className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}
                >
                  Total Blocks
                </div>
              </div>
              <div
                className={`p-3 rounded-lg text-center ${isDarkMode ? "bg-slate-700" : "bg-gray-50"}`}
              >
                <div className="text-lg font-bold text-blue-600">
                  {blockStats.text}
                </div>
                <div
                  className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}
                >
                  Text
                </div>
              </div>
              <div
                className={`p-3 rounded-lg text-center ${isDarkMode ? "bg-slate-700" : "bg-gray-50"}`}
              >
                <div className="text-lg font-bold text-green-600">
                  {blockStats.services}
                </div>
                <div
                  className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}
                >
                  Services
                </div>
              </div>
              <div
                className={`p-3 rounded-lg text-center ${isDarkMode ? "bg-slate-700" : "bg-gray-50"}`}
              >
                <div className="text-lg font-bold text-purple-600">
                  {blockStats.stats}
                </div>
                <div
                  className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}
                >
                  Stats
                </div>
              </div>
              <div
                className={`p-3 rounded-lg text-center ${isDarkMode ? "bg-slate-700" : "bg-gray-50"}`}
              >
                <div className="text-lg font-bold text-orange-600">
                  {blockStats.programme}
                </div>
                <div
                  className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}
                >
                  Programme
                </div>
              </div>
              <div
                className={`p-3 rounded-lg text-center ${isDarkMode ? "bg-slate-700" : "bg-gray-50"}`}
              >
                <div className="text-lg font-bold text-red-600">
                  {blockStats.timeline}
                </div>
                <div
                  className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}
                >
                  Timeline
                </div>
              </div>
            </div>

            {/* Block Type Badges */}
            {blockStats.total > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {blockStats.text > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700"
                  >
                    <Type className="h-3 w-3 mr-1" />
                    {blockStats.text} Text
                  </Badge>
                )}
                {blockStats.services > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700"
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    {blockStats.services} Services
                  </Badge>
                )}
                {blockStats.stats > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-700"
                  >
                    <BarChart3 className="h-3 w-3 mr-1" />
                    {blockStats.stats} Stats
                  </Badge>
                )}
                {blockStats.programme > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-orange-100 text-orange-700"
                  >
                    <GraduationCap className="h-3 w-3 mr-1" />
                    {blockStats.programme} Programme
                  </Badge>
                )}
                {blockStats.impact > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-red-100 text-red-700"
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {blockStats.impact} Impact
                  </Badge>
                )}
                {blockStats.sponsorship > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-700"
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {blockStats.sponsorship} Sponsorship
                  </Badge>
                )}
                {blockStats.timeline > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-indigo-100 text-indigo-700"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    {blockStats.timeline} Timeline
                  </Badge>
                )}

                {blockStats.list > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-cyan-100 text-cyan-700"
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {blockStats.list} List
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content Area */}
        {showPreview ? (
          <Card
            className={`${isDarkMode ? "bg-slate-800 border-slate-600" : "bg-white border-gray-200"}`}
          >
            <CardHeader>
              <CardTitle
                className={`${isDarkMode ? "text-white" : "text-gray-800"} flex items-center gap-2`}
              >
                <Eye className="h-5 w-5" />
                Content Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`min-h-[400px] p-6 rounded-lg border-2 border-dashed ${
                  isDarkMode
                    ? "border-slate-600 bg-slate-900/20"
                    : "border-gray-300 bg-gray-50"
                }`}
              >
                {renderContentPreview()}
              </div>
            </CardContent>
          </Card>
        ) : (
          <ContentBlockManager
            contentBlocks={content}
            onChange={onChange}
            isDarkMode={isDarkMode}
            projectId={projectId}
          />
        )}

        {/* Help Section */}
        <Card
          className={`${isDarkMode ? "bg-slate-800 border-slate-600" : "bg-blue-50 border-blue-200"}`}
        >
          <CardContent className="p-4">
            <h4
              className={`text-sm font-medium mb-2 ${isDarkMode ? "text-blue-300" : "text-blue-700"}`}
            >
              Content Block Guide:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-gray-600 dark:text-slate-400">
              <div>
                <strong className="text-blue-600 dark:text-blue-400">
                  Text Block:
                </strong>
                <p>
                  Simple text content with heading and description for general
                  information sections.
                </p>
              </div>
              <div>
                <strong className="text-green-600 dark:text-green-400">
                  Services Block:
                </strong>
                <p>
                  Organized services grouped by categories, perfect for
                  showcasing what you offer.
                </p>
              </div>
              <div>
                <strong className="text-purple-600 dark:text-purple-400">
                  Stats Block:
                </strong>
                <p>
                  Key statistics and metrics with labels and values for impact
                  measurement.
                </p>
              </div>
              <div>
                <strong className="text-orange-600 dark:text-orange-400">
                  Programme Block:
                </strong>
                <p>
                  Educational programmes with modules and duration information.
                </p>
              </div>
              <div>
                <strong className="text-red-600 dark:text-red-400">
                  Impact Block:
                </strong>
                <p>Impact metrics and results with descriptions and values.</p>
              </div>
              <div>
                <strong className="text-yellow-600 dark:text-yellow-400">
                  Sponsorship Block:
                </strong>
                <p>Sponsorship impact with formulas and monetary amounts.</p>
              </div>
              <div>
                <strong className="text-indigo-600 dark:text-indigo-400">
                  Timeline Block:
                </strong>
                <p>Project timeline with events, years, and descriptions.</p>
              </div>

              <div>
                <strong className="text-cyan-600 dark:text-cyan-400">
                  List Block:
                </strong>
                <p>Organized lists with titles and descriptions.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
);

export default ContentBlockEditor;
