"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Settings, ChevronDown, ChevronUp } from "lucide-react";

const ServicesBlockEditor = ({
  content = {},
  onChange,
  isDarkMode = false,
}) => {
  // Ensure all arrays are properly handled
  const safeCategories = Array.isArray(content.categories)
    ? content.categories
    : [];
  const safeServices = Array.isArray(content.services) ? content.services : [];
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  const handleHeadingChange = (e) => {
    onChange({
      ...content,
      heading: e.target.value,
    });
  };

  const handleAddCategory = () => {
    const newCategory = {
      name: "",
      services: [],
    };

    const updatedCategories = [...safeCategories, newCategory];
    onChange({
      ...content,
      categories: updatedCategories,
    });

    // Auto-expand the new category
    setExpandedCategories(
      (prev) => new Set([...prev, updatedCategories.length - 1]),
    );
  };

  const handleDeleteCategory = (categoryIndex) => {
    const updatedCategories = safeCategories.filter(
      (_, index) => index !== categoryIndex,
    );
    onChange({
      ...content,
      categories: updatedCategories,
    });

    // Remove from expanded categories
    const newExpanded = new Set(expandedCategories);
    newExpanded.delete(categoryIndex);
    setExpandedCategories(newExpanded);
  };

  const handleCategoryNameChange = (categoryIndex, name) => {
    const updatedCategories = safeCategories.map((category, index) =>
      index === categoryIndex ? { ...category, name } : category,
    );
    onChange({
      ...content,
      categories: updatedCategories,
    });
  };

  const handleAddService = (categoryIndex) => {
    const updatedCategories = safeCategories.map((category, index) => {
      if (index === categoryIndex) {
        const newService = {
          name: "",
          description: "",
        };
        const categoryServices = Array.isArray(category.services)
          ? category.services
          : [];
        return {
          ...category,
          services: [...categoryServices, newService],
        };
      }
      return category;
    });

    onChange({
      ...content,
      categories: updatedCategories,
    });
  };

  const handleDeleteService = (categoryIndex, serviceIndex) => {
    const updatedCategories = safeCategories.map((category, index) => {
      if (index === categoryIndex) {
        const categoryServices = Array.isArray(category.services)
          ? category.services
          : [];
        const newServices = categoryServices.filter(
          (_, sIndex) => sIndex !== serviceIndex,
        );
        return {
          ...category,
          services: newServices,
        };
      }
      return category;
    });

    onChange({
      ...content,
      categories: updatedCategories,
    });
  };

  const handleServiceChange = (categoryIndex, serviceIndex, field, value) => {
    const updatedCategories = safeCategories.map((category, index) => {
      if (index === categoryIndex) {
        const categoryServices = Array.isArray(category.services)
          ? category.services
          : [];
        const newServices = categoryServices.map((service, sIndex) =>
          sIndex === serviceIndex ? { ...service, [field]: value } : service,
        );
        return {
          ...category,
          services: newServices,
        };
      }
      return category;
    });

    onChange({
      ...content,
      categories: updatedCategories,
    });
  };

  const toggleCategoryExpansion = (categoryIndex) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryIndex)) {
      newExpanded.delete(categoryIndex);
    } else {
      newExpanded.add(categoryIndex);
    }
    setExpandedCategories(newExpanded);
  };

  const isCategoryValid = (category) => {
    return (
      category.name &&
      category.name.trim() !== "" &&
      category.services &&
      category.services.length > 0
    );
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
            <Settings className="h-4 w-4" />
            Services Block Editor
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
              placeholder="e.g., Services Offered"
              className={`${isDarkMode ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-gray-300"}`}
            />
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label
                className={`text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}
              >
                Categories & Services
              </label>
              <Button
                onClick={handleAddCategory}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Category
              </Button>
            </div>

            {safeCategories.length === 0 ? (
              <div
                className={`p-4 rounded-lg border-2 border-dashed text-center ${
                  isDarkMode
                    ? "border-slate-600 text-slate-400"
                    : "border-gray-300 text-gray-500"
                }`}
              >
                <p>No categories added yet</p>
                <Button
                  onClick={handleAddCategory}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add First Category
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {safeCategories.map((category, categoryIndex) => (
                  <Card
                    key={categoryIndex}
                    className={`${isDarkMode ? "bg-slate-800 border-slate-600" : "bg-white border-gray-200"}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              toggleCategoryExpansion(categoryIndex)
                            }
                            className={
                              isDarkMode
                                ? "text-slate-400 hover:text-white"
                                : "text-gray-500"
                            }
                          >
                            {expandedCategories.has(categoryIndex) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                          <Input
                            value={category.name || ""}
                            onChange={(e) =>
                              handleCategoryNameChange(
                                categoryIndex,
                                e.target.value,
                              )
                            }
                            placeholder="Category name..."
                            className={`${isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-gray-50 border-gray-300"} ${
                              !isCategoryValid(category)
                                ? "border-yellow-300"
                                : ""
                            }`}
                          />
                        </div>
                        <Button
                          onClick={() => handleDeleteCategory(categoryIndex)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {expandedCategories.has(categoryIndex) && (
                        <div className="ml-6 text-xs text-gray-500">
                          {category.services?.length || 0} services
                        </div>
                      )}
                    </CardHeader>

                    {expandedCategories.has(categoryIndex) && (
                      <CardContent className="space-y-3">
                        {/* Services List */}
                        <div className="space-y-2">
                          {category.services?.map((service, serviceIndex) => (
                            <div
                              key={serviceIndex}
                              className={`p-3 rounded-lg border ${
                                isDarkMode
                                  ? "bg-slate-700 border-slate-600"
                                  : "bg-gray-50 border-gray-200"
                              }`}
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                <Input
                                  value={service.name || ""}
                                  onChange={(e) =>
                                    handleServiceChange(
                                      categoryIndex,
                                      serviceIndex,
                                      "name",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Service name..."
                                  className={`${isDarkMode ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-gray-300"} ${
                                    !service.name ? "border-yellow-300" : ""
                                  }`}
                                />
                                <Button
                                  onClick={() =>
                                    handleDeleteService(
                                      categoryIndex,
                                      serviceIndex,
                                    )
                                  }
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700 h-10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <Textarea
                                value={service.description || ""}
                                onChange={(e) =>
                                  handleServiceChange(
                                    categoryIndex,
                                    serviceIndex,
                                    "description",
                                    e.target.value,
                                  )
                                }
                                placeholder="Service description..."
                                rows={2}
                                className={`${isDarkMode ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-gray-300"}`}
                              />
                            </div>
                          ))}
                        </div>

                        <Button
                          onClick={() => handleAddService(categoryIndex)}
                          variant="outline"
                          size="sm"
                          className={`w-full ${isDarkMode ? "border-slate-600 text-slate-300" : ""}`}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Service
                        </Button>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Validation Summary */}
          <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p
              className={`text-xs ${isDarkMode ? "text-blue-300" : "text-blue-700"}`}
            >
              <strong>Validation:</strong> Each category should have a name and
              at least one service for best results.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesBlockEditor;
