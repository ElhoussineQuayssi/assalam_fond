import { NextResponse } from "next/server";
import { getAnalyticsCategories } from "@/controllers/analyticsController";

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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d";

    console.log("GET /api/analytics/categories called with period:", period);
    const data = await getAnalyticsCategories(period);
    console.log("Analytics categories fetched successfully");
    return successResponse(data);
  } catch (error) {
    console.error("Error fetching analytics categories:", error);
    return errorResponse("Failed to fetch analytics categories", 500, {
      originalError: error.message,
      stack: error.stack,
    });
  }
}
