"use client";
import {
  ArrowLeft,
  BookOpen,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAppData } from "@/components/AppDataContext";
import ProjectGalleryRenderer from "@/components/Blocks/ProjectGalleryRenderer";
import SharedHero from "@/components/Hero/SharedHero";
import { ProjectContentRenderer } from "@/components/ProjectContentRenderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const iconMap = {
  rayhana: BookOpen,
  himaya: ShieldCheck,
  fataer: Zap,
  imtiaz: GraduationCap,
  kafala: Users,
  nadi: Briefcase,
};

const categoryColors = {
  Education: "bg-blue-50 text-blue-600 border-blue-200",
  Social: "bg-green-50 text-green-600 border-green-200",
  Economic: "bg-orange-50 text-orange-600 border-orange-200",
};

export default function ProjectDetailPage() {
  const params = useParams();
  const { locale, id } = params;
  const t = useTranslations("Projects");
  const { projects, allProjectImages } = useAppData();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return <div>Project not found</div>;
  }

  const IconComponent = iconMap[project.id] || BookOpen;

  return (
    <div>
      <SharedHero
        title={project.title}
        description={project.description}
        allProjectImages={allProjectImages}
        showScrollButton={false}
      />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link
            href={`/${locale}/projects`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            {t("back_to_projects")}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`w-16 h-16 rounded-2xl ${categoryColors[project.category]} flex items-center justify-center`}
                >
                  <IconComponent size={24} />
                </div>
                <div>
                  <Badge
                    variant="secondary"
                    className={`${project.status === "Actif" || project.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-blue-50 text-blue-600 border-blue-200"} border-none mb-2`}
                  >
                    {project.status}
                  </Badge>
                  <h1 className="text-3xl font-bold">{project.title}</h1>
                </div>
              </div>

              {/* Dynamic Content Renderer */}
              <ProjectContentRenderer contentArray={project.content} />

              {/* Project Gallery */}
              <ProjectGalleryRenderer
                galleryImages={project.images}
                title={t("gallery_title")}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                {/* CTA */}
                <div className="bg-blue-50 rounded-2xl p-6 mb-4">
                  <h3 className="text-xl font-bold mb-4">
                    {t("contribute_title")}
                  </h3>
                  <p className="text-gray-700 mb-6">{t("contribute_desc")}</p>
                  <Link href={`/${locale}/contact`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      {t("contribute")}
                    </Button>
                  </Link>
                </div>

                {/* View Gallery Button */}
                <div className="bg-white rounded-2xl p-4 border">
                  <Link
                    href={`/${locale}/projects/${id}/gallery`}
                    className="w-full block"
                  >
                    <Button className="w-full btn-outline">
                      {t("view_gallery")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
