/**
 * Calculate a Deal Score (0-100) for a vendor offer.
 *
 * - Price score (50pts): how far below the category/product average price
 * - Vendor score (30pts): verified = 30, unverified = 10
 * - Freshness score (20pts): updated < 24h = 20, < 7 days = 10, older = 0
 */

interface DealScoreInput {
  price: number;
  averagePrice: number;
  vendorVerified: boolean;
  updatedAt: string; // ISO date string
}

export const calculateDealScore = ({
  price,
  averagePrice,
  vendorVerified,
  updatedAt,
}: DealScoreInput): number => {
  // Price score (0-50): 50 if price is 50%+ below average, 0 if at or above average
  let priceScore = 0;
  if (averagePrice > 0 && price < averagePrice) {
    const pctBelow = (averagePrice - price) / averagePrice;
    priceScore = Math.min(50, Math.round(pctBelow * 100));
  }

  // Vendor score (0-30)
  const vendorScore = vendorVerified ? 30 : 10;

  // Freshness score (0-20)
  const hoursAgo = (Date.now() - new Date(updatedAt).getTime()) / (1000 * 60 * 60);
  let freshnessScore = 0;
  if (hoursAgo < 24) freshnessScore = 20;
  else if (hoursAgo < 168) freshnessScore = 10; // 7 days

  return Math.min(100, priceScore + vendorScore + freshnessScore);
};

export interface DealScoreLabel {
  text: string;
  emoji: string;
  colorClass: string; // tailwind classes
}

export const getDealScoreLabel = (score: number): DealScoreLabel => {
  if (score >= 80) return { text: "Hot Deal", emoji: "🔥", colorClass: "bg-success text-success-foreground" };
  if (score >= 50) return { text: "Good Deal", emoji: "👍", colorClass: "bg-primary text-primary-foreground" };
  return { text: "Fair", emoji: "", colorClass: "bg-muted text-muted-foreground" };
};
