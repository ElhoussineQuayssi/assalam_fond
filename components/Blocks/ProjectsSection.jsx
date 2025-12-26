import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import Container from "@/components/Container/Container.jsx";
import {
  BookOpen,
  ShieldCheck,
  Zap,
  GraduationCap,
  Users,
  Briefcase,
} from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useAppData } from "@/components/AppDataContext";
import MarqueeText from "@/components/MarqueeText";

gsap.registerPlugin(ScrollTrigger);

const categoryIcons = {
  Education: BookOpen,
  Social: ShieldCheck,
  Economic: Zap,
  default: BookOpen,
};

const categoryColors = {
  Education: "bg-blue-50 text-blue-600 border-blue-200",
  Social: "bg-green-50 text-green-600 border-green-200",
  Economic: "bg-orange-50 text-orange-600 border-orange-200",
};

export default function ProjectsSection() {
  const t = useTranslations("Home.projects");
  const { projects, loading } = useAppData();
  const sectionRef = useRef();

  useEffect(() => {
    if (!loading && projects.length > 0) {
      const cards = gsap.utils.toArray(".project-card");
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

      // Hover animations
      cards.forEach((card) => {
        const icon = card.querySelector(".icon-container");
        const img = card.querySelector("img");

        const handleMouseEnter = () => {
          gsap.set(card, { transformOrigin: "center center" });
          gsap.to(card, {
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            duration: 0.3,
            ease: "power2.out",
          });
          gsap.to(icon, {
            y: -5,
            scale: 1.1,
            duration: 0.3,
            ease: "power2.out",
          });
          if (img)
            gsap.to(img, { scale: 1.1, duration: 0.3, ease: "power2.out" });
        };

        const handleMouseMove = (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          const rotateX = (y / rect.height) * -10;
          const rotateY = (x / rect.width) * 10;
          gsap.to(card, {
            rotationY: rotateY,
            rotationX: rotateX,
            duration: 0.3,
            ease: "power2.out",
            transformPerspective: 1000,
          });
        };

        const handleMouseLeave = () => {
          gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            duration: 0.5,
            ease: "power2.out",
          });
          gsap.to(icon, { y: 0, scale: 1, duration: 0.3, ease: "power2.out" });
          if (img)
            gsap.to(img, { scale: 1, duration: 0.3, ease: "power2.out" });
        };

        card.addEventListener("mouseenter", handleMouseEnter);
        card.addEventListener("mousemove", handleMouseMove);
        card.addEventListener("mouseleave", handleMouseLeave);
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    }
  }, [loading, projects]);

  return (
    <section ref={sectionRef} className="py-24 bg-slate-50">
      <Container>
        <div className="text-center mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#6495ED] mb-4 block">
            Nos Initiatives
          </span>
          <h2 className="text-3xl font-black text-slate-900">{t("title")}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-slate-500">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-slate-500">No projects available.</p>
            </div>
          ) : (
            projects.map((project, index) => {
              const category = project.category || "Education";
              const IconComponent =
                categoryIcons[category] || categoryIcons.default;
              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="project-card group bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-2xl transition-all duration-500"
                >
                  {project.image && (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-32 object-cover rounded-t-[2rem] mb-4"
                    />
                  )}
                  <MarqueeText
                    text={project.title}
                    className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors"
                  />
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    {project.description}
                  </p>
                  <div className="text-blue-600 text-sm font-bold flex items-center gap-2 group-hover:translate-x-[-5px] transition-transform">
                    اقرأ المزيد ←
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </Container>
    </section>
  );
}
