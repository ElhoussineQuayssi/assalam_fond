import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function AboutTimeline() {
  const t = useTranslations("About.timeline");
  const timelineRef = useRef();
  const lineRef = useRef();

  useEffect(() => {
    const line = lineRef.current;
    const events = gsap.utils.toArray(".timeline-event");

    gsap.set(line, { scaleY: 0, transformOrigin: "top" });

    // Pin the timeline section for better scroll experience
    ScrollTrigger.create({
      trigger: timelineRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: false, // Set to true if you want to pin, but for now keep dynamic
      scrub: true,
      onUpdate: (self) => {
        gsap.to(line, {
          scaleY: self.progress,
          duration: 0.1,
          ease: "none",
        });
      },
    });

    events.forEach((event, index) => {
      ScrollTrigger.create({
        trigger: event,
        start: "top 80%",
        end: "bottom 20%",
        scrub: true,
        onEnter: () => {
          gsap.fromTo(
            event,
            { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
            { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
          );
        },
        onLeaveBack: () => {
          gsap.to(event, {
            opacity: 0,
            x: index % 2 === 0 ? -50 : 50,
            duration: 0.5,
          });
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section ref={timelineRef} className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-slate-600">{t("subtitle")}</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-slate-300 h-full">
            <div ref={lineRef} className="w-full bg-blue-600 origin-top"></div>
          </div>

          {/* Timeline Events */}
          <div className="space-y-16">
            {t.raw("events").map((event, index) => {
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`timeline-event flex items-center ${isLeft ? "flex-row" : "flex-row-reverse"} relative`}
                >
                  <div
                    className={`w-1/2 ${isLeft ? "pr-8 text-right" : "pl-8 text-left"}`}
                  >
                    <div className="bg-white rounded-[2rem] p-6 shadow-lg">
                      <span className="text-sm font-bold text-blue-600 mb-2 block">
                        {event.year}
                      </span>
                      <h3 className="text-xl font-black text-slate-900 mb-2">
                        {event.title}
                      </h3>
                      <p className="text-slate-600">{event.description}</p>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>

                  <div className="w-1/2"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
