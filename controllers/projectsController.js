import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

// Validate content block structure
const validateContentBlock = (block) => {
  const validTypes = [
    "text",
    "services",
    "stats",
    "programme",
    "impact",
    "sponsorship",
    "timeline",
    "gallery",
    "list",
  ];
  if (!block || !block.type) {
    throw new Error("Content block must have a type");
  }

  if (!validTypes.includes(block.type)) {
    throw new Error(
      `Invalid content block type: ${block.type}. Valid types are: ${validTypes.join(", ")}`,
    );
  }

  switch (block.type) {
    case "text":
      if (!block.content?.heading || !block.content?.heading.trim()) {
        throw new Error("Text block requires heading content");
      }
      if (!block.content?.text || !block.content?.text.trim()) {
        throw new Error("Text block requires text content");
      }
      break;
    case "services":
      if (!block.content?.heading || !block.content?.heading.trim()) {
        throw new Error("Services block requires heading content");
      }
      if (
        !block.content?.categories ||
        !Array.isArray(block.content.categories)
      ) {
        throw new Error("Services block requires categories array");
      }
      if (block.content.categories.length === 0) {
        throw new Error("Services block requires at least one category");
      }
      break;
    case "stats":
      if (!block.content?.heading || !block.content?.heading.trim()) {
        throw new Error("Stats block requires heading content");
      }
      if (!block.content?.stats || !Array.isArray(block.content.stats)) {
        throw new Error("Stats block requires stats array");
      }
      if (block.content.stats.length === 0) {
        throw new Error("Stats block requires at least one stat");
      }
      break;
    case "programme":
      if (!block.content?.heading || !block.content?.heading.trim()) {
        throw new Error("Programme block requires heading content");
      }
      if (!block.content?.modules || !Array.isArray(block.content.modules)) {
        throw new Error("Programme block requires modules array");
      }
      if (block.content.modules.length === 0) {
        throw new Error("Programme block requires at least one module");
      }
      break;
    case "impact":
      if (!block.content?.heading || !block.content?.heading.trim()) {
        throw new Error("Impact block requires heading content");
      }
      if (!block.content?.impacts || !Array.isArray(block.content.impacts)) {
        throw new Error("Impact block requires impacts array");
      }
      if (block.content.impacts.length === 0) {
        throw new Error("Impact block requires at least one impact");
      }
      break;
    case "sponsorship":
      if (!block.content?.heading || !block.content?.heading.trim()) {
        throw new Error("Sponsorship block requires heading content");
      }
      if (!block.content?.formulas || !Array.isArray(block.content.formulas)) {
        throw new Error("Sponsorship block requires formulas array");
      }
      if (block.content.formulas.length === 0) {
        throw new Error("Sponsorship block requires at least one formula");
      }
      break;
    case "timeline":
      if (!block.content?.heading || !block.content?.heading.trim()) {
        throw new Error("Timeline block requires heading content");
      }
      if (!block.content?.events || !Array.isArray(block.content.events)) {
        throw new Error("Timeline block requires events array");
      }
      if (block.content.events.length === 0) {
        throw new Error("Timeline block requires at least one event");
      }
      break;
    case "gallery":
      if (!block.content?.heading || !block.content?.heading.trim()) {
        throw new Error("Gallery block requires heading content");
      }
      break;
    case "list":
      if (!block.content?.heading || !block.content?.heading.trim()) {
        throw new Error("List block requires heading content");
      }
      if (!block.content?.items || !Array.isArray(block.content.items)) {
        throw new Error("List block requires items array");
      }
      if (block.content.items.length === 0) {
        throw new Error("List block requires at least one item");
      }
      break;
  }
};

