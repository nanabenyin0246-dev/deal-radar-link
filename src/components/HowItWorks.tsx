import { Search, MessageCircle, TrendingDown, Shield, Globe, Zap } from "lucide-react";
import { useI18n } from "@/i18n/I18nContext";

const HowItWorks = () => {
  const { t } = useI18n();

  const steps = [
    { icon: Search, title: t("howItWorks.step1Title"), description: t("howItWorks.step1Desc") },
    { icon: TrendingDown, title: t("howItWorks.step2Title"), description: t("howItWorks.step2Desc") },
    { icon: MessageCircle, title: t("howItWorks.step3Title"), description: t("howItWorks.step3Desc") },
  ];

  const features = [
    { icon: Shield, title: t("howItWorks.feature1Title"), description: t("howItWorks.feature1Desc") },
    { icon: Globe, title: t("howItWorks.feature2Title"), description: t("howItWorks.feature2Desc") },
    { icon: Zap, title: t("howItWorks.feature3Title"), description: t("howItWorks.feature3Desc") },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-muted/50">
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="font-heading text-2xl md:text-4xl font-bold">{t("howItWorks.title")}</h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            {t("howItWorks.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-20">
          {steps.map((step, i) => (
            <div key={i} className="relative text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center justify-center">
                {i + 1}
              </div>
              <h3 className="font-heading font-semibold text-lg">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
              <f.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm text-foreground">{f.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
