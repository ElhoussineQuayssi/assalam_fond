import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Container from "@/components/Container/Container.jsx";

gsap.registerPlugin(ScrollTrigger);

export default function TestimonialsSection() {
  const t = useTranslations('Home');
  const testimonials = t.raw('testimonials.list');
  const sectionRef = useRef();

  useEffect(() => {
    const cards = gsap.utils.toArray('.testimonial-card');
    gsap.set(cards, { x: -50, opacity: 0 });

    ScrollTrigger.batch(cards, {
      onEnter: (batch) => gsap.to(batch, {
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
      }),
      start: "top 85%"
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white">
      <Container>
        <div className="text-center mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#6495ED] mb-4 block">
            {t('testimonials.title')}
          </span>
          <h2 className="text-3xl font-black text-slate-900">
            {t('testimonials.subtitle')}
          </h2>
        </div>

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
                  <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed">"{testimonial.content}"</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}