// Comprehensive project data validation
export const validateProjectData = (data) => {
  const errors = [];

  if (!data) {
    errors.push("Project data is required");
    return errors;
  }

  // Required fields validation
  if (!data.title || data.title.trim().length === 0) {
    errors.push("Title is required");
  } else if (data.title.length > 200) {
    errors.push("Title must be 200 characters or less");
  }

  // Check for excerpt or description (description can be used as excerpt)
  const excerptText = data.excerpt || data.description;
  if (!excerptText || excerptText.trim().length === 0) {
    errors.push("Excerpt is required");
  } else if (excerptText.length > 500) {
    errors.push("Excerpt must be 500 characters or less");
  }

  if (!data.slug || data.slug.trim().length === 0) {
    errors.push("Slug is required");
  } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
    errors.push(
      "Slug must contain only lowercase letters, numbers, and hyphens",
    );
  }

  // Array fields validation
  if (
    !data.categories ||
    !Array.isArray(data.categories) ||
    data.categories.length === 0
  ) {
    errors.push("At least one category is required");
  }

  if (!data.goals || !Array.isArray(data.goals) || data.goals.length === 0) {
    errors.push("At least one goal is required");
  }

  // Optional fields validation
  if (
    data.status &&
    !["draft", "published", "archived"].includes(data.status)
  ) {
    errors.push("Status must be one of: draft, published, archived");
  }

  // Content blocks validation
  if (data.content) {
    if (!Array.isArray(data.content)) {
      errors.push("Content must be an array");
    } else {
      data.content.forEach((block, index) => {
        try {
          validateContentBlock(block);
        } catch (error) {
          errors.push(`Content block ${index + 1}: ${error.message}`);
        }
      });
    }
  }

  return errors;
};

export const getAllProjects = async () => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const createProject = async (projectData) => {
  // Validate required fields
  if (!projectData.title) {
    throw new Error("Title is required");
  }

  // Auto-generate slug if not provided
  if (!projectData.slug && projectData.title) {
    projectData.slug = projectData.title.toLowerCase().replace(/\s+/g, "-");
  }

  // Ensure arrays are properly formatted
  if (projectData.categories && typeof projectData.categories === "string") {
    projectData.categories = projectData.categories
      .split(",")
      .map((cat) => cat.trim())
      .filter((cat) => cat);
  }
  if (projectData.goals && typeof projectData.goals === "string") {
    projectData.goals = projectData.goals
      .split(",")
      .map((goal) => goal.trim())
      .filter((goal) => goal);
  }

  // Ensure content blocks are properly handled
  if (projectData.content) {
    // Validate content blocks structure
    if (Array.isArray(projectData.content)) {
      projectData.content = projectData.content.map((block) => ({
        id: block.id || Math.random().toString(36).substr(2, 9),
        type: block.type,
        content: block.content || {},
      }));
    }
  } else {
    projectData.content = [];
  }

  // Set default values
  projectData.status = projectData.status || "draft";

  const { data, error } = await supabase
    .from("projects")
    .insert([projectData])
    .select();

  if (error) throw error;
  return data[0];
};

export const getProjectById = async (id) => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Project not found");
  return data;
};

export const updateProject = async (id, updateData) => {
  // Validate required fields
  if (!updateData.title) {
    throw new Error("Title is required");
  }

  // Auto-generate slug if not provided and title is being updated
  if (!updateData.slug && updateData.title) {
    updateData.slug = updateData.title.toLowerCase().replace(/\s+/g, "-");
  }

  // Ensure arrays are properly formatted
  if (updateData.categories && typeof updateData.categories === "string") {
    updateData.categories = updateData.categories
      .split(",")
      .map((cat) => cat.trim())
      .filter((cat) => cat);
  }
  if (updateData.goals && typeof updateData.goals === "string") {
    updateData.goals = updateData.goals
      .split(",")
      .map((goal) => goal.trim())
      .filter((goal) => goal);
  }

  // Ensure content blocks are properly handled
  if (updateData.content) {
    // Validate content blocks structure
    if (Array.isArray(updateData.content)) {
      updateData.content = updateData.content.map((block) => ({
        id: block.id || Math.random().toString(36).substr(2, 9),
        type: block.type,
        content: block.content || {},
      }));
    }
  } else {
    updateData.content = [];
  }

  const { data, error } = await supabase
    .from("projects")
    .update(updateData)
    .eq("id", id)
    .select();

  if (error) throw error;
  if (!data || data.length === 0) throw new Error("Project not found");
  return data[0];
};

export const deleteProject = async (id) => {
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) throw error;
};
