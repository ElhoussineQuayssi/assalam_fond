"use client";
import { Edit, Eye, EyeOff } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MultiLanguageTabs from "../admin/MultiLanguageTabs";
import { ProjectContentRenderer } from "../ProjectContentRenderer";
import ContentBlockManager from "./ContentBlockManager";

const MultiLanguageContentBlockManager = ({
  content = { fr: [], en: [], ar: [] },
  onChange,
  isDarkMode = false,
  projectId = null,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState("fr");
  const [previewMode, setPreviewMode] = useState(false);

  // Ensure content structure is always valid
  const safeContent = useMemo(
    () => ({
      fr: Array.isArray(content.fr) ? content.fr : [],
      en: Array.isArray(content.en) ? content.en : [],
      ar: Array.isArray(content.ar) ? content.ar : [],
    }),
    [content],
  );

  const handleLanguageChange = useCallback((language) => {
    setCurrentLanguage(language);
  }, []);

  const handleContentChange = useCallback(
    (language, newContentBlocks) => {
      onChange({
        ...safeContent,
        [language]: newContentBlocks,
      });
    },
    [safeContent, onChange],
  );

  const togglePreviewMode = useCallback(() => {
    setPreviewMode((prev) => !prev);
  }, []);

  const currentContent = safeContent[currentLanguage] || [];

  return (
    <Card
      className={
        isDarkMode
          ? "bg-slate-800 border-slate-600"
          : "bg-white border-gray-200"
      }
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={isDarkMode ? "text-white" : "text-gray-800"}>
            Project Content
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={togglePreviewMode}
            className={isDarkMode ? "border-slate-600 text-slate-300" : ""}
          >
            {previewMode ? (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Edit Mode
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Preview Mode
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <MultiLanguageTabs
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
          isDarkMode={isDarkMode}
        >
          {(language, _context) => (
            <div className="space-y-4">
              {previewMode ? (
                <div
                  className={`p-6 rounded-lg border ${
                    isDarkMode
                      ? "bg-slate-700 border-slate-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Eye className="h-5 w-5 text-blue-500" />
                    <span
                      className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}
                    >
                      Content Preview
                    </span>
                  </div>
                  {currentContent.length > 0 ? (
                    <ProjectContentRenderer contentArray={currentContent} />
                  ) : (
                    <div
                      className={`text-center py-8 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}
                    >
                      <EyeOff className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No content blocks to preview</p>
                      <p className="text-sm">
                        Switch to edit mode to add content blocks
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <ContentBlockManager
                  contentBlocks={currentContent}
                  onChange={(newBlocks) =>
                    handleContentChange(language, newBlocks)
                  }
                  isDarkMode={isDarkMode}
                  projectId={projectId}
                  currentLanguage={language}
                />
              )}
            </div>
          )}
        </MultiLanguageTabs>
      </CardContent>
    </Card>
  );
};

export default MultiLanguageContentBlockManager;
