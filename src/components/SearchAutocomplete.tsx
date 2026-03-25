import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, Loader2 } from "lucide-react";

interface SearchResult {
  name: string;
  slug: string;
  image_url: string | null;
  category_id: string | null;
}

interface SearchAutocompleteProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}

const SearchAutocomplete = ({ value, onChange, onSubmit, placeholder }: SearchAutocompleteProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce 200ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(value.trim());
    }, 200);
    return () => clearTimeout(timer);
  }, [value]);

  const { data: results, isFetching } = useQuery({
    queryKey: ["search-autocomplete", debouncedQuery],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("name, slug, image_url, category_id")
        .ilike("name", `%${debouncedQuery}%`)
        .eq("is_active", true)
        .limit(6);
      if (error) throw error;
      return (data || []) as SearchResult[];
    },
    enabled: debouncedQuery.length >= 2,
    staleTime: 1000 * 60,
  });

  // Get categories for tags
  const { data: categories } = useQuery({
    queryKey: ["categories-map"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("id, name");
      const map: Record<string, string> = {};
      data?.forEach((c) => (map[c.id] = c.name));
      return map;
    },
    staleTime: 1000 * 60 * 10,
  });

  const showDropdown = open && debouncedQuery.length >= 2;
  const items = results || [];
  // +1 for the "Search for..." item
  const totalItems = items.length + 1;

  useEffect(() => {
    setActiveIndex(-1);
  }, [debouncedQuery]);

  // Close on outside click/touch
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, []);

  const selectResult = useCallback(
    (slug: string) => {
      setOpen(false);
      navigate(`/product/${slug}`);
    },
    [navigate]
  );

  const selectFullSearch = useCallback(() => {
    setOpen(false);
    onSubmit();
  }, [onSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % totalItems);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? totalItems - 1 : prev - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < items.length) {
        selectResult(items[activeIndex].slug);
      } else {
        selectFullSearch();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const highlightMatch = (name: string, query: string) => {
    const idx = name.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <span>{name}</span>;
    return (
      <>
        {name.slice(0, idx)}
        <span className="font-bold text-foreground">{name.slice(idx, idx + query.length)}</span>
        {name.slice(idx + query.length)}
      </>
    );
  };

  return (
    <div ref={containerRef} className="relative flex-1">
      <div className="flex items-center">
        {isFetching ? (
          <Loader2 className="w-5 h-5 text-muted-foreground ml-3 shrink-0 animate-spin" />
        ) : (
          <Search className="w-5 h-5 text-muted-foreground ml-3 shrink-0" />
        )}
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-3 py-2.5 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
          role="combobox"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          autoComplete="off"
        />
      </div>

      {/* Trending searches on empty focus */}
      {open && value.trim().length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-50 p-3">
          <p className="text-xs font-medium text-muted-foreground mb-2">🔥 Trending</p>
          <div className="flex flex-wrap gap-2">
            {["iPhone 15", "Shea Butter", "Samsung TV", "Nike Air Max", "Gas Cylinder"].map(term => (
              <button
                key={term}
                onMouseDown={() => { onChange(term); onSubmit(); setOpen(false); }}
                className="px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-xs hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
          {items.length > 0 && (
            <div className="px-4 py-2 border-b border-border bg-muted/30">
              <p className="text-xs text-muted-foreground">
                {isFetching ? "Searching..." : `${items.length} product${items.length !== 1 ? "s" : ""} found`}
              </p>
            </div>
          )}
          {items.map((item, i) => (
            <button
              key={item.slug}
              onMouseDown={() => selectResult(item.slug)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                activeIndex === i ? "bg-accent" : "hover:bg-muted/50"
              }`}
              role="option"
              aria-selected={activeIndex === i}
            >
              <div className="w-8 h-8 rounded-lg bg-muted overflow-hidden shrink-0">
                {item.image_url ? (
                  <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground truncate">
                  {highlightMatch(item.name, debouncedQuery)}
                </p>
              </div>
              {item.category_id && categories?.[item.category_id] && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">
                  {categories[item.category_id]}
                </span>
              )}
            </button>
          ))}

          {/* "Search for" fallback item */}
          <button
            onMouseDown={selectFullSearch}
            onMouseEnter={() => setActiveIndex(items.length)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left border-t border-border transition-colors ${
              activeIndex === items.length ? "bg-accent" : "hover:bg-muted/50"
            }`}
            role="option"
            aria-selected={activeIndex === items.length}
          >
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground">
              Search for '<span className="font-semibold text-foreground">{value.trim()}</span>'
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
