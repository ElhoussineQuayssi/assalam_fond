import { createClient } from '@/utils/supabase/client';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import BlogPostPage from './BlogPostPage';

export async function generateMetadata({ params }) {
  const { locale, id } = await params;
  const supabase = createClient();

  try {
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !post) {
      return {
        title: 'Blog Post Not Found',
        description: 'The requested blog post could not be found.',
      };
    }

    const t = await getTranslations({ locale, namespace: 'Blogs' });

    return {
      title: `${post.title} - ${t('hero.title')}`,
      description: post.excerpt,
    };
  } catch (error) {
    console.error('Error fetching blog post for metadata:', error);
    return {
      title: 'Blog Post',
      description: 'Read our latest blog posts.',
    };
  }
}

export default function Page({ params }) {
  return <BlogPostPage params={params} />;
}