import { getAnalyticsOverview } from '@/controllers/analyticsController';
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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';
    
    console.log('GET /api/analytics/overview called with period:', period);
    const data = await getAnalyticsOverview(period);
    console.log('Analytics overview fetched successfully');
    return successResponse(data);
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    return errorResponse('Failed to fetch analytics overview', 500, { 
      originalError: error.message,
      stack: error.stack 
    });
  }
}