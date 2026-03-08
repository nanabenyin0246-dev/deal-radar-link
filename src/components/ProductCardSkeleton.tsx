const ProductCardSkeleton = () => {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-square bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/4" />
        <div className="space-y-2 pt-2">
          <div className="h-3 bg-muted rounded w-1/3" />
          <div className="h-6 bg-muted rounded w-1/2" />
          <div className="h-3 bg-muted rounded w-2/5" />
        </div>
        <div className="h-10 bg-muted rounded-lg w-full" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
