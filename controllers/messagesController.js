import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const getAllMessages = async () => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Debug logging to check Supabase response
  console.log("Controller - Supabase response:", data);
  console.log("Controller - Supabase error:", error);
  console.log("Controller - Data type:", typeof data);
  console.log("Controller - Data length:", data?.length);
  if (data && data.length > 0) {
    console.log("Controller - First message from Supabase:", data[0]);
    console.log("Controller - First message keys:", Object.keys(data[0]));
    console.log("Controller - First message subject:", data[0]?.subject);
  }

  return data;
};

export const createMessage = async (messageData) => {
  const { data, error } = await supabase.from("messages").insert([messageData]);

  if (error) throw error;
  return { message: "Message sent successfully" };
};

export const deleteMessage = async (id) => {
  const { error } = await supabase.from("messages").delete().eq("id", id);

  if (error) throw error;
};
