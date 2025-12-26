"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ChevronUp, ChevronDown, Clock } from "lucide-react";
import { toast } from "sonner";

const TimelineBlockEditor = ({
  content = { heading: "", events: [] },
  onChange,
  isDarkMode = false,
}) => {
  // Ensure events array is properly handled
  const safeEvents = Array.isArray(content.events) ? content.events : [];
  const [localContent, setLocalContent] = useState(content);

  // Update parent when local content changes
  const updateContent = (newContent) => {
    setLocalContent(newContent);
    onChange(newContent);
  };

  const handleHeadingChange = (value) => {
    updateContent({ ...localContent, heading: value });
  };

  const addEvent = () => {
    const newEvents = [
      ...safeEvents,
      {
        year: "",
        title: "",
        description: "",
      },
    ];
    updateContent({ ...localContent, events: newEvents });
    toast.success("Timeline event added successfully!");
  };

  const updateEvent = (index, field, value) => {
    const newEvents = [...safeEvents];
    newEvents[index] = { ...newEvents[index], [field]: value };
    updateContent({ ...localContent, events: newEvents });
  };

  const removeEvent = (index) => {
    const newEvents = safeEvents.filter((_, i) => i !== index);
    updateContent({ ...localContent, events: newEvents });
    toast.success("Timeline event removed successfully!");
  };

  const moveEvent = (index, direction) => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === safeEvents.length - 1)
    ) {
      return;
    }

    const newEvents = [...safeEvents];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [newEvents[index], newEvents[newIndex]] = [
      newEvents[newIndex],
      newEvents[index],
    ];
    updateContent({ ...localContent, events: newEvents });
  };

  return (
    <Card
      className={`${isDarkMode ? "bg-slate-800 border-slate-600" : "bg-white border-gray-200"}`}
    >
      <CardHeader>
        <CardTitle
          className={`${isDarkMode ? "text-white" : "text-gray-800"} flex items-center gap-2`}
        >
          <Clock className="h-5 w-5" />
          Timeline Block Editor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timeline Heading */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}
          >
            Timeline Title
          </label>
          <Input
            value={localContent.heading || ""}
            onChange={(e) => handleHeadingChange(e.target.value)}
            placeholder="Enter timeline title..."
            className={
              isDarkMode
                ? "bg-slate-700 border-slate-600 text-white"
                : "bg-white border-gray-300"
            }
          />
        </div>

        {/* Events Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label
              className={`block text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}
            >
              Timeline Events
            </label>
            <Button
              onClick={addEvent}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>

          <div className="space-y-4">
            {safeEvents.map((event, index) => (
              <Card
                key={index}
                className={`${isDarkMode ? "bg-slate-700 border-slate-600" : "bg-gray-50 border-gray-200"}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle
                      className={`text-sm ${isDarkMode ? "text-white" : "text-gray-800"}`}
                    >
                      Event {index + 1}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveEvent(index, "up")}
                        disabled={index === 0}
                        className={
                          isDarkMode
                            ? "text-slate-400 hover:text-white"
                            : "text-gray-500 hover:text-gray-700"
                        }
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveEvent(index, "down")}
                        disabled={index === safeEvents.length - 1}
                        className={
                          isDarkMode
                            ? "text-slate-400 hover:text-white"
                            : "text-gray-500 hover:text-gray-700"
                        }
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEvent(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label
                      className={`block text-xs font-medium mb-1 ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}
                    >
                      Year
                    </label>
                    <Input
                      value={event.year || ""}
                      onChange={(e) =>
                        updateEvent(index, "year", e.target.value)
                      }
                      placeholder="e.g., 2024, 2025..."
                      className={`text-sm ${isDarkMode ? "bg-slate-600 border-slate-500 text-white" : "bg-white border-gray-300"}`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-xs font-medium mb-1 ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}
                    >
                      Event Title
                    </label>
                    <Input
                      value={event.title || ""}
                      onChange={(e) =>
                        updateEvent(index, "title", e.target.value)
                      }
                      placeholder="Enter event title..."
                      className={`text-sm ${isDarkMode ? "bg-slate-600 border-slate-500 text-white" : "bg-white border-gray-300"}`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-xs font-medium mb-1 ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}
                    >
                      Event Description
                    </label>
                    <Textarea
                      value={event.description || ""}
                      onChange={(e) =>
                        updateEvent(index, "description", e.target.value)
                      }
                      placeholder="Enter event description..."
                      rows={3}
                      className={`text-sm ${isDarkMode ? "bg-slate-600 border-slate-500 text-white" : "bg-white border-gray-300"}`}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            {safeEvents.length === 0 && (
              <div
                className={`text-center py-8 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}
              >
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No timeline events added yet</p>
                <p className="text-xs">Click "Add Event" to get started</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimelineBlockEditor;
