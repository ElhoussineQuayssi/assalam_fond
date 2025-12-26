"use client";
import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import SharedHero from "@/components/Hero/SharedHero";
import { BookOpen, ShieldCheck, Zap, GraduationCap, Users, Briefcase } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { useAppData } from '@/components/AppDataContext';
import MarqueeText from '@/components/MarqueeText';

gsap.registerPlugin(ScrollTrigger);

const iconMap = {
  rayhana: BookOpen,
  himaya: ShieldCheck,
  fataer: Zap,
  imtiaz: GraduationCap,
  kafala: Users,
  nadi: Briefcase
};

const categoryMap = {
  rayhana: 'Education',
  himaya: 'Social',
  fataer: 'Economic',
  imtiaz: 'Education',
  kafala: 'Social',
  nadi: 'Economic'
};

const categoryColors = {
  Education: 'bg-blue-50 text-blue-600 border-blue-200',
  Social: 'bg-green-50 text-green-600 border-green-200',
  Economic: 'bg-orange-50 text-orange-600 border-orange-200'
};

export default function ProjectsPage() {
  const t = useTranslations('Projects');
  const { projects, loading, allProjectImages } = useAppData();
  const [activeTab, setActiveTab] = useState('all');
  const sectionRef = useRef();

  const projectsWithIcons = projects.map(project => ({
    ...project,
    icon: iconMap[project.id] || BookOpen // default icon
  }));

  const filteredProjects = activeTab === 'all'
    ? projectsWithIcons
    : projectsWithIcons.filter(p => p.category?.toLowerCase() === activeTab);

  useEffect(() => {
    if (projects.length === 0) return;

    const cards = gsap.utils.toArray('.project-card');
    gsap.set(cards, { y: 50, opacity: 0 });

    ScrollTrigger.batch(cards, {
      onEnter: (batch) => gsap.to(batch, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
      }),
      start: "top 85%"
    });

    // Tab change animation
    const handleTabChange = () => {
      gsap.fromTo('.project-card',
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)"
        }
      );
    };

    // Trigger animation on tab change
    handleTabChange();

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [activeTab, projects]);

  return (
    <div ref={sectionRef}>
      <SharedHero
        title={t('hero.title')}
        description={t('hero.description')}
        allProjectImages={allProjectImages}
        showScrollButton={true}
      />

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-12 bg-white border border-slate-200 rounded-full p-1">
              <TabsTrigger
                value="all"
                className="rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
              >
                {t('filters.all')}
              </TabsTrigger>
              <TabsTrigger
                value="education"
                className="rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
              >
                {t('filters.education')}
              </TabsTrigger>
              <TabsTrigger
                value="economic"
                className="rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
              >
                {t('filters.economic')}
              </TabsTrigger>
              <TabsTrigger
                value="social"
                className="rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
              >
                {t('filters.social')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project, index) => {
                  const IconComponent = project.icon;
                  return (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      className="project-card group bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-2xl transition-all duration-500"
                    >
                      {project.image && (
                        <img src={project.image} alt={project.title} className="w-full h-32 object-cover rounded-t-[2rem] mb-4" />
                      )}
                      <MarqueeText text={project.title} className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors" />
                      <p className="text-slate-500 text-sm leading-relaxed mb-6">
                        {project.description}
                      </p>
                      <div
                        className="text-blue-600 text-sm font-bold flex items-center gap-2 group-hover:translate-x-[-5px] transition-transform"
                      >
                        {t('cta')} ←
                      </div>
                    </Link>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}