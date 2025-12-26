"use client";
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Badge } from "@/components/ui/badge";
import SharedHero from "@/components/Hero/SharedHero";
import { BookOpen, ShieldCheck, Zap, GraduationCap, Users, Briefcase, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppData } from '@/components/AppDataContext';

const iconMap = {
  rayhana: BookOpen,
  himaya: ShieldCheck,
  fataer: Zap,
  imtiaz: GraduationCap,
  kafala: Users,
  nadi: Briefcase
};

const categoryColors = {
  Education: 'bg-blue-50 text-blue-600 border-blue-200',
  Social: 'bg-green-50 text-green-600 border-green-200',
  Economic: 'bg-orange-50 text-orange-600 border-orange-200'
};

export default function ProjectGalleryPage() {
  const params = useParams();
  const { locale, id } = params;
  const t = useTranslations('Projects');
  const { projects, allProjectImages } = useAppData();
  const project = projects.find(p => p.id == id);

  if (!project) {
    return <div>Project not found</div>;
  }

  const IconComponent = iconMap[project.id] || BookOpen;

  return (
    <div>
      <SharedHero
        title={`${project.title} - ${t('gallery_title')}`}
        description={project.description}
        allProjectImages={allProjectImages}
        showScrollButton={false}
      />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link
            href={`/${locale}/projects/${id}`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            {t('back_to_projects')}
          </Link>

          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-2xl ${categoryColors[project.category]} flex items-center justify-center`}>
                <IconComponent size={24} />
              </div>
              <div>
                <Badge
                  variant="secondary"
                  className={`${project.status === 'Actif' || project.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-blue-50 text-blue-600 border-blue-200'} border-none mb-2`}
                >
                  {project.status}
                </Badge>
                <h1 className="text-3xl font-bold">{project.title}</h1>
              </div>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">{project.description}</p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.images?.map((image, index) => {
              const src = (image.url || image.image_url || image).toString().replace(/^"|"$/g, '');
              if (!src || typeof src !== 'string' || src.trim() === "") return null;
              return (
                <div key={index} className="group relative aspect-square bg-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                  <img
                    src={src}
                    alt={`${project.title} ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}