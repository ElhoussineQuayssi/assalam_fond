import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection() {
  const t = useTranslations("Home.faq");
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#6495ED] mb-4 block">
            {t("title")}
          </span>
          <h2 className="text-3xl font-black text-slate-900">
            {t("subtitle")}
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {[1, 2, 3, 4].map((num) => (
            <AccordionItem
              key={num}
              value={`item-${num}`}
              className="border border-slate-100 rounded-2xl px-6 bg-[#FAFAFA] hover:bg-white transition-colors"
            >
              <AccordionTrigger className="font-medium text-slate-800 hover:text-[#6495ED] transition-colors">
                {t(`q${num}`)}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed">
                {t(`a${num}`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
