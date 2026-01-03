import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const getAllComments = async () => {
  const { data, error } = await supabase.from("comments").select("*");

  if (error) throw error;

  // Normalize to expected frontend shape (author_name, author_email)
  return (data || []).map((c) => ({
    ...c,
    author_name: c.name || c.author_name || "",
    author_email: c.email || c.author_email || "",
  }));
};

export const createComment = async (commentData) => {
  // Map frontend fields to DB columns if necessary
  const dbPayload = { ...commentData };
  if (dbPayload.author_name) {
    dbPayload.name = dbPayload.author_name;
    delete dbPayload.author_name;
  }
  if (dbPayload.author_email) {
    dbPayload.email = dbPayload.author_email;
    delete dbPayload.author_email;
  }

  const { data, error } = await supabase
    .from("comments")
    .insert([dbPayload])
    .select();

  if (error) throw error;
  const inserted = data[0];
  // Return normalized shape
  return {
    ...inserted,
    author_name: inserted.name || "",
    author_email: inserted.email || "",
  };
};

export const getCommentById = async (id) => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Comment not found");
  return {
    ...data,
    author_name: data.name || data.author_name || "",
    author_email: data.email || data.author_email || "",
  };
};

export const updateComment = async (id, updateData) => {
  const dbPayload = { ...updateData };
  if (dbPayload.author_name) {
    dbPayload.name = dbPayload.author_name;
    delete dbPayload.author_name;
  }
  if (dbPayload.author_email) {
    dbPayload.email = dbPayload.author_email;
    delete dbPayload.author_email;
  }

  const { data, error } = await supabase
    .from("comments")
    .update(dbPayload)
    .eq("id", id)
    .select();

  if (error) throw error;
  if (!data || data.length === 0) throw new Error("Comment not found");
  const updated = data[0];
  return {
    ...updated,
    author_name: updated.name || "",
    author_email: updated.email || "",
  };
};

export const deleteComment = async (id) => {
  const { error } = await supabase.from("comments").delete().eq("id", id);

  if (error) throw error;
};
