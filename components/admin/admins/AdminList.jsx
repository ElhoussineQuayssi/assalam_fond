"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table } from "@/components/ui/table";

export default function AdminList({
  admins = [],
  loading = false,
  error = null,
  onRefresh,
  onAddNew,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <Card className="rounded-lg border bg-white shadow-sm border-gray-200 dark:bg-[#1A1F2E] dark:shadow-none">
        <CardContent className="p-0">
          <div className="p-6 text-center">Loading admins...</div>
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-400">
          Admins Management
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onRefresh} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={onAddNew}>
            Add New Admin
          </Button>
        </div>
      </div>

      <Card className="rounded-lg border bg-white shadow-sm border-gray-200 dark:bg-[#1A1F2E] dark:shadow-none">
        <CardContent className="p-0">
          <Table
            columns={[
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              {
                key: "role",
                label: "Role",
                render: (row) => (
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      row.role === "super_admin"
                        ? "bg-purple-100 text-purple-800"
                        : row.role === "content_manager"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {row.role === "super_admin"
                      ? "Super Admin"
                      : row.role === "content_manager"
                        ? "Content Manager"
                        : row.role === "messages_manager"
                          ? "Messages Manager"
                          : row.role}
                  </span>
                ),
              },
              {
                key: "actions",
                label: "Actions",
                render: (row) => (
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="dark:border-slate-700 dark:text-slate-300"
                      onClick={() => onEdit(row)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400"
                      onClick={() => onDelete(row.id)}
                    >
                      Delete
                    </Button>
                  </div>
                ),
              },
            ]}
            data={admins}
          />
        </CardContent>
      </Card>
    </>
  );
}
