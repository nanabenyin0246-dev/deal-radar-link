import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.224.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-paystack-signature",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PAYSTACK_SECRET = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!PAYSTACK_SECRET) {
      return new Response("Not configured", { status: 500 });
    }

    const body = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    // Verify webhook signature
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(PAYSTACK_SECRET),
      { name: "HMAC", hash: "SHA-512" },
      false,
      ["sign"]
    );
    const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
    const expectedSig = Array.from(new Uint8Array(sig))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (signature !== expectedSig) {
      console.error("Invalid webhook signature");
      return new Response("Invalid signature", { status: 400 });
    }

    const event = JSON.parse(body);
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (event.event === "charge.success") {
      const { reference, metadata, amount, currency } = event.data;
      const orderId = metadata?.order_id;

      if (!orderId) {
        console.error("No order_id in webhook metadata");
        return new Response("OK", { status: 200 });
      }

      // Update order status to paid
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          status: "paid" as const,
          payment_reference: reference,
          payment_method: "paystack",
        })
        .eq("id", orderId)
        .eq("status", "pending"); // Only update if still pending

      if (updateError) {
        console.error("Failed to update order:", updateError);
      }

      // Audit log
      await supabase.from("audit_log").insert({
        user_id: metadata?.buyer_id,
        action: "payment_completed",
        entity_type: "order",
        entity_id: orderId,
        details: {
          provider: "paystack",
          reference,
          amount,
          currency,
          event: "charge.success",
        },
      });

      console.log(`Order ${orderId} marked as paid via Paystack`);
    }

    return new Response("OK", { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response("Error", { status: 500 });
  }
});
