import { useState } from "react";
import { useProductTranslations, useAutoTranslate, useApproveTranslation, useUpdateTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Languages, Check, X, Pencil, Sparkles, Loader2 } from "lucide-react";

const LANG_LABELS: Record<string, string> = {
  fr: "🇫🇷 French",
  es: "🇪🇸 Spanish",
  pt: "🇵🇹 Portuguese",
  ar: "🇸🇦 Arabic",
};

interface TranslationManagerProps {
  productId: string;
  productName: string;
}

const TranslationManager = ({ productId, productName }: TranslationManagerProps) => {
  const { data: translations, isLoading } = useProductTranslations(productId);
  const autoTranslate = useAutoTranslate();
  const approveTranslation = useApproveTranslation();
  const updateTranslation = useUpdateTranslation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const handleAutoTranslate = async () => {
    try {
      await autoTranslate.mutateAsync({ productId });
      queryClient.invalidateQueries({ queryKey: ["product-translations", productId] });
      toast({ title: "Translations generated!" });
    } catch (err: any) {
      toast({ title: "Translation failed", description: err.message, variant: "destructive" });
    }
  };

  const handleApprove = async (translationId: string, approved: boolean) => {
    await approveTranslation.mutateAsync({ translationId, approved });
    queryClient.invalidateQueries({ queryKey: ["product-translations", productId] });
    toast({ title: approved ? "Translation approved" : "Translation rejected" });
  };

  const handleSaveEdit = async (translationId: string) => {
    await updateTranslation.mutateAsync({ translationId, name: editName, description: editDesc });
    queryClient.invalidateQueries({ queryKey: ["product-translations", productId] });
    setEditingId(null);
    toast({ title: "Translation updated" });
  };

  const startEdit = (t: any) => {
    setEditingId(t.id);
    setEditName(t.name);
    setEditDesc(t.description || "");
  };

  return (
    <div className="border border-border rounded-xl p-4 mt-3 bg-muted/30">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-heading font-semibold text-sm flex items-center gap-2">
          <Languages className="w-4 h-4 text-primary" />
          Translations for "{productName}"
        </h4>
        <Button
          size="sm"
          variant="outline"
          onClick={handleAutoTranslate}
          disabled={autoTranslate.isPending}
        >
          {autoTranslate.isPending ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Sparkles className="w-3 h-3" />
          )}
          {autoTranslate.isPending ? "Translating..." : "AI Translate"}
        </Button>
      </div>

      {isLoading ? (
        <p className="text-xs text-muted-foreground">Loading translations...</p>
      ) : !translations?.length ? (
        <p className="text-xs text-muted-foreground">No translations yet. Click AI Translate to generate.</p>
      ) : (
        <div className="space-y-2">
          {translations.map((t: any) => (
            <div key={t.id} className="bg-card border border-border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">{LANG_LABELS[t.language_code] || t.language_code}</span>
                  {t.auto_translated && (
                    <Badge variant="outline" className="text-[10px] py-0">AI</Badge>
                  )}
                  {t.approved ? (
                    <Badge className="bg-primary/10 text-primary text-[10px] py-0">Approved</Badge>
                  ) : (
                    <Badge variant="outline" className="text-secondary text-[10px] py-0">Pending</Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  {editingId !== t.id && (
                    <>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => startEdit(t)}>
                        <Pencil className="w-3 h-3" />
                      </Button>
                      {!t.approved && (
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-primary" onClick={() => handleApprove(t.id, true)}>
                          <Check className="w-3 h-3" />
                        </Button>
                      )}
                      {t.approved && (
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-destructive" onClick={() => handleApprove(t.id, false)}>
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {editingId === t.id ? (
                <div className="space-y-2">
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Product name" className="text-xs h-8" />
                  <Textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} placeholder="Description" className="text-xs min-h-[60px]" />
                  <div className="flex gap-2">
                    <Button size="sm" className="h-7 text-xs" onClick={() => handleSaveEdit(t.id)}>Save</Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setEditingId(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  {t.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.description}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TranslationManager;
