'use client'

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function PageLayout({ children }) {
  const pathname = usePathname();

  // Exclude navbar and footer for routes in (auth) and (panel) folders
  // Assuming auth routes like /login, panel routes like /admin
  const isAuthOrPanel = pathname.includes('/login') || pathname.includes('/admin');

  return (
    <>
      {!isAuthOrPanel && <Navbar />}
      {children}
      {!isAuthOrPanel && <Footer />}
      {!isAuthOrPanel && <LanguageSwitcher />}
    </>
  );
}