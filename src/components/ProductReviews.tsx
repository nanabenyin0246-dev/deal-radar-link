import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useProductReviews, useSubmitReview } from "@/hooks/useReviews";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

const StarSelector = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        className="transition-colors"
      >
        <Star className={`w-6 h-6 ${star <= value ? "fill-secondary text-secondary" : "text-muted-foreground"}`} />
      </button>
    ))}
  </div>
);

const ProductReviews = ({ productId, productName }: ProductReviewsProps) => {
  const { user } = useAuth();
  const { data: reviews, isLoading } = useProductReviews(productId);
  const submitReview = useSubmitReview();
  const { toast } = useToast();

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // Check if user has a completed order for this product
  const { data: eligibleOrder } = useQuery({
    queryKey: ["review-eligibility", productId, user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, vendor_id")
        .eq("buyer_id", user!.id)
        .eq("product_id", productId)
        .eq("status", "completed")
        .limit(1)
        .maybeSingle();
      return data;
    },
    enabled: !!user?.id && !!productId,
  });

  // Check if user already reviewed
  const alreadyReviewed = reviews?.some((r: any) => r.user_id === user?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !eligibleOrder || rating === 0) return;
    try {
      await submitReview.mutateAsync({
        product_id: productId,
        vendor_id: eligibleOrder.vendor_id,
        order_id: eligibleOrder.id,
        rating,
        title,
        body,
        user_id: user.id,
      });
      toast({ title: "Review submitted! ✓" });
      setRating(0); setTitle(""); setBody("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  if (isLoading) return <div className="h-32 bg-muted rounded-xl animate-pulse" />;

  // Aggregate stats
  const totalReviews = reviews?.length || 0;
  const avgRating = totalReviews > 0
    ? (reviews!.reduce((s: number, r: any) => s + r.rating, 0) / totalReviews).toFixed(1)
    : "0";
  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews?.filter((r: any) => r.rating === star).length || 0,
    pct: totalReviews > 0 ? Math.round((reviews!.filter((r: any) => r.rating === star).length / totalReviews) * 100) : 0,
  }));

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-xl font-bold">Customer Reviews</h2>

      {/* Aggregate summary */}
      {totalReviews > 0 && (
        <div className="flex flex-col sm:flex-row gap-6 bg-card border border-border rounded-xl p-5">
          <div className="text-center sm:text-left">
            <div className="font-heading text-4xl font-bold">{avgRating}</div>
            <div className="flex items-center gap-0.5 justify-center sm:justify-start mt-1">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className={`w-4 h-4 ${s <= Math.round(Number(avgRating)) ? "fill-secondary text-secondary" : "text-muted-foreground"}`} />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{totalReviews} review{totalReviews !== 1 ? "s" : ""}</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {ratingCounts.map(rc => (
              <div key={rc.star} className="flex items-center gap-2 text-sm">
                <span className="w-6 text-right text-muted-foreground">{rc.star}★</span>
                <Progress value={rc.pct} className="flex-1 h-2" />
                <span className="w-8 text-xs text-muted-foreground">{rc.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leave a Review */}
      {user && eligibleOrder && !alreadyReviewed && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-heading font-semibold">Leave a Review</h3>
          <StarSelector value={rating} onChange={setRating} />
          <Input placeholder="Review title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="Share your experience..." value={body} onChange={(e) => setBody(e.target.value)} rows={3} />
          <Button type="submit" disabled={rating === 0 || submitReview.isPending}>
            {submitReview.isPending ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      )}

      {user && !eligibleOrder && !alreadyReviewed && (
        <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">Buy this product to leave a review</p>
      )}

      {/* Reviews list */}
      {totalReviews > 0 ? (
        <div className="space-y-4">
          {reviews!.map((review: any) => (
            <div key={review.id} className="bg-card border border-border rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {review.reviewer?.display_name || "Verified Buyer"}
                  </span>
                  {review.order_id && <Badge variant="outline" className="text-[10px]">Verified Purchase</Badge>}
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? "fill-secondary text-secondary" : "text-muted-foreground"}`} />
                ))}
              </div>
              {review.title && <p className="font-semibold text-sm">{review.title}</p>}
              {review.body && <p className="text-sm text-muted-foreground">{review.body}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No reviews yet — be the first to review {productName}!</p>
      )}
    </div>
  );
};

export default ProductReviews;
