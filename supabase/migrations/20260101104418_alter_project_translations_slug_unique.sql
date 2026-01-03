-- Migration: alter project_translations to make slug unique per project instead of globally

ALTER TABLE public.project_translations DROP CONSTRAINT IF EXISTS project_translations_slug_key;

ALTER TABLE public.project_translations ADD CONSTRAINT project_translations_project_id_slug_key UNIQUE (project_id, slug);