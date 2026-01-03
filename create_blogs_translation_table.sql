-- Create the blogs_translation table for multilingual blog posts
CREATE TABLE IF NOT EXISTS public.blogs_translation (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blog_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    lang VARCHAR(2) NOT NULL CHECK (lang IN ('en', 'ar')),
    title TEXT,
    excerpt TEXT,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(blog_id, lang)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blogs_translation_blog_id ON public.blogs_translation(blog_id);
CREATE INDEX IF NOT EXISTS idx_blogs_translation_lang ON public.blogs_translation(lang);

-- Enable Row Level Security (RLS)
ALTER TABLE public.blogs_translation ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (admins)
CREATE POLICY "Allow authenticated users to manage blog translations" ON public.blogs_translation
    FOR ALL USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blogs_translation_updated_at
    BEFORE UPDATE ON public.blogs_translation
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();