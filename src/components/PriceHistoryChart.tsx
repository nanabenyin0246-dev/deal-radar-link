import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface PriceHistoryChartProps {
  productId: string;
  currency?: string;
}

const PriceHistoryChart = ({ productId, currency = "GHS" }: PriceHistoryChartProps) => {
  const { data: history, isLoading } = useQuery({
    queryKey: ["price-history", productId],
    queryFn: async () => {
      const { data: offers } = await supabase
        .from("vendor_offers")
        .select("id, price, created_at")
        .eq("product_id", productId);

      if (!offers?.length) return { history: [], offers };

      const offerIds = offers.map((o) => o.id);
      const { data, error } = await supabase
        .from("price_history")
        .select("price, recorded_at, currency, vendor_offer_id")
        .in("vendor_offer_id", offerIds)
        .order("recorded_at", { ascending: true });

      if (error) throw error;
      return { history: data || [], offers };
    },
    enabled: !!productId,
  });

  if (isLoading) {
    return <div className="h-48 bg-muted rounded-xl animate-pulse" />;
  }

  const historyData = history?.history || [];
  const currentOffers = history?.offers || [];

  // Build chart data - use real history, or synthetic baseline from current offers
  let chartData: { date: string; price: number }[];
  let isBaseline = false;

  if (historyData.length > 0) {
    chartData = historyData.map((h: any) => ({
      date: new Date(h.recorded_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      price: Number(h.price),
    }));
  } else if (currentOffers.length > 0) {
    isBaseline = true;
    chartData = currentOffers.map((offer: any, i: number) => ({
      date: new Date(offer.created_at || Date.now() - i * 24 * 60 * 60 * 1000)
        .toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      price: Number(offer.price),
    }));
  } else {
    return null;
  }

  const earliestDate = currentOffers.length > 0
    ? new Date(currentOffers.reduce((earliest: any, o: any) => o.created_at < earliest ? o.created_at : earliest, currentOffers[0].created_at))
    : null;

  return (
    <div>
      <h3 className="font-heading font-semibold mb-3">Price History</h3>
      <div className="bg-card border border-border rounded-xl p-4">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${currency} ${v}`}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
                fontSize: "12px",
              }}
              formatter={(value: number) => [`${currency} ${value.toLocaleString()}`, "Price"]}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))", r: 3 }}
              activeDot={{ r: 5, fill: "hsl(var(--secondary))" }}
            />
          </LineChart>
        </ResponsiveContainer>
        {isBaseline && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Price tracking started {earliestDate ? earliestDate.toLocaleDateString() : "today"}
          </p>
        )}
      </div>
    </div>
  );
};

export default PriceHistoryChart;
