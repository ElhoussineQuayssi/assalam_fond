import { createClient } from "@/utils/supabase/client";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import ProjectDetailPage from "./ProjectDetailPage";

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
        title: "Project Not Found",
        description: "The requested project could not be found.",
      };
    }

    const t = await getTranslations({ locale, namespace: "Projects" });

    return {
      title: `${project.title} - ${t("hero.title")}`,
      description: project.description,
    };
  } catch (error) {
    console.error("Error fetching project for metadata:", error);
    return {
      title: "Project",
      description: "Learn about our projects.",
    };
  }
}

export default function Page({ params }) {
  return <ProjectDetailPage params={params} />;
}
