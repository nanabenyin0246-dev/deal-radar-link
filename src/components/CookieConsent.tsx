import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookie_consent");
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", new Date().toISOString());
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border p-4 shadow-lg animate-fade-in">
      <div className="container max-w-4xl flex flex-col sm:flex-row items-center gap-4">
        <p className="text-sm text-muted-foreground flex-1">
          We use cookies and similar technologies to improve your experience. By continuing to use RobCompare, you agree to our{" "}
          <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link> and cookie usage.
        </p>
        <div className="flex gap-2 shrink-0">
          <Button size="sm" variant="outline" onClick={() => setVisible(false)}>Decline</Button>
          <Button size="sm" onClick={accept}>Accept</Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
