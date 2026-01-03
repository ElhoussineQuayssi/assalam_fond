/**
 * Loading component for the [locale] route group
 * Automatically shows during page transitions and data fetching
 */
export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-6">
          <div className="h-12 w-96 mx-auto bg-gray-300 rounded-lg"></div>
          <div className="h-6 w-80 mx-auto bg-gray-300 rounded"></div>
          <div className="h-12 w-40 mx-auto bg-gray-300 rounded-full"></div>
        </div>
      </section>

      {/* Content Section Skeleton */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded"></div>

              <div className="space-y-4 mt-8">
                <div className="h-64 w-full bg-gray-200 rounded-2xl"></div>
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="h-6 w-32 bg-gray-200 rounded"></div>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-full bg-gray-200 rounded"></div>
                        <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="h-6 w-24 bg-gray-200 rounded"></div>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-8 w-16 bg-gray-200 rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
