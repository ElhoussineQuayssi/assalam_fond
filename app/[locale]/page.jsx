import { getTranslations } from "next-intl/server";
import Home from "./Home";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });

  return {
    title: t("hero.title"),
    description: t("hero.subtitle"),
  };
}

export default function Page() {
  return <Home />;
}
