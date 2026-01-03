"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AppearanceSettings({ isDarkMode = false }) {
  const handleSave = () => {
    // Implementation for saving appearance settings
    console.log("Saving appearance settings...");
  };

  const handleColorSelect = (color) => {
    // Implementation for selecting primary color
    console.log("Selected color:", color);
  };

  return (
    <Card
      className={`shadow-lg ${isDarkMode ? "bg-slate-800 border-slate-600" : "bg-white border-slate-200"}`}
    >
      <CardHeader>
        <CardTitle className={`${isDarkMode ? "text-white" : "text-gray-800"}`}>
          Appearance Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label
            className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-400" : "text-gray-700"}`}
          >
            Theme
          </label>
          <Select defaultValue="light">
            <SelectTrigger
              className={`w-48 ${isDarkMode ? "bg-slate-700 border-slate-600 text-white" : ""}`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="auto">Auto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-400" : "text-gray-700"}`}
          >
            Primary Color
          </label>
          <div className="flex space-x-2">
            {["blue", "green", "purple", "red", "orange"].map((color) => (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                className={`w-8 h-8 rounded-full bg-${color}-500 border-2 ${
                  isDarkMode ? "border-slate-600" : "border-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label
              className={`text-sm font-medium ${isDarkMode ? "text-slate-400" : "text-gray-700"}`}
            >
              Show Sidebar
            </label>
            <p
              className={`text-sm ${isDarkMode ? "text-slate-500" : "text-gray-500"}`}
            >
              Display the navigation sidebar
            </p>
          </div>
          <input type="checkbox" defaultChecked className="rounded" />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label
              className={`text-sm font-medium ${isDarkMode ? "text-slate-400" : "text-gray-700"}`}
            >
              Compact Mode
            </label>
            <p
              className={`text-sm ${isDarkMode ? "text-slate-500" : "text-gray-500"}`}
            >
              Use compact layout for better space utilization
            </p>
          </div>
          <input type="checkbox" className="rounded" />
        </div>

        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          Save Appearance Settings
        </Button>
      </CardContent>
    </Card>
  );
}
