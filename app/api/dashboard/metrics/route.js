import { getDashboardMetrics } from "@/controllers/dashboardController";
import { NextResponse } from "next/server";

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

export async function GET() {
  try {
    console.log("GET /api/dashboard/metrics called");
    const data = await getDashboardMetrics();
    console.log("Dashboard metrics fetched successfully:", data);
    return successResponse(data);
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    return errorResponse("Failed to fetch dashboard metrics", 500, {
      originalError: error.message,
      stack: error.stack,
    });
  }
}
