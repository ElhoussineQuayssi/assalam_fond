"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralSettings from "./GeneralSettings";
import EmailSettings from "./EmailSettings";
import SecuritySettings from "./SecuritySettings";
import AppearanceSettings from "./AppearanceSettings";

export default function SettingsOverview({ isDarkMode = false }) {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList
          className={`grid w-full grid-cols-4 ${isDarkMode ? "bg-slate-800 border-slate-600" : ""}`}
        >
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <GeneralSettings isDarkMode={isDarkMode} />
        </TabsContent>

        <TabsContent value="email" className="mt-6">
          <EmailSettings isDarkMode={isDarkMode} />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <SecuritySettings isDarkMode={isDarkMode} />
        </TabsContent>

        <TabsContent value="appearance" className="mt-6">
          <AppearanceSettings isDarkMode={isDarkMode} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
