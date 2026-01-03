import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Crown, Heart, Star } from "lucide-react";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

gsap.registerPlugin(ScrollTrigger);

const SponsorshipBlock = ({ heading, plans }) => {
  useEffect(() => {
    gsap.from(".pricing-card", {
      scrollTrigger: {
        trigger: ".sponsorship-section",
        start: "top 80%",
      },
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.8,
      ease: "power2.out",
    });
  }, []);

  const getIcon = (level) => {
    switch (level.toLowerCase()) {
      case "bronze":
        return <Heart className="w-6 h-6" />;
      case "silver":
        return <Star className="w-6 h-6" />;
      case "gold":
        return <Crown className="w-6 h-6" />;
      default:
        return <Check className="w-6 h-6" />;
    }
  };

  const getColorScheme = (level) => {
    switch (level.toLowerCase()) {
      case "bronze":
        return {
          bg: "bg-amber-50",
          border: "border-amber-200",
          text: "text-amber-600",
          button: "bg-amber-600 hover:bg-amber-700",
        };
      case "silver":
        return {
          bg: "bg-slate-50",
          border: "border-slate-200",
          text: "text-slate-600",
          button: "bg-slate-600 hover:bg-slate-700",
        };
      case "gold":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          text: "text-yellow-600",
          button: "bg-yellow-600 hover:bg-yellow-700",
        };
      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-600",
          button: "bg-blue-600 hover:bg-blue-700",
        };
    }
  };

  return (
    <section className="sponsorship-section py-16 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-slate-900 mb-4">{heading}</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          اختر مستوى الرعاية الذي يناسبك وكن جزءاً من التغيير الإيجابي في مجتمعنا
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans?.map((plan, index) => {
          const colors = getColorScheme(plan.level);
          const isPopular = plan.popular;

          return (
            <Card
              key={index}
              className={`pricing-card relative p-8 rounded-3xl border-2 ${colors.border} ${colors.bg} hover:shadow-xl transition-all duration-300 ${isPopular ? "scale-105" : ""}`}
            >
              {isPopular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                  الأكثر شعبية
                </Badge>
              )}

              <div className="text-center mb-6">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${colors.bg} border-2 ${colors.border} mb-4`}
                >
                  <div className={colors.text}>{getIcon(plan.level)}</div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {plan.level}
                </h3>
                <div className="text-3xl font-black text-slate-900 mb-1">
                  {plan.amount}
                </div>
                <p className="text-sm text-slate-500">
                  {plan.period || "شهرياً"}
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {plan.benefits?.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Check className={`w-5 h-5 ${colors.text} flex-shrink-0`} />
                    <span className="text-sm text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button
                className={`w-full ${colors.button} text-white font-bold py-3 rounded-xl transition-colors`}
              >
                {plan.cta || "اختر هذا المستوى"}
              </Button>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default SponsorshipBlock;
