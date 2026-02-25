import { useAnalyticsMetrics } from "@/hooks/useAnalytics";
import { TrendingUp, Eye, MousePointer, ShoppingCart, Users, Package, DollarSign, Percent } from "lucide-react";

const MetricCard = ({ icon: Icon, label, value, sublabel, alert }: { icon: any; label: string; value: string | number; sublabel?: string; alert?: boolean }) => (
  <div className={`bg-card border rounded-xl p-4 ${alert ? "border-secondary" : "border-border"}`}>
    <Icon className={`w-4 h-4 mb-2 ${alert ? "text-secondary" : "text-muted-foreground"}`} />
    <div className="font-heading text-2xl font-bold">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
    {sublabel && <div className="text-[10px] text-muted-foreground mt-1">{sublabel}</div>}
  </div>
);

const AnalyticsTab = () => {
  const { data: metrics, isLoading } = useAnalyticsMetrics();

  if (isLoading) return <p className="text-center py-8 text-muted-foreground">Loading metrics...</p>;
  if (!metrics) return <p className="text-center py-8 text-muted-foreground">No data available</p>;

  return (
    <div className="space-y-6">
      {/* Acquisition */}
      <div>
        <h3 className="font-heading font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Acquisition (30 days)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <MetricCard icon={Users} label="Vendor Signups" value={metrics.acquisition.vendorSignups30d} />
          <MetricCard icon={Package} label="Products Listed" value={metrics.acquisition.productsListed} sublabel="Total active" />
        </div>
      </div>

      {/* Engagement */}
      <div>
        <h3 className="font-heading font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Engagement</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <MetricCard icon={Eye} label="Product Views" value={metrics.engagement.totalViews.toLocaleString()} />
          <MetricCard icon={MousePointer} label="WhatsApp Clicks" value={metrics.engagement.totalClicks.toLocaleString()} />
          <MetricCard icon={Percent} label="Click Conversion" value={`${metrics.engagement.clickConversionRate}%`} sublabel="View → WhatsApp click" alert />
        </div>
      </div>

      {/* Revenue */}
      <div>
        <h3 className="font-heading font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Revenue Signals</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard icon={ShoppingCart} label="Orders Created" value={metrics.revenue.ordersCreated} sublabel={`${metrics.revenue.ordersCreated30d} in 30d`} />
          <MetricCard icon={TrendingUp} label="Orders Completed" value={metrics.revenue.ordersCompleted} sublabel={`${metrics.revenue.ordersCompleted30d} in 30d`} />
          <MetricCard icon={DollarSign} label="GMV (Total)" value={`GHS ${metrics.revenue.gmv.toLocaleString()}`} sublabel={`GHS ${metrics.revenue.gmv30d.toLocaleString()} in 30d`} alert />
          <MetricCard icon={DollarSign} label="Commission (30d)" value={`GHS ${metrics.revenue.commissionEarned30d.toLocaleString()}`} alert />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
