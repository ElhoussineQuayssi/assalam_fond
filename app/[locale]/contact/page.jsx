import { getTranslations } from 'next-intl/server';
import ContactPage from './ContactPage';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Contact' });

  return {
    title: t('hero.title'),
    description: t('hero.description'),
  };
}

export default function Page() {
  return <ContactPage />;
}