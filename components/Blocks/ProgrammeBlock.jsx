import React, { useEffect } from 'react';
import { Clock, GraduationCap, BookOpen, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ProgrammeBlock = ({ heading, modules, duration, certification }) => {
  useEffect(() => {
    gsap.from(".module-card", {
      scrollTrigger: {
        trigger: ".programme-section",
        start: "top 80%",
      },
      opacity: 0,
      x: 30,
      stagger: 0.1,
      duration: 0.8,
      ease: "power2.out"
    });
  }, []);

  return (
    <section className="programme-section py-16 px-4 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-12">

        {/* --- Sidebar Info --- */}
        <div className="md:w-1/3 space-y-6">
          <div className="bg-blue-50 p-8 rounded-[2rem] border border-blue-100">
            <h2 className="text-2xl font-black text-slate-900 mb-6 leading-tight">
              {heading}
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-700">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">المدة</p>
                  <p className="font-bold">{duration}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-700">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">الشهادة</p>
                  <p className="font-bold">{certification || "دبلوم معتمد"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Modules List --- */}
        <div className="md:w-2/3">
          <div className="grid gap-4">
            {modules && modules.map((module, index) => (
              <Card
                key={index}
                className="module-card group p-6 rounded-3xl border-slate-100 hover:border-blue-200 transition-all duration-300 hover:shadow-xl hover:shadow-blue-50/50"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center font-black text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-slate-800 mb-1">
                      {typeof module === 'string' ? module : module.title}
                    </h4>
                    {module.description && (
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {module.description}
                      </p>
                    )}
                  </div>
                  <CheckCircle className="w-5 h-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProgrammeBlock;