-- Migration: Add foreign key constraint to project_translations table

-- Add foreign key constraint linking project_translations.project_id to projects.id
ALTER TABLE public.project_translations
  ADD CONSTRAINT project_translations_project_id_fkey
  FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;

-- Add index on project_id for better join performance
CREATE INDEX IF NOT EXISTS idx_project_translations_project_id
  ON public.project_translations(project_id);
