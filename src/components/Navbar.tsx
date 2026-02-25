import { Search, Menu, X, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

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
          <Link to="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Browse Products
          </Link>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </a>
          <a href="#vendors" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            For Vendors
          </a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Button size="sm">
            Get Started
          </Button>
        </div>

        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card p-4 space-y-3 animate-fade-in">
          <Link to="/products" className="block text-sm font-medium text-muted-foreground py-2" onClick={() => setMobileOpen(false)}>
            Browse Products
          </Link>
          <a href="#how-it-works" className="block text-sm font-medium text-muted-foreground py-2" onClick={() => setMobileOpen(false)}>
            How It Works
          </a>
          <a href="#vendors" className="block text-sm font-medium text-muted-foreground py-2" onClick={() => setMobileOpen(false)}>
            For Vendors
          </a>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1">Sign In</Button>
            <Button size="sm" className="flex-1">Get Started</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
