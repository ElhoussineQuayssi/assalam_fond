"use client";
import {
  Award,
  Eye,
  GraduationCap,
  Heart,
  Shield,
  Sprout,
  Target,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useAppData } from "@/components/AppDataContext";
import AboutTimeline from "@/components/Blocks/AboutTimeline.jsx";
import BlogsSection from "@/components/Blocks/BlogsSection.jsx";
import Container from "@/components/Container/Container.jsx";
import SharedHero from "@/components/Hero/SharedHero.jsx";
import PartnerFlipCard from "@/components/PartnerFlipCard";
import { Button } from "@/components/ui/button";

const Counter = ({ end, suffix = "" }) => {
  return (
    <span>
      {end}
      {suffix}
    </span>
  );
};

export default function AboutPage() {
  const t = useTranslations("About");
  const { allProjectImages } = useAppData();
  const locale = useLocale();

  const partners = [
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
  ];

  return (
    <div className="flex flex-col">
      {/* Shared Hero */}
      <SharedHero
        title={t("hero.title")}
        description={t("hero.description")}
        allProjectImages={allProjectImages}
        showScrollButton={true}
      />

      {/* Overview Section */}
      <section className="py-24 bg-slate-50">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-center text-3xl font-black text-slate-900 mb-8">
              {t("overview.title")}
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
              {t("overview.description")}
            </p>
            <p className="text-lg text-slate-500">{t("overview.additional")}</p>
          </div>
        </Container>
      </section>

      {/* Timeline Section */}
      <AboutTimeline />

      {/* Blogs Section */}
      <BlogsSection />

      {/* Impact Section */}
      <section className="py-24 bg-white">
        <Container>
          <h2 className="text-center text-3xl font-black text-slate-900 mb-16">
            {t("impact.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                key: "sections",
                icon: <Target size={32} />,
                value: <Counter end="36" suffix="+" />,
                label: t("impact.sections"),
              },
              {
                key: "beneficiaries",
                icon: <Users size={32} />,
                value: <Counter end="6000" suffix="+" />,
                label: t("impact.beneficiaries"),
              },
              {
                key: "transparency",
                icon: <Eye size={32} />,
                value: <Counter end="98" suffix="%" />,
                label: t("impact.transparency"),
              },
            ].map((card, _i) => (
              <div
                key={card.key}
                className="text-center p-12 rounded-[2rem] bg-[rgba(0,122,204,0.08)] border"
                style={{ borderColor: "rgba(0,122,204,0.16)" }}
              >
                <div
                  className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(0,122,204,0.12)" }}
                >
                  {/** icon color */}
                  <div className="text-[#007ACC]">{card.icon}</div>
                </div>
                <div className="text-6xl font-black text-[#007ACC] mb-4">
                  {card.value}
                </div>
                <p className="text-[#007ACC] font-medium">{card.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <Container>
          <h2 className="text-center text-3xl font-black text-slate-900 mb-16">
            {t("values.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Heart size={24} />, key: "solidarity" },
              { icon: <Shield size={24} />, key: "dignity" },
              { icon: <GraduationCap size={24} />, key: "education" },
              { icon: <Users size={24} />, key: "empowerment" },
              { icon: <Sprout size={24} />, key: "sustainability" },
              { icon: <Award size={24} />, key: "transparency" },
            ].map((v, _i) => (
              <div
                key={v.key}
                className="group p-8 rounded-[2rem] bg-slate-50 border border-transparent hover:border-blue-100 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {v.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">
                  {t(`values.${v.key}.title`)}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {t(`values.${v.key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Partners & Team */}
      <section className="py-24">
        <Container>
          {/* Partners */}
          <div className="mb-16">
            <h2 className="text-center text-3xl font-black text-slate-900 mb-12">
              {t("partners.title")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              {partners.map((p, _idx) => (
                <div key={p.img} className="text-center">
                  <PartnerFlipCard
                    image={p.img}
                    title={p.names[locale] || p.names.en}
                    className="w-40 h-36 mx-auto"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div>
            <h2 className="text-center text-3xl font-black text-slate-900 mb-12">
              {t("team.title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { key: "fatima", image: "/team/fatema.jpg" },
                { key: "youssef", image: "/team/youssef.jpg" },
                { key: "ahmed", image: "/team/ahmed.jpg" },
              ].map((member, _i) => (
                <div key={member.key} className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-slate-200">
                    <Image
                      src={member.image}
                      alt={t(`team.${member.key}.name`)}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-lg">
                    {t(`team.${member.key}.name`)}
                  </h3>
                  <p className="text-slate-600">
                    {t(`team.${member.key}.role`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900 text-white text-center">
        <Container>
          <h2 className="text-center text-3xl font-black text-white mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            {t("cta.description")}
          </p>
          <Link href={`/${locale}/contact`}>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              {t("cta.button")}
            </Button>
          </Link>
        </Container>
      </section>
    </div>
  );
}
