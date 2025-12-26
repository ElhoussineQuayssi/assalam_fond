"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";

const ProgrammeBlockEditor = ({
  content = { heading: "", duration: "", modules: [] },
  onChange,
  isDarkMode = false,
}) => {
  // Ensure modules array is properly handled
  const safeModules = Array.isArray(content.modules) ? content.modules : [];
  const [localContent, setLocalContent] = useState(content);

  // Update parent when local content changes
  const updateContent = (newContent) => {
    setLocalContent(newContent);
    onChange(newContent);
  };

  const handleHeadingChange = (value) => {
    updateContent({ ...localContent, heading: value });
  };

  const handleDurationChange = (value) => {
    updateContent({ ...localContent, duration: value });
  };

  const addModule = () => {
    const newModules = [
      ...safeModules,
      {
        title: "",
        description: "",
      },
    ];
    updateContent({ ...localContent, modules: newModules });
    toast.success("Module added successfully!");
  };

  const updateModule = (index, field, value) => {
    const newModules = [...safeModules];
    newModules[index] = { ...newModules[index], [field]: value };
    updateContent({ ...localContent, modules: newModules });
  };

  const removeModule = (index) => {
    const newModules = safeModules.filter((_, i) => i !== index);
    updateContent({ ...localContent, modules: newModules });
    toast.success("Module removed successfully!");
  };

  const moveModule = (index, direction) => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === safeModules.length - 1)
    ) {
      return;
    }

    const newModules = [...safeModules];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [newModules[index], newModules[newIndex]] = [
      newModules[newIndex],
      newModules[index],
    ];
    updateContent({ ...localContent, modules: newModules });
  };

  return (
    <Card
      className={`${isDarkMode ? "bg-slate-800 border-slate-600" : "bg-white border-gray-200"}`}
    >
      <CardHeader>
        <CardTitle
          className={`${isDarkMode ? "text-white" : "text-gray-800"} flex items-center gap-2`}
        >
          <GraduationCap className="h-5 w-5" />
          Programme Block Editor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Programme Heading */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}
          >
            Programme Title
          </label>
          <Input
            value={localContent.heading || ""}
            onChange={(e) => handleHeadingChange(e.target.value)}
            placeholder="Enter programme title..."
            className={
              isDarkMode
                ? "bg-slate-700 border-slate-600 text-white"
                : "bg-white border-gray-300"
            }
          />
        </div>

        {/* Programme Duration */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}
          >
            Duration
          </label>
          <Input
            value={localContent.duration || ""}
            onChange={(e) => handleDurationChange(e.target.value)}
            placeholder="e.g., 6 months, 12 weeks..."
            className={
              isDarkMode
                ? "bg-slate-700 border-slate-600 text-white"
                : "bg-white border-gray-300"
            }
          />
        </div>

        {/* Modules Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label
              className={`block text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}
            >
              Programme Modules
            </label>
            <Button
              onClick={addModule}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Module
            </Button>
          </div>

          <div className="space-y-4">
            {safeModules.map((module, index) => (
              <Card
                key={index}
                className={`${isDarkMode ? "bg-slate-700 border-slate-600" : "bg-gray-50 border-gray-200"}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle
                      className={`text-sm ${isDarkMode ? "text-white" : "text-gray-800"}`}
                    >
                      Module {index + 1}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveModule(index, "up")}
                        disabled={index === 0}
                        className={
                          isDarkMode
                            ? "text-slate-400 hover:text-white"
                            : "text-gray-500 hover:text-gray-700"
                        }
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveModule(index, "down")}
                        disabled={index === safeModules.length - 1}
                        className={
                          isDarkMode
                            ? "text-slate-400 hover:text-white"
                            : "text-gray-500 hover:text-gray-700"
                        }
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeModule(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label
                      className={`block text-xs font-medium mb-1 ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}
                    >
                      Module Title
                    </label>
                    <Input
                      value={module.title || ""}
                      onChange={(e) =>
                        updateModule(index, "title", e.target.value)
                      }
                      placeholder="Enter module title..."
                      className={`text-sm ${isDarkMode ? "bg-slate-600 border-slate-500 text-white" : "bg-white border-gray-300"}`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-xs font-medium mb-1 ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}
                    >
                      Module Description
                    </label>
                    <Textarea
                      value={module.description || ""}
                      onChange={(e) =>
                        updateModule(index, "description", e.target.value)
                      }
                      placeholder="Enter module description..."
                      rows={3}
                      className={`text-sm ${isDarkMode ? "bg-slate-600 border-slate-500 text-white" : "bg-white border-gray-300"}`}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            {safeModules.length === 0 && (
              <div
                className={`text-center py-8 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}
              >
                <GraduationCap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No modules added yet</p>
                <p className="text-xs">Click "Add Module" to get started</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgrammeBlockEditor;
