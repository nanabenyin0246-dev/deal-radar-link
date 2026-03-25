import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, CheckCircle, AlertTriangle, MessageCircle, Search, BarChart3 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ISSUE_TYPES = ["Fake product", "Scam", "Wrong price listed", "Harassment", "Other"];

const TrustSafety = () => {
  const { toast } = useToast();
  const [reportVendor, setReportVendor] = useState("");
  const [reportEmail, setReportEmail] = useState("");
  const [reportIssueType, setReportIssueType] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from("audit_log").insert({
        action: "vendor_report",
        entity_type: "vendor",
        details: {
          vendor_name: reportVendor,
          reporter_email: reportEmail,
          issue_type: reportIssueType,
          description: reportDescription,
        },
      });
      if (error) throw error;
      toast({ title: "Report submitted", description: "We'll investigate within 24 hours." });
      setReportVendor(""); setReportEmail(""); setReportIssueType(""); setReportDescription("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Trust & Safety" description="Learn how RobCompare protects buyers and verifies vendors across Africa." path="/trust" />
      <Navbar />
      <div className="container py-12 max-w-3xl">
        <h1 className="font-heading text-3xl font-bold mb-2 flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" /> Shop & Sell with Confidence
        </h1>
        <p className="text-muted-foreground mb-10">RobCompare is built on transparency, verification, and buyer protection.</p>

        {/* Section 1 — How We Verify Vendors */}
        <section className="mb-10">
          <h2 className="font-heading text-xl font-bold mb-3 flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" /> How We Verify Vendors
          </h2>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li>🔍 <strong>Manual Review</strong> — Every vendor is manually reviewed before approval</li>
            <li>✓ <strong>Verified Badge</strong> — Verified vendors have completed identity checks</li>
            <li>📊 <strong>Trust Score</strong> — Calculated from response rate, disputes, and history</li>
          </ul>
        </section>

        {/* Section 2 — Buyer Protection */}
        <section className="mb-10">
          <h2 className="font-heading text-xl font-bold mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" /> Buyer Protection
          </h2>
          <ol className="space-y-2 text-muted-foreground text-sm list-decimal list-inside">
            <li>Compare prices before buying — never overpay</li>
            <li>Check vendor trust scores and verified badges</li>
            <li>Use our WhatsApp escrow checkout for high-value items</li>
            <li>Open a dispute within 7 days if there's an issue</li>
            <li>Our admin team reviews all disputes within 48 hours</li>
          </ol>
        </section>

        {/* Section 3 — Safe WhatsApp Shopping Tips */}
        <section className="mb-10">
          <h2 className="font-heading text-xl font-bold mb-3 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" /> Safe WhatsApp Shopping Tips
          </h2>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li>✓ Always ask for product photos before paying</li>
            <li>✓ Verify vendor location matches their profile</li>
            <li>✓ Start with a small order from new vendors</li>
            <li>✓ Never send payment before agreeing on terms</li>
            <li>✓ Keep all WhatsApp conversations as proof</li>
          </ul>
        </section>

        {/* Section 4 — Report a Vendor */}
        <section className="mb-10">
          <h2 className="font-heading text-xl font-bold mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-secondary" /> Report a Problem
          </h2>
          <form onSubmit={handleReport} className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="space-y-2">
              <Label>Vendor Name *</Label>
              <Input value={reportVendor} onChange={(e) => setReportVendor(e.target.value)} required placeholder="Business name" />
            </div>
            <div className="space-y-2">
              <Label>Your Email *</Label>
              <Input type="email" value={reportEmail} onChange={(e) => setReportEmail(e.target.value)} required placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Issue Type *</Label>
              <Select value={reportIssueType} onValueChange={setReportIssueType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  {ISSUE_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea value={reportDescription} onChange={(e) => setReportDescription(e.target.value)} required placeholder="Describe the issue..." rows={4} />
            </div>
            <Button type="submit" disabled={submitting || !reportIssueType}>
              {submitting ? "Submitting..." : "Submit Report"}
            </Button>
          </form>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default TrustSafety;
