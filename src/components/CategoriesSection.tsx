import { useCategories } from "@/hooks/useProducts";
import { Link } from "react-router-dom";

const CategoriesSection = () => {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-10">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-28 bg-card border border-border rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categories?.length) return null;

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-10">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
