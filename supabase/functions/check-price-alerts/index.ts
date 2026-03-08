import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    // 1. Get all active price alerts with user email via profiles
    const { data: alerts, error: alertsError } = await supabase
      .from("price_alerts")
      .select("id, product_id, target_price, currency, user_id")
      .eq("active", true);

    if (alertsError) throw alertsError;
    if (!alerts || alerts.length === 0) {
      return new Response(JSON.stringify({ message: "No active alerts" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let emailsSent = 0;

    for (const alert of alerts) {
      // 2. Find cheapest offer for this product at or below target price
      const { data: offers, error: offersError } = await supabase
        .from("vendor_offers")
        .select("price, currency, vendor_id")
        .eq("product_id", alert.product_id)
        .eq("is_visible", true)
        .eq("in_stock", true)
        .lte("price", alert.target_price)
        .order("price", { ascending: true })
        .limit(1);

      if (offersError || !offers || offers.length === 0) continue;

      const offer = offers[0];

      // 3. Get vendor name
      const { data: vendor } = await supabase
        .from("vendors")
        .select("business_name")
        .eq("id", offer.vendor_id)
        .single();

      // 4. Get product slug
      const { data: product } = await supabase
        .from("products")
        .select("slug, name")
        .eq("id", alert.product_id)
        .single();

      // 5. Get user email from auth
      const { data: userData } = await supabase.auth.admin.getUserById(alert.user_id);
      const userEmail = userData?.user?.email;

      if (!userEmail || !product) continue;

      // 6. Send email via send-email function
      const emailRes = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        body: JSON.stringify({
          to: userEmail,
          subject: "Price Drop Alert — RobCompare 🔥",
          html: `<h2>Good news! A price dropped.</h2>
<p>The product you're watching just hit your target price.</p>
<p>Best current price: <strong>${offer.price} ${offer.currency}</strong></p>
<p>From vendor: <strong>${vendor?.business_name || "Unknown"}</strong></p>
<a href="https://deal-radar-link.lovable.app/product/${product.slug}"
   style="background:#16a34a;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">
  View Deal Now
</a>`,
        }),
      });

      if (emailRes.ok) {
        // 7. Deactivate the alert
        await supabase
          .from("price_alerts")
          .update({ active: false })
          .eq("id", alert.id);
        emailsSent++;
      }
    }

    return new Response(JSON.stringify({ message: `Processed. Emails sent: ${emailsSent}` }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("check-price-alerts error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
