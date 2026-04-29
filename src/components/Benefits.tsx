"use client";

import { Heart, Truck, ShieldCheck } from "lucide-react";

const benefits = [
    {
        icon: <Heart size={28} className="benefit-icon" />,
        title: "Budget Friendly",
    },
    {
        icon: <Truck size={28} className="benefit-icon" />,
        title: "Free Shipping",
    },
    {
        icon: <ShieldCheck size={28} className="benefit-icon" />,
        title: "100% ORIGINAL",
    }
];

export default function Benefits() {
    return (
        <section className="benefits-section" style={{ backgroundColor: '#fff' }}>
            <div className="section-container">
                <div className="benefits-header" style={{ marginBottom: 'clamp(2rem, 5vw, 4rem)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ color: '#36533f', fontSize: 'clamp(10px, 1.5vw, 11px)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>The Prrayasha Advantage</span>
                    <h2 style={{ 
                        fontSize: 'clamp(24px, 4vw, 36px)', 
                        fontWeight: '700', 
                        color: '#1a1a1a',
                        marginBottom: '1rem',
                        fontFamily: 'var(--font-serif)',
                        textAlign: 'center'
                    }}>
                        Why Our Clients Love Us
                    </h2>
                    <div style={{ width: '60px', height: '2px', background: 'linear-gradient(to right, transparent, #36533f, transparent)' }}></div>
                </div>
                
                <div className="benefits-grid" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                    gap: '2rem' 
                }}>
                    {benefits.map((benefit, index) => (
                        <div key={index} style={{ 
                            backgroundColor: '#fff', 
                            padding: '3rem 2rem', 
                            borderRadius: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            gap: '1.5rem',
                            border: '1px solid #f2ece8',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'default'
                        }} className="benefit-card">
                            <div style={{ 
                                color: '#36533f', 
                                backgroundColor: '#36533f0a', 
                                width: '70px', 
                                height: '70px', 
                                borderRadius: '20px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                transition: 'all 0.3s ease'
                            }} className="icon-wrapper">
                                {benefit.icon}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <h3 style={{ 
                                    fontSize: '18px', 
                                    fontWeight: '700', 
                                    color: '#1a1a1a',
                                    fontFamily: 'var(--font-serif)'
                                }}>
                                    {benefit.title}
                                </h3>
                                <p style={{ fontSize: '13px', color: '#888', lineHeight: '1.6' }}>
                                    Experience the finest quality and curated selections designed exclusively for you.
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <style jsx>{`
                .benefit-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.04);
                    border-color: #36533f33;
                }
                .benefit-icon {
                    stroke-width: 1.5px;
                }
                .benefits-section {
                    padding: 3rem 0 6rem 0;
                }
                @media (max-width: 1024px) {
                    .benefits-section {
                        padding: 3rem 1.5rem 3rem 1.5rem;
                    }
                }
                @media (max-width: 640px) {
                    .benefits-section {
                        padding: 2rem 1.5rem 2rem 1.5rem;
                    }
                }
            `}</style>
        </section>
    );
}
