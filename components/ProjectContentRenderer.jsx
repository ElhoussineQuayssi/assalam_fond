"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { CheckCircle2, Clock, TrendingUp } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// --- 1. Text Block (Heading أصغر و Padding متوازن) ---
const TextBlock = ({ heading, text, language = "fr" }) => {
  const displayHeading =
    typeof heading === "object"
      ? heading[language] || heading.fr || ""
      : heading || "";
  const displayText =
    typeof text === "object" ? text[language] || text.fr || "" : text || "";

  return (
    <section className="py-6 max-w-3xl mx-auto px-6">
      {displayHeading && (
        <h2 className="text-lg font-bold text-slate-800 mb-3 border-l-4 border-blue-500 pl-4">
          {displayHeading}
        </h2>
      )}
      {displayText && (
        <p className="text-sm text-slate-600 leading-relaxed">{displayText}</p>
      )}
    </section>
  );
};

// --- 3. Programme Block (نفس اللي في الصورة ولكن أصغر) ---
const ProgrammeBlock = ({ heading, modules, duration, language = "fr" }) => {
  // Ensure modules is an array
  const safeModules = Array.isArray(modules) ? modules : [];
  const displayHeading =
    typeof heading === "object"
      ? heading[language] || heading.fr || ""
      : heading || "";
  const displayDuration =
    typeof duration === "object"
      ? duration[language] || duration.fr || ""
      : duration || "";

  return (
    <section className="py-10 max-w-5xl mx-auto px-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4 bg-blue-600 text-white p-6 rounded-3xl shadow-lg shadow-blue-100">
          <h3 className="text-md font-bold mb-4">{displayHeading}</h3>
          <div className="flex items-center gap-2 text-xs">
            <Clock size={14} /> {displayDuration}
          </div>
        </div>
        <div className="md:w-3/4 grid gap-3">
          {safeModules.map((m, i) => (
            <div
              key={i}
              className="p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 transition-colors"
            >
              <h4 className="text-xs font-bold text-blue-600 uppercase mb-1">
                {m.title}
              </h4>
              <p className="text-xs text-slate-500 leading-snug">
                {m.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- 4. Impact & Sponsorship (Cards صغار وهادئين) ---
const ImpactBlock = ({ heading, impacts, formulas, language = "fr" }) => {
  // Ensure impacts and formulas are arrays
  const safeImpacts = Array.isArray(impacts) ? impacts : [];
  const safeFormulas = Array.isArray(formulas) ? formulas : [];
  const items = safeImpacts.length > 0 ? safeImpacts : safeFormulas;
  const displayHeading =
    typeof heading === "object"
      ? heading[language] || heading.fr || ""
      : heading || "";

  return (
    <section className="py-10 max-w-5xl mx-auto px-6">
      {displayHeading && (
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8 text-center">
          {displayHeading}
        </h3>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <div
            key={i}
            className="p-6 bg-white border border-slate-100 rounded-[2rem] text-center hover:shadow-md transition-shadow"
          >
            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp size={14} className="text-blue-500" />
            </div>
            <h4 className="text-xs font-bold text-slate-800 mb-2">
              {item.description || item.name}
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed uppercase">
              {item.value || item.amount}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

// --- 5. Timeline (المشاريع الموسمية - Missing) ---
const TimelineBlock = ({ heading, events, language = "fr" }) => {
  // Ensure events is an array
  const safeEvents = Array.isArray(events) ? events : [];
  const displayHeading =
    typeof heading === "object"
      ? heading[language] || heading.fr || ""
      : heading || "";

  return (
    <section className="py-10 max-w-3xl mx-auto px-6">
      {displayHeading && (
        <h3 className="text-sm font-black mb-6 text-blue-600 uppercase">
          {displayHeading}
        </h3>
      )}
      <div className="space-y-6 border-l-2 border-blue-50 ml-2">
        {safeEvents.map((ev, i) => (
          <div key={i} className="relative pl-8">
            <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-blue-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              {ev.year}
            </span>
            <h4 className="text-sm font-bold text-slate-800">{ev.title}</h4>
            <p className="text-xs text-slate-500">{ev.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// --- 2. Services Block (نفس اللي في الصورة ولكن أصغر) ---
const ServicesBlock = ({ heading, categories, language = "fr" }) => {
  // Ensure categories is an array
  const safeCategories = Array.isArray(categories) ? categories : [];
  const displayHeading =
    typeof heading === "object"
      ? heading[language] || heading.fr || ""
      : heading || "";

  return (
    <section className="py-10 max-w-5xl mx-auto px-6">
      {displayHeading && (
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-8 text-center">
          {displayHeading}
        </h3>
      )}
      <div className="space-y-6">
        {safeCategories.map((category, index) => (
          <div key={index} className="space-y-4">
            {category.name && (
              <h4 className="text-md font-semibold text-blue-600 dark:text-blue-400">
                {category.name}
              </h4>
            )}
            <div className="grid gap-3">
              {(Array.isArray(category.services) ? category.services : []).map(
                (service, serviceIndex) => (
                  <div
                    key={serviceIndex}
                    className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg hover:border-blue-200 transition-colors"
                  >
                    {service.name && (
                      <h5 className="text-sm font-bold text-slate-800 dark:text-white mb-1">
                        {service.name}
                      </h5>
                    )}
                    {service.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {service.description}
                      </p>
                    )}
                  </div>
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// --- 3. Stats Block (أصغر وهدوء) ---
const StatsBlock = ({ heading, stats, language = "fr" }) => {
  // Ensure stats is an array
  const safeStats = Array.isArray(stats) ? stats : [];
  const displayHeading =
    typeof heading === "object"
      ? heading[language] || heading.fr || ""
      : heading || "";

  return (
    <section className="py-10 max-w-5xl mx-auto px-6">
      {displayHeading && (
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-8 text-center">
          {displayHeading}
        </h3>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {safeStats.map((stat, index) => (
          <div
            key={index}
            className="p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-center hover:shadow-md transition-shadow"
          >
            <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp size={14} className="text-blue-500" />
            </div>
            {stat.label && (
              <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-2">
                {stat.label}
              </h4>
            )}
            {stat.value && (
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">
                {stat.value}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

// --- 6. List Block (Fixed empty state handling) ---
const ListBlock = ({ heading, items = [], language = "fr" }) => {
  // Ensure items is always an array
  const safeItems = Array.isArray(items) ? items : [];
  const displayHeading =
    typeof heading === "object"
      ? heading[language] || heading.fr || ""
      : heading || "";

  // Don't render if no heading and no items
  if (
    (!displayHeading || displayHeading.trim() === "") &&
    safeItems.length === 0
  ) {
    return null;
  }

  // Don't render if only heading but no items and heading is generic
  if (
    safeItems.length === 0 &&
    (!displayHeading ||
      displayHeading.trim() === "" ||
      displayHeading === "List Title")
  ) {
    return null;
  }

  return (
    <section className="py-10 max-w-5xl mx-auto px-6">
      {displayHeading && displayHeading.trim() !== "" && (
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-8 text-center">
          {displayHeading}
        </h3>
      )}
      <div className="space-y-4">
        {safeItems.map((item, index) => {
          // Skip items with no meaningful content
          if (
            (!item.title || item.title.trim() === "") &&
            (!item.description || item.description.trim() === "")
          ) {
            return null;
          }

          return (
            <div
              key={index}
              className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg"
            >
              <div className="w-6 h-6 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 size={14} className="text-blue-500" />
              </div>
              <div className="flex-1">
                {item.title && item.title.trim() !== "" && (
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">
                    {item.title}
                  </h4>
                )}
                {item.description && item.description.trim() !== "" && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

// --- Master Renderer ---
export const ProjectContentRenderer = ({ contentArray, language = "fr" }) => {
  // Ensure contentArray is always an array
  const safeContentArray = Array.isArray(contentArray) ? contentArray : [];

  // Filter out empty list blocks
  const filteredContent = safeContentArray.filter((block) => {
    // Skip empty list blocks
    if (block.type === "list") {
      const hasHeading =
        block.content?.heading &&
        block.content.heading.trim() !== "" &&
        block.content.heading !== "List Title";
      const hasItems =
        Array.isArray(block.content?.items) &&
        block.content.items.some(
          (item) =>
            (item.title && item.title.trim() !== "") ||
            (item.description && item.description.trim() !== ""),
        );
      return hasHeading || hasItems;
    }

    // Keep all other block types
    return true;
  });

  if (filteredContent.length === 0) return null;

  return (
    <div className="space-y-6">
      {filteredContent.map((block) => {
        const { type, content, id } = block;
        switch (type) {
          case "text":
            return <TextBlock key={id} {...content} language={language} />;
          case "services":
            return <ServicesBlock key={id} {...content} language={language} />;
          case "stats":
            return <StatsBlock key={id} {...content} language={language} />;
          case "programme":
            return <ProgrammeBlock key={id} {...content} language={language} />;
          case "impact":
            return <ImpactBlock key={id} {...content} language={language} />;
          case "sponsorship":
            return <ImpactBlock key={id} {...content} language={language} />;
          case "timeline":
            return <TimelineBlock key={id} {...content} language={language} />;

          case "list":
            return <ListBlock key={id} {...content} language={language} />;
          default:
            console.warn(`Unknown block type: ${type}`);
            return null;
        }
      })}
    </div>
  );
};
