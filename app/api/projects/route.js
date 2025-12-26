import { getAllProjects, createProject, validateProjectData } from '@/controllers/projectsController';
import { NextResponse } from 'next/server';

// Standardized error response format
const errorResponse = (message, status = 400, details = null) => {
  return NextResponse.json({
    success: false,
    error: message,
    details: details,
    timestamp: new Date().toISOString()
  }, { status });
};

// Success response format
const successResponse = (data, status = 200) => {
  return NextResponse.json({
    success: true,
    data: data,
    timestamp: new Date().toISOString()
  }, { status });
};

export async function GET() {
  try {
    const data = await getAllProjects();
    return successResponse(data);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return errorResponse('Failed to fetch projects', 500, { originalError: error.message });
  }
}

export async function POST(request) {
  try {
    const formData = await request.json();
    
    // Validate the request data
    const validationErrors = validateProjectData(formData);
    if (validationErrors.length > 0) {
      return errorResponse('Validation failed', 400, { errors: validationErrors });
    }
    
    // Process the data for complex content blocks
    const processedData = {
      ...formData,
      content: Array.isArray(formData.content) ? formData.content : [],
      categories: Array.isArray(formData.categories) ? formData.categories : [],
      goals: Array.isArray(formData.goals) ? formData.goals : [],
      // Ensure proper field mapping
      excerpt: formData.description || formData.excerpt,
    };
    
    const data = await createProject(processedData);
    return successResponse(data, 201);
  } catch (error) {
    console.error('Error creating project:', error);
    return errorResponse('Failed to create project', 500, { originalError: error.message });
  }
}