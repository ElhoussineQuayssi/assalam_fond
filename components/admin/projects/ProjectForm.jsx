"use client";
import { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import MultiSelect from "@/components/ui/MultiSelect";
import GoalsManager from "@/components/ui/GoalsManager";
import SlugInput from "@/components/ui/SlugInput";
import ContentBlockEditor from "@/components/Blocks/ContentBlockEditor";
import GalleryImageManagerLocal from "@/components/Blocks/GalleryImageManagerLocal";
import MultiLanguageTabs from "@/components/admin/MultiLanguageTabs";
import { generateSlug } from "@/utils/slugGenerator";

if (typeof window !== "undefined") {
  import("gsap");
}

export default function ProjectForm({ 
  project = null, 
  formData = {},
  validationErrors = {},
  onSubmit,
  onCancel,
  isDarkMode = false,
  existingProjects = []
}) {
  // Initialize form data with multilingual structure
  const [localFormData, setLocalFormData] = useState(() => {
    // If editing existing project, transform data to multilingual structure
    if (project) {
      return {
        // Shared fields
        slug: project.slug || '',
        categories: project.categories || [],
        status: project.status || 'draft',
        start_date: project.start_date || '',
        location: project.location || '',
        goals: project.goals || [],
        image: project.image || '',
        gallery_images: project.gallery_images || [],
        
        // Multilingual fields
        title: {
          fr: project.title || '',
          en: project.title_en || '',
          ar: project.title_ar || ''
        },
        excerpt: {
          fr: project.excerpt || '',
          en: project.excerpt_en || '',
          ar: project.excerpt_ar || ''
        },
        content: {
          fr: project.content || [],
          en: project.content_en || [],
          ar: project.content_ar || []
        },
        people_helped: {
          fr: project.people_helped || '',
          en: project.people_helped_en || '',
          ar: project.people_helped_ar || ''
        }
      };
    }
    
    // For new projects, initialize with empty multilingual structure
    return {
      // Shared fields
      slug: '',
      categories: [],
      status: 'draft',
      start_date: '',
      location: '',
      goals: [],
      image: '',
      gallery_images: [],
      
      // Multilingual fields
      title: { fr: '', en: '', ar: '' },
      excerpt: { fr: '', en: '', ar: '' },
      content: { fr: [], en: [], ar: [] },
      people_helped: { fr: '', en: '', ar: '' }
    };
  });

  const [localValidationErrors, setLocalValidationErrors] = useState(validationErrors);
  const [activeLanguage, setActiveLanguage] = useState('fr');
  const formRef = useRef();

  // Determine which languages are completed
  const completedLanguages = ['fr', 'en', 'ar'].filter(lang => {
    const title = localFormData.title[lang];
    const excerpt = localFormData.excerpt[lang];
    return title && title.trim() !== '' && excerpt && excerpt.trim() !== '';
  });

  // Auto-generate slug when French title changes
  const handleTitleChange = (language, title) => {
    setLocalFormData(prev => ({
      ...prev,
      title: { ...prev.title, [language]: title },
      slug: language === 'fr' && (!prev.slug || prev.slug === generateSlug(prev.title.fr, existingProjects.map(p => p.slug)))
        ? generateSlug(title, existingProjects.map(p => p.slug))
        : prev.slug
    }));
    
    // Clear validation error for title when user starts typing
    if (localValidationErrors.title && localValidationErrors.title[language]) {
      setLocalValidationErrors(prev => ({
        ...prev,
        title: { ...prev.title, [language]: null }
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all required fields
    const errors = {};
    
    // Validate French fields (required)
    if (!localFormData.title.fr || localFormData.title.fr.trim() === '') {
      errors.title = { ...errors.title, fr: 'French title is required' };
    }
    if (!localFormData.excerpt.fr || localFormData.excerpt.fr.trim() === '') {
      errors.excerpt = { ...errors.excerpt, fr: 'French excerpt is required' };
    }
    
    // Validate English fields
    if (localFormData.title.en && localFormData.title.en.trim() !== '') {
      if (!localFormData.excerpt.en || localFormData.excerpt.en.trim() === '') {
        errors.excerpt = { ...errors.excerpt, en: 'English excerpt is required when English title is provided' };
      }
    }
    
    // Validate Arabic fields
    if (localFormData.title.ar && localFormData.title.ar.trim() !== '') {
      if (!localFormData.excerpt.ar || localFormData.excerpt.ar.trim() === '') {
        errors.excerpt = { ...errors.excerpt, ar: 'Arabic excerpt is required when Arabic title is provided' };
      }
    }
    
    // Validate shared fields
    if (!localFormData.categories || localFormData.categories.length === 0) {
      errors.categories = 'At least one category is required';
    }
    if (!localFormData.goals || localFormData.goals.length === 0) {
      errors.goals = 'At least one goal is required';
    }
    
    if (Object.keys(errors).length > 0) {
      setLocalValidationErrors(errors);
      return;
    }
    
    setLocalValidationErrors({});
    onSubmit(e, localFormData);
  };

  const handleInputChange = (field, value) => {
    setLocalFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field when user starts typing
    if (localValidationErrors[field]) {
      setLocalValidationErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleArrayChange = (field, value) => {
    setLocalFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field when user makes changes
    if (localValidationErrors[field]) {
      setLocalValidationErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleMultilingualChange = (field, language, value) => {
    setLocalFormData(prev => ({
      ...prev,
      [field]: { ...prev[field], [language]: value }
    }));
    
    // Clear validation error for this field and language
    if (localValidationErrors[field] && localValidationErrors[field][language]) {
      setLocalValidationErrors(prev => ({
        ...prev,
        [field]: { ...prev[field], [language]: null }
      }));
    }
  };

  const handleContentChange = (language, contentBlocks) => {
    setLocalFormData(prev => ({
      ...prev,
      content: { ...prev.content, [language]: contentBlocks }
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {project ? 'Edit Project' : 'Add New Project'}
        </h2>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>

      {/* Validation Summary */}
      {Object.keys(localValidationErrors).length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h3>
          <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
            {Object.entries(localValidationErrors).map(([field, error]) => (
              <li key={field}>
                {typeof error === 'string' ? error : 
                  Object.entries(error).map(([lang, msg]) => 
                    msg ? `${lang.toUpperCase()}: ${msg}` : null
                  ).filter(Boolean).join(', ')
                }
              </li>
            ))}
          </ul>
        </div>
      )}

      <Card ref={formRef} className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-slate-800 dark:border-slate-600">
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
                      <label htmlFor={`project-title-${language}`} className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                        Title ({context.languageCode.toUpperCase()}) *
                      </label>
                      <Input
                        id={`project-title-${language}`}
                        value={localFormData.title[language] || ''}
                        onChange={(e) => handleTitleChange(language, e.target.value)}
                        required={language === 'fr'}
                        className={`dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                          localValidationErrors.title && localValidationErrors.title[language] ? 'border-red-500' : ''
                        }`}
                        dir={context.isRTL ? 'rtl' : 'ltr'}
                      />
                      {localValidationErrors.title && localValidationErrors.title[language] && (
                        <p className="text-red-500 text-xs mt-1">{localValidationErrors.title[language]}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor={`project-excerpt-${language}`} className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                        Excerpt ({context.languageCode.toUpperCase()})
                      </label>
                      <textarea
                        id={`project-excerpt-${language}`}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                          localValidationErrors.excerpt && localValidationErrors.excerpt[language] ? 'border-red-500' : ''
                        }`}
                        rows={3}
                        value={localFormData.excerpt[language] || ''}
                        onChange={(e) => handleMultilingualChange('excerpt', language, e.target.value)}
                        placeholder={`Brief description in ${context.languageName}...`}
                        dir={context.isRTL ? 'rtl' : 'ltr'}
                      />
                      {localValidationErrors.excerpt && localValidationErrors.excerpt[language] && (
                        <p className="text-red-500 text-xs mt-1">{localValidationErrors.excerpt[language]}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor={`project-people-helped-${language}`} className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                        People Helped ({context.languageCode.toUpperCase()})
                      </label>
                      <Input
                        id={`project-people-helped-${language}`}
                        value={localFormData.people_helped[language] || ''}
                        onChange={(e) => handleMultilingualChange('people_helped', language, e.target.value)}
                        placeholder="e.g., 500 personnes / 500 people / 500 شخص"
                        className={`dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                          localValidationErrors.people_helped && localValidationErrors.people_helped[language] ? 'border-red-500' : ''
                        }`}
                        dir={context.isRTL ? 'rtl' : 'ltr'}
                      />
                      {localValidationErrors.people_helped && localValidationErrors.people_helped[language] && (
                        <p className="text-red-500 text-xs mt-1">{localValidationErrors.people_helped[language]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                        Content Blocks ({context.languageCode.toUpperCase()})
                      </label>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} mb-2`}>
                        Create structured content blocks to showcase your project effectively.
                      </p>
                      <ContentBlockEditor
                        content={localFormData.content[language] || []}
                        onChange={(contentBlocks) => handleContentChange(language, contentBlocks)}
                        isDarkMode={isDarkMode}
                        projectId={project?.id}
                        language={language}
                      />
                    </div>
                  </div>
                </div>
              )}
            </MultiLanguageTabs>

            {/* Shared Fields (outside tabs) */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Shared Fields</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="project-slug" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    Slug
                  </label>
                  <SlugInput
                    title={localFormData.title.fr}
                    value={localFormData.slug}
                    onChange={(slug) => handleInputChange('slug', slug)}
                    existingSlugs={existingProjects.map(p => p.slug)}
                    isDarkMode={isDarkMode}
                    showPreview={true}
                  />
                </div>
                
                <div>
                  <label htmlFor="project-status" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <Select value={localFormData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger className="dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label htmlFor="project-start-date" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    Start Date
                  </label>
                  <Input
                    id="project-start-date"
                    type="month"
                    value={localFormData.start_date}
                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                    className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="project-location" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    Location
                  </label>
                  <Input
                    id="project-location"
                    value={localFormData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Casablanca, Morocco"
                    className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    Categories
                  </label>
                  <MultiSelect
                    value={localFormData.categories}
                    onChange={(categories) => handleArrayChange('categories', categories)}
                    isDarkMode={isDarkMode}
                    maxSelected={5}
                    allowCustom={true}
                    placeholder="Select or add categories..."
                    error={localValidationErrors.categories}
                  />
                  {localValidationErrors.categories && (
                    <p className="text-red-500 text-xs mt-1">{localValidationErrors.categories}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    Project Goals
                  </label>
                  <GoalsManager
                    goals={localFormData.goals}
                    onChange={(goals) => handleArrayChange('goals', goals)}
                    isDarkMode={isDarkMode}
                    maxGoals={10}
                    minGoals={1}
                    placeholder="Enter a project goal..."
                    error={localValidationErrors.goals}
                  />
                  {localValidationErrors.goals && (
                    <p className="text-red-500 text-xs mt-1">{localValidationErrors.goals}</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="project-image" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Main Image URL
                </label>
                <Input
                  id="project-image"
                  value={localFormData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>

              {/* Project Gallery Image Manager */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Project Gallery Images
                </label>
                <GalleryImageManagerLocal
                  projectId={project?.id}
                  isDarkMode={isDarkMode}
                  className=""
                  images={localFormData.gallery_images}
                  onImagesChange={(images) => {
                    handleArrayChange('gallery_images', images);
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-6 border-t border-gray-200 dark:border-gray-600">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {project ? 'Update Project' : 'Create Project'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
