"use client";

import Link from "next/link";
import { useTranslations } from 'next-intl';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { useLocale } from 'next-intl';
import Container from "@/components/Container/Container";
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const t = useTranslations('Home');
  const tNav = useTranslations();
  const tContact = useTranslations('Contact');
  const locale = useLocale();
  const footerRef = useRef();

  useEffect(() => {
    const links = gsap.utils.toArray('.footer-link');
    gsap.set(links, { y: 20, opacity: 0 });

    ScrollTrigger.create({
      trigger: footerRef.current,
      start: "top 90%",
      onEnter: () => {
        gsap.to(links, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out"
        });
      },
      once: true
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const footerLinks = [
    { name: tNav('navbar.home'), href: "/" },
    { name: tNav('navbar.about'), href: "/about" },
    { name: tNav('navbar.projects'), href: "/projects" },
    { name: tNav('navbar.blogs'), href: "/blogs" },
    { name: tNav('navbar.contact'), href: "/contact" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com", label: "Youtube" },
  ];

  return (
    <footer ref={footerRef} className="bg-white border-t border-slate-200 py-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
                {(() => {
                  const logos = {
                    fr: "https://hpymvpexiunftdgeobiw.supabase.co/storage/v1/object/public/Assalam/fondation%20francais.png",
                    ar: "https://hpymvpexiunftdgeobiw.supabase.co/storage/v1/object/public/Assalam/fondation%20arabe.png",
                    en: "https://hpymvpexiunftdgeobiw.supabase.co/storage/v1/object/public/Assalam/fondation%20anglais.png",
                  };
                  const logoUrl = logos[locale];
                  return logoUrl ? (
                    <img src={logoUrl} alt="Assalam" className="h-14 mb-4" />
                  ) : (
                    <span className="text-2xl font-black text-blue-600 tracking-tighter">ASSALAM</span>
                  );
                })()}
              </Link>
            <p className="text-slate-600 text-sm leading-relaxed max-w-md">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-4 text-sm uppercase tracking-wide">{t('footer.quick_links')}</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="footer-link text-slate-600 hover:text-blue-600 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-4 text-sm uppercase tracking-wide">{t('footer.contact')}</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-600 text-sm">
                <Mail size={14} />
                <span>{tContact('info.email')}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 text-sm">
                <Phone size={14} />
                <span>{tContact('info.phone')}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 text-sm">
                <MapPin size={14} />
                <span>{tContact('info.address')}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-6 mt-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-blue-600 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={24} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm">
            © 2024 Assalam Foundation. {t('footer.rights')}
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="footer-link text-slate-500 hover:text-blue-600 text-sm transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link href="/terms" className="footer-link text-slate-500 hover:text-blue-600 text-sm transition-colors">
              {t('footer.terms')}
            </Link>
          </div>
        </div>

        {/* Signature */}
        <div className="mt-6 text-center">
          <p className="text-slate-400 text-xs">
            {t('footer.signature')}
          </p>
        </div>
      </Container>
    </footer>
  );
}
