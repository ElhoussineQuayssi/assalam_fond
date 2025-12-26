import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const getAllComments = async () => {
  const { data, error } = await supabase.from("comments").select("*");

  if (error) throw error;
  return data;
};

export const createComment = async (commentData) => {
  const { data, error } = await supabase
    .from("comments")
    .insert([commentData])
    .select();

  if (error) throw error;
  return data[0];
};

export const getCommentById = async (id) => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Comment not found");
  return data;
};

export const updateComment = async (id, updateData) => {
  const { data, error } = await supabase
    .from("comments")
    .update(updateData)
    .eq("id", id)
    .select();

  if (error) throw error;
  if (!data || data.length === 0) throw new Error("Comment not found");
  return data[0];
};

export const deleteComment = async (id) => {
  const { error } = await supabase.from("comments").delete().eq("id", id);

  if (error) throw error;
};
