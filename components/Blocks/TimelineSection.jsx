import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Award, Calendar, Globe, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import Container from "@/components/Container/Container.jsx";

gsap.registerPlugin(ScrollTrigger);

export default function TimelineSection() {
  const t = useTranslations("Home");
  const timelineRef = useRef();
  const lineRef = useRef();
  const timelineEvents = t.raw("timeline.events");

  useEffect(() => {
    const line = lineRef.current;
    const events = gsap.utils.toArray(".timeline-event");

    gsap.set(line, { scaleY: 0, transformOrigin: "top" });

    ScrollTrigger.create({
      trigger: timelineRef.current,
      start: "top 80%",
      end: "bottom 20%",
      onUpdate: (self) => {
        gsap.to(line, {
          scaleY: self.progress,
          duration: 0.3,
          ease: "none",
        });
      },
    });

    events.forEach((event, index) => {
      const dot = event.querySelector(".timeline-dot");
      ScrollTrigger.create({
        trigger: event,
        start: "top 85%",
        onEnter: () => {
          gsap.fromTo(
            event,
            { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
            { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
          );
          // Pulse the dot
          gsap.to(dot, {
            scale: 1.3,
            duration: 0.4,
            ease: "power2.out",
            yoyo: true,
            repeat: 1,
          });
        },
        once: true,
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section ref={timelineRef} className="py-24 bg-slate-50">
      <Container>
        <div className="text-center mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#6495ED] mb-4 block">
            {t("timeline.title")}
          </span>
          <h2 className="text-3xl font-black text-slate-900">
            {t("timeline.subtitle")}
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-500 to-blue-600 h-full">
            <div ref={lineRef} className="w-full bg-blue-600 origin-top"></div>
          </div>

          {/* Timeline Events */}
          <div className="space-y-16">
            {timelineEvents.map((event, index) => {
              const icons = [Calendar, Globe, Award, Users];
              const IconComponent = icons[index % icons.length];
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`timeline-event flex items-center ${isLeft ? "flex-row" : "flex-row-reverse"} relative`}
                >
                  <div
                    className={`w-1/2 ${isLeft ? "pr-8 text-right" : "pl-8 text-left"}`}
                  >
                    <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-[2rem] p-6 shadow-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                          <IconComponent size={20} className="text-blue-600" />
                        </div>
                        <span className="text-sm font-bold text-blue-600">
                          {event.year}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 mb-2">
                        {event.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="timeline-dot absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>

                  <div className="w-1/2"></div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
