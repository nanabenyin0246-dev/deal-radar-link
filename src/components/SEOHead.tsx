import { useEffect } from "react";
import { useI18n } from "@/i18n/I18nContext";
import { SUPPORTED_LOCALES } from "@/i18n/translations";

interface SEOHeadProps {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: string;
  jsonLd?: Record<string, any>;
}

const SEOHead = ({ title, description, path = "", image, type = "website", jsonLd }: SEOHeadProps) => {
  const { locale } = useI18n();
  const baseUrl = window.location.origin;
  const canonicalUrl = `${baseUrl}${path}`;

  useEffect(() => {
    // Title
    document.title = `${title} | RobCompare`;

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description || title);

    // OpenGraph
    const ogTags: Record<string, string> = {
      "og:title": title,
      "og:description": description || title,
      "og:url": canonicalUrl,
      "og:type": type,
      "og:locale": locale,
      "og:site_name": "RobCompare",
    };
    if (image) ogTags["og:image"] = image;

    Object.entries(ogTags).forEach(([property, content]) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    });

    // Twitter Card
    const twitterTags: Record<string, string> = {
      "twitter:card": "summary_large_image",
      "twitter:title": title,
      "twitter:description": description || title,
    };
    if (image) twitterTags["twitter:image"] = image;

    Object.entries(twitterTags).forEach(([name, content]) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    });

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    // Hreflang tags
    const existingHreflangs = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existingHreflangs.forEach((el) => el.remove());

    SUPPORTED_LOCALES.forEach((loc) => {
      const link = document.createElement("link");
      link.setAttribute("rel", "alternate");
      link.setAttribute("hreflang", loc.code);
      link.setAttribute("href", `${baseUrl}${path}`);
      document.head.appendChild(link);
    });

    // x-default
    const defaultLink = document.createElement("link");
    defaultLink.setAttribute("rel", "alternate");
    defaultLink.setAttribute("hreflang", "x-default");
    defaultLink.setAttribute("href", `${baseUrl}${path}`);
    document.head.appendChild(defaultLink);

    // JSON-LD
    const existingJsonLd = document.querySelector('script[data-seo-jsonld]');
    if (existingJsonLd) existingJsonLd.remove();

    if (jsonLd) {
      const script = document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      script.setAttribute("data-seo-jsonld", "true");
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      // Clean up hreflang on unmount
      document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
      const jsonScript = document.querySelector('script[data-seo-jsonld]');
      if (jsonScript) jsonScript.remove();
    };
  }, [title, description, path, image, type, locale, canonicalUrl, jsonLd]);

  return null;
};

export default SEOHead;
