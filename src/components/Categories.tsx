"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import apiHome from "@/apiProvider/home.provider";
import { IMAGE_BASE_URL } from "@/lib/api-client";

export default function Categories() {
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const { status, response } = await apiHome.getCategoryList();
            if (status) setCategories(response.data);
        };
        fetchCategories();
    }, []);

    return (
        <section className="category-section">
            <div className="section-container">
                <div className="category-header" style={{ marginBottom: 'clamp(2rem, 5vw, 4rem)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ color: '#36533f', fontSize: 'clamp(10px, 1.5vw, 11px)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>Curated Selections</span>
                    <h2 className="category-title" style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: '700', color: '#1a1a1a', marginBottom: '1rem', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>Our Categories</h2>
                    <div style={{ width: '60px', height: '2px', background: 'linear-gradient(to right, transparent, #36533f, transparent)' }}></div>
                </div>

                <div className="category-grid">
                    {categories.map((cat) => (
                        <div key={cat.id} className="category-card-wrapper">
                            <div className="category-item">
                                <Link href={`/shop?categoryId=${cat.id}`} className="main-category-link">
                                    <div className="image-square-wrapper">
                                        {/* Blurred Background to fill gaps */}
                                        <div className="blurred-backdrop">
                                            <img
                                                src={`${IMAGE_BASE_URL}/${cat.image.path}`}
                                                alt=""
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(20px)', opacity: 0.3 }}
                                            />
                                        </div>
                                        <img
                                            src={`${IMAGE_BASE_URL}/${cat.image.path}`}
                                            alt={cat.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            className="category-img"
                                        />
                                    </div>
                                    <h3 className="category-name">
                                        {cat.name}
                                    </h3>
                                </Link>

                                {cat.subCategories && cat.subCategories.length > 0 && (
                                    <div className="subcategory-dropdown-wrap">
                                        <div className="subcategory-list">
                                            {cat.subCategories.map((sub: any) => (
                                                <Link key={sub.id} href={`/shop?categoryId=${cat.id}&subCategoryId=${sub.id}`} className="subcategory-link">
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .category-section {
                    padding: 1rem 1.5rem 4rem;
                    background-color: #fff;
                }
                .section-container {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .category-header {
                    text-align: center;
                }
                .category-title {
                    font-size: 36px;
                    font-weight: 700;
                    color: #1a1210;
                    margin-bottom: 1rem;
                }

                .category-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 4rem 2rem;
                    width: 100%;
                }
                .category-card-wrapper {
                    display: flex;
                    justify-content: center;
                }
                .category-item {
                    display: flex; 
                    flex-direction: column; 
                    align-items: center;
                    text-align: center;
                    width: 100%;
                    max-width: 240px;
                }
                .main-category-link {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 100%;
                    text-decoration: none;
                }
                .image-square-wrapper { 
                    width: 240px;
                    height: 240px;
                    position: relative; 
                    border-radius: 4px;
                    overflow: hidden;
                    border: 1px solid #eee;
                    background: #fcfcfc;
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    margin-bottom: 2rem;
                }
                :global(.category-img) {
                    object-fit: cover !important;
                    padding: 0px;
                    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;
                }
                .blurred-backdrop {
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                    transform: scale(1.1);
                }
                .category-name { 
                    font-size: 16px; 
                    font-weight: 700; 
                    color: #1a1210;
                    margin: 0;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    transition: all 0.3s ease;
                }
                .category-item:hover .image-square-wrapper {
                    border-color: var(--gold, #d4af37);
                    box-shadow: 0 15px 35px rgba(212, 175, 55, 0.15);
                    transform: translateY(-10px);
                }
                .category-item:hover .category-img {
                    transform: scale(1.1);
                }
                .category-item:hover .category-name {
                    color: var(--gold, #d4af37);
                    letter-spacing: 0.15em;
                }
                
                .subcategory-dropdown-wrap {
                    display: grid;
                    grid-template-rows: 0fr;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    width: 100%;
                }
                .subcategory-list { 
                    overflow: hidden;
                    display: flex; 
                    flex-direction: column; 
                    gap: 0.4rem;
                    align-items: center;
                    padding-top: 1.5rem;
                }
                .category-item:hover .subcategory-dropdown-wrap {
                    grid-template-rows: 1fr;
                    opacity: 1;
                    visibility: visible;
                }
                
                .subcategory-link { 
                    font-size: 13px; 
                    color: #000;
                    text-decoration: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    padding: 6px 15px;
                    position: relative;
                    font-weight: 500;
                    display: inline-block;
                }
                .subcategory-link:hover {
                    color: #d4af37 !important;
                    background-color: rgba(212, 175, 55, 0.08);
                    border-radius: 4px;
                    font-weight: 700;
                    transform: translateX(4px);
                }
                .subcategory-link::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    width: 0;
                    height: 1px;
                    background: #36533f;
                    transition: all 0.3s ease;
                    transform: translateX(-50%);
                }
                .subcategory-link:hover::after {
                    width: 60%;
                }

                @media (max-width: 1024px) {
                    .category-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 3rem 1.5rem;
                    }
                    .category-title {
                        font-size: 32px;
                    }
                }
                @media (max-width: 640px) {
                    .category-section {
                        padding: 4rem 1rem 3rem;
                    }
                    .category-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 2rem 1rem;
                    }
                    .category-name {
                        font-size: 14px;
                    }
                    .image-square-wrapper {
                        width: 160px;
                        height: 160px;
                    }
                    .category-item {
                        max-width: 160px;
                    }
                }
                @media (max-width: 380px) {
                    .image-square-wrapper {
                        width: 140px;
                        height: 140px;
                    }
                    .category-item {
                        max-width: 140px;
                    }
                    .category-name {
                        font-size: 12px;
                    }
                }
            `}</style>
        </section>
    );
}
