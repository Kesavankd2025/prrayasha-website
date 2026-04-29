"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";
import ProductCard from "@/components/ProductCard";
import apiHome from "@/apiProvider/home.provider";
import { ChevronDown, ChevronRight as ChevronRightIcon, MapPinned } from "lucide-react";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const categoryId = searchParams.get("categoryId");
  const subCategoryId = searchParams.get("subCategoryId");

  const [productList, setProductList] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  
  // Accordion state matching the design
  const [catOpen, setCatOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  
  const [expandedCats, setExpandedCats] = useState<string[]>([]);
  const [expandedAttrs, setExpandedAttrs] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(15);
  const [loadStep, setLoadStep] = useState(15);

  const getGridPagingConfig = () => {
    if (typeof window === "undefined") {
      return { initialCount: 15, incrementCount: 15 };
    }
    if (window.innerWidth <= 640) {
      return { initialCount: 10, incrementCount: 10 };
    }
    const columns = window.innerWidth <= 1024 ? 2 : 3;
    const rowBatch = columns * 5;
    return { initialCount: rowBatch, incrementCount: rowBatch };
  };

  const handleFilter = (catId?: string, subId?: string) => {
    const params = new URLSearchParams(searchParams);
    if (catId) {
      params.set("categoryId", catId);
      if (subId) params.set("subCategoryId", subId);
      else params.delete("subCategoryId");
    } else {
      params.delete("categoryId");
      params.delete("subCategoryId");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const toggleCat = (id: string) => {
    setExpandedCats(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleAttr = (id: string) => {
    setExpandedAttrs(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleFilterToggle = (attrId: string, valId: string) => {
    setSelectedFilters(prev => {
      const current = prev[attrId] || [];
      const updated = current.includes(valId) 
        ? current.filter(id => id !== valId)
        : [...current, valId];
      
      const newFilters = { ...prev };
      if (updated.length > 0) {
        newFilters[attrId] = updated;
      } else {
        delete newFilters[attrId];
      }
      return newFilters;
    });
  };


  const clearAllFilters = () => {
    setSelectedFilters({});
    setMaxPrice(10000);
    setSelectedSize(null);
    router.push(pathname);
  };

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      const { status, response } = await apiHome.getCategoryList();
      if (status) setCategories(response.data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchAttributes = async () => {
      const { status, response } = await apiHome.getAttributeList();
      if (status) {
        const filtered = response.data.filter((attr: any) => 
          attr.values?.some((v: any) => v.isFilter)
        );
        setAttributes(filtered);
      }
    };
    fetchAttributes();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { status, response } = await apiHome.getProductList(
        categoryId || undefined,
        subCategoryId || undefined,
        undefined,
        selectedFilters
      );
      if (status) {
        setProductList(response.data);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [categoryId, subCategoryId, selectedFilters]);

  const formattedProducts = useMemo(() => {
    return productList.map((p: any) => {
      const attribute = p.attributes?.[0];
      const imagePath = attribute?.images?.[0]?.path || "";
      const price = attribute?.price || p.price || 0;
      const mrp = attribute?.mrp || p.mrp || 0;

      return {
        ...p,
        id: p._id,
        slug: p.slug,
        name: p.name,
        category: p.category?.name || "Uncategorized",
        categoryPath: [p.category?.slug, p.subCategory?.slug].filter(Boolean),
        description: p.shortDescription || p.fullDescription || "",
        price,
        regularPrice: mrp > price ? mrp : undefined,
        image: imagePath ? imagePath : "/images/placeholder.jpg",
        sizes: ["S", "M", "L", "XL", "XXL"],
        rating: 5,
        featured: p.isFeatured || false,
        newArrival: p.isNewArrival || false,
        attributes: p.attributes
      };
    });
  }, [productList]);

  const filteredProducts = useMemo(() => {
    return formattedProducts.filter((p) => {
      const matchesPrice = p.price <= maxPrice;
      const matchesSize = selectedSize ? p.sizes?.includes(selectedSize) : true;
      return matchesPrice && matchesSize;
    });
  }, [formattedProducts, maxPrice, selectedSize]);

  useEffect(() => {
    const applyGridPaging = () => {
      const { initialCount, incrementCount } = getGridPagingConfig();
      setVisibleCount(initialCount);
      setLoadStep(incrementCount);
    };

    applyGridPaging();
    window.addEventListener("resize", applyGridPaging);
    return () => window.removeEventListener("resize", applyGridPaging);
  }, []);

  useEffect(() => {
    const { initialCount, incrementCount } = getGridPagingConfig();
    setVisibleCount(initialCount);
    setLoadStep(incrementCount);
  }, [filteredProducts]);

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );

  const hasMoreProducts = visibleProducts.length < filteredProducts.length;

  return (
    <>
      <PageHero
        eyebrow="Shop"
        title={categoryId ? (categories.find(c => c.id === categoryId)?.name || "Category") : "Browse our collections"}
        description={categoryId ? `Explore our premium range of ${categories.find(c => c.id === categoryId)?.name || "ethnic wear"}.` : "Discover the finest patterns and fabrics curated just for you."}
        accent="Find your perfect ethnic silhouette from our premium collection."
      />
      <section className="store-page-section">
        <div className="store-page-shell">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />

          <div className="shop-main-layout">
            <aside className="shop-filters-sidebar">
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '2px solid #eaeaea', paddingBottom: '0.75rem' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, fontFamily: 'var(--font-serif)', color: '#1a1a1a' }}>Filters</h2>
                {(Object.keys(selectedFilters).length > 0 || maxPrice < 10000 || selectedSize || categoryId) && (
                  <button 
                    onClick={clearAllFilters}
                    style={{ 
                      fontSize: '13px', 
                      color: '#8a4b65', 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      fontWeight: '700',
                      textDecoration: 'underline'
                    }}
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="filter-section">
                <div className="filter-header" onClick={() => setCatOpen(!catOpen)}>
                  <h3>Categories</h3>
                  <span className="filter-chevron">
                    <ChevronDown size={18} style={{ transform: catOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
                  </span>
                </div>
                <div className={`filter-content ${!catOpen ? 'mobile-hidden' : ''}`}>
                  {/* Show All Option */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '16px', cursor: 'pointer', fontWeight: !categoryId ? '700' : '500' }}>
                    <input
                      type="checkbox"
                      checked={!categoryId}
                      onChange={() => handleFilter()}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                    />
                    Show All
                  </label>

                  {categories.map((cat) => (
                    <div key={cat.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '16px', cursor: 'pointer', fontWeight: categoryId === cat.id ? '700' : '400' }}>
                          <input
                            type="checkbox"
                            checked={categoryId === cat.id && !subCategoryId}
                            onChange={() => handleFilter(cat.id)}
                            style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                          />
                          {cat.name}
                        </label>
                        {cat.subCategories?.length > 0 && (
                          <button
                            onClick={() => toggleCat(cat.id)}
                            style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              padding: '8px', marginRight: '-8px', background: 'none', border: 'none',
                              cursor: 'pointer', color: '#888', transition: 'transform 0.3s ease'
                            }}
                          >
                            {expandedCats.includes(cat.id) ? <ChevronDown size={20} /> : <ChevronRightIcon size={20} />}
                          </button>
                        )}
                      </div>

                      {expandedCats.includes(cat.id) && cat.subCategories?.length > 0 && (
                        <div style={{ marginLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderLeft: '1px solid #eee', paddingLeft: '1rem' }}>
                          {cat.subCategories.map((sub: any) => (
                            <label key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '15px', cursor: 'pointer', fontWeight: subCategoryId === sub.id ? '700' : '400' }}>
                              <input
                                type="checkbox"
                                checked={subCategoryId === sub.id}
                                onChange={() => handleFilter(cat.id, sub.id)}
                                style={{ width: '14px', height: '14px', accentColor: 'var(--primary)' }}
                              />
                              {sub.name}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <div className="filter-header" onClick={() => setPriceOpen(!priceOpen)}>
                  <h3>Price</h3>
                  <span className="filter-chevron">
                    <ChevronDown size={18} style={{ transform: priceOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
                  </span>
                </div>
                <div className={`filter-content ${!priceOpen ? 'mobile-hidden' : ''}`}>
                  <div style={{ marginTop: '0.5rem' }}>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--primary)' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#555', marginTop: '0.75rem', fontWeight: '600' }}>
                      <span>₹0</span>
                      <span>₹{maxPrice.toLocaleString("en-IN")}</span>
                      <span>₹10,000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Attribute Filters */}
              {attributes.map((attr) => (
                <div key={attr.id} className="filter-section">
                  <div className="filter-header" onClick={() => toggleAttr(attr.id)}>
                    <h3>{attr.name}</h3>
                    <span className="filter-chevron">
                      <ChevronDown size={18} style={{ transform: expandedAttrs.includes(attr.id) ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
                    </span>
                  </div>
                  
                  <div className={`filter-content ${!expandedAttrs.includes(attr.id) ? 'mobile-hidden' : ''}`}>
                    {attr.values?.filter((v: any) => v.isFilter).map((val: any) => (
                      <label key={val._id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '14px', cursor: 'pointer', color: '#333' }}>
                        <input
                          type="checkbox"
                          checked={selectedFilters[attr.id]?.includes(val._id) || false}
                          onChange={() => handleFilterToggle(attr.id, val._id)}
                          style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                        />
                        {val.name}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </aside>

            <div className="shop-product-grid-container">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', width: '100%' }}>Loading products...</div>
              ) : (
                <>
                  <div className="shop-product-grid">
                    {filteredProducts.length > 0 ? (
                      visibleProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))
                    ) : (
                      <div className="shop-empty-state" style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
                        <MapPinned size={48} strokeWidth={1} style={{ opacity: 0.2, marginBottom: '1.5rem' }} />
                        <p style={{ fontSize: '18px', fontWeight: '600' }}>No products found.</p>
                        <button 
                          onClick={() => {
                            setSelectedFilters({});
                            setMaxPrice(10000);
                            handleFilter();
                          }}
                          style={{ marginTop: '1rem', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', fontSize: '12px', borderBottom: '2px solid var(--primary)' }}
                        >
                          Clear All Filters
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {hasMoreProducts && (
                    <div className="shop-load-more-wrap">
                      <button
                        type="button"
                        className="shop-load-more-btn"
                        onClick={() => setVisibleCount((current) => current + loadStep)}
                      >
                        Load More
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .shop-main-layout {
          display: flex;
          gap: 3rem;
          align-items: flex-start;
          margin-top: 2rem;
        }

        .shop-filters-sidebar {
          width: 280px;
          flex-shrink: 0;
          padding: 1.5rem;
          background-color: #fdfaf9;
          border: 1px solid #eee;
          border-radius: 12px;
          position: sticky;
          top: 120px;
        }

        .filter-section {
          border-bottom: 1px solid #f0f0f0;
        }
        .filter-section:last-child {
          border-bottom: none;
        }

        .filter-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 0;
          cursor: default;
          pointer-events: none;
        }

        .filter-header h3 {
          font-size: 16px;
          font-weight: 700;
          margin: 0;
          font-family: var(--font-serif);
          color: #111;
        }

        .filter-chevron {
          color: #333;
          display: none;
          align-items: center;
          justify-content: center;
        }

        .filter-content {
          padding-bottom: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .shop-product-grid-container {
          flex-grow: 1;
        }

        .shop-product-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .shop-empty-state {
          grid-column: 1 / -1;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .shop-load-more-wrap {
          display: flex;
          justify-content: center;
          margin-top: 3rem;
        }

        .shop-load-more-btn {
          min-height: 46px;
          padding: 0 2rem;
          border-radius: 999px;
          background: var(--primary);
          color: #fff;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          box-shadow: 0 10px 22px rgba(53, 84, 64, 0.18);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .shop-load-more-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 28px rgba(53, 84, 64, 0.22);
        }

        @media (max-width: 1024px) {
          .shop-main-layout {
            flex-direction: row;
            gap: 1.5rem;
          }
          .shop-filters-sidebar {
            width: 200px;
          }
          .shop-product-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }
          .shop-empty-state {
            padding: 3rem 1rem !important;
          }
        }

        @media (max-width: 767px) {
          .filter-header {
            cursor: pointer;
            pointer-events: auto;
          }
          .filter-chevron {
            display: flex;
          }
          .mobile-hidden {
            display: none !important;
          }
          .shop-main-layout {
            flex-direction: column;
            gap: 1.5rem;
          }
          .shop-filters-sidebar {
            width: 100%;
            position: relative;
            top: 0;
            margin-bottom: 1rem;
          }
        }

        @media (max-width: 640px) {
          .store-page-section {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          .store-page-shell {
            width: 100%;
            max-width: 100%;
            margin: 0;
          }
          .shop-main-layout {
            margin-top: 1.5rem;
          }
          .shop-product-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }
          .shop-empty-state {
            padding: 2.5rem 0.75rem !important;
          }
          .shop-load-more-wrap {
            margin-top: 2rem;
          }
        }
      `}</style>
    </>
  );
}

export default function ShopPage() {
  return (
    <>
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '4rem', width: '100%' }}>Loading shop...</div>}>
        <ShopContent />
      </Suspense>
    </>
  );
}
