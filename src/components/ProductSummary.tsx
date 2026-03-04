import { useDuckDuckGoSummary } from "@/hooks/useDuckDuckGo";
import { ExternalLink, Info } from "lucide-react";

interface ProductSummaryProps {
  productName: string;
  brand?: string;
}

const ProductSummary = ({ productName, brand }: ProductSummaryProps) => {
  const searchQuery = brand ? `${brand} ${productName}` : productName;
  const { data: summary, isLoading } = useDuckDuckGoSummary(searchQuery);

  if (isLoading || !summary) return null;

  return (
    <div className="bg-accent/30 border border-border rounded-xl p-4 space-y-2">
      <div className="flex items-start gap-3">
        {summary.image && (
          <img
            src={summary.image}
            alt={summary.heading}
            className="w-12 h-12 rounded-lg object-cover shrink-0"
          />
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-primary shrink-0" />
            <h4 className="font-heading font-semibold text-sm truncate">{summary.heading}</h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mt-1 line-clamp-3">
            {summary.abstract}
          </p>
          {summary.abstractURL && (
            <a
              href={summary.abstractURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-1"
            >
              Read more on {summary.abstractSource} <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductSummary;
