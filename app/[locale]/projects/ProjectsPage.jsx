"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BookOpen,
  Briefcase,
  Eye,
  Globe,
  GraduationCap,
  Heart,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useAppData } from "@/components/AppDataContext";
import ImpactCard from "@/components/Cards/ImpactCard";
import Container from "@/components/Container/Container";
import SharedHero from "@/components/Hero/SharedHero";
import MarqueeText from "@/components/MarqueeText";
import PartnerFlipCard from "@/components/PartnerFlipCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

gsap.registerPlugin(ScrollTrigger);

const iconMap = {
  rayhana: BookOpen,
  himaya: ShieldCheck,
  fataer: Zap,
  imtiaz: GraduationCap,
  kafala: Users,
  nadi: Briefcase,
};

const _categoryMap = {
  rayhana: "Education",
  himaya: "Social",
  fataer: "Economic",
  imtiaz: "Education",
  kafala: "Social",
  nadi: "Economic",
};

const _categoryColors = {
  Education: "bg-blue-50 text-blue-600 border-blue-200",
  Social: "bg-green-50 text-green-600 border-green-200",
  Economic: "bg-orange-50 text-orange-600 border-orange-200",
};

export default function ProjectsPage() {
  const t = useTranslations("Projects");
  const locale = useLocale();
  const { projects, allProjectImages } = useAppData();
  const [activeTab, setActiveTab] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const sectionRef = useRef();

  const projectsWithIcons = projects.map((project) => ({
    ...project,
    icon: iconMap[project.id] || BookOpen, // default icon
  }));

  const filteredProjects =
    activeTab === "all"
      ? projectsWithIcons
      : projectsWithIcons.filter(
          (p) => p.category?.toLowerCase() === activeTab,
        );

  useEffect(() => {
    if (projects.length === 0) return;

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

    // Tab change animation
    const handleTabChange = () => {
      gsap.fromTo(
        ".project-card",
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
      );
    };

    // Trigger animation on tab change
    handleTabChange();

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        trigger.kill();
      });
    };
  }, [projects]);

  return (
    <div ref={sectionRef}>
      <SharedHero
        title={t("hero.title")}
        description={t("hero.description")}
        allProjectImages={allProjectImages}
        showScrollButton={true}
      />

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
              setShowAll(false); // Reset showAll when changing tabs
            }}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-12 bg-white border border-slate-200 rounded-full p-1">
              <TabsTrigger
                value="all"
                className="rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
              >
                {t("filters.all")}
              </TabsTrigger>
              <TabsTrigger
                value="education"
                className="rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
              >
                {t("filters.education")}
              </TabsTrigger>
              <TabsTrigger
                value="economic"
                className="rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
              >
                {t("filters.economic")}
              </TabsTrigger>
              <TabsTrigger
                value="social"
                className="rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
              >
                {t("filters.social")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(showAll ? filteredProjects : filteredProjects.slice(0, 6)).map((project, _index) => {
                  const _IconComponent = project.icon;
                  return (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      className="project-card group bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-2xl transition-all duration-500"
                    >
                      {project.image && (
                        <Image
                          src={project.image}
                          alt={project.title}
                          width={400}
                          height={128}
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
                        {t("cta")} ←
                      </div>
                    </Link>
                  );
                })}
              </div>

              {!showAll && filteredProjects.length > 6 && (
                <div className="text-center mt-12">
                  <button
                    onClick={() => setShowAll(true)}
                    className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300"
                  >
                    {t("view_more_projects") || "View More Projects"}
                  </button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Impact Statistics Section */}
      <section className="py-16 bg-white">
        <Container>
          <h2 className="text-center text-3xl font-black text-slate-900 mb-10">
            {t("impact_title")}
          </h2>
          <div className="grid-impact grid grid-cols-1 md:grid-cols-3 gap-6">
            <ImpactCard
              type="blue"
              icon={<Globe size={18} />}
              value="36+"
              title="Sections Nationales"
              translatedTitle={t("impact.sections")}
            />
            <ImpactCard
              type="green"
              icon={<Heart size={18} />}
              value="6000+"
              title="Bénéficiaires"
              translatedTitle={t("impact.beneficiaries")}
            />
            <ImpactCard
              type="red"
              icon={<Eye size={18} />}
              value="98%"
              title="Transparence"
              translatedTitle={t("impact.transparency")}
            />
          </div>
        </Container>
      </section>

      {/* Partner Recognition Section */}
      <section className="py-24 bg-slate-50">
        <Container>
          <h2 className="text-center text-3xl font-black text-slate-900 mb-12">
            {t("partners_title")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {[
              {
                img: "https://hpymvpexiunftdgeobiw.supabase.co/storage/v1/object/public/Assalam/markaz_himaya.png",
                names: {
                  fr: "Centre Himaya",
                  en: "Himaya Center",
                  ar: "مركز حماية",
                },
              },
              {
                img: "https://hpymvpexiunftdgeobiw.supabase.co/storage/v1/object/public/Assalam/mobadara.jpeg",
                names: {
                  fr: "Initiative Nationale pour le Développement Humain",
                  en: "National Initiative for Human Development",
                  ar: "المبادرة الوطنية للتنمية البشرية",
                },
              },
              {
                img: "https://hpymvpexiunftdgeobiw.supabase.co/storage/v1/object/public/Assalam/niyabat_anfa.jpg",
                names: {
                  fr: "Direction Provinciale du Ministère de l’Éducation Nationale – Casablanca-Anfa",
                  en: "Provincial Directorate of the Ministry of National Education – Casablanca-Anfa",
                  ar: "المديرية الإقليمية لوزارة التربية الوطنية – الدار البيضاء أنفا",
                },
              },
              {
                img: "https://hpymvpexiunftdgeobiw.supabase.co/storage/v1/object/public/Assalam/ta3awon_lwatani.png",
                names: {
                  fr: "Entraide Nationale",
                  en: "National Mutual Aid",
                  ar: "التعاون الوطني",
                },
              },
            ].map((partner) => (
              <div key={partner.img} className="text-center">
                <PartnerFlipCard
                  image={partner.img}
                  title={partner.names[locale] || partner.names.fr}
                  className="w-40 h-36 mx-auto"
                />
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
