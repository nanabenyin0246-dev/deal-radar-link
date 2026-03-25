import { Search, Menu, X, ShoppingBag, User, Store, Package, Bell } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/i18n/I18nContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CurrencySelector from "@/components/CurrencySelector";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isVendor, signOut } = useAuth();
  const { t } = useI18n();

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-heading text-xl font-bold text-foreground">
            Rob<span className="text-primary">Compare</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t("nav.browse")}</Link>
          <a href="/#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t("nav.howItWorks")}</a>
          {user && (
            <Link to="/orders" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Package className="w-3.5 h-3.5" /> {t("nav.myOrders")}
            </Link>
          )}
          {user && (
            <Link to="/alerts" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Bell className="w-3.5 h-3.5" /> Alerts
            </Link>
          )}
          {isVendor && (
            <Link to="/vendor/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Store className="w-3.5 h-3.5" /> {t("nav.dashboard")}
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <CurrencySelector />
          <LanguageSwitcher />
          {user ? (
            <>
              <span className="text-xs text-muted-foreground max-w-[140px] truncate" title={user.email}>{user.email}</span>
              <Button variant="ghost" size="sm" onClick={signOut}>{t("nav.signOut")}</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild><Link to="/auth">{t("nav.signIn")}</Link></Button>
              <Button size="sm" asChild><Link to="/auth">{t("nav.getStarted")}</Link></Button>
            </>
          )}
        </div>

        <button className="md:hidden p-2 text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card p-4 space-y-3 animate-fade-in">
          <Link to="/products" className="block text-sm font-medium text-muted-foreground py-2 flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <Search className="w-4 h-4" /> {t("nav.browse")}
          </Link>
          {user && (
            <>
              <Link to="/orders" className="block text-sm font-medium text-muted-foreground py-2 flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <Package className="w-4 h-4" /> {t("nav.myOrders")}
              </Link>
              <Link to="/alerts" className="block text-sm font-medium text-muted-foreground py-2 flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <Bell className="w-4 h-4" /> Price Alerts
              </Link>
            </>
          )}
          {isVendor && (
            <Link to="/vendor/dashboard" className="block text-sm font-medium text-muted-foreground py-2 flex items-center gap-2" onClick={() => setMobileOpen(false)}>
              <Store className="w-4 h-4" /> {t("nav.dashboard")}
            </Link>
          )}
          <div className="flex items-center gap-2 py-2">
            <CurrencySelector />
            <LanguageSwitcher />
          </div>
          <div className="flex gap-2 pt-2">
            {user ? (
              <Button variant="outline" size="sm" className="flex-1" onClick={() => { signOut(); setMobileOpen(false); }}>{t("nav.signOut")}</Button>
            ) : (
              <>
                <Button variant="outline" size="sm" className="flex-1" asChild><Link to="/auth" onClick={() => setMobileOpen(false)}>{t("nav.signIn")}</Link></Button>
                <Button size="sm" className="flex-1" asChild><Link to="/auth" onClick={() => setMobileOpen(false)}>{t("nav.getStarted")}</Link></Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
