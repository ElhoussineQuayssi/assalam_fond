"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, TrendingUp, DollarSign } from "lucide-react";
import { toast } from "sonner";

const ImpactBlockEditor = ({ 
  content = { heading: "", impacts: [], formulas: [] }, 
  onChange, 
  isDarkMode = false,
  blockType = "impact" // "impact" or "sponsorship"
}) => {
  // Ensure arrays are properly handled
  const safeImpacts = Array.isArray(content.impacts) ? content.impacts : [];
  const safeFormulas = Array.isArray(content.formulas) ? content.formulas : [];
  const [localContent, setLocalContent] = useState(content);

  // Update parent when local content changes
  const updateContent = (newContent) => {
    setLocalContent(newContent);
    onChange(newContent);
  };

  const handleHeadingChange = (value) => {
    updateContent({ ...localContent, heading: value });
  };

  const addImpact = () => {
    const newImpacts = [...safeImpacts, {
      description: "",
      value: ""
    }];
    updateContent({ ...localContent, impacts: newImpacts });
    toast.success("Impact added successfully!");
  };

  const updateImpact = (index, field, value) => {
    const newImpacts = [...safeImpacts];
    newImpacts[index] = { ...newImpacts[index], [field]: value };
    updateContent({ ...localContent, impacts: newImpacts });
  };

  const removeImpact = (index) => {
    const newImpacts = safeImpacts.filter((_, i) => i !== index);
    updateContent({ ...localContent, impacts: newImpacts });
    toast.success("Impact removed successfully!");
  };

  const addFormula = () => {
    const newFormulas = [...safeFormulas, {
      name: "",
      amount: ""
    }];
    updateContent({ ...localContent, formulas: newFormulas });
    toast.success("Formula added successfully!");
  };

  const updateFormula = (index, field, value) => {
    const newFormulas = [...safeFormulas];
    newFormulas[index] = { ...newFormulas[index], [field]: value };
    updateContent({ ...localContent, formulas: newFormulas });
  };

  const removeFormula = (index) => {
    const newFormulas = safeFormulas.filter((_, i) => i !== index);
    updateContent({ ...localContent, formulas: newFormulas });
    toast.success("Formula removed successfully!");
  };

  const getIcon = () => {
    return blockType === "sponsorship" ? DollarSign : TrendingUp;
  };

  const getTitle = () => {
    return blockType === "sponsorship" ? "Sponsorship Block Editor" : "Impact Block Editor";
  };

  const Icon = getIcon();

  return (
    <Card className={`${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'}`}>
      <CardHeader>
        <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-800'} flex items-center gap-2`}>
          <Icon className="h-5 w-5" />
          {getTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Block Heading */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
            {blockType === "sponsorship" ? "Sponsorship Title" : "Impact Title"}
          </label>
          <Input
            value={localContent.heading || ""}
            onChange={(e) => handleHeadingChange(e.target.value)}
            placeholder={blockType === "sponsorship" ? "Enter sponsorship title..." : "Enter impact title..."}
            className={isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}
          />
        </div>

        {/* Impacts Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Impacts & Results
            </label>
            <Button
              onClick={addImpact}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Impact
            </Button>
          </div>

          <div className="space-y-4">
            {safeImpacts.map((impact, index) => (
              <Card key={index} className={`${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      Impact {index + 1}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImpact(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                      Description
                    </label>
                    <Input
                      value={impact.description || ""}
                      onChange={(e) => updateImpact(index, "description", e.target.value)}
                      placeholder="e.g., People helped, Projects completed..."
                      className={`text-sm ${isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                      Value
                    </label>
                    <Input
                      value={impact.value || ""}
                      onChange={(e) => updateImpact(index, "value", e.target.value)}
                      placeholder="e.g., 500, $10,000..."
                      className={`text-sm ${isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            {(safeImpacts.length === 0) && (
              <div className={`text-center py-6 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                <TrendingUp className="h-6 w-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No impacts added yet</p>
                <p className="text-xs">Click "Add Impact" to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Formulas Section (mainly for sponsorship) */}
        {blockType === "sponsorship" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                Sponsorship Formulas
              </label>
              <Button
                onClick={addFormula}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Formula
              </Button>
            </div>

            <div className="space-y-4">
              {safeFormulas.map((formula, index) => (
                <Card key={index} className={`${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        Formula {index + 1}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFormula(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                        Formula Name
                      </label>
                      <Input
                        value={formula.name || ""}
                        onChange={(e) => updateFormula(index, "name", e.target.value)}
                        placeholder="e.g., Sponsorship impact..."
                        className={`text-sm ${isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                        Amount
                      </label>
                      <Input
                        value={formula.amount || ""}
                        onChange={(e) => updateFormula(index, "amount", e.target.value)}
                        placeholder="e.g., $10,000, €5,000..."
                        className={`text-sm ${isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              {(safeFormulas.length === 0) && (
                <div className={`text-center py-6 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  <DollarSign className="h-6 w-6 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No formulas added yet</p>
                  <p className="text-xs">Click "Add Formula" to get started</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImpactBlockEditor;