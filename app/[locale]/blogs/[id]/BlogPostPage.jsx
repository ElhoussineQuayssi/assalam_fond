"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Copy,
  Facebook,
  Linkedin,
  Link as LinkIcon,
  Mail,
  MessageCircle,
  Send,
  Share2,
  Tag,
  TrendingUp,
  Twitter,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { use, useEffect, useState } from "react";
import { useAppData } from "@/components/AppDataContext";
import BlogComments from "@/components/BlogComments";
import Container from "@/components/Container/Container.jsx";
import SharedHero from "@/components/Hero/SharedHero.jsx";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

export default function BlogPostPage({ params, post: serverPost }) {
  const t = useTranslations("Blogs");
  const { id, locale } = use(params);
  const { blogs, allProjectImages } = useAppData();
  const [copied, setCopied] = useState(false);

  let post = blogs.find((p) => p.id === id);

  // If server-side post is provided, use it and transform for the locale
  if (serverPost) {
    const content = serverPost.content[locale] || serverPost.content.fr || "";
    const readTime = Math.ceil(
      content.replace(/<[^>]*>/g, "").split(/\s+/).length / 200,
    ); // Assuming 200 words per minute

    post = {
      ...serverPost,
      title: serverPost.title[locale] || serverPost.title.fr || "",
      excerpt: serverPost.excerpt[locale] || serverPost.excerpt.fr || "",
      content: content,
      date: new Date(serverPost.published_at).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      readTime: `${readTime} min read`,
      // Keep other fields like slug, category, etc.
    };
  }

  if (!post) {
    notFound();
  }

  // Add image to post
  const fullPost = {
    ...post,
    image: post.image || `/blog-${blogs.indexOf(post) + 1}.jpg`,
  };

  // Get all posts for sidebar
  const allPosts = blogs.map((p, index) => ({
    ...p,
    image: p.image || `/blog-${index + 1}.jpg`,
  }));

  // Get related posts (excluding current post)
  const relatedPosts = allPosts.filter((p) => p.id !== id).slice(0, 5);

  // Get recent posts (excluding current)
  const recentPosts = allPosts.filter((p) => p.id !== id).slice(0, 3);

  // Get categories
  const categories = [...new Set(blogs.map((p) => p.category).filter(Boolean))];

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = encodeURIComponent(
    `${fullPost.title} - ${t("hero.title")}`,
  );

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  useEffect(() => {
    // Sidebar entrance with stagger
    gsap.from(".sidebar-widget", {
      opacity: 0,
      x: 30,
      stagger: 0.15,
      duration: 1,
      ease: "power2.out",
      delay: 0.5,
    });

    // Animate related posts on scroll
    gsap.from(".related-post", {
      opacity: 0,
      y: 60,
      stagger: 0.2,
      duration: 1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: ".related-posts",
        start: "top 80%",
      },
    });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Shared Hero */}
      <SharedHero
        title={fullPost.title}
        description={fullPost.excerpt}
        allProjectImages={allProjectImages}
        showScrollButton={false}
      />

      {/* Article Content */}
      <section className="py-20 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-8">
              {/* Back Button */}
              <Link href="/blogs">
                <Button variant="ghost" className="mb-8 group">
                  <ArrowLeft
                    size={16}
                    className="mr-2 group-hover:-translate-x-1 transition-transform"
                  />
                  {t("back_to_blog")}
                </Button>
              </Link>

              {/* Article Header */}
              <header className="mb-12">
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                    {fullPost.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {fullPost.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {fullPost.readTime}
                  </span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 leading-tight">
                  {fullPost.title}
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  {fullPost.excerpt}
                </p>
              </header>

              {/* Featured Image */}
              <div className="aspect-video bg-slate-100 rounded-3xl mb-12 overflow-hidden shadow-lg">
                <Image
                  src={fullPost.image}
                  alt={fullPost.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>

              {/* Article Content */}
              <article className="prose prose-xl max-w-none prose-headings:text-slate-900 prose-headings:font-black prose-p:text-slate-700 prose-p:leading-relaxed prose-li:text-slate-700 prose-blockquote:text-slate-600 prose-blockquote:border-l-4 prose-blockquote:border-blue-200 prose-blockquote:bg-blue-50/50 prose-blockquote:p-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:font-medium mb-16">
                {/* biome-ignore lint: security/noDangerouslySetInnerHtml - Content comes from trusted admin panel */}
                <div dangerouslySetInnerHTML={{ __html: fullPost.content }} />
              </article>

              {/* Comments Section */}
              <BlogComments postId={id} />
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-8 h-fit sticky top-28">
              {/* Share in Media */}
              <div className="sidebar-widget p-6 bg-white/70 backdrop-blur-md rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Share2 size={16} className="text-green-600" />
                  </div>
                  <h4 className="font-bold text-sm">
                    {t("sidebar.share_in_media")}
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
                        "_blank",
                      )
                    }
                    className="rounded-full"
                  >
                    <Facebook size={14} className="mr-1" />
                    FB
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(
                        `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`,
                        "_blank",
                      )
                    }
                    className="rounded-full"
                  >
                    <Twitter size={14} className="mr-1" />
                    TW
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(
                        `https://wa.me/?text=${shareText}%20${encodeURIComponent(shareUrl)}`,
                        "_blank",
                      )
                    }
                    className="rounded-full"
                  >
                    <MessageCircle size={14} className="mr-1" />
                    WA
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(
                        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
                        "_blank",
                      )
                    }
                    className="rounded-full"
                  >
                    <Linkedin size={14} className="mr-1" />
                    LI
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(
                        `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${shareText}`,
                        "_blank",
                      )
                    }
                    className="rounded-full"
                  >
                    <Send size={14} className="mr-1" />
                    TG
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(
                        `mailto:?subject=${encodeURIComponent(fullPost.title)}&body=${encodeURIComponent(`${fullPost.excerpt}\n\n${shareUrl}`)}`,
                        "_blank",
                      )
                    }
                    className="rounded-full"
                  >
                    <Mail size={14} className="mr-1" />
                    EM
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className={`w-full rounded-full transition-colors ${copied ? "bg-green-50 border-green-200 text-green-700" : ""}`}
                >
                  {copied ? (
                    <>
                      <Copy size={14} className="mr-1" />
                      {t("sidebar.link_copied")}
                    </>
                  ) : (
                    <>
                      <LinkIcon size={14} className="mr-1" />
                      {t("sidebar.copy_link")}
                    </>
                  )}
                </Button>
              </div>

              {/* Related Articles */}
              <div className="sidebar-widget p-6 bg-white/70 backdrop-blur-md rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <TrendingUp size={16} className="text-orange-600" />
                  </div>
                  <h4 className="font-bold text-sm">
                    {t("sidebar.related_articles")}
                  </h4>
                </div>
                <div className="space-y-3">
                  {relatedPosts.slice(0, 3).map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      href={`/blogs/${relatedPost.id}`}
                    >
                      <div className="flex gap-3 group p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="w-12 h-12 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-medium text-slate-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                            {relatedPost.title}
                          </h5>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                            {relatedPost.date}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent Posts */}
              <div className="sidebar-widget p-6 bg-white/70 backdrop-blur-md rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Clock size={16} className="text-red-600" />
                  </div>
                  <h4 className="font-bold text-sm">
                    {t("sidebar.recent_posts_title")}
                  </h4>
                </div>
                <div className="space-y-3">
                  {recentPosts.map((recentPost) => (
                    <Link key={recentPost.id} href={`/blogs/${recentPost.id}`}>
                      <div className="flex gap-3 group p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="w-12 h-12 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={recentPost.image}
                            alt={recentPost.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-medium text-slate-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                            {recentPost.title}
                          </h5>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                            {recentPost.date}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="sidebar-widget p-6 bg-gradient-to-br from-slate-50 to-gray-50 backdrop-blur-md rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <Tag size={16} className="text-teal-600" />
                  </div>
                  <h4 className="font-bold text-sm">
                    {t("sidebar.categories_title")}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Link key={category} href={`/blogs?category=${category}`}>
                      <span className="px-3 py-1 bg-white text-slate-700 text-xs rounded-full hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">
                        {category}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </div>
  );
}
