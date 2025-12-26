import { getTranslations } from "next-intl/server";
import ProjectsPage from "./ProjectsPage";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Projects" });

  return {
    title: t("hero.title"),
    description: t("hero.description"),
  };
}

export default function Page() {
  return <ProjectsPage />;
}
