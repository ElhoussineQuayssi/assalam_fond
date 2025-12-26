import { getTranslations } from 'next-intl/server';
import AboutPage from './AboutPage';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'About' });

  return {
    title: t('hero.title'),
    description: t('hero.description'),
  };
}

export default function Page() {
  return <AboutPage />;
}