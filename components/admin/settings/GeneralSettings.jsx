"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function GeneralSettings({ isDarkMode = false }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    id: null,
    site_title: "",
    site_description: "",
    contact_email: "",
    phone: "",
    address: "",
  });

  // Fetch site config on mount
  useEffect(() => {
    let mounted = true;
    const fetchConfig = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/site-config");
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();
        if (mounted && data) {
          setConfig((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error("Error fetching site config:", err);
        toast.error("Failed to load site settings");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchConfig();
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (key) => (e) => {
    const value = e?.target ? e.target.value : e;
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // ensure id is included
      const payload = { ...config };
      const res = await fetch("/api/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Save failed");
      setConfig((prev) => ({ ...prev, ...data }));
      toast.success("General settings saved");
    } catch (err) {
      console.error("Error saving site config:", err);
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
              Site Title
            </label>
            <Input
              value={config.site_title || ""}
              onChange={handleChange("site_title")}
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
              value={config.site_description || ""}
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
            Contact Email
          </label>
          <Input
            type="email"
            value={config.contact_email || ""}
            onChange={handleChange("contact_email")}
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
            Phone Number
          </label>
          <Input
            value={config.phone || ""}
            onChange={handleChange("phone")}
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
            Address
          </label>
          <Input
            value={config.address || ""}
            onChange={handleChange("address")}
            className={
              isDarkMode ? "bg-slate-700 border-slate-600 text-white" : ""
            }
            disabled={loading}
          />
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
