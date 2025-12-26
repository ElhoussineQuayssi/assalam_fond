"use client";
import { useState, useEffect } from "react";
import {
  Copy,
  RefreshCw,
  Eye,
  CheckCircle,
  AlertCircle,
  Edit3,
  Save,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  generateSlug,
  validateSlug,
  copySlugToClipboard,
} from "@/utils/slugGenerator";

export default function SlugInput({
  title = "",
  value = "",
  onChange,
  existingSlugs = [],
  placeholder = "auto-generated-from-title",
  showPreview = true,
  className = "",
  isDarkMode = false,
}) {
  const [internalValue, setInternalValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  const [validation, setValidation] = useState({ isValid: true, error: null });
  const [copySuccess, setCopySuccess] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Update internal value when prop value changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Generate slug from title when not editing
  useEffect(() => {
    if (!isEditing && title && !internalValue) {
      const generatedSlug = generateSlug(title, existingSlugs);
      setInternalValue(generatedSlug);
      onChange?.(generatedSlug);
    }
  }, [title, isEditing, internalValue, existingSlugs, onChange]);

  // Validate slug on change
  useEffect(() => {
    if (internalValue) {
      const validationResult = validateSlug(internalValue);
      setValidation(validationResult);
    } else {
      setValidation({ isValid: true, error: null });
    }
  }, [internalValue]);

  const handleInputChange = (newValue) => {
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const handleRegenerateSlug = () => {
    if (title) {
      const newSlug = generateSlug(title, existingSlugs);
      setInternalValue(newSlug);
      onChange?.(newSlug);
      setIsEditing(false);
    }
  };

  const handleCopySlug = async () => {
    if (internalValue) {
      const result = await copySlugToClipboard(internalValue);
      if (result.success) {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    }
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      // Save changes
      setIsEditing(false);
    } else {
      // Start editing
      setIsEditing(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && isEditing) {
      setIsEditing(false);
    }
    if (e.key === "Escape" && isEditing) {
      setInternalValue(value);
      setIsEditing(false);
    }
  };

  const getValidationColor = () => {
    if (!internalValue)
      return isDarkMode ? "border-slate-600" : "border-gray-300";
    if (validation.isValid)
      return isDarkMode ? "border-green-500" : "border-green-500";
    return isDarkMode ? "border-red-500" : "border-red-500";
  };

  const getValidationIcon = () => {
    if (!internalValue) return null;
    if (validation.isValid)
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <AlertCircle className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label
          className={`text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}
        >
          URL Slug
        </label>
        <div className="flex items-center gap-2">
          {showPreview && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowSuggestions(!showSuggestions)}
              className={`text-xs ${isDarkMode ? "hover:bg-slate-700 text-slate-400" : "hover:bg-gray-100 text-gray-500"}`}
            >
              <Eye className="h-3 w-3 mr-1" />
              Preview
            </Button>
          )}
          {title && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRegenerateSlug}
              className={`text-xs ${isDarkMode ? "hover:bg-slate-700 text-slate-400" : "hover:bg-gray-100 text-gray-500"}`}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Regenerate
            </Button>
          )}
        </div>
      </div>

      <div className="relative">
        <div className="flex">
          <div className="flex-1 relative">
            <Input
              value={internalValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyPress}
              onFocus={() => setIsEditing(true)}
              placeholder={placeholder}
              className={`pr-20 ${getValidationColor()} ${
                isDarkMode
                  ? "bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  : ""
              } ${isEditing ? "ring-2 ring-blue-500 ring-opacity-50" : ""}`}
              readOnly={!isEditing}
            />

            {/* Validation Icon */}
            <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
              {getValidationIcon()}
            </div>

            {/* Edit/Save Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleToggleEdit}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 ${
                isDarkMode
                  ? "hover:bg-slate-600 text-slate-400"
                  : "hover:bg-gray-100 text-gray-500"
              }`}
            >
              {isEditing ? (
                <Save className="h-3 w-3" />
              ) : (
                <Edit3 className="h-3 w-3" />
              )}
            </Button>
          </div>

          {/* Copy Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopySlug}
            disabled={!internalValue || !validation.isValid}
            className={`ml-2 ${
              copySuccess
                ? "bg-green-500 hover:bg-green-600 text-white"
                : isDarkMode
                  ? "border-slate-600 hover:bg-slate-700 text-slate-300"
                  : ""
            }`}
          >
            {copySuccess ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Validation Error */}
        {validation.error && (
          <p
            className={`text-xs mt-1 flex items-center gap-1 ${
              isDarkMode ? "text-red-400" : "text-red-600"
            }`}
          >
            <AlertCircle className="h-3 w-3" />
            {validation.error}
          </p>
        )}

        {/* URL Preview */}
        {showPreview && internalValue && (
          <div
            className={`mt-2 p-2 rounded border text-xs ${
              isDarkMode
                ? "bg-slate-800 border-slate-600 text-slate-300"
                : "bg-gray-50 border-gray-200 text-gray-600"
            }`}
          >
            <span className="font-mono">
              https://yoursite.com/projects/{internalValue}
            </span>
          </div>
        )}
      </div>

      {/* Auto-generation Notice */}
      {!isEditing && title && (
        <div
          className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}
        >
          Auto-generated from title. Click the edit icon to customize.
        </div>
      )}

      {/* Slug Suggestions */}
      {showSuggestions && title && (
        <div
          className={`p-3 rounded border ${
            isDarkMode
              ? "bg-slate-800 border-slate-600"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <p
            className={`text-xs font-medium mb-2 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}
          >
            URL Preview
          </p>
          <div className="space-y-1">
            <div
              className={`text-xs font-mono ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}
            >
              https://yoursite.com/projects/
              {internalValue || "your-project-slug"}
            </div>
            {internalValue && (
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    validation.isValid
                      ? isDarkMode
                        ? "border-green-500 text-green-400"
                        : "border-green-500 text-green-700"
                      : isDarkMode
                        ? "border-red-500 text-red-400"
                        : "border-red-500 text-red-700"
                  }`}
                >
                  {validation.isValid ? "Valid URL" : "Invalid URL"}
                </Badge>
                {internalValue.length > 0 && (
                  <span
                    className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}
                  >
                    {internalValue.length} characters
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
