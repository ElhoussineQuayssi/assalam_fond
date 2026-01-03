"use client";
import { BarChart3, Plus, Trash2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const StatsBlockEditor = ({ content = {}, onChange, isDarkMode = false }) => {
  // Ensure stats array is properly handled
  const safeStats = Array.isArray(content.stats) ? content.stats : [];
  const handleHeadingChange = (e) => {
    onChange({
      ...content,
      heading: e.target.value,
    });
  };

  const handleAddStat = () => {
    const newStat = {
      label: "",
      value: "",
    };

    const updatedStats = [...safeStats, newStat];
    onChange({
      ...content,
      stats: updatedStats,
    });
  };

  const handleDeleteStat = (statIndex) => {
    const updatedStats = safeStats.filter((_, index) => index !== statIndex);
    onChange({
      ...content,
      stats: updatedStats,
    });
  };

  const handleStatChange = (statIndex, field, value) => {
    const updatedStats = safeStats.map((stat, index) =>
      index === statIndex ? { ...stat, [field]: value } : stat,
    );
    onChange({
      ...content,
      stats: updatedStats,
    });
  };

  const isStatValid = (stat) => {
    return (
      stat.label &&
      stat.label.trim() !== "" &&
      stat.value &&
      stat.value.trim() !== ""
    );
  };

  // Validation for numeric values
  const handleValueChange = (statIndex, value) => {
    // Allow empty or numeric values
    if (value === "" || /^\d+$/.test(value)) {
      handleStatChange(statIndex, "value", value);
    }
  };

  return (
    <div className="space-y-4">
      <Card
        className={`${isDarkMode ? "bg-slate-700 border-slate-600" : "bg-gray-50 border-gray-200"}`}
      >
        <CardHeader className="pb-3">
          <CardTitle
            className={`text-sm ${isDarkMode ? "text-white" : "text-gray-800"} flex items-center gap-2`}
          >
            <BarChart3 className="h-4 w-4" />
            Stats Block Editor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}
            >
              Section Heading
            </label>
            <Input
              value={content.heading || ""}
              onChange={handleHeadingChange}
              placeholder="e.g., Key Statistics"
              className={`${isDarkMode ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-gray-300"}`}
            />
          </div>

          {/* Stats List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label
                className={`text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}
              >
                Statistics
              </label>
              <Button
                onClick={handleAddStat}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Stat
              </Button>
            </div>

            {safeStats.length === 0 ? (
              <div
                className={`p-4 rounded-lg border-2 border-dashed text-center ${
                  isDarkMode
                    ? "border-slate-600 text-slate-400"
                    : "border-gray-300 text-gray-500"
                }`}
              >
                <p>No statistics added yet</p>
                <Button
                  onClick={handleAddStat}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add First Stat
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {safeStats.map((stat, statIndex) => (
                  <Card
                    key={statIndex}
                    className={`${isDarkMode ? "bg-slate-800 border-slate-600" : "bg-white border-gray-200"}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            isDarkMode
                              ? "bg-purple-900 text-purple-300"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {statIndex + 1}
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Input
                              value={stat.label || ""}
                              onChange={(e) =>
                                handleStatChange(
                                  statIndex,
                                  "label",
                                  e.target.value,
                                )
                              }
                              placeholder="Label (e.g., People helped)"
                              className={`${isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300"} ${
                                !isStatValid(stat) ? "border-yellow-300" : ""
                              }`}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Input
                              value={stat.value || ""}
                              onChange={(e) =>
                                handleValueChange(statIndex, e.target.value)
                              }
                              placeholder="Value (e.g., 500)"
                              className={`${isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300"} ${
                                !isStatValid(stat) ? "border-yellow-300" : ""
                              }`}
                            />
                            <Button
                              onClick={() => handleDeleteStat(statIndex)}
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 h-10 px-3"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Preview */}
                      <div
                        className={`p-3 rounded-lg border ${
                          isDarkMode
                            ? "bg-slate-700 border-slate-600"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <TrendingUp size={12} className="text-blue-500" />
                          </div>
                          <div className="flex-1">
                            <h4
                              className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}
                            >
                              {stat.label || "Untitled Statistic"}
                            </h4>
                            <p
                              className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}
                            >
                              {stat.value
                                ? `Value: ${stat.value}`
                                : "No value set"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Example Stats */}
          {safeStats.length === 0 && (
            <div
              className={`p-4 rounded-lg border ${isDarkMode ? "bg-slate-700 border-slate-600" : "bg-blue-50 border-blue-200"}`}
            >
              <h4
                className={`text-sm font-medium mb-2 ${isDarkMode ? "text-blue-300" : "text-blue-700"}`}
              >
                Example Statistics:
              </h4>
              <div className="space-y-1 text-xs text-gray-600 dark:text-slate-400">
                <p>• "People helped" → "500"</p>
                <p>• "Communities reached" → "25"</p>
                <p>• "Years of experience" → "10"</p>
                <p>• "Projects completed" → "45"</p>
              </div>
            </div>
          )}

          {/* Validation Summary */}
          <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p
              className={`text-xs ${isDarkMode ? "text-blue-300" : "text-blue-700"}`}
            >
              <strong>Validation:</strong> Each statistic should have both a
              label and a numeric value for best display.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsBlockEditor;
