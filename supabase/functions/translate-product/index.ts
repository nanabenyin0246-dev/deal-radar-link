import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SUPPORTED_LANGS = ["en", "fr", "es", "pt", "ar"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claims?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claims.claims.sub;
    const { product_id, source_lang = "en" } = await req.json();

    if (!product_id) {
      return new Response(JSON.stringify({ error: "product_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch the product
    const { data: product, error: prodErr } = await supabase
      .from("products")
      .select("name, description")
      .eq("id", product_id)
      .single();

    if (prodErr || !product) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const targetLangs = SUPPORTED_LANGS.filter((l) => l !== source_lang);

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a product translator for an e-commerce marketplace. Translate the product name and description accurately and naturally. Preserve brand names. Return JSON only.`,
          },
          {
            role: "user",
            content: `Translate the following product from ${source_lang} to these languages: ${targetLangs.join(", ")}.

Product name: "${product.name}"
Description: "${product.description || ""}"

Return a JSON object with language codes as keys, each containing "name" and "description". Example:
{"fr": {"name": "...", "description": "..."}, "es": {"name": "...", "description": "..."}}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "save_translations",
              description: "Save translated product information",
              parameters: {
                type: "object",
                properties: {
                  translations: {
                    type: "object",
                    additionalProperties: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        description: { type: "string" },
                      },
                      required: ["name", "description"],
                    },
                  },
                },
                required: ["translations"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "save_translations" } },
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      const text = await aiResponse.text();
      console.error("AI error:", status, text);
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "Translation failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ error: "AI did not return translations" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { translations } = JSON.parse(toolCall.function.arguments);

    // Save translations using service role
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const upserts = Object.entries(translations).map(([lang, t]: [string, any]) => ({
      product_id,
      language_code: lang,
      name: t.name,
      description: t.description || null,
      auto_translated: true,
      approved: false,
    }));

    // Also insert the source language as approved
    upserts.push({
      product_id,
      language_code: source_lang,
      name: product.name,
      description: product.description || null,
      auto_translated: false,
      approved: true,
    });

    for (const row of upserts) {
      // Check if translation exists
      const { data: existing } = await adminClient
        .from("product_translations")
        .select("id")
        .eq("product_id", row.product_id)
        .eq("language_code", row.language_code)
        .maybeSingle();

      if (existing) {
        await adminClient
          .from("product_translations")
          .update({
            name: row.name,
            description: row.description,
            auto_translated: row.auto_translated,
            approved: row.approved,
          })
          .eq("id", existing.id);
      } else {
        await adminClient.from("product_translations").insert(row);
      }
    }

    return new Response(
      JSON.stringify({ success: true, translations, languages: Object.keys(translations) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Translation error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
