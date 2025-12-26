"use client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function BlogFilters({
  search = '',
  statusFilter = 'all',
  categoryFilter = 'all',
  onSearchChange,
  onStatusChange,
  onCategoryChange,
  className = ""
}) {
  return (
    <div className={`mb-6 space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search blog posts..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="benevolat">Benevolat</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="social">Social</SelectItem>
            <SelectItem value="economic">Economic</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}