import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Shield, CheckCircle, AlertTriangle, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const TrustSafety = () => {
  const { toast } = useToast();
  const [reportVendor, setReportVendor] = useState("");
  const [reportIssue, setReportIssue] = useState("");
  const [reportEmail, setReportEmail] = useState("");

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Report submitted", description: "We'll review this within 24 hours." });
    setReportVendor(""); setReportIssue(""); setReportEmail("");
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Shopping Safely on RobCompare" description="Learn how RobCompare protects buyers and verifies vendors." path="/trust" />
      <Navbar />
      <div className="container py-12 max-w-3xl">
        <h1 className="font-heading text-3xl font-bold mb-8 flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" /> Shopping Safely on RobCompare
        </h1>

        <section className="mb-10">
          <h2 className="font-heading text-xl font-bold mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" /> How we verify vendors
          </h2>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li>• Every vendor application is manually reviewed by our team before approval</li>
            <li>• Verified vendors display a ✓ badge confirming their identity and legitimacy</li>
            <li>• We check business registration, WhatsApp number validity, and product quality</li>
            <li>• Vendors caught violating policies are suspended immediately</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-heading text-xl font-bold mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" /> Buyer protection
          </h2>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li>• Open a dispute within 7 days of purchase if something goes wrong</li>
            <li>• Our admin team reviews disputes and mediates between buyer and vendor</li>
            <li>• Refunds are issued to buyers when vendors fail to deliver as promised</li>
            <li>• Repeat offenders are permanently banned from the platform</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-heading text-xl font-bold mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-secondary" /> Report a vendor
          </h2>
          <form onSubmit={handleReport} className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="space-y-2">
              <Label>Vendor name</Label>
              <Input value={reportVendor} onChange={(e) => setReportVendor(e.target.value)} required placeholder="Business name" />
            </div>
            <div className="space-y-2">
              <Label>Describe the issue</Label>
              <Textarea value={reportIssue} onChange={(e) => setReportIssue(e.target.value)} required placeholder="What happened?" rows={4} />
            </div>
            <div className="space-y-2">
              <Label>Your email</Label>
              <Input type="email" value={reportEmail} onChange={(e) => setReportEmail(e.target.value)} required placeholder="you@example.com" />
            </div>
            <Button type="submit">Submit Report</Button>
          </form>
        </section>

        <section className="mb-10">
          <h2 className="font-heading text-xl font-bold mb-3 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" /> Tips for safe WhatsApp shopping
          </h2>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li>1. Always confirm the exact product, price, and delivery terms before paying</li>
            <li>2. Use secure payment methods — avoid sending cash directly to strangers</li>
            <li>3. Ask for photos or videos of the actual item before purchase</li>
            <li>4. Keep all chat records as evidence in case of a dispute</li>
            <li>5. Prefer verified vendors (look for the ✓ badge) for higher trust</li>
          </ul>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default TrustSafety;
