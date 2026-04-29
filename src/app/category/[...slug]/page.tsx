import { notFound } from "next/navigation";

import Breadcrumbs from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";
import ProductCard from "@/components/ProductCard";
import { findCategoryBySlugPath, getProductsByPath } from "@/lib/storefront-data";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const category = findCategoryBySlugPath(slug);

  if (!category) {
    notFound();
  }

  const items = getProductsByPath(slug);

  return (
    <>
      <PageHero
        eyebrow="Collections"
        title={category.label}
        description={category.description}
        accent="Each collection page now carries the same layered boutique feel as the home page, with softer surfaces and clearer discovery paths."
      />
      <section className="store-page-section">
        <div className="store-page-shell">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: category.label },
            ]}
          />
          {category.children?.length ? (
            <div className="category-chip-row">
              {category.children.map((child) => (
                <a key={child.href} href={child.href} className="category-chip">
                  {child.label}
                </a>
              ))}
            </div>
          ) : null}
          {/* Shop Main Layout */}
          <div className="shop-main-layout">
            {/* Left Sidebar Filters */}
            <aside className="shop-filters-sidebar">
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '1.5rem', borderBottom: '1px solid #eaeaea', paddingBottom: '0.75rem', fontFamily: 'var(--font-serif)' }}>Price</h3>
                <div style={{ marginTop: '0.5rem' }}>
                  <input type="range" min="0" max="10000" style={{ width: '100%', accentColor: 'var(--primary)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#555', marginTop: '0.75rem', fontWeight: '600' }}>
                    <span>₹0</span>
                    <span>₹10,000</span>
                  </div>
                </div>
              </div>
              
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '1.5rem', borderBottom: '1px solid #eaeaea', paddingBottom: '0.75rem', fontFamily: 'var(--font-serif)' }}>Availability</h3>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '14px', cursor: 'pointer', color: '#333' }}>
                  <input type="radio" name="availability" style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }} /> In stock
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '14px', cursor: 'pointer', color: '#333' }}>
                  <input type="radio" name="availability" style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }} /> Out of stock
                </label>
              </div>

              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '1.5rem', borderBottom: '1px solid #eaeaea', paddingBottom: '0.75rem', fontFamily: 'var(--font-serif)' }}>Size</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <label key={size} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '14px', cursor: 'pointer', color: '#333' }}>
                      <input type="radio" name="size" style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }} /> {size}
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Right Side 3-Column Grid */}
            <div className="shop-product-grid-container">
              <div className="product-grid">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .shop-main-layout {
          display: flex;
          gap: 3rem;
          align-items: flex-start;
          margin-top: 2rem;
        }
        .shop-filters-sidebar {
          width: 250px;
          flex-shrink: 0;
          padding: 1.5rem;
          background-color: #fdfaf9;
          border: 1px solid #eee;
          border-radius: 12px;
          position: sticky;
          top: 120px;
        }
        .shop-product-grid-container {
          flex-grow: 1;
        }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        @media (max-width: 767px) {
          .shop-main-layout {
            flex-direction: column;
            gap: 2rem;
          }
          .shop-filters-sidebar {
            width: 100%;
            position: static;
            padding: 1.25rem;
          }
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }
        }

        @media (max-width: 640px) {
          .product-grid {
            gap: 0.75rem;
          }
        }
      `}</style>
    </>
  );
}
