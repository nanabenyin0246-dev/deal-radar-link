import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, Smartphone, MessageCircle, Globe, Shield } from "lucide-react";

interface RegionalOnboardingProps {
  region: "ghana" | "francophone";
}

const ghanaContent = {
  title: "Sell on RobCompare Ghana",
  subtitle: "Join the fastest-growing marketplace in Ghana. Accept Mobile Money, sell via WhatsApp, and reach buyers nationwide.",
  features: [
    { icon: Smartphone, label: "MTN, Vodafone & AirtelTigo Mobile Money", desc: "Accept payments instantly via mobile money" },
    { icon: MessageCircle, label: "WhatsApp-Powered Commerce", desc: "Receive orders directly on WhatsApp" },
    { icon: Shield, label: "Ghana Cedi (GH₵) Support", desc: "List products in your local currency" },
    { icon: Globe, label: "Reach All of Ghana", desc: "Buyers from Accra to Kumasi to Tamale" },
  ],
  cta: "Register as Ghana Vendor",
  badge: "🇬🇭 Ghana",
};

const francophoneContent = {
  title: "Vendez sur RobCompare Afrique",
  subtitle: "Rejoignez le marché en pleine croissance en Afrique de l'Ouest francophone. Paiement mobile, vente WhatsApp, traduction AI.",
  features: [
    { icon: Globe, label: "Interface en Français", desc: "Tableau de bord et support entièrement en français" },
    { icon: Smartphone, label: "Paiement Mobile & XOF", desc: "Acceptez les paiements en francs CFA (XOF)" },
    { icon: MessageCircle, label: "Commerce WhatsApp", desc: "Recevez des commandes directement sur WhatsApp" },
    { icon: Shield, label: "Traduction AI Automatique", desc: "Traduisez vos produits en anglais, espagnol, portugais, arabe" },
  ],
  cta: "S'inscrire comme vendeur",
  badge: "🇸🇳 Afrique Francophone",
};

const RegionalOnboarding = ({ region }: RegionalOnboardingProps) => {
  const { user, isVendor } = useAuth();

  // Don't show vendor recruitment to anyone already signed in
  if (user || isVendor) return null;

  const content = region === "ghana" ? ghanaContent : francophoneContent;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container max-w-4xl">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-3">{content.badge}</Badge>
          <h2 className="font-heading text-2xl md:text-3xl font-bold">{content.title}</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">{content.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {content.features.map((f) => (
            <div key={f.label} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-heading font-semibold text-sm">{f.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg">
            <Link to="/auth">
              {content.cta}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RegionalOnboarding;
