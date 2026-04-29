"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

const categories = [
    {
        name: "kurthi collections",
        image: "/images/LAK2617.jpeg",
        count: "120+ Items"
    },
    {
        name: "our brand prrayasha",
        image: "/images/image.png",
        count: "Exclusive"
    },
    {
        name: "bottom wears",
        image: "/images/RSM2609.jpeg",
        count: "80+ Items"
    },
    {
        name: "night wears",
        image: "/images/RSM2626.jpeg",
        count: "45+ Items"
    }
];

export default function CategoryGrid() {
    return (
        <section className="category-grid-section" style={{ padding: '3rem 1rem', background: '#fff' }}>
            <div className="section-container">
                <div className="brand-styles-header" style={{ marginBottom: '4rem' }}>
                    <span className="section-label" style={{ textAlign: 'center' }}>Explore Our Range</span>
                    <h2 className="brand-styles-title">Shop by Category</h2>
                    <div className="title-underline"></div>
                </div>

                <div className="brand-styles-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
                    {categories.map((cat, index) => (
                        <div key={index} className="brand-style-card" style={{ cursor: 'pointer' }}>
                            <div className="style-image-wrapper" style={{ borderRadius: '15px' }}>
                                <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    className="style-img"
                                />
                                <div className="style-overlay" style={{ background: 'rgba(0,0,0,0.3)' }}>
                                    <button className="style-view-btn">Browse Collection</button>
                                </div>
                            </div>
                            <div className="style-info" style={{ textAlign: 'left' }}>
                                <h4 className="style-name" style={{ textTransform: 'capitalize', fontSize: '20px' }}>{cat.name}</h4>
                                <p style={{ fontSize: '12px', color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>{cat.count}</p>
                                <a href="#" className="style-link">
                                    Shop Now <ArrowRight size={14} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
