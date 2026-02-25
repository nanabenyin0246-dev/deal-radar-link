import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container max-w-3xl py-12 prose prose-sm">
      <h1 className="font-heading text-3xl font-bold">Terms of Service</h1>
      <p className="text-muted-foreground">Last updated: February 25, 2026</p>

      <h2 className="font-heading">1. About RobCompare</h2>
      <p>RobCompare is a price comparison and marketplace intermediary platform that aggregates product listings from independent vendors. We are <strong>not a retailer</strong>. We do not sell, ship, or handle any products directly. All transactions occur between buyers and vendors. RobCompare operates as a limited liability entity.</p>

      <h2 className="font-heading">2. Platform Role & Liability Limitation</h2>
      <p>RobCompare acts solely as a <strong>marketplace intermediary</strong>. We display prices, vendor information, and facilitate contact between buyers and vendors. We do not guarantee product availability, pricing accuracy, or vendor reliability. The platform, its directors, and employees shall not be personally liable for any losses arising from vendor transactions.</p>

      <h2 className="font-heading">3. User Responsibilities</h2>
      <ul>
        <li>Users must verify product details directly with vendors before purchasing.</li>
        <li>Payments may be made directly to vendors via WhatsApp or through secure escrow checkout when available.</li>
        <li>RobCompare facilitates dispute resolution but is not obligated to resolve all disputes.</li>
      </ul>

      <h2 className="font-heading">4. Escrow & Payment Processing</h2>
      <p>When escrow checkout is available, buyers may pay via Mobile Money (MTN, Vodafone Cash, AirtelTigo Money), Paystack, or card. Funds are held until delivery is confirmed. An 8% commission is deducted from vendor payouts. In case of disputes, funds are frozen pending administrative review.</p>

      <h2 className="font-heading">5. WhatsApp Transactions</h2>
      <p>WhatsApp "Buy Now" links connect buyers directly with vendors. For WhatsApp-direct payments, RobCompare does not process, hold, or manage any payment. Buyers should exercise due diligence.</p>

      <h2 className="font-heading">6. Dispute Resolution</h2>
      <ul>
        <li>Buyers may open a dispute within 7 days of delivery.</li>
        <li>Vendors have 48 hours to respond to disputes.</li>
        <li>RobCompare admin may: refund the buyer, release funds to the vendor, or arrange a split settlement.</li>
        <li>All dispute decisions are logged for legal audit purposes.</li>
      </ul>

      <h2 className="font-heading">7. Cross-Border Purchases</h2>
      <p>Buyers are responsible for customs duties, import taxes, or shipping fees. RobCompare does not facilitate international logistics.</p>

      <h2 className="font-heading">8. Commission & Tax</h2>
      <p>RobCompare charges vendors a default commission of 8% on facilitated sales. VAT may apply where required by law. Commission income is tracked separately from vendor revenue for accounting purposes.</p>

      <h2 className="font-heading">9. Data Retention & Privacy</h2>
      <p>Transaction records, audit logs, and dispute records are retained for a minimum of 7 years for tax and legal compliance. See our <a href="/privacy">Privacy Policy</a> for details.</p>

      <h2 className="font-heading">10. Prohibited Activities</h2>
      <ul>
        <li>Listing counterfeit, illegal, or restricted items.</li>
        <li>Fraudulent transactions or price manipulation.</li>
        <li>Circumventing platform commission or escrow systems.</li>
      </ul>

      <h2 className="font-heading">11. Limitation of Liability</h2>
      <p>RobCompare is provided "as is" without warranties. The platform, its parent company, directors, and employees are not liable for any direct, indirect, incidental, or consequential damages. Maximum liability is limited to the commission earned on the relevant transaction.</p>

      <h2 className="font-heading">12. Governing Law</h2>
      <p>These terms are governed by the laws of the Republic of Ghana. Disputes shall be resolved through arbitration in Accra, Ghana.</p>

      <h2 className="font-heading">13. Changes</h2>
      <p>We may update these terms at any time. Continued use constitutes acceptance. Material changes will be notified via email.</p>

      <h2 className="font-heading">14. Contact</h2>
      <p>For questions, contact us at <strong>support@robcompare.com</strong>.</p>
    </div>
    <Footer />
  </div>
);

export default Terms;
