import Breadcrumbs from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";
import ProductCard from "@/components/ProductCard";
import { searchProducts } from "@/lib/storefront-data";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q ?? "";
  const results = searchProducts(query);

  return (
    <>
      <PageHero
        eyebrow="Search"
        title={query ? `Results for "${query}"` : "Search the collection"}
        description="Search results now follow the same premium catalog styling as the rest of the storefront, helping shoppers move from intent to discovery more naturally."
        accent="Whether you search by fabric, product type, or occasion, the experience now stays visually aligned with the home page."
      />
      <section className="store-page-section">
        <div className="store-page-shell">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
          {results.length ? (
            <div className="product-grid-layout">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="summary-card success-card">
              <h2>No matches found</h2>
              <p>Try searching for silk, kurti, wedding, kids, or a colour story you have in mind.</p>
              <a href="/shop" className="store-cta">Browse all collections</a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
