import { createClient } from "@/utils/supabase/client";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import ProjectGalleryPage from "./ProjectGalleryPage";

export async function generateMetadata({ params }) {
  const { locale, id } = await params;
  const supabase = createClient();

  try {
    const { data: project, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !project) {
      return {
        title: "Project Gallery Not Found",
        description: "The requested project gallery could not be found.",
      };
    }

    const t = await getTranslations({ locale, namespace: "Projects" });

    return {
      title: `${project.title} - ${t("gallery_title")} - ${t("hero.title")}`,
      description: project.description,
    };
  } catch (error) {
    console.error("Error fetching project for gallery metadata:", error);
    return {
      title: "Project Gallery",
      description: "View project images.",
    };
  }
}

export default function Page({ params }) {
  return <ProjectGalleryPage params={params} />;
}
