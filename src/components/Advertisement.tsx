"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import apiHome from "@/apiProvider/home.provider";
import { IMAGE_BASE_URL } from "@/lib/api-client";

export default function Advertisement() {
    const [adList, setAdList] = useState<any[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const fetchAds = async () => {
            const { status, response } = await apiHome.getAdvertisementList();
            if (status && response.data) {
                setAdList(response.data);
            }
        };
        fetchAds();
    }, []);

    useEffect(() => {
        if (adList.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % adList.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [adList.length]);

    const nextSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentSlide((prev) => (prev + 1) % adList.length);
    };

    const prevSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentSlide((prev) => (prev === 0 ? adList.length - 1 : prev - 1));
    };

    if (adList.length === 0) {
        return null;
    }

    return (
        <section className="advertisement-section" style={{ padding: '3rem 1.5rem 4rem' }}>
            <div className="section-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div className="advertisement-header" style={{ marginBottom: 'clamp(2rem, 5vw, 4rem)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ color: '#36533f', fontSize: 'clamp(10px, 1.5vw, 11px)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>Limited Time Offers</span>
                    <h2 className="advertisement-title" style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: '700', color: '#1a1a1a', marginBottom: '1rem', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>Special Promotions</h2>
                    <div style={{ width: '60px', height: '2px', background: 'linear-gradient(to right, transparent, #36533f, transparent)' }}></div>
                </div>

                <div style={{ position: "relative", cursor: "pointer", overflow: "hidden", height: 'clamp(250px, 40vw, 400px)', borderRadius: '12px' }}>
                {adList.map((ad, idx) => (
                    <div
                        key={ad._id || idx}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            opacity: currentSlide === idx ? 1 : 0,
                            transition: "opacity 0.8s ease-in-out",
                            zIndex: currentSlide === idx ? 1 : 0,
                        }}
                    >
                        <img
                            src={`${IMAGE_BASE_URL}/${ad.image.path}`}
                            alt={`Advertisement ${idx + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                ))}

                {adList.length > 1 && (
                    <>
                        {/* Carousel Controls */}
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1rem', zIndex: 10 }}>
                            <button
                                onClick={prevSlide}
                                style={{ pointerEvents: 'auto', background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', transition: 'background 0.3s' }}
                            >
                                <ChevronLeft size={20} color="#36533f" />
                            </button>
                            <button
                                onClick={nextSlide}
                                style={{ pointerEvents: 'auto', background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', transition: 'background 0.3s' }}
                            >
                                <ChevronRight size={20} color="#36533f" />
                            </button>
                        </div>

                        {/* Carousel Indicators */}
                        <div style={{ position: 'absolute', bottom: '1rem', left: '0', width: '100%', display: 'flex', justifyContent: 'center', gap: '0.4rem', zIndex: 10 }}>
                            {adList.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => { e.stopPropagation(); setCurrentSlide(idx); }}
                                    style={{
                                        border: 'none',
                                        padding: 0,
                                        width: currentSlide === idx ? '24px' : '6px',
                                        height: '6px',
                                        borderRadius: '3px',
                                        backgroundColor: currentSlide === idx ? '#fff' : 'rgba(255,255,255,0.5)',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer'
                                    }}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    </section>
    );
}
