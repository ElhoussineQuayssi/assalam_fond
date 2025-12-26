import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle } from "lucide-react";

const LANGUAGES = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ar", name: "العربية", flag: "🇲🇦" },
];

export default function MultiLanguageTabs({
  children,
  currentLanguage = "fr",
  onLanguageChange,
  validationErrors = {},
  completedLanguages = [],
  isDarkMode = false,
}) {
  const [activeTab, setActiveTab] = useState(currentLanguage);

  const handleTabChange = (language) => {
    setActiveTab(language);
    if (onLanguageChange) {
      onLanguageChange(language);
    }
  };

  const hasErrors = (lang) => {
    return Object.keys(validationErrors).some(
      (key) => validationErrors[key] && validationErrors[key][lang],
    );
  };

  const isCompleted = (lang) => {
    return completedLanguages.includes(lang) || !hasErrors(lang);
  };

  return (
    <div className="space-y-4">
      {/* Language Tabs */}
      <div className="border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            {LANGUAGES.map((lang) => (
              <TabsTrigger
                key={lang.code}
                value={lang.code}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                  isDarkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-600"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
                {isCompleted(lang.code) && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                {hasErrors(lang.code) && !isCompleted(lang.code) && (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Content Wrapper with RTL Support */}
          {LANGUAGES.map((lang) => (
            <TabsContent
              key={lang.code}
              value={lang.code}
              className={`p-4 ${
                lang.code === "ar"
                  ? "direction-rtl text-right"
                  : "direction-ltr text-left"
              }`}
            >
              <div className="space-y-4">
                {/* Language Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {lang.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {lang.code.toUpperCase()} -{" "}
                        {lang.code === "ar"
                          ? "النص من اليمين إلى اليسار"
                          : "Text direction: left to right"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {isCompleted(lang.code) && (
                      <Badge
                        variant="success"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      >
                        Complet
                      </Badge>
                    )}
                    {hasErrors(lang.code) && !isCompleted(lang.code) && (
                      <Badge
                        variant="destructive"
                        className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      >
                        Erreurs
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Content with Language Context */}
                <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                  {children(lang.code, {
                    isRTL: lang.code === "ar",
                    languageName: lang.name,
                    languageCode: lang.code,
                  })}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Validation Summary */}
      {Object.keys(validationErrors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 dark:bg-red-900/20 dark:border-red-800">
          <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
            Erreurs de validation:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {LANGUAGES.map((lang) => {
              const errors = Object.entries(validationErrors).filter(
                ([key, value]) => value && value[lang.code],
              );

              if (errors.length === 0) return null;

              return (
                <div
                  key={lang.code}
                  className="bg-white dark:bg-gray-800 p-3 rounded border border-red-100 dark:border-red-800"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{lang.flag}</span>
                    <span className="font-medium text-red-700 dark:text-red-300">
                      {lang.name}
                    </span>
                  </div>
                  <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
                    {errors.map(([field, value]) => (
                      <li key={field}>• {value[lang.code]}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
