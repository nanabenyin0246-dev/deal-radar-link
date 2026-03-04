import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SUPPORTED_LANGS = ["en", "fr", "es", "pt", "ar"];

// MyMemory Translation API (5,000 chars/day free, no key)
async function translateMyMemory(text: string, from: string, to: string): Promise<string> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("MyMemory failed");
  const data = await res.json();
  if (data.responseStatus !== 200) throw new Error(data.responseDetails || "MyMemory error");
  return data.responseData.translatedText;
}

// Lingva Translate (unlimited, open source fallback)
async function translateLingva(text: string, from: string, to: string): Promise<string> {
  const url = `https://lingva.ml/api/v1/${from}/${to}/${encodeURIComponent(text)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Lingva failed");
  const data = await res.json();
  return data.translation;
}

// Translate with fallback chain: MyMemory → Lingva → AI
async function translateText(text: string, from: string, to: string): Promise<string> {
  if (!text.trim()) return "";
  try {
    return await translateMyMemory(text, from, to);
  } catch {
    try {
      return await translateLingva(text, from, to);
    } catch {
      throw new Error("Free translation APIs unavailable");
    }
  }
}

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

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { product_id, source_lang = "en" } = await req.json();

    if (!product_id) {
      return new Response(JSON.stringify({ error: "product_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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

    const targetLangs = SUPPORTED_LANGS.filter((l) => l !== source_lang);
    const translations: Record<string, { name: string; description: string }> = {};

    for (const lang of targetLangs) {
      try {
        const [name, description] = await Promise.all([
          translateText(product.name, source_lang, lang),
          product.description ? translateText(product.description, source_lang, lang) : Promise.resolve(""),
        ]);
        translations[lang] = { name, description };
      } catch (err) {
        console.error(`Translation to ${lang} failed:`, err);
        // Skip this language
      }
    }

    // Save translations using service role
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const upserts = Object.entries(translations).map(([lang, t]) => ({
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
      JSON.stringify({
        success: true,
        translations,
        languages: Object.keys(translations),
        source: "mymemory+lingva",
      }),
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
