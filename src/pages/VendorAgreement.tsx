import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const VendorAgreement = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container max-w-3xl py-12 prose prose-sm">
      <h1 className="font-heading text-3xl font-bold">Vendor Agreement</h1>
      <p className="text-muted-foreground">Last updated: February 25, 2026</p>

      <h2 className="font-heading">1. Vendor Responsibilities</h2>
      <ul>
        <li>Vendors must provide accurate product information, pricing, and availability.</li>
        <li>Vendors are solely responsible for the authenticity, quality, and legality of their products.</li>
        <li>Vendors must respond to buyer inquiries via WhatsApp in a timely manner.</li>
        <li>Vendors must comply with all applicable local and international laws.</li>
      </ul>

      <h2 className="font-heading">2. Product Listings</h2>
      <ul>
        <li>All product listings must be accurate and not misleading.</li>
        <li>Prohibited items include counterfeit goods, illegal substances, weapons, and any items banned by local law.</li>
        <li>RobCompare reserves the right to remove any listing without notice.</li>
      </ul>

      <h2 className="font-heading">3. Commission Structure</h2>
      <ul>
        <li>RobCompare charges a default commission of <strong>8%</strong> on sales facilitated through the platform.</li>
        <li>Commission is calculated on the final sale price.</li>
        <li>Commission tracking is handled through WhatsApp click-through analytics and vendor self-reporting.</li>
        <li>Commission rates may vary by vendor tier or promotional periods.</li>
      </ul>

      <h2 className="font-heading">4. WhatsApp Integration</h2>
      <p>Vendors agree that their WhatsApp number will be used to generate "Buy Now" links. Vendors may optionally include Flutterwave or Paystack payment links in their product listings.</p>

      <h2 className="font-heading">5. Trust Score & Verification</h2>
      <ul>
        <li>Trust scores are calculated based on response rate, customer feedback, and listing accuracy.</li>
        <li>Verified vendors have completed identity and business verification.</li>
        <li>RobCompare may suspend vendors with consistently low trust scores.</li>
      </ul>

      <h2 className="font-heading">6. Vendor Tiers</h2>
      <p>Vendors may be classified into tiers (Basic, Premium, Enterprise) based on performance. Higher tiers receive better visibility and lower commission rates.</p>

      <h2 className="font-heading">7. Account Suspension</h2>
      <p>RobCompare may suspend or terminate vendor accounts for: fraudulent activity, repeated complaints, policy violations, or inactivity.</p>

      <h2 className="font-heading">8. Intellectual Property</h2>
      <p>Vendors grant RobCompare a non-exclusive license to display product images and information on the platform. Vendors retain all ownership of their content.</p>

      <h2 className="font-heading">9. Dispute Resolution</h2>
      <p>Disputes between vendors and buyers should be resolved directly. RobCompare may mediate but is not obligated to do so.</p>

      <h2 className="font-heading">10. Changes</h2>
      <p>We may update this agreement. Vendors will be notified of material changes.</p>

      <h2 className="font-heading">11. Contact</h2>
      <p>Email: <strong>vendors@robcompare.com</strong></p>
    </div>
    <Footer />
  </div>
);

export default VendorAgreement;
