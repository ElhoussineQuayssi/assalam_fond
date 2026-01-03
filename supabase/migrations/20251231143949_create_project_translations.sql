-- Migration: create project_translations table

CREATE TABLE IF NOT EXISTS public.project_translations (
  id uuid not null default extensions.uuid_generate_v4 (),
  project_id text not null,
  lang text not null,
  title text null,
  excerpt text null,
  people_helped text null,
  content jsonb null,
  slug text null,
  metadata jsonb null default '{}'::jsonb,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint project_translations_pkey primary key (id),
  constraint project_translations_project_id_lang_key unique (project_id, lang),
  constraint project_translations_lang_check check (
    (
      lang = any (array['fr'::text, 'en'::text, 'ar'::text])
    )
  )
) TABLESPACE pg_default;

-- Ensure slug is unique globally across translations
ALTER TABLE public.project_translations
  ADD CONSTRAINT project_translations_slug_key UNIQUE (slug);

create index IF not exists idx_project_translations_project_lang on public.project_translations using btree (project_id, lang) TABLESPACE pg_default;
