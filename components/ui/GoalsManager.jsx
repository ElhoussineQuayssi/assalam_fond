"use client";
import { useState } from "react";
import { Plus, X, ChevronUp, ChevronDown, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function GoalsManager({
  goals = [],
  onChange,
  placeholder = "Enter a project goal...",
  maxGoals = 10,
  minGoals = 1,
  className = "",
  isDarkMode = false,
}) {
  const [newGoal, setNewGoal] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(null);

  const handleAddGoal = () => {
    if (newGoal.trim() && goals.length < maxGoals) {
      const updatedGoals = [
        ...goals,
        { id: Date.now(), text: newGoal.trim(), priority: goals.length + 1 },
      ];
      onChange(updatedGoals);
      setNewGoal("");
    }
  };

  const handleRemoveGoal = (index) => {
    if (goals.length > minGoals) {
      const updatedGoals = goals.filter((_, i) => i !== index);
      // Reassign priorities
      const reprioritizedGoals = updatedGoals.map((goal, i) => ({
        ...goal,
        priority: i + 1,
      }));
      onChange(reprioritizedGoals);
    }
  };

  const handleUpdateGoal = (index, newText) => {
    const updatedGoals = goals.map((goal, i) =>
      i === index ? { ...goal, text: newText } : goal,
    );
    onChange(updatedGoals);
  };

  const handleMoveGoal = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= goals.length) return;

    const updatedGoals = [...goals];
    const [movedGoal] = updatedGoals.splice(fromIndex, 1);
    updatedGoals.splice(toIndex, 0, movedGoal);

    // Reassign priorities
    const reprioritizedGoals = updatedGoals.map((goal, i) => ({
      ...goal,
      priority: i + 1,
    }));

    onChange(reprioritizedGoals);
    setFocusedIndex(toIndex);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddGoal();
    }
  };

  const canRemove = goals.length > minGoals;
  const canAdd = goals.length < maxGoals;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Goals List */}
      {goals.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label
              className={`text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}
            >
              Project Goals ({goals.length}/{maxGoals})
            </label>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`text-xs ${isDarkMode ? "border-slate-600 text-slate-400" : "border-gray-300 text-gray-600"}`}
              >
                Priority Order
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            {goals.map((goal, index) => (
              <div
                key={goal.id || index}
                className={`group flex items-center gap-2 p-3 border rounded-lg transition-all duration-200 ${
                  isDarkMode
                    ? "bg-slate-700 border-slate-600 hover:bg-slate-600"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                } ${focusedIndex === index ? "ring-2 ring-blue-500 ring-opacity-50" : ""}`}
              >
                {/* Drag Handle / Priority Indicator */}
                <div
                  className={`flex flex-col items-center gap-1 ${
                    isDarkMode ? "text-slate-400" : "text-gray-400"
                  }`}
                >
                  <GripVertical className="h-4 w-4 cursor-grab" />
                  <Badge
                    variant="outline"
                    className={`text-xs px-1.5 py-0.5 ${
                      isDarkMode
                        ? "border-slate-500 text-slate-400"
                        : "border-gray-300 text-gray-500"
                    }`}
                  >
                    {goal.priority || index + 1}
                  </Badge>
                </div>

                {/* Goal Input */}
                <div className="flex-1">
                  <Input
                    value={goal.text}
                    onChange={(e) => handleUpdateGoal(index, e.target.value)}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(null)}
                    placeholder={`Goal ${index + 1}...`}
                    className={`border-0 bg-transparent p-0 h-auto font-medium focus:ring-0 ${
                      isDarkMode
                        ? "text-white placeholder:text-slate-400"
                        : "text-gray-900 placeholder:text-gray-500"
                    }`}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {/* Move Up */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMoveGoal(index, index - 1)}
                    disabled={index === 0}
                    className={`h-8 w-8 p-0 ${
                      isDarkMode
                        ? "hover:bg-slate-600 text-slate-400 hover:text-white"
                        : "hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>

                  {/* Move Down */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMoveGoal(index, index + 1)}
                    disabled={index === goals.length - 1}
                    className={`h-8 w-8 p-0 ${
                      isDarkMode
                        ? "hover:bg-slate-600 text-slate-400 hover:text-white"
                        : "hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>

                  {/* Remove */}
                  {canRemove && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveGoal(index)}
                      className={`h-8 w-8 p-0 ${
                        isDarkMode
                          ? "hover:bg-red-600 text-slate-400 hover:text-white"
                          : "hover:bg-red-100 text-gray-400 hover:text-red-600"
                      }`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Goal */}
      {canAdd && (
        <div
          className={`p-4 border-2 border-dashed rounded-lg ${
            isDarkMode
              ? "border-slate-600 hover:border-slate-500"
              : "border-gray-300 hover:border-gray-400"
          } transition-colors duration-200`}
        >
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                disabled={!canAdd}
                className={`border-0 bg-transparent focus:ring-0 ${
                  isDarkMode
                    ? "text-white placeholder:text-slate-400"
                    : "text-gray-900 placeholder:text-gray-500"
                }`}
              />
            </div>
            <Button
              type="button"
              onClick={handleAddGoal}
              disabled={!newGoal.trim()}
              size="sm"
              className="px-3"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Goal
            </Button>
          </div>
          <p
            className={`text-xs mt-2 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}
          >
            Press Enter or click "Add Goal" to add. Minimum {minGoals}, maximum{" "}
            {maxGoals} goals.
          </p>
        </div>
      )}

      {/* Validation Messages */}
      {!canAdd && goals.length >= maxGoals && (
        <div
          className={`p-3 rounded-lg ${
            isDarkMode
              ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
              : "bg-amber-50 border border-amber-200 text-amber-800"
          }`}
        >
          <p className="text-sm font-medium">Maximum goals reached</p>
          <p className="text-xs mt-1">
            You've reached the maximum of {maxGoals} goals. Remove some goals to
            add new ones.
          </p>
        </div>
      )}

      {goals.length < minGoals && (
        <div
          className={`p-3 rounded-lg ${
            isDarkMode
              ? "bg-red-500/10 border border-red-500/20 text-red-400"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <p className="text-sm font-medium">Minimum goals required</p>
          <p className="text-xs mt-1">
            You need at least {minGoals} goal{plural(minGoals)} for this
            project.
          </p>
        </div>
      )}

      {/* Summary Stats */}
      {goals.length > 0 && (
        <div
          className={`flex items-center justify-between text-xs ${
            isDarkMode ? "text-slate-400" : "text-gray-500"
          }`}
        >
          <span>
            {goals.length} goal{plural(goals.length)} defined
          </span>
          <span>
            Priority: {goals[0]?.priority || 1} -{" "}
            {goals[goals.length - 1]?.priority || goals.length}
          </span>
        </div>
      )}
    </div>
  );
}

// Helper function for pluralization
function plural(count) {
  return count === 1 ? "" : "s";
}
