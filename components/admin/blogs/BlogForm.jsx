"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import MultiLanguageTabs from "@/components/admin/MultiLanguageTabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [_isLoading, _setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const formRef = useRef();

  // Update local form data when formData prop changes
  useEffect(() => {
    console.log("BlogForm: formData prop changed:", formData);
    console.log("BlogForm: category from formData:", formData?.category);
    if (formData && Object.keys(formData).length > 0) {
      setLocalFormData((prev) => ({
        ...prev,
        ...formData,
      }));
      console.log(
        "BlogForm: localFormData updated with category:",
        formData.category,
      );
    }
  }, [formData]);

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
    if (localValidationErrors.title?.[language]) {
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

  const handleInputChange = useCallback(
    (field, value) => {
      setLocalFormData((prev) => ({ ...prev, [field]: value }));

      // Clear validation error for this field when user starts typing
      if (localValidationErrors[field]) {
        setLocalValidationErrors((prev) => ({ ...prev, [field]: null }));
      }
    },
    [localValidationErrors],
  );

  const handleMultilingualChange = (field, language, value) => {
    setLocalFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [language]: value },
    }));

    // Clear validation error for this field and language
    if (localValidationErrors[field]?.[language]) {
      setLocalValidationErrors((prev) => ({
        ...prev,
        [field]: { ...prev[field], [language]: null },
      }));
    }
  };

  const handleStatusChange = useCallback((status) => {
    setLocalFormData((prev) => ({
      ...prev,
      status,
      published_at:
        status === "published" && !prev.published_at
          ? new Date().toISOString().split("T")[0]
          : prev.published_at,
    }));
  }, []);

  const _handleCategoryChange = useCallback(
    (value) => {
      handleInputChange("category", value);
    },
    [handleInputChange],
  );

  // Image upload functions
  const uploadBlogImageToSupabase = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "blogs");

      const response = await fetch("/api/upload/project-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();
      return result.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setUploadingImage(true);

    try {
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Upload to Supabase
      const imageUrl = await uploadBlogImageToSupabase(file);

      // Update form data
      handleInputChange("image", imageUrl);

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(error.message || "Failed to upload image");
      setImagePreview("");
    } finally {
      setUploadingImage(false);
    }

    // Clear the input
    event.target.value = "";
  };

  const removeImage = () => {
    handleInputChange("image", "");
    setImagePreview("");
    toast.success("Image removed");
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
                  : error && typeof error === "object"
                    ? Object.entries(error)
                        .map(([lang, msg]) =>
                          msg ? `${lang.toUpperCase()}: ${msg}` : null,
                        )
                        .filter(Boolean)
                        .join(", ")
                    : ""}
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
                          localValidationErrors.title?.[language]
                            ? "border-red-500"
                            : ""
                        }`}
                        dir={context.isRTL ? "rtl" : "ltr"}
                      />
                      {localValidationErrors.title?.[language] && (
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
                          localValidationErrors.excerpt?.[language]
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
                      {localValidationErrors.excerpt?.[language] && (
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
                          localValidationErrors.content?.[language]
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
                      {localValidationErrors.content?.[language] && (
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    {activeLanguage === "fr"
                      ? "Image du blog"
                      : activeLanguage === "en"
                        ? "Blog Image"
                        : "صورة المدونة"}
                  </label>
                  <div className="mt-2 space-y-4">
                    {/* Current Image Display */}
                    {(blog?.image || imagePreview) && (
                      <div className="relative inline-block">
                        <img
                          src={imagePreview || blog.image}
                          alt="Image du blog"
                          className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                          onError={(e) => {
                            e.target.src = "/placeholder-image.jpg";
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                          onClick={removeImage}
                          disabled={uploadingImage}
                        >
                          ×
                        </Button>
                      </div>
                    )}

                    {/* Upload Button */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <input
                          type="file"
                          id="blog-image-upload"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploadingImage}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById("blog-image-upload").click()
                          }
                          disabled={uploadingImage}
                          className="w-full sm:w-auto"
                        >
                          {uploadingImage ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                              Téléchargement...
                            </>
                          ) : (
                            <>
                              📤{" "}
                              {blog?.image
                                ? "Changer l'image"
                                : "Télécharger une image"}
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Image URL Display (for debugging) */}
                      {blog?.image && (
                        <div className="flex-1 text-xs text-gray-500 break-all">
                          URL: {blog.image}
                        </div>
                      )}
                    </div>

                    {/* Upload Instructions */}
                    <div className="text-xs text-gray-500">
                      <p>Formats supportés : JPG, PNG, GIF, WebP</p>
                      <p>Taille maximale : 5 Mo</p>
                      <p>
                        Les images seront automatiquement converties en WebP
                      </p>
                      <p>Stockage dans le bucket 'blogs' de Supabase</p>
                    </div>
                  </div>
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
