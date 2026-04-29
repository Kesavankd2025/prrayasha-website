"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ProductCard from "./ProductCard";
import apiHome from "@/apiProvider/home.provider";

export default function ProductSection() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const { status, response } = await apiHome.getProductList(undefined, undefined, true);
            if (status) {
                setProducts(response.data || []);
            }
            setLoading(false);
        };
        fetchProducts();
    }, []);

    return (
        <section className="product-section">
            <div className="section-container">
                <div style={{ marginBottom: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ color: '#36533f', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>Daily Essentials</span>
                    <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a1a', marginBottom: '1rem', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>Shop Every Day</h2>
                    <div style={{ width: '60px', height: '2px', background: 'linear-gradient(to right, transparent, #36533f, transparent)' }}></div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#36533f', width: '100%' }}>Loading collections...</div>
                ) : (
                    <div className="product-grid">
                        {products.slice(0, 4).map((p) => (
                            <ProductCard key={p._id || p.id} product={p} />
                        ))}
                    </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
                    <Link href="/shop" style={{ display: 'inline-block' }}>
                        <button style={{ backgroundColor: '#36533f', color: 'white', padding: '1rem 3.5rem', borderRadius: '100px', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '13px', letterSpacing: '0.12em', display: 'flex', alignItems: 'center', gap: '0.6rem', transition: 'all 0.3s ease', boxShadow: '0 10px 25px rgba(54, 83, 63, 0.2)' }} className="view-all-btn">
                            View All <ArrowUpRight size={18} />
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

