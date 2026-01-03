"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ProjectList({
  projects = [],
  loading = false,
  error = null,
  // Actions
  onRefresh,
  onAddNew,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <Card className="rounded-lg border bg-white shadow-sm border-gray-200 dark:bg-[#1A1F2E] dark:shadow-none">
        <CardContent className="p-0">
          <div className="p-6 text-center">Loading projects...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-400">
          Projects Management
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <Button variant="outline" onClick={onRefresh} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={onAddNew}>
            Add New Project
          </Button>
        </div>
      </div>

      <Card className="rounded-lg border bg-white shadow-sm border-gray-200 dark:bg-[#1A1F2E] dark:shadow-none">
        <CardContent className="p-0">
          {projects.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-slate-500 dark:text-slate-400">
                No projects found. Click "Add New Project" to create one.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                      Categories
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                      People Helped
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                      Updated At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-600">
                  {projects.map((project) => (
                    <tr
                      key={project.id}
                      className="hover:bg-gray-50 dark:hover:bg-slate-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {project.title && project.title.length > 25
                          ? `${project.title.substring(0, 25)}...`
                          : project.title || "Untitled"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                        {project.slug && project.slug.length > 25
                          ? `${project.slug.substring(0, 25)}...`
                          : project.slug || "No slug"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                        {project.categories && project.categories.length > 0
                          ? project.categories.join(", ")
                          : "No categories"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            project.status === "published"
                              ? "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400"
                          }`}
                        >
                          {project.status || "draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                        {project.location || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                        {project.people_helped || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                        {project.updated_at
                          ? new Date(project.updated_at).toLocaleDateString()
                          : project.created_at
                            ? new Date(project.created_at).toLocaleDateString()
                            : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(project)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => onDelete(project.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
