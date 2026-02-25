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
        <li><strong>Vendor data:</strong> Business name, WhatsApp number, city, country, agreement acceptance logs.</li>
        <li><strong>Transaction data:</strong> Order details, payment references, commission records.</li>
        <li><strong>Usage data:</strong> Pages visited, searches, clicks, and interactions.</li>
        <li><strong>Device data:</strong> Browser type, IP address (hashed for security), device type.</li>
      </ul>

      <h2 className="font-heading">2. How We Use Data</h2>
      <ul>
        <li>To provide price comparison and marketplace services.</li>
        <li>To process orders and facilitate escrow payments.</li>
        <li>To resolve disputes and maintain audit trails.</li>
        <li>To calculate and track commissions and tax obligations.</li>
        <li>To improve platform features and user experience.</li>
      </ul>

      <h2 className="font-heading">3. Data Sharing</h2>
      <p>We do not sell personal data. We may share data with:</p>
      <ul>
        <li>Vendors: Order details for fulfillment. WhatsApp messages initiated by buyer.</li>
        <li>Payment processors: Paystack, Flutterwave for payment processing.</li>
        <li>Service providers: For hosting, analytics, and platform infrastructure.</li>
        <li>Legal authorities: When required by law or for fraud prevention.</li>
      </ul>

      <h2 className="font-heading">4. Sensitive Data Protection</h2>
      <ul>
        <li>Passwords are encrypted using industry-standard hashing (bcrypt).</li>
        <li>Mobile Money phone numbers are stored as secure hashes.</li>
        <li>Payment tokens are never stored on our servers.</li>
        <li>All data in transit uses TLS 1.3 encryption.</li>
      </ul>

      <h2 className="font-heading">5. Cookies</h2>
      <p>We use cookies for authentication, preferences, and analytics. You may decline non-essential cookies via the consent banner.</p>

      <h2 className="font-heading">6. Data Security</h2>
      <ul>
        <li>Rate limiting on login attempts to prevent brute force attacks.</li>
        <li>Secure token expiration for password resets and sessions.</li>
        <li>Regular security audits and monitoring.</li>
      </ul>

      <h2 className="font-heading">7. Data Retention</h2>
      <ul>
        <li>Account data: Retained while account is active, deleted 30 days after account deletion request.</li>
        <li>Transaction & audit records: Retained for minimum 7 years for legal/tax compliance.</li>
        <li>Dispute records: Retained for minimum 5 years.</li>
      </ul>

      <h2 className="font-heading">8. Your Rights (GDPR/Ghana DPA)</h2>
      <ul>
        <li>Access, correct, or delete your personal data.</li>
        <li>Opt out of non-essential data processing.</li>
        <li>Request data portability (exportable CSV format).</li>
        <li>Lodge complaints with Ghana Data Protection Commission.</li>
      </ul>

      <h2 className="font-heading">9. Children</h2>
      <p>RobCompare is not intended for users under 18. We do not knowingly collect data from minors.</p>

      <h2 className="font-heading">10. Changes</h2>
      <p>We may update this policy. We'll notify users of material changes via email or platform notice.</p>

      <h2 className="font-heading">11. Contact</h2>
      <p>Data Protection Officer: <strong>privacy@robcompare.com</strong></p>
    </div>
    <Footer />
  </div>
);

export default Privacy;
