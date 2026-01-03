import { NextResponse } from "next/server";
import {
  updateProject,
  validateProjectData,
} from "@/controllers/projectsController";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

// Standardized error response format
const errorResponse = (message, status = 400, details = null) => {
  return NextResponse.json(
    {
      success: false,
      error: message,
      details: details,
      timestamp: new Date().toISOString(),
    },
    { status },
  );
};

// Success response format
const successResponse = (data, status = 200) => {
  return NextResponse.json(
    {
      success: true,
      data: data,
      timestamp: new Date().toISOString(),
    },
    { status },
  );
};

export async function GET(_request, { params }) {
  try {
    // Await params Promise (Next.js 13+ requirement)
    const { id } = await params;

    if (!id) {
      return errorResponse("Project ID is required", 400);
    }

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return errorResponse("Project not found", 404);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Server error:", error);
    return errorResponse("Internal server error", 500);
  }
}

export async function PUT(request, { params }) {
  try {
    // Await params Promise (Next.js 13+ requirement)
    const { id } = await params;

    if (!id) {
      return errorResponse("Project ID is required", 400);
    }

    const requestData = await request.json();

    // Handle empty or null request data
    if (!requestData || Object.keys(requestData).length === 0) {
      return errorResponse("Request body is required", 400);
    }

    // Process the excerpt field - handle both excerpt and description
    const processedData = {
      ...requestData,
      // Ensure excerpt is properly mapped
      excerpt: requestData.excerpt || requestData.description,
      // Ensure arrays are properly handled
      content: Array.isArray(requestData.content) ? requestData.content : [],
      categories: Array.isArray(requestData.categories)
        ? requestData.categories
        : [],
      goals: Array.isArray(requestData.goals) ? requestData.goals : [],
      updated_at: new Date().toISOString(),
    };

    // Validate the processed data (which has proper excerpt mapping)
    // For updates, be less strict about content validation to allow saving incomplete content
    const validationErrors = validateProjectData(processedData, {
      allowIncompleteContent: true,
    });

    if (validationErrors.length > 0) {
      console.log("Validation errors:", validationErrors);
      return errorResponse("Validation failed", 400, {
        errors: validationErrors,
      });
    }

    // Remove id and unknown fields from update data if present
    delete processedData.id;
    // Remove featured field if it doesn't exist in database schema
    delete processedData.featured;
    // Remove share_on_social field if it doesn't exist in database schema
    delete processedData.share_on_social;

    const data = await updateProject(id, processedData);
    return successResponse(data);
  } catch (error) {
    console.error("Server error:", error);
    return errorResponse(`Update failed: ${error.message}`, 500, {
      originalError: error.message,
    });
  }
}

export async function DELETE(_request, { params }) {
  try {
    // Await params Promise (Next.js 13+ requirement)
    const { id } = await params;

    if (!id) {
      return errorResponse("Project ID is required", 400);
    }

    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      console.error("Supabase error:", error);
      return errorResponse("Failed to delete project", 500);
    }

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Server error:", error);
    return errorResponse("Internal server error", 500);
  }
}
