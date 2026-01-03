"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// --- Project Gallery Renderer ---
const ProjectGalleryRenderer = ({
  galleryImages,
  title = "Project Gallery",
}) => {
  // Ensure galleryImages is an array
  const safeGalleryImages = Array.isArray(galleryImages) ? galleryImages : [];

  // Don't render if no images
  if (safeGalleryImages.length === 0) {
    return null;
  }

  // Filter for published images only
  const publishedImages = safeGalleryImages.filter(
    (img) => img.status !== "deleted",
  );

  // Don't render if no published images
  if (publishedImages.length === 0) {
    return null;
  }

  return (
    <section className="py-10 max-w-6xl mx-auto px-6">
      {/* Gallery Title */}
      {title && (
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2 flex items-center justify-center gap-2">
            <ImageIcon className="h-5 w-5" />
            {title}
          </h2>
          <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>
      )}

      {/* Images Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {publishedImages.map((img, i) => {
          // Handle different image URL formats with safe encoding
          const rawSrc = (img.url || img.image_url || img)
            .toString()
            .replace(/^"|"$/g, "");

          if (!rawSrc || typeof rawSrc !== "string" || rawSrc.trim() === "")
            return null;

          // Safely encode URL - avoid double-encoding already encoded URLs
          let safeSrc;
          try {
            // If URL contains %2520 (double-encoded), decode it first
            if (rawSrc.includes("%2520")) {
              safeSrc = decodeURIComponent(rawSrc);
            } else {
              safeSrc = encodeURI(rawSrc);
            }
          } catch (error) {
            console.warn("URL encoding failed for image:", rawSrc, error);
            safeSrc = rawSrc; // Fallback to raw URL
          }

          return (
            <div
              key={img.id || i}
              className="break-inside-avoid rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="relative w-full aspect-[4/3] group-hover:scale-105 transition-transform duration-500">
                <Image
                  src={safeSrc}
                  alt={img.caption || `Gallery image ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading={i < 3 ? "eager" : "lazy"}
                  priority={i < 2}
                  onError={(e) => {
                    // Fallback: try to render as regular img tag if Next.js Image fails
                    const imgElement = e.target;
                    const fallbackImg = document.createElement("img");
                    fallbackImg.src = safeSrc;
                    fallbackImg.alt = img.caption || `Gallery image ${i + 1}`;
                    fallbackImg.className = "w-full h-full object-cover";
                    fallbackImg.onerror = () => {
                      fallbackImg.src = "/placeholder-image.jpg";
                    };
                    imgElement.parentNode.replaceChild(fallbackImg, imgElement);
                  }}
                />
                {/* Image Caption Overlay */}
                {img.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-4">
                    <p className="text-sm font-medium">{img.caption}</p>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <ImageIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gallery Stats */}
      <div className="mt-8 text-center">
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
            publishedImages.length > 0
              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
          }`}
        >
          <ImageIcon className="h-4 w-4" />
          <span>
            {publishedImages.length}{" "}
            {publishedImages.length === 1 ? "image" : "images"}
          </span>
        </div>
      </div>
    </section>
  );
};

export default ProjectGalleryRenderer;
