"use client";
import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";
import { Link, usePathname } from "@/app/i18n";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "ar", name: "العربية", flag: "🇲🇦" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[200]">
      <div className="relative">
        {/* Main Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Switch language"
        >
          <Globe size={20} />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[140px]">
            {languages.map((lang) => (
              <Link
                key={lang.code}
                href={pathname}
                locale={lang.code}
                className={`flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  locale === lang.code
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
                {locale === lang.code && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full ml-auto" />
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
