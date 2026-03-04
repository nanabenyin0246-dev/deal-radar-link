import { useState, useRef, useEffect } from "react";
import { ScanLine, Search, X, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBarcodeLookup } from "@/hooks/useBarcodeLookup";
import { useToast } from "@/hooks/use-toast";

interface BarcodeScannerProps {
  onProductFound?: (product: { title: string; brand: string; ean: string; images: string[] }) => void;
}

const BarcodeScanner = ({ onProductFound }: BarcodeScannerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [barcode, setBarcode] = useState("");
  const barcodeLookup = useBarcodeLookup();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleLookup = async () => {
    if (!barcode.trim()) return;
    try {
      const product = await barcodeLookup.mutateAsync(barcode.trim());
      if (product) {
        toast({ title: "Product found!", description: product.title });
        onProductFound?.({
          title: product.title,
          brand: product.brand,
          ean: product.ean,
          images: product.images,
        });
      } else {
        toast({ title: "Not found", description: "No product found for this barcode.", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Lookup failed", description: err.message, variant: "destructive" });
    }
  };

  if (!isOpen) {
    return (
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} className="gap-2">
        <ScanLine className="w-4 h-4" />
        Scan Barcode
      </Button>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-semibold text-sm flex items-center gap-2">
          <ScanLine className="w-4 h-4 text-primary" />
          Barcode Lookup
        </h3>
        <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter UPC/EAN barcode..."
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLookup()}
          className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <Button size="sm" onClick={handleLookup} disabled={barcodeLookup.isPending || !barcode.trim()}>
          {barcodeLookup.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </Button>
      </div>

      {barcodeLookup.data && (
        <div className="bg-accent/30 rounded-lg p-3 space-y-2">
          <p className="font-heading font-semibold text-sm">{barcodeLookup.data.title}</p>
          {barcodeLookup.data.brand && (
            <p className="text-xs text-muted-foreground">Brand: {barcodeLookup.data.brand}</p>
          )}
          {barcodeLookup.data.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{barcodeLookup.data.description}</p>
          )}
          {barcodeLookup.data.offers.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Global prices:</p>
              {barcodeLookup.data.offers.slice(0, 3).map((o, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span>{o.merchant}</span>
                  <a href={o.link} target="_blank" rel="noopener noreferrer" className="text-primary flex items-center gap-1">
                    {o.currency} {o.price} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <p className="text-[10px] text-muted-foreground">Powered by UPC Item DB · 100 lookups/day free</p>
    </div>
  );
};

export default BarcodeScanner;
