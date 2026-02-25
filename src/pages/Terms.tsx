import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container max-w-3xl py-12 prose prose-sm">
      <h1 className="font-heading text-3xl font-bold">Terms of Service</h1>
      <p className="text-muted-foreground">Last updated: February 25, 2026</p>

      <h2 className="font-heading">1. About RobCompare</h2>
      <p>RobCompare is a price comparison platform that aggregates product listings from independent vendors. We are <strong>not a retailer</strong>. We do not sell, ship, or handle any products directly. All transactions occur between buyers and vendors.</p>

      <h2 className="font-heading">2. Platform Role</h2>
      <p>RobCompare acts solely as a comparison engine. We display prices, vendor information, and WhatsApp contact links. We do not guarantee product availability, pricing accuracy, or vendor reliability.</p>

      <h2 className="font-heading">3. User Responsibilities</h2>
      <ul>
        <li>Users must verify product details directly with vendors before purchasing.</li>
        <li>All payments are made directly to vendors via WhatsApp, Flutterwave, Paystack, or other methods provided by the vendor.</li>
        <li>RobCompare is not liable for disputes between buyers and vendors.</li>
      </ul>

      <h2 className="font-heading">4. WhatsApp Transactions</h2>
      <p>WhatsApp "Buy Now" links connect buyers directly with vendors. RobCompare does not process, hold, or manage any payment. Buyers should exercise due diligence before completing transactions.</p>

      <h2 className="font-heading">5. Cross-Border Purchases</h2>
      <p>Buyers are responsible for any customs duties, import taxes, or shipping fees. RobCompare does not facilitate international logistics.</p>

      <h2 className="font-heading">6. Commission</h2>
      <p>RobCompare may charge vendors a commission on sales facilitated through the platform. Commission rates are disclosed in the Vendor Agreement.</p>

      <h2 className="font-heading">7. Intellectual Property</h2>
      <p>All content, branding, and technology on RobCompare are owned by RobCompare or its licensors. Vendors retain ownership of their product listings and images.</p>

      <h2 className="font-heading">8. Limitation of Liability</h2>
      <p>RobCompare is provided "as is" without warranties. We are not liable for any damages arising from use of the platform, vendor interactions, or transaction disputes.</p>

      <h2 className="font-heading">9. Changes</h2>
      <p>We may update these terms at any time. Continued use of the platform constitutes acceptance of updated terms.</p>

      <h2 className="font-heading">10. Contact</h2>
      <p>For questions, contact us at <strong>support@robcompare.com</strong>.</p>
    </div>
    <Footer />
  </div>
);

export default Terms;
