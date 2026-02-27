import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nContext";

const Footer = () => {
  const { t } = useI18n();

  const legalLinks = [
    { label: t("footer.terms"), to: "/terms" },
    { label: t("footer.privacy"), to: "/privacy" },
    { label: t("footer.vendorAgreement"), to: "/vendor-agreement" },
  ];

  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <ShoppingBag className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="font-heading text-lg font-bold">Rob<span className="text-primary">Compare</span></span>
            </Link>
            <p className="text-xs text-muted-foreground">{t("footer.tagline")}</p>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm mb-3">{t("footer.platform")}</h4>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{t("footer.browseProducts")}</Link></li>
              <li><Link to="/auth" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{t("footer.forVendors")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm mb-3">{t("footer.company")}</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{t("footer.about")}</a></li>
              <li><a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{t("footer.contact")}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm mb-3">{t("footer.legal")}</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-xs text-muted-foreground hover:text-foreground transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">{t("footer.copyright")}</p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">{t("footer.madeIn")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
