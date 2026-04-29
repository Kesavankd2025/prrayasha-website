"use client";

import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import ProductInteraction from "@/components/ProductInteraction";
import apiHome from "@/apiProvider/home.provider";

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      console.log("Fetching product details for slug:", slug);
      setLoading(true);
      try {
        const { status, response } = await apiHome.getProductDetails(slug);
        
        if (status && response?.data) {
          setProduct(response.data);
          
          // Fetch related products from same category
          const { status: relStatus, response: relResponse } = await apiHome.getProductList(response.data.categoryId);
          if (relStatus && relResponse?.data) {
            setRelated(relResponse.data.filter((item: any) => item._id !== response.data._id).slice(0, 4));
          }
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: '#8a4b65' }}>
        <div className="loader" style={{ width: '100%', textAlign: 'center' }}>Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <div style={{ backgroundColor: '#fdfaf9', minHeight: '100vh', paddingBottom: '0' }}>
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #f2ece8' }}>
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Collections", href: "/shop" },
            { label: product.name }
          ]}
        />
      </div>

      <section className="store-page-section product-page-section">
        <div className="store-page-shell">
          <ProductInteraction product={product} />

          {related.length > 0 && (
            <div className="related-block product-related-block" style={{ marginTop: '4rem' }}>
              <div className="section-heading-row product-related-heading" style={{ textAlign: 'center', marginBottom: '3rem', justifyContent: 'center' }}>
                <div>
                  <p className="section-kicker" style={{ color: '#1a1a2e', fontWeight: 'bold', letterSpacing: '0.1em', fontSize: '12px' }}>OUR SHOP</p>
                  <h2 className="product-related-title" style={{ fontSize: '28px', color: '#36533f', fontWeight: 'bold' }}>Related Products</h2>
                </div>
              </div>
              <div className="product-grid-layout product-related-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
                {related.map((item: any) => (
                  <ProductCard key={item._id} product={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        .store-page-shell {
          width: 100%;
          max-width: var(--max-width);
          margin: 0 auto;
        }
        .product-page-section {
          padding-left: 1rem;
          padding-right: 1rem;
        }
        @media (max-width: 1024px) {
          .product-related-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 1.5rem !important;
          }
        }

        @media (max-width: 767px) {
          .product-page-section {
            padding-left: 1.25rem !important;
            padding-right: 1.25rem !important;
          }

          .store-page-shell {
            width: 100%;
            max-width: 100%;
            margin: 0;
          }

          .product-related-heading {
            margin-bottom: 2rem !important;
          }

          .product-related-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 1rem !important;
          }
        }

        @media (max-width: 640px) {
          .product-page-section {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }

          .product-related-block {
            margin-top: 3rem !important;
          }

          .product-related-heading {
            margin-bottom: 1.5rem !important;
          }

          .product-related-title {
            font-size: 24px !important;
          }

          .product-related-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 0.75rem !important;
          }
        }
      `}</style>
    </div>
  );
}
