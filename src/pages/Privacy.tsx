import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container max-w-3xl py-12 prose prose-sm">
      <h1 className="font-heading text-3xl font-bold">Privacy Policy</h1>
      <p className="text-muted-foreground">Last updated: February 25, 2026</p>

      <h2 className="font-heading">1. Information We Collect</h2>
      <ul>
        <li><strong>Account data:</strong> Email, display name, country, preferred currency and language.</li>
        <li><strong>Vendor data:</strong> Business name, WhatsApp number, city, country.</li>
        <li><strong>Usage data:</strong> Pages visited, searches, clicks, and interactions.</li>
        <li><strong>Device data:</strong> Browser type, IP address, device type.</li>
      </ul>

      <h2 className="font-heading">2. How We Use Data</h2>
      <ul>
        <li>To provide price comparison services.</li>
        <li>To display vendor listings and facilitate WhatsApp contact.</li>
        <li>To improve platform features and user experience.</li>
        <li>To send account-related communications.</li>
      </ul>

      <h2 className="font-heading">3. Data Sharing</h2>
      <p>We do not sell personal data. We may share data with:</p>
      <ul>
        <li>Vendors: When a buyer clicks "Buy on WhatsApp," the vendor receives the buyer's WhatsApp message.</li>
        <li>Service providers: For hosting, analytics, and platform infrastructure.</li>
        <li>Legal authorities: When required by law.</li>
      </ul>

      <h2 className="font-heading">4. Cookies</h2>
      <p>We use cookies and similar technologies for authentication, preferences, and analytics.</p>

      <h2 className="font-heading">5. Data Security</h2>
      <p>We use industry-standard encryption and security measures. However, no system is 100% secure.</p>

      <h2 className="font-heading">6. Your Rights (GDPR/CCPA)</h2>
      <ul>
        <li>Access, correct, or delete your personal data.</li>
        <li>Opt out of non-essential data processing.</li>
        <li>Request data portability.</li>
      </ul>

      <h2 className="font-heading">7. Children</h2>
      <p>RobCompare is not intended for users under 18. We do not knowingly collect data from minors.</p>

      <h2 className="font-heading">8. Changes</h2>
      <p>We may update this policy. We'll notify users of material changes via email or platform notice.</p>

      <h2 className="font-heading">9. Contact</h2>
      <p>Email: <strong>privacy@robcompare.com</strong></p>
    </div>
    <Footer />
  </div>
);

export default Privacy;
