import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getBlogPostWithTranslations } from "@/controllers/blogPostsController";
import BlogPostPage from "./BlogPostPage";

export async function generateMetadata({ params }) {
  const { locale, id } = await params;

  try {
    const post = await getBlogPostWithTranslations(id);

    if (!post) {
      return {
        title: "Blog Post Not Found",
        description: "The requested blog post could not be found.",
      };
    }

    const t = await getTranslations({ locale, namespace: "Blogs" });
    const title = post.title[locale] || post.title.fr || "Blog Post";
    const excerpt =
      post.excerpt[locale] || post.excerpt.fr || "Read our latest blog posts.";

    return {
      title: `${title} - ${t("hero.title")}`,
      description: excerpt,
    };
  } catch (error) {
    console.error("Error fetching blog post for metadata:", error);
    return {
      title: "Blog Post",
      description: "Read our latest blog posts.",
    };
  }
}

export default async function Page({ params }) {
  const { id } = await params;

  try {
    const post = await getBlogPostWithTranslations(id);
    if (!post) {
      notFound();
    }

    return <BlogPostPage params={params} post={post} />;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    notFound();
  }
}
