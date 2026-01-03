import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

// Get all settings, optionally filtered by category
export const getSettings = async (category = null) => {
  let query = supabase.from("settings").select("*");

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query
    .order("category", { ascending: true })
    .order("key", { ascending: true });

  if (error) throw error;
  return data;
};

// Get a specific setting by key
export const getSetting = async (key) => {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("key", key)
    .single();

  if (error) throw error;
  return data;
};

// Update a setting by key
export const updateSetting = async (key, value, type = null) => {
  const updateData = { value };

  // If type is provided, update it too
  if (type) {
    updateData.type = type;
  }

  const { data, error } = await supabase
    .from("settings")
    .update(updateData)
    .eq("key", key)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error(`Setting with key '${key}' not found`);
  return data;
};

// Update multiple settings at once
export const updateSettings = async (settings) => {
  const results = [];

  for (const setting of settings) {
    try {
      const result = await updateSetting(
        setting.key,
        setting.value,
        setting.type,
      );
      results.push(result);
    } catch (error) {
      throw new Error(
        `Failed to update setting '${setting.key}': ${error.message}`,
      );
    }
  }

  return results;
};

// Get settings grouped by category
export const getSettingsGrouped = async () => {
  const settings = await getSettings();

  const grouped = settings.reduce((acc, setting) => {
    const category = setting.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(setting);
    return acc;
  }, {});

  return grouped;
};

// Get public settings only
export const getPublicSettings = async () => {
  const { data, error } = await supabase
    .from("settings")
    .select("key, value, type, category, description")
    .eq("is_public", true)
    .order("category", { ascending: true })
    .order("key", { ascending: true });

  if (error) throw error;
  return data;
};
