"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SecuritySettings({ isDarkMode = false }) {
  const handleSave = () => {
    // Implementation for saving security settings
    console.log("Saving security settings...");
  };

  const handleEnable2FA = () => {
    // Implementation for enabling 2FA
    console.log("Enabling 2FA...");
  };

  const handleConfigurePasswordPolicy = () => {
    // Implementation for configuring password policy
    console.log("Configuring password policy...");
  };

  return (
    <Card
      className={`shadow-lg ${isDarkMode ? "bg-slate-800 border-slate-600" : "bg-white border-slate-200"}`}
    >
      <CardHeader>
        <CardTitle className={`${isDarkMode ? "text-white" : "text-gray-800"}`}>
          Security Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label
              className={`text-sm font-medium ${isDarkMode ? "text-slate-400" : "text-gray-700"}`}
            >
              Two-Factor Authentication
            </label>
            <p
              className={`text-sm ${isDarkMode ? "text-slate-500" : "text-gray-500"}`}
            >
              Add an extra layer of security to your account
            </p>
          </div>
          <Button variant="outline" onClick={handleEnable2FA}>
            Enable 2FA
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label
              className={`text-sm font-medium ${isDarkMode ? "text-slate-400" : "text-gray-700"}`}
            >
              Session Timeout
            </label>
            <p
              className={`text-sm ${isDarkMode ? "text-slate-500" : "text-gray-500"}`}
            >
              Automatically log out inactive users
            </p>
          </div>
          <Select defaultValue="30">
            <SelectTrigger
              className={`w-32 ${isDarkMode ? "bg-slate-700 border-slate-600 text-white" : ""}`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 min</SelectItem>
              <SelectItem value="30">30 min</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
              <SelectItem value="240">4 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label
              className={`text-sm font-medium ${isDarkMode ? "text-slate-400" : "text-gray-700"}`}
            >
              Password Policy
            </label>
            <p
              className={`text-sm ${isDarkMode ? "text-slate-500" : "text-gray-500"}`}
            >
              Require strong passwords for all users
            </p>
          </div>
          <Button variant="outline" onClick={handleConfigurePasswordPolicy}>
            Configure
          </Button>
        </div>

        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          Save Security Settings
        </Button>
      </CardContent>
    </Card>
  );
}
