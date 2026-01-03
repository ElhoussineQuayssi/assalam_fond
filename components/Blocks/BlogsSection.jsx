"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useAppData } from "@/components/AppDataContext";
import Container from "@/components/Container/Container.jsx";
import MarqueeText from "@/components/MarqueeText";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";

gsap.registerPlugin(ScrollTrigger);

export default function BlogsSection() {
  const t = useTranslations("Home.blogs");
  const { blogs, loading } = useAppData();
  const { locale } = useParams();
  const sectionRef = useRef();
  const [visibleBlogs, setVisibleBlogs] = useState(3);
  const [newlyLoaded, setNewlyLoaded] = useState(new Set());
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!loading && blogs.length > 0) {
      const cards = gsap.utils.toArray(".blog-card");
      gsap.set(cards, { y: 50, opacity: 0 });

      ScrollTrigger.batch(cards, {
        onEnter: (batch) =>
          gsap.to(batch, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
          }),
        start: "top 85%",
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    }
  }, [loading, blogs]);

  useEffect(() => {
    if (newlyLoaded.size > 0) {
      gsap.fromTo(
        ".new-blog",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          onComplete: () => setNewlyLoaded(new Set()),
        },
      );
    }
  }, [newlyLoaded.size]);

  // Infinite scroll effect
  useEffect(() => {
    if (visibleBlogs >= blogs.length || loading || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && !loading) {
          setIsLoadingMore(true);
          // Add a small delay to simulate loading
          setTimeout(() => {
            const newVisible = Math.min(visibleBlogs + 3, blogs.length);
            const newIds = Array.from(
              { length: newVisible - visibleBlogs },
              (_, i) => visibleBlogs + i,
            );
            setNewlyLoaded(new Set([...newlyLoaded, ...newIds]));
            setVisibleBlogs(newVisible);
            setIsLoadingMore(false);
          }, 500);
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [visibleBlogs, blogs.length, loading, isLoadingMore, newlyLoaded]);

  return (
    <section ref={sectionRef} className="py-20">
      <Container>
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-900">{t("title")}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-slate-500">Loading blogs...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-slate-500">No blogs available.</p>
            </div>
          ) : (
            blogs.slice(0, visibleBlogs).map((blog, index) => {
              const resolve = (field) => {
                if (!field) return "";
                if (typeof field === "string") return field;
                // field is likely an object like { fr: "...", en: "..." }
                return (
                  (locale && field[locale]) ||
                  field.fr ||
                  field.en ||
                  Object.values(field)[0] ||
                  ""
                );
              };

              const title = resolve(blog.title);
              const excerpt = resolve(blog.excerpt || blog.content);

              return (
                <Link key={blog.id} href={`/blogs/${blog.id}`}>
                  <Card
                    className={`overflow-hidden group blog-card cursor-pointer ${newlyLoaded.has(index) ? "new-blog" : ""}`}
                  >
                    <div className="aspect-video bg-slate-200 group-hover:scale-105 transition-transform" />
                    <CardHeader className="p-4">
                      <span className="text-blue-500 text-xs font-medium">
                        {new Date(blog.created_at).toLocaleDateString()}
                      </span>
                      <MarqueeText
                        text={title}
                        className="text-lg mt-2 font-semibold"
                      />
                      <CardDescription className="line-clamp-2">
                        {excerpt}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })
          )}
        </div>

        {/* Infinite Scroll Sentinel */}
        {visibleBlogs < blogs.length && !loading && (
          <div ref={sentinelRef} className="flex justify-center py-8">
            {isLoadingMore ? (
              <div className="flex items-center gap-3 text-slate-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-sm">Loading more blogs...</span>
              </div>
            ) : (
              <div className="h-4"></div>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}
