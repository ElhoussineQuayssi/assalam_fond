"use client";
import { gsap } from "gsap";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

const AccordionItem = ({ title, content, index, isOpen, setOpenIndex }) => {
  const contentRef = useRef(null);
  const iconRef = useRef(null);
  const itemRef = useRef(null);

  const toggleAccordion = () => {
    const newIsOpen = !isOpen;
    setOpenIndex(newIsOpen ? index : -1);

    gsap.to(contentRef.current, {
      height: newIsOpen ? "auto" : 0,
      opacity: newIsOpen ? 1 : 0,
      duration: 0.5,
      ease: "power3.inOut",
    });

    gsap.to(iconRef.current, {
      rotate: newIsOpen ? 180 : 0,
      duration: 0.3,
    });
  };

  return (
    <div
      ref={itemRef}
      className={`relative mb-4 overflow-hidden rounded-2xl border transition-colors duration-300 ${
        isOpen
          ? "border-blue-200 bg-blue-50/30"
          : "border-slate-100 bg-white hover:border-blue-300"
      }`}
    >
      {/* Left Indicator Bar */}
      <div
        className={`absolute left-0 top-0 h-full w-1 bg-blue-500 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <button
        type="button"
        onClick={toggleAccordion}
        className="flex w-full items-center justify-between p-6 text-left"
      >
        <span
          className={`text-lg font-bold ${isOpen ? "text-blue-600" : "text-slate-800"}`}
        >
          {title}
        </span>
        <div ref={iconRef} className="text-slate-400">
          <ChevronDown size={20} />
        </div>
      </button>

      <div ref={contentRef} className="h-0 opacity-0 overflow-hidden">
        <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-blue-100/50">
          {content}
        </div>
      </div>
    </div>
  );
};

const CommitmentVisionSection = () => {
  const sectionRef = useRef(null);
  const accordionRefs = useRef([]);
  const imageRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(-1);
  const t = useTranslations("Home");

  useEffect(() => {
    // Staggered entrance animation
    gsap.fromTo(
      accordionRefs.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
      },
    );

    // Image slide-in animation
    gsap.fromTo(
      imageRef.current,
      {
        x: 100,
        clipPath: "inset(0 0 0 100%)",
      },
      {
        x: 0,
        clipPath: "inset(0 0 0 0%)",
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      },
    );
  }, []);

  const accordionData = [
    {
      title: t("about.mission"),
      content: t("about.mission_desc"),
    },
    {
      title: t("about.vision"),
      content: t("about.vision_desc"),
    },
    {
      title: t("about.values"),
      content: t("about.values_desc"),
    },
  ];

  return (
    <section ref={sectionRef} className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Title and Description */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            {t("about.engagement")}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t("about.general_desc")}
          </p>
        </div>

        {/* Layout: Accordion Left, Image Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Accordion */}
          <div>
            {accordionData.map((item, index) => (
              <div
                key={index}
                ref={(el) => (accordionRefs.current[index] = el)}
              >
                <AccordionItem
                  title={item.title}
                  content={item.content}
                  index={index}
                  isOpen={openIndex === index}
                  setOpenIndex={setOpenIndex}
                />
              </div>
            ))}
          </div>

          {/* Sticky Image */}
          <div className="lg:sticky lg:top-8">
            <div
              ref={imageRef}
              className="bg-white rounded-[3rem] p-4 shadow-sm border border-slate-100 aspect-square flex items-center justify-center overflow-hidden"
            >
              <Image
                src="https://hpymvpexiunftdgeobiw.supabase.co/storage/v1/object/public/projects/Centre/IDC08872.JPG"
                fill
                className="object-cover rounded-[2.5rem] opacity-90"
                alt="Impact"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommitmentVisionSection;
