import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BASE_URL = "https://deal-radar-link.lovable.app";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: products } = await supabase
    .from("products")
    .select("slug, updated_at")
    .eq("is_active", true)
    .order("updated_at", { ascending: false });

  const staticPages = [
    { loc: "/", priority: "1.0" },
    { loc: "/products", priority: "0.9" },
    { loc: "/buyers", priority: "0.8" },
    { loc: "/vendors", priority: "0.8" },
    { loc: "/terms", priority: "0.3" },
    { loc: "/privacy", priority: "0.3" },
  ];

  const urls = staticPages
    .map(
      (p) =>
        `  <url>\n    <loc>${BASE_URL}${p.loc}</loc>\n    <priority>${p.priority}</priority>\n    <changefreq>weekly</changefreq>\n  </url>`
    )
    .concat(
      (products || []).map(
        (p) =>
          `  <url>\n    <loc>${BASE_URL}/product/${p.slug}</loc>\n    <lastmod>${p.updated_at.split("T")[0]}</lastmod>\n    <priority>0.7</priority>\n    <changefreq>daily</changefreq>\n  </url>`
      )
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

  return new Response(xml, {
    headers: { ...corsHeaders, "Content-Type": "application/xml; charset=utf-8" },
  });
});
