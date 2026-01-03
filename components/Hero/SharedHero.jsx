"use client";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";

const SharedHero = ({
  title,
  description,
  image,
  allProjectImages,
  showScrollButton = false,
}) => {
  const [index, setIndex] = useState(0);
  const [randomImages, setRandomImages] = useState([]);
  const titleRef = useRef(null);
  const locale = useLocale();

  useEffect(() => {
    if (allProjectImages?.length > 0) {
      const shuffled = [...allProjectImages].sort(() => 0.5 - Math.random());
      setRandomImages(shuffled.slice(0, 6));
    }
  }, [allProjectImages]);

  useEffect(() => {
    if (randomImages.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % randomImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [randomImages]);

  useGSAP(
    () => {
      if (titleRef.current) {
        const words = titleRef.current.querySelectorAll("span");
        gsap.fromTo(
          words,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power4.out",
            delay: 0.5,
          },
        );
      }
    },
    { dependencies: [title] },
  );

  const scrollToNext = () => {
    const nextSection = document.querySelector("section:nth-of-type(2)");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // If no allProjectImages provided, fall back to single image
  if (!allProjectImages || allProjectImages.length === 0) {
    return (
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {image && (
            <Image
              src={image}
              alt="Hero background"
              fill
              className="object-cover scale-110"
              priority
            />
          )}
          {/* Overlay dark m-gadd bach l-ktaba w l-navbar items i-banou */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl pt-24">
          <h1
            ref={titleRef}
            className={`text-6xl font-black mb-6 drop-shadow-2xl ${locale === "ar" ? "text-right" : ""}`}
          >
            {(locale === "ar"
              ? title.split(" ").reverse()
              : title.split(" ")
            ).map((word, index) => (
              <span
                key={index}
                className={`inline-block ${locale === "ar" ? "ml-2" : "mr-2"}`}
              >
                {word}
              </span>
            ))}
          </h1>
          <p className="text-xl text-gray-100 max-w-2xl mx-auto drop-shadow-md mb-8">
            {description}
          </p>
          {showScrollButton && (
            <button
              onClick={scrollToNext}
              className="mt-8 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors group"
              aria-label="Scroll to next section"
            >
              <ChevronDown className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
            </button>
          )}
        </div>
      </section>
    );
  }

  if (randomImages.length === 0)
    return (
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="relative z-10 text-center text-white px-4 max-w-4xl pt-24">
          <h1
            ref={titleRef}
            className={`text-6xl font-black mb-6 drop-shadow-2xl ${locale === "ar" ? "text-right" : ""}`}
          >
            {(locale === "ar"
              ? title.split(" ").reverse()
              : title.split(" ")
            ).map((word, index) => (
              <span
                key={index}
                className={`inline-block ${locale === "ar" ? "ml-2" : "mr-2"}`}
              >
                {word}
              </span>
            ))}
          </h1>
          <p className="text-xl text-gray-100 max-w-2xl mx-auto drop-shadow-md mb-8">
            {description}
          </p>
          {showScrollButton && (
            <button
              onClick={scrollToNext}
              className="mt-8 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors group"
              aria-label="Scroll to next section"
            >
              <ChevronDown className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
            </button>
          )}
        </div>
      </section>
    );

  return (
    <section className="relative h-screen w-full overflow-hidden bg-slate-900">
      {/* Background Slideshow */}
      <AnimatePresence mode="wait">
        <motion.img
          key={randomImages[index].image_url}
          src={randomImages[index].image_url}
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 0.4, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <h1
          ref={titleRef}
          className={`text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-lg ${locale === "ar" ? "text-right" : ""}`}
        >
          {(locale === "ar"
            ? title.split(" ").reverse()
            : title.split(" ")
          ).map((word, index) => (
            <span
              key={index}
              className={`inline-block ${locale === "ar" ? "ml-2" : "mr-2"}`}
            >
              {word}
            </span>
          ))}
        </h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-100 max-w-2xl mx-auto drop-shadow-md mb-8"
        >
          {description}
        </motion.p>
        {showScrollButton && (
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={scrollToNext}
            className="mt-8 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors group"
            aria-label="Scroll to next section"
          >
            <ChevronDown className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
          </motion.button>
        )}
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {randomImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === index
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Subtle Gradient bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/80 pointer-events-none" />
    </section>
  );
};

export default SharedHero;
