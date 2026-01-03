"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Globe, Heart, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { useAppData } from "@/components/AppDataContext.js";
import BlogsSection from "@/components/Blocks/BlogsSection.jsx";
import CommitmentVisionSection from "@/components/Blocks/CommitmentVisionSection.jsx";
import FAQSection from "@/components/Blocks/FAQSection.jsx";
import ProjectsSection from "@/components/Blocks/ProjectsSection.jsx";
import TestimonialsSection from "@/components/Blocks/TestimonialsSection.jsx";
import TimelineSection from "@/components/Blocks/TimelineSection.jsx";
import ImpactCard from "@/components/Cards/ImpactCard.jsx";
import Container from "@/components/Container/Container.jsx";
import SharedHero from "@/components/Hero/SharedHero.jsx";
import { Separator } from "@/components/ui/separator"; // Shadcn Separator

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const mainRef = useRef();
  const t = useTranslations("Home");
  const { allProjectImages } = useAppData();

  useGSAP(
    () => {
      gsap.from(".reveal-card", {
        scrollTrigger: {
          trigger: ".grid-impact",
          start: "top 85%",
        },
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out",
      });

      gsap.from(".about-section", {
        scrollTrigger: {
          trigger: ".about-section",
          start: "top 85%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    },
    { scope: mainRef },
  );

  return (
    <main ref={mainRef} className="bg-[#FAFAFA]">
      <SharedHero
        title={t("hero.title")}
        description={t("hero.subtitle")}
        allProjectImages={allProjectImages}
      />

      <section className="py-16">
        <Container>
          <h2 className="text-center text-3xl font-black text-slate-900 mb-10">
            {t("impact.title")}
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
              icon={<ShieldCheck size={18} />}
              value="98%"
              title="Transparence"
              translatedTitle={t("impact.transparency")}
            />
          </div>
        </Container>
      </section>

      <Container>
        <Separator className="opacity-50" />
      </Container>

      <CommitmentVisionSection />

      <ProjectsSection />

      <BlogsSection />

      <TestimonialsSection />

      <TimelineSection />

      <FAQSection />
    </main>
  );
}
