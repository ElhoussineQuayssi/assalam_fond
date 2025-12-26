import { getTranslations } from "next-intl/server";
import BlogsPage from "./BlogsPage";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blogs" });

  return {
    title: t("hero.title"),
    description: t("hero.subtitle"),
  };
}

export default function Page() {
  return <BlogsPage />;
}
