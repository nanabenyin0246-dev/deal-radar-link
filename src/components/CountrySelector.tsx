import { useState } from "react";
import { useAllCountries, CountryData } from "@/hooks/useRestCountries";
import { ChevronDown, Search, X } from "lucide-react";

interface CountrySelectorProps {
  value?: string;
  onChange: (country: CountryData) => void;
  label?: string;
  placeholder?: string;
}

const CountrySelector = ({ value, onChange, label, placeholder = "Select country" }: CountrySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data: countries, isLoading } = useAllCountries();

  const selected = countries?.find((c) => c.code === value || c.name === value);
  const filtered = countries?.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      {label && <label className="text-sm font-medium text-foreground mb-1 block">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-background border border-border rounded-lg px-3 py-2.5 text-sm hover:border-primary/30 transition-colors"
      >
        <span className={selected ? "text-foreground" : "text-muted-foreground"}>
          {selected ? `${selected.flag} ${selected.name}` : placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-card border border-border rounded-xl shadow-lg overflow-hidden animate-fade-in">
          <div className="p-2 border-b border-border">
            <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-2 py-1.5">
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search countries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm focus:outline-none"
                autoFocus
              />
              {search && (
                <button onClick={() => setSearch("")}>
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">Loading countries...</div>
            ) : filtered?.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">No countries found</div>
            ) : (
              filtered?.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-accent/50 transition-colors ${
                    c.code === selected?.code ? "bg-accent" : ""
                  }`}
                  onClick={() => {
                    onChange(c);
                    setIsOpen(false);
                    setSearch("");
                  }}
                >
                  <span className="text-lg">{c.flag}</span>
                  <div className="text-left">
                    <span className="font-medium">{c.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {c.currencies[0]?.code} · {c.callingCode}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
