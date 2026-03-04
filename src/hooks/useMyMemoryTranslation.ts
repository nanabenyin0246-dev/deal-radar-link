import { useMutation } from "@tanstack/react-query";

const MYMEMORY_API = "https://api.mymemory.translated.net/get";
const LINGVA_API = "https://lingva.ml/api/v1";

interface TranslationResult {
  translatedText: string;
  source: "mymemory" | "lingva";
}

const translateWithMyMemory = async (
  text: string,
  from: string,
  to: string
): Promise<string> => {
  const url = `${MYMEMORY_API}?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("MyMemory request failed");
  const data = await res.json();
  if (data.responseStatus !== 200) throw new Error(data.responseDetails || "MyMemory error");
  return data.responseData.translatedText;
};

const translateWithLingva = async (
  text: string,
  from: string,
  to: string
): Promise<string> => {
  const url = `${LINGVA_API}/${from}/${to}/${encodeURIComponent(text)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Lingva request failed");
  const data = await res.json();
  return data.translation;
};

export const useTranslateText = () => {
  return useMutation({
    mutationFn: async ({
      text,
      from = "en",
      to,
    }: {
      text: string;
      from?: string;
      to: string;
    }): Promise<TranslationResult> => {
      try {
        const translatedText = await translateWithMyMemory(text, from, to);
        return { translatedText, source: "mymemory" };
      } catch {
        // Fallback to Lingva
        try {
          const translatedText = await translateWithLingva(text, from, to);
          return { translatedText, source: "lingva" };
        } catch {
          throw new Error("Translation failed on both MyMemory and Lingva");
        }
      }
    },
  });
};

export const translateBatch = async (
  texts: string[],
  from: string,
  to: string
): Promise<string[]> => {
  const results: string[] = [];
  for (const text of texts) {
    if (!text.trim()) {
      results.push("");
      continue;
    }
    try {
      results.push(await translateWithMyMemory(text, from, to));
    } catch {
      try {
        results.push(await translateWithLingva(text, from, to));
      } catch {
        results.push(text); // Return original on failure
      }
    }
  }
  return results;
};
