import { useQuery } from "@tanstack/react-query";

interface WikidataEnrichment {
  description: string;
  image: string | null;
  officialWebsite: string | null;
  countryOfOrigin: string | null;
  manufacturer: string | null;
  inception: string | null;
}

const WIKIDATA_API = "https://www.wikidata.org/w/api.php";

export const useWikidataEnrichment = (searchTerm: string) => {
  return useQuery({
    queryKey: ["wikidata-enrichment", searchTerm],
    queryFn: async (): Promise<WikidataEnrichment | null> => {
      // Search for the entity
      const searchRes = await fetch(
        `${WIKIDATA_API}?action=wbsearchentities&search=${encodeURIComponent(searchTerm)}&language=en&limit=1&format=json&origin=*`
      );
      if (!searchRes.ok) return null;
      const searchData = await searchRes.json();
      const entityId = searchData.search?.[0]?.id;
      if (!entityId) return null;

      // Get entity details
      const entityRes = await fetch(
        `${WIKIDATA_API}?action=wbgetentities&ids=${entityId}&props=claims|descriptions&languages=en&format=json&origin=*`
      );
      if (!entityRes.ok) return null;
      const entityData = await entityRes.json();
      const entity = entityData.entities?.[entityId];
      if (!entity) return null;

      const claims = entity.claims || {};
      const description = entity.descriptions?.en?.value || searchData.search?.[0]?.description || "";

      // Extract relevant properties
      const getClaimValue = (prop: string): string | null => {
        const claim = claims[prop]?.[0]?.mainsnak?.datavalue?.value;
        if (!claim) return null;
        if (typeof claim === "string") return claim;
        if (claim.text) return claim.text;
        if (claim.id) return claim.id;
        if (claim.time) return claim.time.replace("+", "").split("T")[0];
        return null;
      };

      // P18 = image, P856 = official website, P495 = country of origin, P176 = manufacturer, P571 = inception
      const imageFile = getClaimValue("P18");
      const image = imageFile
        ? `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(imageFile)}`
        : null;

      return {
        description,
        image,
        officialWebsite: getClaimValue("P856"),
        countryOfOrigin: getClaimValue("P495"),
        manufacturer: getClaimValue("P176"),
        inception: getClaimValue("P571"),
      };
    },
    enabled: searchTerm.length >= 2,
    staleTime: 24 * 60 * 60 * 1000,
  });
};
