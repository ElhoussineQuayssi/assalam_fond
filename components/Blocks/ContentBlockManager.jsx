"use client";
import {
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit,
  Eye,
  GraduationCap,
  Plus,
  Settings,
  Trash2,
  TrendingUp,
  Type,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImpactBlockEditor from "./ImpactBlockEditor";
import { ListBlockEditor } from "./ListBlockEditor";
import ProgrammeBlockEditor from "./ProgrammeBlockEditor";
import ServicesBlockEditor from "./ServicesBlockEditor";
import StatsBlockEditor from "./StatsBlockEditor";
// Individual block editors
import TextBlockEditor from "./TextBlockEditor";
import TimelineBlockEditor from "./TimelineBlockEditor";

const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const ContentBlockManager = ({
  contentBlocks = [],
  onChange,
  isDarkMode = false,
  projectId = null,
  currentLanguage = "fr",
}) => {
  // Ensure contentBlocks is always an array
  const safeContentBlocks = Array.isArray(contentBlocks) ? contentBlocks : [];

  // Initialize state with proper defaults to prevent controlled/uncontrolled switching
  const [activeEditor, setActiveEditor] = useState(null);
  const [newBlockType, setNewBlockType] = useState(null); // Initialize to null for stable Select behavior
  const [previewMode, setPreviewMode] = useState(false);

  // Render tracking for debugging infinite loops
  const renderCountRef = useRef(0);
  const instanceIdRef = useRef(Math.random().toString(36).slice(2, 9));
  const lastPropsRef = useRef(null);

  // Development mode logging with detailed prop tracking
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      renderCountRef.current += 1;

      console.log(
        `🔄 ContentBlockManager:${instanceIdRef.current} RENDER #${renderCountRef.current} - STARTING`,
      );
      console.log(`📋 Content blocks: ${safeContentBlocks.length} blocks`);
      console.log(
        `🎯 Current state - activeEditor: ${activeEditor}, newBlockType: "${newBlockType}", previewMode: ${previewMode}`,
      );
      console.log(
        `📊 Props - isDarkMode: ${isDarkMode}, projectId: ${projectId}`,
      );
      console.log(
        `🔍 Content blocks details:`,
        safeContentBlocks.map((b) => ({ id: b.id, type: b.type })),
      );

      // Track prop changes
      const currentProps = {
        contentBlocks: safeContentBlocks,
        isDarkMode,
        projectId,
      };
      if (lastPropsRef.current) {
        const changes = {};
        Object.keys(currentProps).forEach((key) => {
          if (
            JSON.stringify(lastPropsRef.current[key]) !==
            JSON.stringify(currentProps[key])
          ) {
            changes[key] = {
              from: lastPropsRef.current[key],
              to: currentProps[key],
            };
          }
        });
        if (Object.keys(changes).length > 0) {
          console.log(`🔄 PROP CHANGES DETECTED:`, changes);
        } else {
          console.warn(
            `⚠️ RENDER WITHOUT PROP CHANGES - Possible state update loop!`,
          );
        }
      }
      lastPropsRef.current = currentProps;

      return () => {
        console.log(
          `🏗️ ContentBlockManager:${instanceIdRef.current} RENDER #${renderCountRef.current} - COMPLETING`,
        );
      };
    }
  });

  // Prevent cascading re-renders by stabilizing props
  const _stableProps = useMemo(
    () => ({
      contentBlocks: safeContentBlocks,
      isDarkMode,
      projectId,
    }),
    [isDarkMode, projectId, safeContentBlocks],
  ); // Only depend on primitive values

  const blockTypes = useMemo(
    () => [
      {
        value: "text",
        label: "Text Block",
        icon: Type,
        description: "Simple text with heading",
      },
      {
        value: "services",
        label: "Services Block",
        icon: Settings,
        description: "Organized services and categories",
      },
      {
        value: "stats",
        label: "Stats Block",
        icon: BarChart3,
        description: "Statistics and key metrics",
      },
      {
        value: "programme",
        label: "Programme Block",
        icon: GraduationCap,
        description: "Programme with modules",
      },
      {
        value: "impact",
        label: "Impact Block",
        icon: TrendingUp,
        description: "Impact and results",
      },
      {
        value: "sponsorship",
        label: "Sponsorship Block",
        icon: TrendingUp,
        description: "Sponsorship impact and formulas",
      },
      {
        value: "timeline",
        label: "Timeline Block",
        icon: Clock,
        description: "Project timeline events",
      },

      {
        value: "list",
        label: "List Block",
        icon: CheckCircle2,
        description: "Organized lists with titles and descriptions",
      },
    ],
    [],
  );

  // Memoized callback for handling block type selection with guarded setter
  const handleBlockTypeChange = useCallback((value) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`🔧 handleBlockTypeChange called with value: ${value}`);
    }
    setNewBlockType((prev) => {
      if (prev === value) return prev; // Guard against same value
      return value;
    });
  }, []);

  const handleAddBlock = useCallback(() => {
    if (!newBlockType) {
      toast.error("Please select a block type");
      return;
    }

    const newBlock = {
      id: generateId(),
      type: newBlockType,
      content: getDefaultContent(newBlockType),
    };

    onChange([...safeContentBlocks, newBlock]);
    setActiveEditor(newBlock.id);
    setNewBlockType(null); // Reset to null for stable Select behavior
    toast.success("New block added successfully!");
  }, [newBlockType, onChange, getDefaultContent, safeContentBlocks]);

  const getDefaultContent = (type) => {
    switch (type) {
      case "text":
        return {
          heading: { fr: "", en: "", ar: "" },
          text: { fr: "", en: "", ar: "" },
        };
      case "services":
        return {
          heading: {
            fr: "Services Offerts",
            en: "Services Offered",
            ar: "الخدمات المقدمة",
          },
          categories: [],
        };
      case "stats":
        return {
          heading: {
            fr: "Statistiques Clés",
            en: "Key Statistics",
            ar: "الإحصائيات الرئيسية",
          },
          stats: [],
        };
      case "programme":
        return {
          heading: { fr: "", en: "", ar: "" },
          duration: { fr: "", en: "", ar: "" },
          modules: [],
        };
      case "impact":
        return {
          heading: {
            fr: "Impact & Résultats",
            en: "Impact & Results",
            ar: "التأثير والنتائج",
          },
          impacts: [],
        };
      case "sponsorship":
        return {
          heading: {
            fr: "Impact du Parrainage",
            en: "Sponsorship Impact",
            ar: "تأثير الرعاية",
          },
          formulas: [],
        };
      case "timeline":
        return {
          heading: {
            fr: "Chronologie du Projet",
            en: "Project Timeline",
            ar: "الجدول الزمني للمشروع",
          },
          events: [],
        };

      case "list":
        return {
          heading: { fr: "", en: "", ar: "" }, // Start with empty heading
          items: [], // Start with empty items array
        };
      default:
        return {};
    }
  };

  const handleUpdateBlock = useCallback(
    (blockId, updatedContent) => {
      const updatedBlocks = safeContentBlocks.map((block) =>
        block.id === blockId ? { ...block, content: updatedContent } : block,
      );
      onChange(updatedBlocks);
    },
    [safeContentBlocks, onChange],
  );

  const handleDeleteBlock = useCallback(
    (blockId) => {
      if (confirm("Are you sure you want to delete this block?")) {
        const updatedBlocks = safeContentBlocks.filter(
          (block) => block.id !== blockId,
        );
        onChange(updatedBlocks);
        if (activeEditor === blockId) {
          setActiveEditor(null);
        }
        toast.success("Block deleted successfully!");
      }
    },
    [safeContentBlocks, onChange, activeEditor],
  );

  const handleMoveBlock = useCallback(
    (blockId, direction) => {
      const currentIndex = safeContentBlocks.findIndex(
        (block) => block.id === blockId,
      );
      if (
        (direction === "up" && currentIndex === 0) ||
        (direction === "down" && currentIndex === safeContentBlocks.length - 1)
      ) {
        return;
      }

      const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      const updatedBlocks = [...safeContentBlocks];
      [updatedBlocks[currentIndex], updatedBlocks[newIndex]] = [
        updatedBlocks[newIndex],
        updatedBlocks[currentIndex],
      ];
      onChange(updatedBlocks);
    },
    [safeContentBlocks, onChange],
  );

  const renderBlockPreview = (block) => {
    const { type, content } = block;

    switch (type) {
      case "text":
        return (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">
              {content.heading || "Untitled"}
            </h4>
            <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-2">
              {content.text || "No content yet..."}
            </p>
          </div>
        );
      case "services":
        return (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">
              {content.heading || "Services"}
            </h4>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              {content.categories?.length || 0} categories
            </p>
          </div>
        );
      case "stats":
        return (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">
              {content.heading || "Statistics"}
            </h4>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              {content.stats?.length || 0} stats
            </p>
          </div>
        );
      case "programme":
        return (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">
              {content.heading || "Programme"}
            </h4>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              {content.duration && `${content.duration} • `}
              {content.modules?.length || 0} modules
            </p>
          </div>
        );
      case "impact":
        return (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">
              {content.heading || "Impact & Results"}
            </h4>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              {content.impacts?.length || 0} impacts
            </p>
          </div>
        );
      case "sponsorship":
        return (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">
              {content.heading || "Sponsorship Impact"}
            </h4>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              {content.formulas?.length || 0} formulas
            </p>
          </div>
        );
      case "timeline":
        return (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">
              {content.heading || "Project Timeline"}
            </h4>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              {content.events?.length || 0} events
            </p>
          </div>
        );

      case "list":
        return (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">
              {content.heading || "List Title"}
            </h4>
            <div className="space-y-1">
              {(content.items || []).slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <CheckCircle2 size={12} className="text-blue-500" />
                  <span>{item.title || "Item Title"}</span>
                </div>
              ))}
              {(content.items || []).length > 3 && (
                <div className="text-xs text-slate-400">
                  +{(content.items || []).length - 3} more items
                </div>
              )}
            </div>
          </div>
        );
      default:
        return <p className="text-sm text-gray-500">Unknown block type</p>;
    }
  };

  const renderBlockEditor = (block) => {
    const { type, content, id } = block;

    switch (type) {
      case "text":
        return (
          <TextBlockEditor
            key={id}
            content={content}
            onChange={(updatedContent) => handleUpdateBlock(id, updatedContent)}
            isDarkMode={isDarkMode}
            currentLanguage={currentLanguage}
          />
        );
      case "services":
        return (
          <ServicesBlockEditor
            key={id}
            content={content}
            onChange={(updatedContent) => handleUpdateBlock(id, updatedContent)}
            isDarkMode={isDarkMode}
            currentLanguage={currentLanguage}
          />
        );
      case "stats":
        return (
          <StatsBlockEditor
            key={id}
            content={content}
            onChange={(updatedContent) => handleUpdateBlock(id, updatedContent)}
            isDarkMode={isDarkMode}
            currentLanguage={currentLanguage}
          />
        );
      case "programme":
        return (
          <ProgrammeBlockEditor
            key={id}
            content={content}
            onChange={(updatedContent) => handleUpdateBlock(id, updatedContent)}
            isDarkMode={isDarkMode}
            currentLanguage={currentLanguage}
          />
        );
      case "impact":
        return (
          <ImpactBlockEditor
            key={id}
            content={content}
            onChange={(updatedContent) => handleUpdateBlock(id, updatedContent)}
            isDarkMode={isDarkMode}
            blockType="impact"
            currentLanguage={currentLanguage}
          />
        );
      case "sponsorship":
        return (
          <ImpactBlockEditor
            key={id}
            content={content}
            onChange={(updatedContent) => handleUpdateBlock(id, updatedContent)}
            isDarkMode={isDarkMode}
            blockType="sponsorship"
            currentLanguage={currentLanguage}
          />
        );
      case "timeline":
        return (
          <TimelineBlockEditor
            key={id}
            content={content}
            onChange={(updatedContent) => handleUpdateBlock(id, updatedContent)}
            isDarkMode={isDarkMode}
            currentLanguage={currentLanguage}
          />
        );

      case "list":
        return (
          <ListBlockEditor
            key={id}
            heading={content.heading}
            items={content.items}
            onChange={(newContent) => handleUpdateBlock(id, newContent)}
            currentLanguage={currentLanguage}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Block */}
      <Card
        className={`${isDarkMode ? "bg-slate-800 border-slate-600" : "bg-white border-gray-200"}`}
      >
        <CardHeader>
          <CardTitle
            className={`${isDarkMode ? "text-white" : "text-gray-800"} flex items-center gap-2`}
          >
            <Plus className="h-5 w-5" />
            Content Blocks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label
                className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}
              >
                Add New Block
              </label>
              <Select
                value={newBlockType}
                onValueChange={handleBlockTypeChange}
              >
                <SelectTrigger
                  className={`${isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300"}`}
                >
                  <SelectValue placeholder="Select block type..." />
                </SelectTrigger>
                <SelectContent>
                  {blockTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-gray-500">
                            {type.description}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              onClick={handleAddBlock}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Block
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
              className={isDarkMode ? "border-slate-600 text-slate-300" : ""}
            >
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? "Edit" : "Preview"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Blocks List */}
      {contentBlocks.length === 0 ? (
        <Card
          className={`${isDarkMode ? "bg-slate-800 border-slate-600" : "bg-white border-gray-200"}`}
        >
          <CardContent className="py-12 text-center">
            <div
              className={`text-gray-500 ${isDarkMode ? "text-slate-400" : ""}`}
            >
              <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No content blocks added yet</p>
              <p className="text-sm">Add your first block to get started</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {safeContentBlocks.map((block, index) => (
            <Card
              key={block.id}
              className={`${isDarkMode ? "bg-slate-800 border-slate-600" : "bg-white border-gray-200"}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        block.type === "text"
                          ? "bg-blue-100 text-blue-700"
                          : block.type === "services"
                            ? "bg-green-100 text-green-700"
                            : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <CardTitle
                        className={`text-base ${isDarkMode ? "text-white" : "text-gray-800"}`}
                      >
                        {blockTypes.find((t) => t.value === block.type)
                          ?.label || "Unknown"}
                      </CardTitle>
                      <p
                        className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}
                      >
                        {
                          blockTypes.find((t) => t.value === block.type)
                            ?.description
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveBlock(block.id, "up")}
                      disabled={index === 0}
                      className={
                        isDarkMode ? "text-slate-400 hover:text-white" : ""
                      }
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveBlock(block.id, "down")}
                      disabled={index === contentBlocks.length - 1}
                      className={
                        isDarkMode ? "text-slate-400 hover:text-white" : ""
                      }
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setActiveEditor(
                          activeEditor === block.id ? null : block.id,
                        )
                      }
                      className={
                        isDarkMode ? "text-slate-400 hover:text-white" : ""
                      }
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteBlock(block.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Block Preview */}
                {activeEditor !== block.id && (
                  <div
                    className={`p-4 rounded-lg border ${isDarkMode ? "bg-slate-700 border-slate-600" : "bg-gray-50 border-gray-200"}`}
                  >
                    {renderBlockPreview(block)}
                  </div>
                )}

                {/* Block Editor */}
                {activeEditor === block.id && renderBlockEditor(block)}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentBlockManager;
