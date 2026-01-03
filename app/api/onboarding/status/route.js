import { NextResponse } from "next/server";

// Mock admin data for development (no authentication required)
const mockAdmin = {
  id: "demo-admin-123",
  name: "Demo Admin",
  email: "admin@demo.com",
};

// Default onboarding status
const getDefaultOnboardingStatus = () => ({
  completed: false,
  step: 0,
  data: {},
  admin: mockAdmin,
});

// Helper function to get onboarding data from localStorage (server-side simulation)
const getStoredOnboardingData = () => {
  // In a real app, this would come from a database
  // For demo purposes, we'll return default data
  return getDefaultOnboardingStatus();
};

// Helper function to store onboarding data (server-side simulation)
const storeOnboardingData = (_data) => {
  // In a real app, this would save to a database
  // For demo purposes, we'll just return success
  return true;
};

export async function GET(_request) {
  try {
    // Return mock onboarding status (no authentication required)
    const onboardingData = getStoredOnboardingData();

    return NextResponse.json({
      success: true,
      onboarding: onboardingData,
    });
  } catch (error) {
    console.error("Error fetching onboarding status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { completed, step, data } = body;

    // Get current onboarding data
    const currentData = getStoredOnboardingData();

    // Update with new data
    const updatedData = {
      ...currentData,
      ...(completed !== undefined && { completed }),
      ...(step !== undefined && { step }),
      ...(data !== undefined && { data: { ...currentData.data, ...data } }),
    };

    // Store updated data (mock implementation)
    const success = storeOnboardingData(updatedData);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update onboarding status" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Onboarding status updated successfully",
      onboarding: updatedData,
    });
  } catch (error) {
    console.error("Error updating onboarding status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
