import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Container from "@/components/Container/Container.jsx";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppData } from "@/components/AppDataContext";
import Link from "next/link";
import MarqueeText from "@/components/MarqueeText";

gsap.registerPlugin(ScrollTrigger);

export default function BlogsSection() {
  const t = useTranslations("Home.blogs");
  const { blogs, loading } = useAppData();
  const sectionRef = useRef();
  const [visibleBlogs, setVisibleBlogs] = useState(3);
  const [newlyLoaded, setNewlyLoaded] = useState(new Set());

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
  }, [visibleBlogs]);

  const showMore = () => {
    const newVisible = Math.min(visibleBlogs + 3, blogs.length);
    const newIds = Array.from(
      { length: newVisible - visibleBlogs },
      (_, i) => visibleBlogs + i,
    );
    setNewlyLoaded(new Set([...newlyLoaded, ...newIds]));
    setVisibleBlogs(newVisible);
  };

  return (
    <section ref={sectionRef} className="py-20">
      <Container>
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-black text-slate-900">{t("title")}</h2>
          {visibleBlogs < blogs.length && !loading && (
            <Button variant="outline" onClick={showMore}>
              {t("show_more")}
            </Button>
          )}
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
            blogs.slice(0, visibleBlogs).map((blog, index) => (
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
                      text={blog.title}
                      className="text-lg mt-2 font-semibold"
                    />
                    <CardDescription className="line-clamp-2">
                      {blog.content}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))
          )}
        </div>
      </Container>
    </section>
  );
}
