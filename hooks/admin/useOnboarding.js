"use client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// Mock admin data for development
const mockAdmin = {
  id: "demo-admin-123",
  name: "Demo Admin",
  email: "admin@demo.com",
};

export function useOnboarding() {
  const [onboardingStatus, setOnboardingStatus] = useState({
    completed: false,
    step: 0,
    data: {},
    admin: null,
    loading: true,
    error: null,
  });

  const router = useRouter();

  // Fetch onboarding status from localStorage and API
  const fetchOnboardingStatus = useCallback(async () => {
    try {
      setOnboardingStatus((prev) => ({ ...prev, loading: true, error: null }));

      // First check localStorage for cached data
      const localData =
        typeof window !== "undefined"
          ? localStorage.getItem("onboardingData")
          : null;
      let cachedData = null;

      if (localData) {
        try {
          cachedData = JSON.parse(localData);
        } catch (_e) {
          console.warn("Invalid localStorage data, ignoring cache");
        }
      }

      // Fetch from API
      const response = await fetch("/api/onboarding/status");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch onboarding status");
      }

      // Merge API data with localStorage cache (prefer localStorage for user progress)
      const apiData = result.onboarding;
      const mergedData = {
        ...apiData,
        ...(cachedData && {
          completed: cachedData.completed ?? apiData.completed,
          step: cachedData.step ?? apiData.step,
          data: { ...apiData.data, ...cachedData.data },
        }),
      };

      setOnboardingStatus({
        completed: mergedData.completed,
        step: mergedData.step,
        data: mergedData.data,
        admin: mergedData.admin,
        loading: false,
        error: null,
      });

      // Update localStorage with merged data
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "onboardingData",
          JSON.stringify({
            completed: mergedData.completed,
            step: mergedData.step,
            data: mergedData.data,
            lastUpdated: new Date().toISOString(),
          }),
        );
      }

      return mergedData;
    } catch (error) {
      console.error("Error fetching onboarding status:", error);

      // Fallback to localStorage only
      if (typeof window !== "undefined") {
        const localData = localStorage.getItem("onboardingData");
        if (localData) {
          try {
            const cachedData = JSON.parse(localData);
            setOnboardingStatus({
              completed: cachedData.completed || false,
              step: cachedData.step || 0,
              data: cachedData.data || {},
              admin: mockAdmin,
              loading: false,
              error: null,
            });
            return cachedData;
          } catch (_e) {
            console.warn("Invalid cached data, using defaults");
          }
        }
      }

      // Final fallback to defaults
      const defaultData = {
        completed: false,
        step: 0,
        data: {},
        admin: mockAdmin,
      };

      setOnboardingStatus({
        ...defaultData,
        loading: false,
        error: error.message,
      });

      return defaultData;
    }
  }, []);

  // Update onboarding status
  const updateOnboardingStatus = useCallback(
    async (updates) => {
      try {
        const response = await fetch("/api/onboarding/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to update onboarding status");
        }

        // Update local state
        const newState = {
          ...onboardingStatus,
          ...updates,
          error: null,
        };

        setOnboardingStatus(newState);

        // Persist to localStorage
        if (typeof window !== "undefined") {
          const storageData = {
            completed: newState.completed,
            step: newState.step,
            data: newState.data,
            lastUpdated: new Date().toISOString(),
          };
          localStorage.setItem("onboardingData", JSON.stringify(storageData));
        }

        return result;
      } catch (error) {
        console.error("Error updating onboarding status:", error);

        // Even if API fails, update localStorage for offline functionality
        if (typeof window !== "undefined") {
          const newState = {
            ...onboardingStatus,
            ...updates,
            error: error.message,
          };

          setOnboardingStatus(newState);

          const storageData = {
            completed: newState.completed,
            step: newState.step,
            data: newState.data,
            lastUpdated: new Date().toISOString(),
          };
          localStorage.setItem("onboardingData", JSON.stringify(storageData));

          return {
            success: true,
            message: "Updated locally (API unavailable)",
          };
        }

        setOnboardingStatus((prev) => ({
          ...prev,
          error: error.message,
        }));
        return null;
      }
    },
    [onboardingStatus],
  );

  // Mark onboarding as complete
  const completeOnboarding = useCallback(async () => {
    const result = await updateOnboardingStatus({
      completed: true,
      step: 100,
    });

    if (result) {
      // Redirect to main dashboard
      router.push("/admin");
    }

    return result;
  }, [updateOnboardingStatus, router]);

  // Update progress step
  const updateProgress = useCallback(
    async (step, additionalData = {}) => {
      return await updateOnboardingStatus({
        step: Math.min(step, 100),
        data: {
          ...onboardingStatus.data,
          ...additionalData,
          lastUpdated: new Date().toISOString(),
        },
      });
    },
    [updateOnboardingStatus, onboardingStatus.data],
  );

  // Save user preferences
  const savePreferences = useCallback(
    async (preferences) => {
      return await updateOnboardingStatus({
        data: {
          ...onboardingStatus.data,
          preferences: {
            ...onboardingStatus.data.preferences,
            ...preferences,
          },
        },
      });
    },
    [updateOnboardingStatus, onboardingStatus.data],
  );

  // Skip onboarding
  const skipOnboarding = useCallback(async () => {
    return await completeOnboarding();
  }, [completeOnboarding]);

  // Initialize on mount
  useEffect(() => {
    fetchOnboardingStatus();
  }, [fetchOnboardingStatus]);

  return {
    // State
    completed: onboardingStatus.completed,
    step: onboardingStatus.step,
    data: onboardingStatus.data,
    admin: onboardingStatus.admin,
    loading: onboardingStatus.loading,
    error: onboardingStatus.error,

    // Actions
    fetchOnboardingStatus,
    updateOnboardingStatus,
    completeOnboarding,
    updateProgress,
    savePreferences,
    skipOnboarding,

    // Computed values
    isNewUser: !onboardingStatus.completed && onboardingStatus.step === 0,
    progressPercentage: onboardingStatus.step,
    hasStarted: onboardingStatus.step > 0,
  };
}
