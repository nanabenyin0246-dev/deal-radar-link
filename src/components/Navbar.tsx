import { Search, Menu, X, ShoppingBag, User, Store } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isVendor, signOut } = useAuth();

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
          <Link to="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Browse Products</Link>
          <a href="/#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          {isVendor && (
            <Link to="/vendor/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Store className="w-3.5 h-3.5" /> Dashboard
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-xs text-muted-foreground">{user.email}</span>
              <Button variant="ghost" size="sm" onClick={signOut}>Sign Out</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild><Link to="/auth">Sign In</Link></Button>
              <Button size="sm" asChild><Link to="/auth">Get Started</Link></Button>
            </>
          )}
        </div>

        <button className="md:hidden p-2 text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card p-4 space-y-3 animate-fade-in">
          <Link to="/products" className="block text-sm font-medium text-muted-foreground py-2" onClick={() => setMobileOpen(false)}>Browse Products</Link>
          {isVendor && (
            <Link to="/vendor/dashboard" className="block text-sm font-medium text-muted-foreground py-2" onClick={() => setMobileOpen(false)}>Vendor Dashboard</Link>
          )}
          <div className="flex gap-2 pt-2">
            {user ? (
              <Button variant="outline" size="sm" className="flex-1" onClick={() => { signOut(); setMobileOpen(false); }}>Sign Out</Button>
            ) : (
              <>
                <Button variant="outline" size="sm" className="flex-1" asChild><Link to="/auth" onClick={() => setMobileOpen(false)}>Sign In</Link></Button>
                <Button size="sm" className="flex-1" asChild><Link to="/auth" onClick={() => setMobileOpen(false)}>Get Started</Link></Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
