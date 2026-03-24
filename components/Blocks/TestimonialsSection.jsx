"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import Container from "@/components/Container/Container.jsx";

gsap.registerPlugin(ScrollTrigger);

// Fallback static testimonials for SSR safety
const FALLBACK_TESTIMONIALS = [
  {
    name: "Ahmed Bennani",
    role: "Bénéficiaire",
    content: "Assalam a transformé ma vie. Grâce à leurs programmes éducatifs, j'ai pu poursuivre mes études et réaliser mes rêves.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },
  {
    name: "Fatima Alaoui",
    role: "Volontaire",
    content: "Contribuer à Assalam est une expérience enrichissante. Voir l'impact positif sur la communauté me motive chaque jour.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
  },
  {
    name: "Youssef Tazi",
    role: "Partenaire",
    content: "La transparence et l'efficacité d'Assalam sont remarquables. Leur approche innovative fait vraiment la différence.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  }
];

export default function TestimonialsSection() {
  const t = useTranslations("Home");
  const sectionRef = useRef();
  const [isMounted, setIsMounted] = useState(false);

  // Get testimonials - ensure we always have valid array
  const rawTestimonials = t.raw("testimonials.list");
  const testimonials = Array.isArray(rawTestimonials) && rawTestimonials.length > 0 
    ? rawTestimonials 
    : FALLBACK_TESTIMONIALS;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  console.log("TestimonialsSection loaded:", { 
    length: testimonials.length, 
    first: testimonials[0]?.name,
    isMounted
  });

  useEffect(() => {
    // Only run GSAP animation after mount
    if (!isMounted) return;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const cards = gsap.utils.toArray(".testimonial-card");
      if (cards.length === 0) return;
      
      gsap.set(cards, { x: -50, opacity: 0 });

      ScrollTrigger.batch(cards, {
        onEnter: (batch) =>
          gsap.to(batch, {
            x: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
          }),
        start: "top 85%",
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isMounted]);

  return (
    <section ref={sectionRef} className="py-24 bg-white">
      <Container>
        <div className="text-center mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#6495ED] mb-4 block">
            {t("testimonials.title")}
          </span>
          <h2 className="text-3xl font-black text-slate-900">
            {t("testimonials.subtitle")}
          </h2>
        </div>

        {/* Always show testimonials - use fallback data initially */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card bg-white/40 backdrop-blur-md border border-white/20 rounded-[2rem] p-6 shadow-lg"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-slate-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
