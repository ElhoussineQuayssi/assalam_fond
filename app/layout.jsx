import { Cairo, Readex_Pro, Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { notFound } from 'next/navigation';
import { routing } from '../i18n/routing';
import './globals.css';
import { AppDataProvider } from '../components/AppDataContext';
import { Toaster } from 'sonner';

const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-cairo' });
const readexPro = Readex_Pro({ subsets: ['arabic', 'latin'], variable: '--font-readex-pro' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta-sans' });

export const metadata = {
  title: 'Assalam Foundation - Supporting Communities Through Action',
  description: 'Assalam Foundation is a non-profit organization dedicated to promoting sustainable development and empowerment in local communities through education, health, and economic programs.',
};

export default async function RootLayout({ children, params }) {
  const { locale } = await params;

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className={`${cairo.variable} ${readexPro.variable} ${inter.variable} ${plusJakartaSans.variable} font-readex-pro`}>
        <AppDataProvider>
          {children}
          <Toaster />
        </AppDataProvider>
      </body>
    </html>
  );
}