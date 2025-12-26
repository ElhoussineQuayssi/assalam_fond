"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import Image from "next/image";

export default function PartnerFlipCard({ image, title, className = "" }) {
  const cardRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    if (!innerRef.current) return;
    gsap.set(innerRef.current, {
      transformStyle: "preserve-3d",
      rotateY: 0,
    });
  }, []);

  const flipIn = () => {
    if (!innerRef.current) return;
    gsap.to(innerRef.current, {
      rotateY: 180,
      duration: 0.8,
      ease: "power3.out",
    });
  };

  const flipOut = () => {
    if (!innerRef.current) return;
    gsap.to(innerRef.current, {
      rotateY: 0,
      duration: 0.8,
      ease: "power3.out",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={flipIn}
      onMouseLeave={flipOut}
      style={{ perspective: "1200px" }}
      className={`w-64 h-40 cursor-pointer ${className}`}
    >
      <div
        ref={innerRef}
        className="relative w-full h-full rounded-xl shadow-lg"
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden rounded-xl overflow-hidden bg-white flex items-center justify-center">
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain p-4"
          />
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rounded-xl bg-blue-600 text-white flex items-center justify-center rotate-y-180">
          <h3 className="text-lg font-semibold text-center px-4">
            {title}
          </h3>
        </div>
      </div>
    </div>
  );
}
