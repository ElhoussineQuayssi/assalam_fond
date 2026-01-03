"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function GeneralSettings({ isDarkMode = false }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    site_name: "",
    site_description: "",
    site_url: "",
    site_email: "",
    contact_phone: "",
    contact_address: "",
    contact_city: "",
    contact_country: "",
  });

  // Fetch settings on mount
  useEffect(() => {
    let mounted = true;
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/settings?category=site");
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const result = await res.json();
        if (!result.success) throw new Error("Failed to fetch settings");

        // Convert settings array to object
        const settingsObj = {};
        result.data.forEach((setting) => {
          // Parse JSON value
          let value = setting.value;
          if (
            typeof value === "string" &&
            (value.startsWith('"') ||
              value.startsWith("{") ||
              value.startsWith("["))
          ) {
            try {
              value = JSON.parse(value);
            } catch (_e) {
              // Keep as string if parsing fails
            }
          }
          settingsObj[setting.key] = value;
        });

        if (mounted) {
          setSettings((prev) => ({ ...prev, ...settingsObj }));
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
        toast.error("Failed to load site settings");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSettings();
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (key) => (e) => {
    const value = e?.target ? e.target.value : e;
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Convert settings object to array for bulk update
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        key,
        value: JSON.stringify(value),
        type: typeof value === "boolean" ? "boolean" : "string",
      }));

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsArray),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.error || "Save failed");

      toast.success("General settings saved");
    } catch (err) {
      console.error("Error saving settings:", err);
      toast.error(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      className={`shadow-lg ${isDarkMode ? "bg-slate-800 border-slate-600" : "bg-white border-slate-200"}`}
    >
      <CardHeader>
        <CardTitle className={`${isDarkMode ? "text-white" : "text-gray-800"}`}>
          General Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-400" : "text-gray-700"}`}
            >
              Site Name
            </label>
            <Input
              value={settings.site_name || ""}
              onChange={handleChange("site_name")}
              className={
                isDarkMode ? "bg-slate-700 border-slate-600 text-white" : ""
              }
              disabled={loading}
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-400" : "text-gray-700"}`}
            >
              Site Description
            </label>
            <Input
              value={settings.site_description || ""}
              onChange={handleChange("site_description")}
              className={
                isDarkMode ? "bg-slate-700 border-slate-600 text-white" : ""
              }
              disabled={loading}
            />
          </div>
        </div>
        <div>
          <label
            className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-400" : "text-gray-700"}`}
          >
            Site URL
          </label>
          <Input
            value={settings.site_url || ""}
            onChange={handleChange("site_url")}
            className={
              isDarkMode ? "bg-slate-700 border-slate-600 text-white" : ""
            }
            disabled={loading}
          />
        </div>
        <div>
          <label
            className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-400" : "text-gray-700"}`}
          >
            Contact Email
          </label>
          <Input
            type="email"
            value={settings.site_email || ""}
            onChange={handleChange("site_email")}
            className={
              isDarkMode ? "bg-slate-700 border-slate-600 text-white" : ""
            }
            disabled={loading}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-400" : "text-gray-700"}`}
            >
              Phone Number
            </label>
            <Input
              value={settings.contact_phone || ""}
              onChange={handleChange("contact_phone")}
              className={
                isDarkMode ? "bg-slate-700 border-slate-600 text-white" : ""
              }
              disabled={loading}
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-400" : "text-gray-700"}`}
            >
              City
            </label>
            <Input
              value={settings.contact_city || ""}
              onChange={handleChange("contact_city")}
              className={
                isDarkMode ? "bg-slate-700 border-slate-600 text-white" : ""
              }
              disabled={loading}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-400" : "text-gray-700"}`}
            >
              Address
            </label>
            <Input
              value={settings.contact_address || ""}
              onChange={handleChange("contact_address")}
              className={
                isDarkMode ? "bg-slate-700 border-slate-600 text-white" : ""
              }
              disabled={loading}
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-400" : "text-gray-700"}`}
            >
              Country
            </label>
            <Input
              value={settings.contact_country || ""}
              onChange={handleChange("contact_country")}
              className={
                isDarkMode ? "bg-slate-700 border-slate-600 text-white" : ""
              }
              disabled={loading}
            />
          </div>
        </div>
        <Button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={saving || loading}
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
}
