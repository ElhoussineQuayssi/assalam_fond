"use client";
import { Loader2, Plus, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import GalleryImageManager from "../../Blocks/GalleryImageManager";
import MultiLanguageContentBlockManager from "../../Blocks/MultiLanguageContentBlockManager";

// Translation labels for form fields
const FIELD_LABELS = {
  fr: {
    title: "Titre",
    excerpt: "Extrait",
    peopleHelped: "Personnes Aidées",
    projectContent: "Contenu du Projet",
    projectDetails: "Détails du Projet",
    slug: "Slug",
    status: "Statut",
    startDate: "Date de Début",
    location: "Lieu",
    categories: "Catégories",
    goals: "Objectifs",
    projectImage: "Image du Projet",
  },
  en: {
    title: "Title",
    excerpt: "Excerpt",
    peopleHelped: "People Helped",
    projectContent: "Project Content",
    projectDetails: "Project Details",
    slug: "Slug",
    status: "Status",
    startDate: "Start Date",
    location: "Location",
    categories: "Categories",
    goals: "Goals",
    projectImage: "Project Image",
  },
  ar: {
    title: "العنوان",
    excerpt: "الملخص",
    peopleHelped: "الأشخاص المساعدون",
    projectContent: "محتوى المشروع",
    projectDetails: "تفاصيل المشروع",
    slug: "المعرف",
    status: "الحالة",
    startDate: "تاريخ البدء",
    location: "الموقع",
    categories: "الفئات",
    goals: "الأهداف",
    projectImage: "صورة المشروع",
  },
};

export default function ProjectForm({
  project = null,
  onSubmit,
  onCancel,
  isDarkMode = false,
  existingProjects = [],
}) {
  console.log("ProjectForm rendering", { project, onSubmit, onCancel });
  const [currentLanguage, setCurrentLanguage] = useState("fr");

  // Multilingual translations state - holds all languages
  const [translations, setTranslations] = useState({
    fr: { title: "", excerpt: "", people_helped: "", content: [], slug: "" },
    en: { title: "", excerpt: "", people_helped: "", content: [], slug: "" },
    ar: { title: "", excerpt: "", people_helped: "", content: [], slug: "" },
  });

  // Shared project fields (not language-specific)
  const [sharedData, setSharedData] = useState({
    slug: "",
    status: "draft",
    start_date: "",
    location: "",
    categories: [],
    goals: [],
    image: "",
    gallery_images: [],
  });

  const [newCategory, setNewCategory] = useState("");
  const [newGoal, setNewGoal] = useState("");
  const [errors, setErrors] = useState({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize translations and shared data when project changes
  useEffect(() => {
    if (project) {
      // Set shared data (non-language-specific fields)
      setSharedData({
        slug: project.slug || "",
        status: project.status || "draft",
        start_date: project.start_date || "",
        location: project.location || "",
        categories: project.categories || [],
        goals: project.goals || [],
        image: project.image || "",
        gallery_images: project.gallery_images || [],
      });

      // Set translations data (language-specific fields)
      const projectTranslations = project.translations || {};
      setTranslations({
        fr: {
          title: projectTranslations.fr?.title || project.title || "",
          excerpt: projectTranslations.fr?.excerpt || project.excerpt || "",
          people_helped:
            projectTranslations.fr?.people_helped ||
            project.people_helped ||
            "",
          content: Array.isArray(projectTranslations.fr?.content)
            ? projectTranslations.fr.content
            : Array.isArray(project.content)
              ? project.content
              : [],
          slug: projectTranslations.fr?.slug || project.slug || "",
        },
        en: {
          title: projectTranslations.en?.title || "",
          excerpt: projectTranslations.en?.excerpt || "",
          people_helped: projectTranslations.en?.people_helped || "",
          content: Array.isArray(projectTranslations.en?.content)
            ? projectTranslations.en.content
            : [],
          slug: projectTranslations.en?.slug || "",
        },
        ar: {
          title: projectTranslations.ar?.title || "",
          excerpt: projectTranslations.ar?.excerpt || "",
          people_helped: projectTranslations.ar?.people_helped || "",
          content: Array.isArray(projectTranslations.ar?.content)
            ? projectTranslations.ar.content
            : [],
          slug: projectTranslations.ar?.slug || "",
        },
      });
    } else {
      // New project - initialize empty data
      setSharedData({
        slug: "",
        status: "draft",
        start_date: "",
        location: "",
        categories: [],
        goals: [],
        image: "",
        gallery_images: [],
      });

      setTranslations({
        fr: {
          title: "",
          excerpt: "",
          people_helped: "",
          content: [],
          slug: "",
        },
        en: {
          title: "",
          excerpt: "",
          people_helped: "",
          content: [],
          slug: "",
        },
        ar: {
          title: "",
          excerpt: "",
          people_helped: "",
          content: [],
          slug: "",
        },
      });
    }
    setErrors({});
  }, [project]);

  // Auto-generate slug from French title (only for new projects)
  useEffect(() => {
    if (translations.fr.title && !project && currentLanguage === "fr") {
      const slug = translations.fr.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setSharedData((prev) => ({ ...prev, slug }));
      setTranslations((prev) => ({
        ...prev,
        fr: { ...prev.fr, slug },
      }));
    }
  }, [translations.fr.title, project, currentLanguage]);

  // DEBUGGING: Check data flow and field population
  useEffect(() => {
    console.log("🚨 ProjectForm Debug Start 🚨");

    // Check if project object exists
    console.log("Current Project:", project);

    // Check if translations exist
    console.log("Translations object:", project?.translations);

    // Check current language
    console.log("Current language:", currentLanguage);

    // Check the data being used to populate the form
    const langData = project?.translations?.[currentLanguage];
    console.log(`Data for ${currentLanguage}:`, langData);

    // Optional: check each expected field
    if (langData) {
      console.log("Title:", langData.title);
      console.log("Excerpt:", langData.excerpt);
      console.log("People Helped:", langData.people_helped);
      console.log("Content:", langData.content);
    } else {
      console.warn("⚠️ No translation data found for this language!");
    }

    console.log("🚨 ProjectForm Debug End 🚨");
  }, [project, currentLanguage]);

  // Handle language-specific field changes
  const handleTranslationChange = (field, value) => {
    setTranslations((prev) => ({
      ...prev,
      [currentLanguage]: {
        ...prev[currentLanguage],
        [field]: value,
      },
    }));
  };

  // Handle shared (non-language-specific) field changes
  const handleSharedChange = (field, value) => {
    setSharedData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle content blocks change (multilingual)
  const handleContentChange = (newContent) => {
    setTranslations((prev) => ({
      ...prev,
      [currentLanguage]: {
        ...prev[currentLanguage],
        content: newContent,
      },
    }));
  };

  const addCategory = () => {
    if (
      newCategory.trim() &&
      !(sharedData.categories || []).includes(newCategory.trim())
    ) {
      handleSharedChange("categories", [
        ...(sharedData.categories || []),
        newCategory.trim(),
      ]);
      setNewCategory("");
    }
  };

  const removeCategory = (category) => {
    handleSharedChange(
      "categories",
      (sharedData.categories || []).filter((c) => c !== category),
    );
  };

  const addGoal = () => {
    if (newGoal.trim() && !(sharedData.goals || []).includes(newGoal.trim())) {
      handleSharedChange("goals", [
        ...(sharedData.goals || []),
        newGoal.trim(),
      ]);
      setNewGoal("");
    }
  };

  const removeGoal = (goal) => {
    handleSharedChange(
      "goals",
      (sharedData.goals || []).filter((g) => g !== goal),
    );
  };

  // Image upload functions
  const uploadImageToSupabase = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "projects");

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
      const imageUrl = await uploadImageToSupabase(file);

      // Update shared data
      handleSharedChange("image", imageUrl);

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
    handleSharedChange("image", "");
    setImagePreview("");
    toast.success("Image removed");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Merge translations and shared data into the expected structure
      const formData = {
        ...sharedData,
        translations,
      };
      await onSubmit(e, formData, currentLanguage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // DEBUGGING: Visual Field Inspector Component
  const DebugFieldInspector = () => {
    // Only show in development
    if (process.env.NODE_ENV === "production") return null;

    const currentLangData = translations[currentLanguage] || {};

    // Check field status
    const fieldStatus = {
      title: {
        value: currentLangData.title || "",
        required: currentLanguage === "fr",
        populated: !!(currentLangData.title || "").trim(),
        label: "Title",
      },
      excerpt: {
        value: currentLangData.excerpt || "",
        required: currentLanguage === "fr",
        populated: !!(currentLangData.excerpt || "").trim(),
        label: "Excerpt",
      },
      people_helped: {
        value: currentLangData.people_helped || "",
        required: false,
        populated: !!(currentLangData.people_helped || "").trim(),
        label: "People Helped",
      },
      content: {
        value: currentLangData.content || [],
        required: false,
        populated:
          Array.isArray(currentLangData.content) &&
          currentLangData.content.length > 0,
        label: "Content Blocks",
      },
    };

    // French-only fields
    if (currentLanguage === "fr") {
      fieldStatus.slug = {
        value: sharedData.slug || "",
        required: true,
        populated: !!(sharedData.slug || "").trim(),
        label: "Slug",
      };
      fieldStatus.categories = {
        value: sharedData.categories || [],
        required: true,
        populated:
          Array.isArray(sharedData.categories) &&
          sharedData.categories.length > 0,
        label: "Categories",
      };
      fieldStatus.goals = {
        value: sharedData.goals || [],
        required: true,
        populated:
          Array.isArray(sharedData.goals) && sharedData.goals.length > 0,
        label: "Goals",
      };
      fieldStatus.image = {
        value: sharedData.image || "",
        required: false,
        populated: !!(sharedData.image || "").trim(),
        label: "Project Image",
      };
    }

    const totalFields = Object.keys(fieldStatus).length;
    const populatedFields = Object.values(fieldStatus).filter(
      (f) => f.populated,
    ).length;
    const requiredFields = Object.values(fieldStatus).filter((f) => f.required);
    const missingRequired = requiredFields.filter((f) => !f.populated);

    return (
      <Card className="mb-4 border-orange-200 bg-orange-50 dark:bg-orange-950/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-orange-800 dark:text-orange-200 flex items-center gap-2">
            🐛 Debug Inspector - {currentLanguage.toUpperCase()} Fields
            <span className="text-xs bg-orange-200 dark:bg-orange-800 px-2 py-1 rounded">
              {populatedFields}/{totalFields} populated
            </span>
            {missingRequired.length > 0 && (
              <span className="text-xs bg-red-200 dark:bg-red-800 px-2 py-1 rounded text-red-800 dark:text-red-200">
                {missingRequired.length} required missing
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            {Object.entries(fieldStatus).map(([key, status]) => (
              <div
                key={key}
                className={`p-2 rounded border-2 ${
                  status.required && !status.populated
                    ? "border-red-400 bg-red-50 dark:bg-red-950/20"
                    : !status.required && !status.populated
                      ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-950/20"
                      : "border-green-400 bg-green-50 dark:bg-green-950/20"
                }`}
              >
                <div className="font-medium">{status.label}</div>
                <div
                  className={`${
                    status.required && !status.populated
                      ? "text-red-700 dark:text-red-300"
                      : !status.required && !status.populated
                        ? "text-yellow-700 dark:text-yellow-300"
                        : "text-green-700 dark:text-green-300"
                  }`}
                >
                  {status.required && !status.populated && "❌ Required"}
                  {!status.required && !status.populated && "⚠️ Empty"}
                  {status.populated && "✅ Populated"}
                </div>
              </div>
            ))}
          </div>
          {!project?.translations?.[currentLanguage] && (
            <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded text-red-800 dark:text-red-200 text-xs">
              ⚠️ No translation data found for {currentLanguage}!
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-400">
          {project ? "Edit Project" : "Create New Project"}
        </h2>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* DEBUGGING: Visual Field Inspector */}
        <DebugFieldInspector />

        {/* Language Selector */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium">Language:</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={currentLanguage === "fr" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentLanguage("fr")}
                  className="flex items-center gap-2"
                >
                  🇫🇷 Français
                </Button>
                <Button
                  type="button"
                  variant={currentLanguage === "en" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentLanguage("en")}
                  className="flex items-center gap-2"
                >
                  🇺🇸 English
                </Button>
                <Button
                  type="button"
                  variant={currentLanguage === "ar" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentLanguage("ar")}
                  className="flex items-center gap-2"
                >
                  🇲🇦 العربية
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Language Context */}
        {(() => {
          const isRTL = currentLanguage === "ar";
          const _context = {
            isRTL,
            languageName:
              currentLanguage === "fr"
                ? "Français"
                : currentLanguage === "en"
                  ? "English"
                  : "العربية",
            languageCode: currentLanguage,
          };

          return (
            <>
              {/* Multilingual Content Section */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {FIELD_LABELS[currentLanguage].projectContent}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`title-${currentLanguage}`}>
                        {FIELD_LABELS[currentLanguage].title} *
                      </Label>
                      <Input
                        id={`title-${currentLanguage}`}
                        value={translations[currentLanguage]?.title || ""}
                        onChange={(e) =>
                          handleTranslationChange("title", e.target.value)
                        }
                        placeholder={
                          currentLanguage === "fr"
                            ? "Entrez le titre du projet"
                            : currentLanguage === "en"
                              ? "Enter project title"
                              : "أدخل عنوان المشروع"
                        }
                        required={currentLanguage === "fr"}
                        dir={isRTL ? "rtl" : "ltr"}
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.title}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`excerpt-${currentLanguage}`}>
                        {FIELD_LABELS[currentLanguage].excerpt} *
                      </Label>
                      <Textarea
                        id={`excerpt-${currentLanguage}`}
                        value={translations[currentLanguage]?.excerpt || ""}
                        onChange={(e) =>
                          handleTranslationChange("excerpt", e.target.value)
                        }
                        placeholder={
                          currentLanguage === "fr"
                            ? "Brève description du projet"
                            : currentLanguage === "en"
                              ? "Brief description of the project"
                              : "وصف مختصر للمشروع"
                        }
                        rows={3}
                        required={currentLanguage === "fr"}
                        dir={isRTL ? "rtl" : "ltr"}
                      />
                      {errors.excerpt && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.excerpt}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`people-helped-${currentLanguage}`}>
                        {FIELD_LABELS[currentLanguage].peopleHelped}
                      </Label>
                      <Input
                        id={`people-helped-${currentLanguage}`}
                        value={
                          translations[currentLanguage]?.people_helped || ""
                        }
                        onChange={(e) =>
                          handleTranslationChange(
                            "people_helped",
                            e.target.value,
                          )
                        }
                        placeholder={
                          currentLanguage === "fr"
                            ? "Nombre ou description des personnes aidées"
                            : currentLanguage === "en"
                              ? "Number or description of people helped"
                              : "عدد أو وصف الأشخاص المساعدين"
                        }
                        dir={isRTL ? "rtl" : "ltr"}
                      />
                      {errors.people_helped && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.people_helped}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Project Content Blocks - Available in all languages */}
              <MultiLanguageContentBlockManager
                content={{
                  fr: translations.fr.content,
                  en: translations.en.content,
                  ar: translations.ar.content,
                }}
                onChange={handleContentChange}
                isDarkMode={isDarkMode}
                projectId={project?.id}
              />

              {/* Project Details Section - Only show for French */}
              {currentLanguage === "fr" && (
                <Card>
                  <CardHeader>
                    <CardTitle>{FIELD_LABELS.fr.projectDetails}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="slug">{FIELD_LABELS.fr.slug} *</Label>
                        <Input
                          id="slug"
                          value={sharedData.slug}
                          onChange={(e) =>
                            handleSharedChange("slug", e.target.value)
                          }
                          placeholder="identifiant-url"
                          required
                        />
                        {errors.slug && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.slug}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="status">{FIELD_LABELS.fr.status}</Label>
                        <Select
                          value={sharedData.status || "draft"}
                          onValueChange={(value) =>
                            handleSharedChange("status", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Brouillon</SelectItem>
                            <SelectItem value="published">Publié</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="start_date">
                          {FIELD_LABELS.fr.startDate}
                        </Label>
                        <Input
                          id="start_date"
                          type="month"
                          value={sharedData.start_date || ""}
                          onChange={(e) =>
                            handleSharedChange("start_date", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="location">
                          {FIELD_LABELS.fr.location}
                        </Label>
                        <Input
                          id="location"
                          value={sharedData.location || ""}
                          onChange={(e) =>
                            handleSharedChange("location", e.target.value)
                          }
                          placeholder="Lieu du projet"
                        />
                      </div>
                    </div>

                    {/* Categories */}
                    <div>
                      <Label>{FIELD_LABELS.fr.categories} *</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {(sharedData.categories || []).map((category) => (
                          <Badge
                            key={category}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {category}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => removeCategory(category)}
                            />
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          placeholder="Ajouter une catégorie"
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), addCategory())
                          }
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addCategory}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {errors.categories && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.categories}
                        </p>
                      )}
                    </div>

                    {/* Goals */}
                    <div>
                      <Label>{FIELD_LABELS.fr.goals} *</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {(sharedData.goals || []).map((goal) => (
                          <Badge
                            key={goal}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {goal}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => removeGoal(goal)}
                            />
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newGoal}
                          onChange={(e) => setNewGoal(e.target.value)}
                          placeholder="Ajouter un objectif"
                          onKeyPress={(e) =>
                            e.key === "Enter" && (e.preventDefault(), addGoal())
                          }
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addGoal}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {errors.goals && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.goals}
                        </p>
                      )}
                    </div>

                    {/* Project Image */}
                    <div>
                      <Label>{FIELD_LABELS.fr.projectImage}</Label>
                      <div className="mt-2 space-y-4">
                        {/* Current Image Display */}
                        {(project?.image || imagePreview) && (
                          <div className="relative inline-block">
                            <img
                              src={imagePreview || project.image}
                              alt="Image du projet"
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
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}

                        {/* Upload Button */}
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <input
                              type="file"
                              id="project-image"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              disabled={uploadingImage}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                document.getElementById("project-image").click()
                              }
                              disabled={uploadingImage}
                              className="w-full sm:w-auto"
                            >
                              {uploadingImage ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Téléchargement...
                                </>
                              ) : (
                                <>
                                  <Upload className="h-4 w-4 mr-2" />
                                  {project?.image
                                    ? "Changer l'image"
                                    : "Télécharger une image"}
                                </>
                              )}
                            </Button>
                          </div>

                          {/* Image URL Display (for debugging) */}
                          {project?.image && (
                            <div className="flex-1 text-xs text-gray-500 break-all">
                              URL: {project.image}
                            </div>
                          )}
                        </div>

                        {/* Upload Instructions */}
                        <div className="text-xs text-gray-500">
                          <p>Formats supportés : JPG, PNG, GIF, WebP</p>
                          <p>Taille maximale : 5 Mo</p>
                          <p>
                            Les images seront téléchargées dans le bucket
                            'projects' de Supabase
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Project Gallery */}
                    <div className="mt-6">
                      <GalleryImageManager
                        projectId={project?.id}
                        isDarkMode={isDarkMode}
                        images={sharedData.gallery_images || []}
                        onImagesChange={(newImages) =>
                          handleSharedChange("gallery_images", newImages)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          );
        })()}
        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {project ? "Updating..." : "Creating..."}
              </>
            ) : project ? (
              "Update Project"
            ) : (
              "Create Project"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
