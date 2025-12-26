"use client";
import { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MultiLanguageTabs from "@/components/admin/MultiLanguageTabs";

if (typeof window !== "undefined") {
  import("gsap");
}

export default function BlogForm({
  blog = null,
  formData = {},
  onSubmit,
  onCancel,
  isDarkMode = false,
}) {
  // Initialize form data with multilingual structure
  const [localFormData, setLocalFormData] = useState(() => {
    // If editing existing blog, transform data to multilingual structure
    if (blog) {
      return {
        // Shared fields
        slug: blog.slug || "",
        category: blog.category || "",
        status: blog.status || "draft",
        published_at: blog.published_at || "",
        tags: blog.tags || "",
        image: blog.image || "",

        // Multilingual fields
        title: {
          fr: blog.title || "",
          en: blog.title_en || "",
          ar: blog.title_ar || "",
        },
        excerpt: {
          fr: blog.excerpt || "",
          en: blog.excerpt_en || "",
          ar: blog.excerpt_ar || "",
        },
        content: {
          fr: blog.content || "",
          en: blog.content_en || "",
          ar: blog.content_ar || "",
        },
      };
    }

    // For new blogs, initialize with empty multilingual structure
    return {
      // Shared fields
      slug: "",
      category: "",
      status: "draft",
      published_at: "",
      tags: "",
      image: "",

      // Multilingual fields
      title: { fr: "", en: "", ar: "" },
      excerpt: { fr: "", en: "", ar: "" },
      content: { fr: "", en: "", ar: "" },
    };
  });

  const [localValidationErrors, setLocalValidationErrors] = useState({});
  const [activeLanguage, setActiveLanguage] = useState("fr");
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef();

  // Load blog data with translations when editing
  useEffect(() => {
    const loadBlogData = async () => {
      if (blog && blog.id) {
        setIsLoading(true);
        try {
          const response = await fetch(
            `/api/blog-posts/${blog.id}/translations`,
          );
          if (!response.ok) {
            throw new Error("Failed to load blog data");
          }
          const multilingualData = await response.json();
          setLocalFormData(multilingualData);
        } catch (error) {
          console.error("Error loading blog with translations:", error);
          // Fallback to basic blog data
          setLocalFormData({
            slug: blog.slug || "",
            category: blog.category || "",
            status: blog.status || "draft",
            published_at: blog.published_at || "",
            tags: blog.tags || "",
            image: blog.image || "",
            title: {
              fr: blog.title || "",
              en: blog.title_en || "",
              ar: blog.title_ar || "",
            },
            excerpt: {
              fr: blog.excerpt || "",
              en: blog.excerpt_en || "",
              ar: blog.excerpt_ar || "",
            },
            content: {
              fr: blog.content || "",
              en: blog.content_en || "",
              ar: blog.content_ar || "",
            },
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadBlogData();
  }, [blog]);

  // Determine which languages are completed
  const completedLanguages = ["fr", "en", "ar"].filter((lang) => {
    const title = localFormData.title[lang];
    const excerpt = localFormData.excerpt[lang];
    const content = localFormData.content[lang];
    return (
      title &&
      title.trim() !== "" &&
      excerpt &&
      excerpt.trim() !== "" &&
      content &&
      content.trim() !== ""
    );
  });

  // Auto-generate slug when French title changes
  const handleTitleChange = (language, title) => {
    setLocalFormData((prev) => ({
      ...prev,
      title: { ...prev.title, [language]: title },
      slug:
        language === "fr" &&
        (!prev.slug || prev.slug === title.toLowerCase().replace(/\s+/g, "-"))
          ? title.toLowerCase().replace(/\s+/g, "-")
          : prev.slug,
    }));

    // Clear validation error for title when user starts typing
    if (localValidationErrors.title && localValidationErrors.title[language]) {
      setLocalValidationErrors((prev) => ({
        ...prev,
        title: { ...prev.title, [language]: null },
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all required fields
    const errors = {};

    // Validate French fields (required)
    if (!localFormData.title.fr || localFormData.title.fr.trim() === "") {
      errors.title = { ...errors.title, fr: "French title is required" };
    }
    if (!localFormData.excerpt.fr || localFormData.excerpt.fr.trim() === "") {
      errors.excerpt = { ...errors.excerpt, fr: "French excerpt is required" };
    }
    if (!localFormData.content.fr || localFormData.content.fr.trim() === "") {
      errors.content = { ...errors.content, fr: "French content is required" };
    }

    // Validate English fields
    if (localFormData.title.en && localFormData.title.en.trim() !== "") {
      if (!localFormData.excerpt.en || localFormData.excerpt.en.trim() === "") {
        errors.excerpt = {
          ...errors.excerpt,
          en: "English excerpt is required when English title is provided",
        };
      }
      if (!localFormData.content.en || localFormData.content.en.trim() === "") {
        errors.content = {
          ...errors.content,
          en: "English content is required when English title is provided",
        };
      }
    }

    // Validate Arabic fields
    if (localFormData.title.ar && localFormData.title.ar.trim() !== "") {
      if (!localFormData.excerpt.ar || localFormData.excerpt.ar.trim() === "") {
        errors.excerpt = {
          ...errors.excerpt,
          ar: "Arabic excerpt is required when Arabic title is provided",
        };
      }
      if (!localFormData.content.ar || localFormData.content.ar.trim() === "") {
        errors.content = {
          ...errors.content,
          ar: "Arabic content is required when Arabic title is provided",
        };
      }
    }

    // Validate shared fields
    if (!localFormData.category) {
      errors.category = "Category is required";
    }

    if (Object.keys(errors).length > 0) {
      setLocalValidationErrors(errors);
      return;
    }

    setLocalValidationErrors({});
    onSubmit(e, localFormData);
  };

  const handleInputChange = (field, value) => {
    setLocalFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error for this field when user starts typing
    if (localValidationErrors[field]) {
      setLocalValidationErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleMultilingualChange = (field, language, value) => {
    setLocalFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [language]: value },
    }));

    // Clear validation error for this field and language
    if (
      localValidationErrors[field] &&
      localValidationErrors[field][language]
    ) {
      setLocalValidationErrors((prev) => ({
        ...prev,
        [field]: { ...prev[field], [language]: null },
      }));
    }
  };

  const handleStatusChange = (status) => {
    setLocalFormData((prev) => ({
      ...prev,
      status,
      published_at:
        status === "published" && !prev.published_at
          ? new Date().toISOString().split("T")[0]
          : prev.published_at,
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {blog ? "Edit Blog Post" : "Add New Blog Post"}
        </h2>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      {/* Validation Summary */}
      {Object.keys(localValidationErrors).length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-sm font-medium text-red-800 mb-2">
            Please fix the following errors:
          </h3>
          <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
            {Object.entries(localValidationErrors).map(([field, error]) => (
              <li key={field}>
                {typeof error === "string"
                  ? error
                  : Object.entries(error)
                      .map(([lang, msg]) =>
                        msg ? `${lang.toUpperCase()}: ${msg}` : null,
                      )
                      .filter(Boolean)
                      .join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Card
        ref={formRef}
        className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-slate-800 dark:border-slate-600"
      >
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Multilingual Content Tabs */}
            <MultiLanguageTabs
              currentLanguage={activeLanguage}
              onLanguageChange={setActiveLanguage}
              validationErrors={localValidationErrors}
              completedLanguages={completedLanguages}
              isDarkMode={isDarkMode}
            >
              {(language, context) => (
                <div className="space-y-6">
                  {/* Language-specific fields */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {context.languageName} Content
                    </h3>

                    <div>
                      <label
                        htmlFor={`blog-title-${language}`}
                        className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
                      >
                        {language === "fr"
                          ? "Titre"
                          : language === "en"
                            ? "Title"
                            : "العنوان"}{" "}
                        ({context.languageCode.toUpperCase()}) *
                      </label>
                      <Input
                        id={`blog-title-${language}`}
                        value={localFormData.title[language] || ""}
                        onChange={(e) =>
                          handleTitleChange(language, e.target.value)
                        }
                        required={language === "fr"}
                        className={`dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                          localValidationErrors.title &&
                          localValidationErrors.title[language]
                            ? "border-red-500"
                            : ""
                        }`}
                        dir={context.isRTL ? "rtl" : "ltr"}
                      />
                      {localValidationErrors.title &&
                        localValidationErrors.title[language] && (
                          <p className="text-red-500 text-xs mt-1">
                            {localValidationErrors.title[language]}
                          </p>
                        )}
                    </div>

                    <div>
                      <label
                        htmlFor={`blog-excerpt-${language}`}
                        className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
                      >
                        {language === "fr"
                          ? "Extrait"
                          : language === "en"
                            ? "Excerpt"
                            : "ملخص"}
                      </label>
                      <textarea
                        id={`blog-excerpt-${language}`}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                          localValidationErrors.excerpt &&
                          localValidationErrors.excerpt[language]
                            ? "border-red-500"
                            : ""
                        }`}
                        rows={3}
                        value={localFormData.excerpt[language] || ""}
                        onChange={(e) =>
                          handleMultilingualChange(
                            "excerpt",
                            language,
                            e.target.value,
                          )
                        }
                        placeholder={
                          language === "fr"
                            ? "Brève description en français..."
                            : language === "en"
                              ? "Brief description in English..."
                              : "وصف مختصر بالعربية..."
                        }
                        dir={context.isRTL ? "rtl" : "ltr"}
                      />
                      {localValidationErrors.excerpt &&
                        localValidationErrors.excerpt[language] && (
                          <p className="text-red-500 text-xs mt-1">
                            {localValidationErrors.excerpt[language]}
                          </p>
                        )}
                    </div>

                    <div>
                      <label
                        htmlFor={`blog-content-${language}`}
                        className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
                      >
                        {language === "fr"
                          ? "Contenu"
                          : language === "en"
                            ? "Content"
                            : "المحتوى"}
                      </label>
                      <textarea
                        id={`blog-content-${language}`}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                          localValidationErrors.content &&
                          localValidationErrors.content[language]
                            ? "border-red-500"
                            : ""
                        }`}
                        rows={12}
                        value={localFormData.content[language] || ""}
                        onChange={(e) =>
                          handleMultilingualChange(
                            "content",
                            language,
                            e.target.value,
                          )
                        }
                        placeholder={
                          language === "fr"
                            ? "Écrivez le contenu de votre article de blog en français..."
                            : language === "en"
                              ? "Write your blog post content in English..."
                              : "اكتب محتوى مقالتك بالعربية..."
                        }
                        dir={context.isRTL ? "rtl" : "ltr"}
                      />
                      {localValidationErrors.content &&
                        localValidationErrors.content[language] && (
                          <p className="text-red-500 text-xs mt-1">
                            {localValidationErrors.content[language]}
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </MultiLanguageTabs>

            {/* Shared Fields (outside tabs) */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                {activeLanguage === "fr"
                  ? "Champs Partagés"
                  : activeLanguage === "en"
                    ? "Shared Fields"
                    : "الحقول المشتركة"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="blog-slug"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
                  >
                    {activeLanguage === "fr"
                      ? "Slug"
                      : activeLanguage === "en"
                        ? "Slug"
                        : "الرابط"}
                  </label>
                  <Input
                    id="blog-slug"
                    value={localFormData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder={
                      activeLanguage === "fr"
                        ? "auto-généré-à-partir-du-titre"
                        : activeLanguage === "en"
                          ? "auto-generated-from-title"
                          : "يتم-إنشاءه-تلقائيًا-من-العنوان"
                    }
                    className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="blog-category"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
                  >
                    {activeLanguage === "fr"
                      ? "Catégorie"
                      : activeLanguage === "en"
                        ? "Category"
                        : "الفئة"}
                  </label>
                  <Select
                    value={localFormData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger className="dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                      <SelectValue
                        placeholder={
                          activeLanguage === "fr"
                            ? "Sélectionner une catégorie"
                            : activeLanguage === "en"
                              ? "Select category"
                              : "اختر الفئة"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="benevolat">
                        {activeLanguage === "fr"
                          ? "Benevolat"
                          : activeLanguage === "en"
                            ? "Benevolat"
                            : "التطوع"}
                      </SelectItem>
                      <SelectItem value="education">
                        {activeLanguage === "fr"
                          ? "Education"
                          : activeLanguage === "en"
                            ? "Education"
                            : "التعليم"}
                      </SelectItem>
                      <SelectItem value="social">
                        {activeLanguage === "fr"
                          ? "Social"
                          : activeLanguage === "en"
                            ? "Social"
                            : "الاجتماعي"}
                      </SelectItem>
                      <SelectItem value="economic">
                        {activeLanguage === "fr"
                          ? "Economic"
                          : activeLanguage === "en"
                            ? "Economic"
                            : "الاقتصادي"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {localValidationErrors.category && (
                    <p className="text-red-500 text-xs mt-1">
                      {localValidationErrors.category}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label
                    htmlFor="blog-status"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
                  >
                    {activeLanguage === "fr"
                      ? "Statut"
                      : activeLanguage === "en"
                        ? "Status"
                        : "الحالة"}
                  </label>
                  <Select
                    value={localFormData.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">
                        {activeLanguage === "fr"
                          ? "Brouillon"
                          : activeLanguage === "en"
                            ? "Draft"
                            : "مسودة"}
                      </SelectItem>
                      <SelectItem value="published">
                        {activeLanguage === "fr"
                          ? "Publié"
                          : activeLanguage === "en"
                            ? "Published"
                            : "منشور"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label
                    htmlFor="blog-published-at"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
                  >
                    {activeLanguage === "fr"
                      ? "Date de publication"
                      : activeLanguage === "en"
                        ? "Published At"
                        : "تاريخ النشر"}
                  </label>
                  <Input
                    id="blog-published-at"
                    type="date"
                    value={localFormData.published_at}
                    onChange={(e) =>
                      handleInputChange("published_at", e.target.value)
                    }
                    className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label
                    htmlFor="blog-tags"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
                  >
                    {activeLanguage === "fr"
                      ? "Mots-clés"
                      : activeLanguage === "en"
                        ? "Tags"
                        : "الوسوم"}
                  </label>
                  <Input
                    id="blog-tags"
                    value={localFormData.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                    placeholder={
                      activeLanguage === "fr"
                        ? "mot-clé1, mot-clé2, mot-clé3"
                        : activeLanguage === "en"
                          ? "tag1, tag2, tag3"
                          : "وسم1، وسم2، وسم3"
                    }
                    className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="blog-image"
                    className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
                  >
                    {activeLanguage === "fr"
                      ? "URL de l'image"
                      : activeLanguage === "en"
                        ? "Image URL"
                        : "رابط الصورة"}
                  </label>
                  <Input
                    id="blog-image"
                    value={localFormData.image}
                    onChange={(e) => handleInputChange("image", e.target.value)}
                    placeholder={
                      activeLanguage === "fr"
                        ? "https://example.com/image.jpg"
                        : activeLanguage === "en"
                          ? "https://example.com/image.jpg"
                          : "https://example.com/image.jpg"
                    }
                    className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-6 border-t border-gray-200 dark:border-gray-600">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {blog ? "Update Post" : "Create Post"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
