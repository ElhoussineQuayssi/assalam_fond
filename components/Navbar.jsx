"use client";
import gsap from "gsap";
import { Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useAppData } from "./AppDataContext";

export default function Navbar() {
  const t = useTranslations("navbar");
  const locale = useLocale();
  const { siteConfig, loading } = useAppData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const linkRefs = useRef([]);
  const contactRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      gsap.fromTo(
        ".mobile-link",
        { opacity: 0, x: 20 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: "power2.out",
          delay: 0.3,
        },
      );
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const handleHover = (index, enter) => {
    const underline = linkRefs.current[index]?.querySelector(".underline");
    if (underline) {
      gsap.to(underline, { width: enter ? "100%" : "0%", duration: 0.3 });
    }
  };

  const handleMouseEnter = () => {
    const handleMouseMove = (e) => {
      if (!contactRef.current) return;
      const rect = contactRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const deltaX = mouseX - centerX;
      const deltaY = mouseY - centerY;
      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
      const maxDistance = 150;
      if (distance < maxDistance) {
        const strength = (maxDistance - distance) / maxDistance;
        const moveX = deltaX * strength * 0.5;
        const moveY = deltaY * strength * 0.5;
        gsap.to(contactRef.current, {
          x: moveX,
          y: moveY,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(contactRef.current, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };
    document.addEventListener("mousemove", handleMouseMove);
    contactRef.current._mouseMoveHandler = handleMouseMove;
  };

  const handleMouseLeave = () => {
    if (contactRef.current._mouseMoveHandler) {
      document.removeEventListener(
        "mousemove",
        contactRef.current._mouseMoveHandler,
      );
    }
    gsap.to(contactRef.current, {
      x: 0,
      y: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <nav
      className={`fixed top-0 w-full z-[100] transition-all duration-300
      ${isScrolled ? "bg-white shadow-md py-3" : "bg-transparent py-5"}`}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        {(() => {
          const logos = {
            fr: "https://hpymvpexiunftdgeobiw.supabase.co/storage/v1/object/public/Assalam/fondation%20francais.png",
            ar: "https://hpymvpexiunftdgeobiw.supabase.co/storage/v1/object/public/Assalam/fondation%20arabe.png",
            en: "https://hpymvpexiunftdgeobiw.supabase.co/storage/v1/object/public/Assalam/fondation%20anglais.png",
          };
          const logoUrl = logos[locale] || siteConfig?.arabe_logo;
          return logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-16 md:h-12" />
          ) : (
            <div
              className={`text-2xl font-black tracking-tighter transition-colors ${
                isScrolled ? "text-blue-600" : "text-white drop-shadow-md"
              }`}
            >
              ASSALAM
            </div>
          );
        })()}

        {/* Desktop Links */}
        <div
          className={`hidden md:flex items-center gap-10 font-medium transition-colors ${
            isScrolled ? "text-slate-600" : "text-white drop-shadow-sm"
          }`}
        >
          {[
            { href: "/", text: t("home") },
            { href: "/about", text: t("about") },
            { href: "/projects", text: t("projects") },
            { href: "/blogs", text: t("blogs") },
          ].map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              ref={(el) => (linkRefs.current[index] = el)}
              onMouseEnter={() => handleHover(index, true)}
              onMouseLeave={() => handleHover(index, false)}
              className={`relative text-sm font-medium transition-colors ${
                isScrolled
                  ? "text-slate-600 hover:text-blue-600"
                  : "text-white hover:text-blue-200"
              }`}
            >
              {item.text}
              <span className="underline absolute bottom-0 left-0 h-0.5 bg-current w-0 transition-all"></span>
            </a>
          ))}
          <a
            href="/contact"
            ref={contactRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="bg-blue-600 text-white px-8 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all"
          >
            {t("contact")}
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(true)}>
          <Menu
            size={28}
            className={isScrolled ? "text-blue-600" : "text-white"}
          />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[110] bg-white transition-transform duration-500 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header west l-menu (Logo + Close Button) */}
        <div className="flex items-center justify-between p-6 border-b border-slate-50">
          {(() => {
            const logos = {
              fr: "https://hpymvpexiunftdgeobiw.supabase.co/storage/v1/object/public/Assalam/fondation%20francais.png",
              ar: "https://hpymvpexiunftdgeobiw.supabase.co/storage/v1/object/public/Assalam/fondation%20arabe.png",
              en: "https://hpymvpexiunftdgeobiw.supabase.co/storage/v1/object/public/Assalam/fondation%20anglais.png",
            };
            const logoUrl = logos[locale] || siteConfig?.arabe_logo;
            return logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-12" />
            ) : (
              <div className="text-xl font-black text-blue-600">ASSALAM</div>
            );
          })()}
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 bg-slate-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* Links dyal l-menu */}
        <div className="flex flex-col gap-6 p-10">
          {[
            { href: "/", text: t("home") },
            { href: "/about", text: t("about") },
            { href: "/projects", text: t("projects") },
            { href: "/blogs", text: t("blogs") },
            { href: "/contact", text: t("contact") },
          ].map((link, i) => (
            <a
              key={i}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="mobile-link text-2xl font-bold text-slate-900 border-b border-slate-50 pb-4"
            >
              {link.text}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
