import { useQuery } from "@tanstack/react-query";

interface InstantAnswer {
  heading: string;
  abstract: string;
  abstractSource: string;
  abstractURL: string;
  image: string | null;
  relatedTopics: { text: string; url: string }[];
}

const DDG_API = "https://api.duckduckgo.com/";

export const useDuckDuckGoSummary = (query: string) => {
  return useQuery({
    queryKey: ["ddg-summary", query],
    queryFn: async (): Promise<InstantAnswer | null> => {
      const res = await fetch(
        `${DDG_API}?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
      );
      if (!res.ok) return null;
      const data = await res.json();

      if (!data.Abstract && !data.AbstractText) return null;

      return {
        heading: data.Heading || query,
        abstract: data.AbstractText || data.Abstract || "",
        abstractSource: data.AbstractSource || "",
        abstractURL: data.AbstractURL || "",
        image: data.Image ? `https://duckduckgo.com${data.Image}` : null,
        relatedTopics: (data.RelatedTopics || [])
          .filter((t: any) => t.Text && t.FirstURL)
          .slice(0, 5)
          .map((t: any) => ({
            text: t.Text,
            url: t.FirstURL,
          })),
      };
    },
    enabled: query.length >= 2,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};
