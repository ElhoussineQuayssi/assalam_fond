"use client";
import { Eye, EyeOff, Type } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const TextBlockEditor = ({
  content,
  onChange,
  isDarkMode = false,
  currentLanguage = "fr",
}) => {
  const [showPreview, setShowPreview] = useState(false);

  const handleHeadingChange = (e) => {
    const newHeading = {
      ...content.heading,
      [currentLanguage]: e.target.value,
    };
    onChange({
      ...content,
      heading: newHeading,
    });
  };

  const handleTextChange = (e) => {
    const newText = { ...content.text, [currentLanguage]: e.target.value };
    onChange({
      ...content,
      text: newText,
    });
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
            <Type className="h-4 w-4" />
            Text Block Editor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}
            >
              Heading
            </label>
            <Input
              value={content.heading?.[currentLanguage] || ""}
              onChange={handleHeadingChange}
              placeholder="Enter section heading..."
              className={`${isDarkMode ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-gray-300"} ${
                !content.heading?.[currentLanguage] ? "border-yellow-300" : ""
              }`}
            />
            {!content.heading?.[currentLanguage] && (
              <p className="text-xs text-yellow-600 mt-1">
                Heading is recommended
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                className={`block text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}
              >
                Content
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className={`${isDarkMode ? "text-slate-400 hover:text-white" : "text-gray-500 hover:text-gray-700"}`}
              >
                {showPreview ? (
                  <EyeOff className="h-4 w-4 mr-1" />
                ) : (
                  <Eye className="h-4 w-4 mr-1" />
                )}
                {showPreview ? "Hide" : "Show"} Preview
              </Button>
            </div>
            <Textarea
              value={content.text?.[currentLanguage] || ""}
              onChange={handleTextChange}
              placeholder="Enter your text content here..."
              rows={6}
              className={`${isDarkMode ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-gray-300"} ${
                !content.text?.[currentLanguage] ? "border-yellow-300" : ""
              }`}
            />
            {!content.text?.[currentLanguage] && (
              <p className="text-xs text-yellow-600 mt-1">
                Content is required
              </p>
            )}
          </div>

          {/* Preview */}
          {showPreview && (
            <div
              className={`p-4 rounded-lg border ${
                isDarkMode
                  ? "bg-slate-800 border-slate-500"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="space-y-3">
                {content.heading?.[currentLanguage] && (
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white border-l-4 border-blue-500 pl-4">
                    {content.heading[currentLanguage]}
                  </h2>
                )}
                {content.text?.[currentLanguage] ? (
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {content.text[currentLanguage]}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    No content to display
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TextBlockEditor;
