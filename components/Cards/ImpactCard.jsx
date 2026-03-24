"use client";

import { gsap } from "gsap";
import { CSSPlugin } from "gsap/CSSPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

gsap.registerPlugin(ScrollTrigger, CSSPlugin);

export default function ImpactCard({
  value,
  title,
  icon,
  type = "blue",
  translatedTitle,
}) {
  const cardRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  // Use a ref to track the value to avoid re-render issues
  const valueRef = useRef(value);
  valueRef.current = value;
  const [displayValue, setDisplayValue] = useState("");

  const themes = {
    blue: "text-[#6495ED] border-blue-100 bg-blue-50",
    green: "text-emerald-500 border-emerald-100 bg-emerald-50",
    red: "text-rose-500 border-rose-100 bg-rose-50",
  };

  // Set mounted state on client-side only
  useEffect(() => {
    setIsMounted(true);
    // Set the display value when mounted
    setDisplayValue(valueRef.current || "");
  }, []);

  const numericValue = parseInt(value?.replace(/[^\\d]/g, ""), 10) || 0;

  useEffect(() => {
    const card = cardRef.current;
    if (!card || !isMounted) return;

    // Mouse tilt effects
    const handleMouseEnter = () => {
      gsap.set(card, { transformOrigin: "center center" });
    };

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (y / rect.height) * -10;
      const rotateY = (x / rect.width) * 10;
      gsap.to(card, {
        rotationY: rotateY,
        rotationX: rotateX,
        duration: 0.3,
        ease: "power2.out",
        transformPerspective: 1000,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    // Count animation on scroll (client-only)
    const tl = gsap.timeline();
    ScrollTrigger.create({
      trigger: card,
      start: "top 85%",
      onEnter: () => {
        tl.fromTo(
          { count: 0 },
          { count: numericValue },
          {
            count: numericValue,
            duration: 2,
            ease: "power2.out",
            onUpdate: function () {
              const count = Math.floor(this.targets()[0].count);
              setDisplayValue(
                count + (value.includes("+") ? "+" : value.includes("%") ? "%" : "")
              );
            },
          },
        );

        // Icon animation
        const iconEl = card.querySelector(".icon-container");
        gsap.fromTo(iconEl, { y: -10 }, {
          y: 0,
          duration: 0.6,
          ease: "bounce.out",
          delay: 0.2,
          onComplete: () => {
            gsap.to(iconEl, {
              y: -5,
              duration: 2,
              ease: "power1.inOut",
              yoyo: true,
              repeat: -1,
            });
          },
        });
      },
      once: true,
    });

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      tl.kill();
    };
  }, [value, numericValue, isMounted]);

  return (
    <Card
      ref={cardRef}
      className="reveal-card bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 border-2 border-muted/50 rounded-[2rem]"
    >
      <CardHeader className="pb-2">
        <div className={`icon-container w-12 h-12 rounded-xl flex items-center justify-center mb-2 shadow-md ${themes[type]}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`count-display text-4xl font-bold mb-1 ${themes[type].split(' ')[0]} transition-all duration-300`}>
          {/* Show value immediately - use value prop directly to avoid hydration issues */}
          {value || displayValue || "0"}
        </div>
        <CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-400">
          {translatedTitle || title}
        </CardTitle>
      </CardContent>
    </Card>
  );
}
