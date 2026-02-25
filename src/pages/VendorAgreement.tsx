import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const VendorAgreement = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container max-w-3xl py-12 prose prose-sm">
      <h1 className="font-heading text-3xl font-bold">Vendor Agreement</h1>
      <p className="text-muted-foreground">Version 1.0 · Last updated: February 25, 2026</p>

      <h2 className="font-heading">1. Vendor Responsibilities</h2>
      <ul>
        <li>Vendors must provide accurate product information, pricing, and availability.</li>
        <li>Vendors are <strong>solely responsible</strong> for the authenticity, quality, legality, and regulatory compliance of their products.</li>
        <li>Vendors must respond to buyer inquiries via WhatsApp within 24 hours.</li>
        <li>Vendors must fulfill orders within the specified shipping timeline.</li>
        <li>Vendors are responsible for all refunds and returns as per their own policies.</li>
        <li>Vendors must comply with all applicable local and international laws, including consumer protection regulations.</li>
      </ul>

      <h2 className="font-heading">2. Prohibited Items</h2>
      <ul>
        <li>Counterfeit goods or unauthorized replicas.</li>
        <li>Illegal substances, weapons, or explosives.</li>
        <li>Items banned by Ghanaian or international law.</li>
        <li>Stolen property or items obtained through fraud.</li>
        <li>Products that infringe intellectual property rights.</li>
      </ul>
      <p>Vendors acknowledge reviewing the prohibited items checklist during onboarding. Listing prohibited items results in immediate account suspension.</p>

      <h2 className="font-heading">3. Commission Structure</h2>
      <ul>
        <li>RobCompare charges a default commission of <strong>8%</strong> on sales facilitated through the platform.</li>
        <li>Commission is calculated on the final sale price (excluding shipping).</li>
        <li>For escrow transactions, commission is automatically deducted before vendor payout.</li>
        <li>For WhatsApp-direct sales, vendors self-report and remit commission monthly.</li>
        <li>VAT may apply on commission amounts where required by law.</li>
        <li>Commission rates may vary by vendor tier or promotional periods.</li>
      </ul>

      <h2 className="font-heading">4. Escrow & Payment Flow</h2>
      <ul>
        <li>When escrow is used, buyer payment is held until delivery confirmation.</li>
        <li>Vendors must provide tracking information within 48 hours of payment confirmation.</li>
        <li>Funds are released to vendor minus commission within 3 business days after buyer confirms delivery.</li>
        <li>If buyer does not confirm within 7 days of delivery, funds are auto-released.</li>
        <li>Disputed transactions freeze funds pending admin review.</li>
      </ul>

      <h2 className="font-heading">5. Dispute Resolution</h2>
      <ul>
        <li>Vendors must respond to buyer disputes within 48 hours.</li>
        <li>Failure to respond may result in automatic refund to buyer.</li>
        <li>RobCompare admin decisions on disputes are final.</li>
        <li>All dispute interactions are logged for legal audit purposes.</li>
        <li>Repeated disputes may result in trust score reduction or account suspension.</li>
      </ul>

      <h2 className="font-heading">6. Trust Score & Verification</h2>
      <ul>
        <li>Trust scores are calculated based on response rate, customer feedback, dispute ratio, and listing accuracy.</li>
        <li>Verified vendors have completed identity and business verification.</li>
        <li>RobCompare may suspend vendors with trust scores below 30%.</li>
      </ul>

      <h2 className="font-heading">7. Account Suspension & Termination</h2>
      <p>RobCompare may suspend or terminate vendor accounts for:</p>
      <ul>
        <li>Fraudulent activity or fraud flags.</li>
        <li>Repeated customer complaints or disputes.</li>
        <li>Policy violations or listing prohibited items.</li>
        <li>Failure to remit commission payments.</li>
        <li>Inactivity exceeding 180 days.</li>
      </ul>
      <p>High-risk vendors require manual admin approval before activation.</p>

      <h2 className="font-heading">8. Platform as Intermediary</h2>
      <p>Vendors acknowledge and agree that:</p>
      <ul>
        <li>RobCompare is a <strong>marketplace intermediary only</strong>.</li>
        <li>RobCompare does not take ownership, possession, or control of vendor products.</li>
        <li>All product liability rests solely with the vendor.</li>
        <li>RobCompare is not liable for any losses arising from vendor-buyer transactions.</li>
      </ul>

      <h2 className="font-heading">9. Data & Audit Trail</h2>
      <ul>
        <li>Vendor agreement acceptance (timestamp, IP address, version) is permanently logged.</li>
        <li>All product changes, order updates, and dispute actions are audited.</li>
        <li>Vendors may request export of their transaction data in CSV format.</li>
      </ul>

      <h2 className="font-heading">10. Intellectual Property</h2>
      <p>Vendors grant RobCompare a non-exclusive license to display product images and information. Vendors retain all ownership of their content.</p>

      <h2 className="font-heading">11. Governing Law</h2>
      <p>This agreement is governed by the laws of the Republic of Ghana. Disputes shall be resolved through arbitration in Accra.</p>

      <h2 className="font-heading">12. Changes</h2>
      <p>We may update this agreement. Vendors will be notified of material changes and must re-accept updated terms to continue using the platform.</p>

      <h2 className="font-heading">13. Contact</h2>
      <p>Email: <strong>vendors@robcompare.com</strong></p>
    </div>
    <Footer />
  </div>
);

export default VendorAgreement;
