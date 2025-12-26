"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SharedHero from "@/components/Hero/SharedHero.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useAppData } from "@/components/AppDataContext";
import MarqueeText from "@/components/MarqueeText";

gsap.registerPlugin(ScrollTrigger);

export default function BlogsPage() {
  const t = useTranslations("Blogs");
  const { blogs, loading, allProjectImages } = useAppData();

  // Memoize blog posts to prevent infinite re-renders
  const blogPosts = useMemo(() => {
    console.log(`BlogsPage: Processing ${blogs.length} blog posts`);
    const processed = blogs.map((post, index) => ({
      ...post,
      image: post.image || `/blog-${index + 1}.jpg`,
    }));
    console.log(`BlogsPage: Processed ${processed.length} posts with images`);
    return processed;
  }, [blogs]);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(blogs.map((post) => post.category).filter(Boolean)),
    ];
    return [t("all_categories") || "All", ...uniqueCategories];
  }, [blogs, t]);

  const [filteredPosts, setFilteredPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState(3);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Initialize state when blogPosts or categories change
  useEffect(() => {
    if (blogPosts.length > 0) {
      setFilteredPosts(blogPosts);
      setSelectedCategory(categories[0] || "");
    }
  }, [blogPosts, categories]);

  useEffect(() => {
    if (blogs.length === 0) return;

    // Reveal blog cards one by one
    gsap.from(".blog-card", {
      opacity: 0,
      y: 60,
      stagger: 0.2,
      duration: 1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: ".blog-grid",
        start: "top 80%",
      },
    });

    // Sidebar entrance
    gsap.from(".sidebar-widget", {
      opacity: 0,
      x: 30,
      stagger: 0.15,
      duration: 1,
      ease: "power2.out",
      delay: 0.5,
    });

    // Hover animations for blog cards
    const cards = document.querySelectorAll(".blog-card");
    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, { scale: 1.05, duration: 0.3, ease: "power2.out" });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { scale: 1, duration: 0.3, ease: "power2.out" });
      });
    });
  }, [blogs]);

  useEffect(() => {
    if (blogPosts.length === 0) return;

    console.time("filterPosts");
    let filtered = blogPosts;

    // Filter by category
    if (selectedCategory && selectedCategory !== categories[0]) {
      // categories[0] is "All"
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredPosts(filtered);
    setVisiblePosts(3); // Reset visible posts when filtering
    console.timeEnd("filterPosts");
    console.log(`Filtered to ${filtered.length} posts`);
  }, [selectedCategory, searchTerm, blogPosts, categories]);

  const featuredPost = blogPosts[0];
  const regularPosts = filteredPosts.slice(1);

  // Show loading state if posts are not loaded yet
  if (blogPosts.length === 0) {
    return (
      <main className="bg-slate-50/50 min-h-screen">
        {/* Shared Hero */}
        <SharedHero
          title={t("hero.title")}
          description={t("hero.subtitle")}
          allProjectImages={allProjectImages}
          showScrollButton={true}
        />
        <div className="container mx-auto px-6 py-20 text-center">
          <p>Loading blog posts...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-slate-50/50 min-h-screen">
      {/* Shared Hero */}
      <SharedHero
        title={t("hero.title")}
        description={t("hero.subtitle")}
        allProjectImages={allProjectImages}
        showScrollButton={true}
      />

      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12" id="blog-posts">
            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPosts.slice(0, visiblePosts).map((post, index) => (
                <article
                  key={post.id}
                  className="blog-card group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500"
                >
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                      {post.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <div className="flex items-center gap-4 text-[10px] text-slate-400 mb-4 uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {post.readTime}
                      </span>
                    </div>
                    <MarqueeText
                      text={post.title}
                      className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors"
                    />
                    <p className="text-slate-500 text-sm line-clamp-2 mb-6">
                      {post.excerpt}
                    </p>
                    <Link
                      href={`/blogs/${post.id}`}
                      className="flex items-center gap-2 text-blue-600 font-black text-xs group-hover:gap-4 transition-all"
                    >
                      {t("read_more")} <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More */}
            {visiblePosts < filteredPosts.length && (
              <div className="text-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() =>
                    setVisiblePosts((prev) =>
                      Math.min(prev + 3, filteredPosts.length),
                    )
                  }
                  className="rounded-full px-8"
                >
                  {t("load_more")}
                </Button>
              </div>
            )}
          </div>

          {/* Sticky Sidebar */}
          <aside
            className="lg:col-span-4 space-y-8 h-fit sticky top-28"
            id="blog-sidebar"
          >
            {/* Search Box */}
            <div className="sidebar-widget p-8 bg-slate-50 backdrop-blur-md rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50">
              <h4 className="font-bold mb-4 text-sm">
                {t("sidebar.categories_title")}
              </h4>
              <div className="relative">
                <Input
                  className="rounded-full pr-12 h-12 bg-slate-50 border-none"
                  placeholder={t("sidebar.search_placeholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
              </div>
            </div>

            {/* Categories Badge Cloud */}
            <div className="sidebar-widget p-8 bg-white backdrop-blur-md rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50">
              <h4 className="font-bold mb-4 text-sm">
                {t("sidebar.categories_title")}
              </h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Posts */}
            <div className="sidebar-widget p-8 bg-white backdrop-blur-md rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50">
              <h4 className="font-bold mb-4 text-sm">
                {t("sidebar.recent_posts_title")}
              </h4>
              <div className="space-y-4">
                {blogPosts.slice(0, 3).map((recentPost) => (
                  <div key={recentPost.id} className="flex gap-3">
                    <div className="w-12 h-12 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={recentPost.image}
                        alt={recentPost.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-medium text-slate-900 line-clamp-2 mb-1">
                        {recentPost.title}
                      </h5>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                        {recentPost.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
