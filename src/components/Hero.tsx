"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import apiHome from "@/apiProvider/home.provider";
import { IMAGE_BASE_URL } from "@/lib/api-client";

export default function Hero() {
    const [bannerList, setBannerList] = useState<any[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const fetchBanners = async () => {
            const { status, response } = await apiHome.getBannerList();
            if (status) {
                setBannerList(response.data);
            }
        };
        fetchBanners();
    }, []);

    useEffect(() => {
        if (bannerList.length === 0) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % bannerList.length);
        }, 5000); 
        return () => clearInterval(timer);
    }, [bannerList.length]);

    const nextSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentSlide((prev) => (prev + 1) % bannerList.length);
    };

    const prevSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentSlide((prev) => (prev === 0 ? bannerList.length - 1 : prev - 1));
    };

    if (bannerList.length === 0) {
        return <div className="hero" style={{ height: 'clamp(300px, 40vw, 600px)', backgroundColor: '#f5f5f5' }}></div>;
    }

    return (
        <div className="hero" style={{ position: "relative", cursor: "pointer", overflow: "hidden" }}>
            {bannerList.map((banner, idx) => (
                <div 
                    key={banner.id} 
                    className="hero-media"
                    onClick={() => {
                        const targetUrl = banner.url || banner.link;
                        if (targetUrl) window.location.href = targetUrl;
                    }}
                    style={{
                        position: idx === 0 ? "relative" : "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: idx === 0 ? "auto" : "100%",
                        opacity: currentSlide === idx ? 1 : 0,
                        transition: "opacity 0.8s ease-in-out",
                        zIndex: currentSlide === idx ? 1 : 0,
                        cursor: (banner.url || banner.link) ? "pointer" : "default"
                    }}
                >
                    <img
                        src={`${IMAGE_BASE_URL}/${banner.image.path}`}
                        alt={banner.title}
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                        className="hero-image"
                    />
                </div>
            ))}
            
            {/* Carousel Controls */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 clamp(0.5rem, 2vw, 2rem)', zIndex: 10 }}>
                <button 
                    onClick={prevSlide}
                    style={{ pointerEvents: 'auto', background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', width: 'clamp(28px, 4vw, 40px)', height: 'clamp(28px, 4vw, 40px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', transition: 'background 0.3s' }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#fff'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.7)'}
                >
                    <ChevronLeft size={24} color="#36533f" style={{ width: 'clamp(16px, 2.5vw, 24px)', height: 'clamp(16px, 2.5vw, 24px)' }} />
                </button>
                <button 
                    onClick={nextSlide}
                    style={{ pointerEvents: 'auto', background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', width: 'clamp(28px, 4vw, 40px)', height: 'clamp(28px, 4vw, 40px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', transition: 'background 0.3s' }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#fff'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.7)'}
                >
                    <ChevronRight size={24} color="#36533f" style={{ width: 'clamp(16px, 2.5vw, 24px)', height: 'clamp(16px, 2.5vw, 24px)' }} />
                </button>
            </div>

            {/* Carousel Indicators */}
            <div style={{ position: 'absolute', bottom: 'clamp(0.5rem, 2vw, 2rem)', left: '0', width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', zIndex: 10 }}>
                {bannerList.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); setCurrentSlide(idx); }}
                        style={{
                            border: 'none',
                            padding: 0,
                            width: currentSlide === idx ? '30px' : '8px',
                            height: '8px',
                            borderRadius: '4px',
                            backgroundColor: currentSlide === idx ? '#fff' : 'rgba(255,255,255,0.5)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                        }}
                    />
                ))}
            </div>

            {/* SEO Text */}
            <div className="hero-content" style={{ display: "none" }}>
                <h1>Prrayasha Collections</h1>
                <h2>Discover the New Premium Collection</h2>
                <p>Elegance | Quality | Style</p>
                <p>New Arrivals - Shop Now</p>
                <span>www.prrayashacollections.com</span>
            </div>
        </div>
    );
}
