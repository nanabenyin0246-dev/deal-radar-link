import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Get current commission config
    const { data: config } = await supabase
      .from("commission_config")
      .select("*")
      .limit(1)
      .single();

    if (!config || config.commission_active) {
      return new Response(JSON.stringify({ status: "already_active_or_no_config" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user count
    const { data: userCount } = await supabase.rpc("get_user_count");

    if (userCount >= config.activation_threshold) {
      // Activate commission
      await supabase
        .from("commission_config")
        .update({
          commission_rate: 0.03,
          commission_active: true,
          commission_activated_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", config.id);

      // Audit log
      await supabase.from("audit_log").insert({
        action: "commission_activated",
        entity_type: "commission_config",
        entity_id: config.id,
        details: {
          user_count: userCount,
          threshold: config.activation_threshold,
          new_rate: 0.03,
        },
      });

      return new Response(
        JSON.stringify({
          status: "activated",
          user_count: userCount,
          new_rate: 0.03,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        status: "below_threshold",
        user_count: userCount,
        threshold: config.activation_threshold,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
