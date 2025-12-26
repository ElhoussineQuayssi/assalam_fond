import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const getSiteConfig = async () => {
  const { data, error } = await supabase
    .from("site_config")
    .select("*")
    .single();

  if (error) throw error;
  return data;
};

export const updateSiteConfig = async (updateData) => {
  const { data, error } = await supabase
    .from("site_config")
    .update(updateData)
    .eq("id", updateData.id)
    .select();

  if (error) throw error;
  if (!data || data.length === 0) throw new Error("Site config not found");
  return data[0];
};
