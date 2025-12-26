"use client";
import { Target, Eye, Heart, Shield, GraduationCap, Users, Sprout, Award } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Container from "@/components/Container/Container.jsx";
import SharedHero from "@/components/Hero/SharedHero.jsx";
import AboutTimeline from "@/components/Blocks/AboutTimeline.jsx";
import BlogsSection from "@/components/Blocks/BlogsSection.jsx";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAppData } from '@/components/AppDataContext';

const Counter = ({ end, suffix = "" }) => {
  return <span>{end}{suffix}</span>;
};

export default function AboutPage() {
  const t = useTranslations('About');
  const { allProjectImages } = useAppData();

  return (
    <div className="flex flex-col">
      {/* Shared Hero */}
      <SharedHero
        title={t('hero.title')}
        description={t('hero.description')}
        allProjectImages={allProjectImages}
        showScrollButton={true}
      />

      {/* Overview Section */}
      <section className="py-24 bg-slate-50">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-center text-3xl font-black text-slate-900 mb-8">{t('overview.title')}</h2>
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
              {t('overview.description')}
            </p>
            <p className="text-lg text-slate-500">
              {t('overview.additional')}
            </p>
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
          <h2 className="text-center text-3xl font-black text-slate-900 mb-16">{t('impact.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-12 bg-blue-50 rounded-[2rem] border border-blue-100">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-100 flex items-center justify-center">
                <Target size={32} className="text-blue-600" />
              </div>
              <div className="text-6xl font-black text-blue-900 mb-4"><Counter end="36" suffix="+" /></div>
              <p className="text-blue-700 font-medium">{t('impact.sections')}</p>
            </div>
            <div className="text-center p-12 bg-green-50 rounded-[2rem] border border-green-100">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-green-100 flex items-center justify-center">
                <Users size={32} className="text-green-600" />
              </div>
              <div className="text-6xl font-black text-green-900 mb-4"><Counter end="6000" suffix="+" /></div>
              <p className="text-green-700 font-medium">{t('impact.beneficiaries')}</p>
            </div>
            <div className="text-center p-12 bg-purple-50 rounded-[2rem] border border-purple-100">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-purple-100 flex items-center justify-center">
                <Eye size={32} className="text-purple-600" />
              </div>
              <div className="text-6xl font-black text-purple-900 mb-4"><Counter end="98" suffix="%" /></div>
              <p className="text-purple-700 font-medium">{t('impact.transparency')}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <Container>
          <h2 className="text-center text-3xl font-black text-slate-900 mb-16">{t('values.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Heart size={24} />, key: "solidarity" },
              { icon: <Shield size={24} />, key: "dignity" },
              { icon: <GraduationCap size={24} />, key: "education" },
              { icon: <Users size={24} />, key: "empowerment" },
              { icon: <Sprout size={24} />, key: "sustainability" },
              { icon: <Award size={24} />, key: "transparency" },
            ].map((v, i) => (
              <div key={i} className="group p-8 rounded-[2rem] bg-slate-50 border border-transparent hover:border-blue-100 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {v.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{t(`values.${v.key}.title`)}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{t(`values.${v.key}.desc`)}</p>
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
            <h2 className="text-center text-3xl font-black text-slate-900 mb-12">{t('partners.title')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              {/* Placeholder logos - replace with actual partner logos */}
              <div className="text-center group">
                <div className="w-24 h-24 mx-auto bg-slate-200 rounded-lg flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-300 hover:scale-110">
                  <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600">{t('partners.indh')}</span>
                </div>
              </div>
              <div className="text-center group">
                <div className="w-24 h-24 mx-auto bg-slate-200 rounded-lg flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-300 hover:scale-110">
                  <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600">{t('partners.entraide')}</span>
                </div>
              </div>
              <div className="text-center group">
                <div className="w-24 h-24 mx-auto bg-slate-200 rounded-lg flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-300 hover:scale-110">
                  <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600">{t('partners.unicef')}</span>
                </div>
              </div>
              <div className="text-center group">
                <div className="w-24 h-24 mx-auto bg-slate-200 rounded-lg flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-300 hover:scale-110">
                  <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600">{t('partners.who')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Team */}
          <div>
            <h2 className="text-center text-3xl font-black text-slate-900 mb-12">{t('team.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { key: "fatima", image: "/team/fatema.jpg" },
                { key: "youssef", image: "/team/youssef.jpg" },
                { key: "ahmed", image: "/team/ahmed.jpg" },
              ].map((member, i) => (
                <div key={i} className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-slate-200">
                    <Image
                      src={member.image}
                      alt={t(`team.${member.key}.name`)}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-lg">{t(`team.${member.key}.name`)}</h3>
                  <p className="text-slate-600">{t(`team.${member.key}.role`)}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900 text-white text-center">
        <Container>
          <h2 className="text-center text-3xl font-black text-white mb-4">{t('cta.title')}</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">{t('cta.description')}</p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            {t('cta.button')}
          </Button>
        </Container>
      </section>
    </div>
  );
}