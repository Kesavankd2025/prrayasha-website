"use client";

import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import apiHome from "@/apiProvider/home.provider";

interface TestimonialHeaderProps {
    label: string;
    title: string;
}

const SectionHeader = ({ label, title }: TestimonialHeaderProps) => (
    <div style={{ marginBottom: 'clamp(2rem, 5vw, 4rem)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ color: 'var(--gold)', fontSize: 'clamp(10px, 1.5vw, 11px)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>{label}</span>
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: '700', color: '#fff', marginBottom: '1rem', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>{title}</h2>
        <div style={{ width: '60px', height: '2px', background: 'linear-gradient(to right, transparent, var(--gold), transparent)' }}></div>
    </div>
);

interface Review {
    text: string;
    author: string;
    detail: string;
    rating: number;
}

export default function Testimonials() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    const fetchTestimonials = async () => {
        try {
            const res = await apiHome.getTestimonialList();
            if (res.status && res.response && res.response.data) {
                const mappedReviews = res.response.data.map((item: any) => ({
                    text: item.message,
                    author: item.clientName,
                    detail: item.title || "Happy Client",
                    rating: item.rating || 5
                }));
                setReviews(mappedReviews);
            }
        } catch (error) {
            console.error("Error fetching testimonials:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const nextSlide = useCallback(() => {
        if (reviews.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % reviews.length);
        }
    }, [reviews.length]);

    const prevSlide = () => {
        if (reviews.length > 0) {
            setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
        }
    };

    useEffect(() => {
        if (reviews.length > 1) {
            const interval = setInterval(nextSlide, 5000);
            return () => clearInterval(interval);
        }
    }, [nextSlide, reviews.length]);

    if (loading) {
        return null; // Or a skeleton loader
    }

    if (reviews.length === 0) {
        return null; // Don't show the section if there are no testimonials
    }

    return (
        <section className="testimonials-section">
            <div className="testimonials-bg-layer" aria-hidden="true"></div>
            <div className="section-container">
                <SectionHeader
                    label="Our Community"
                    title="What Our Clients Say"
                />

                <div className="testimonial-slider-container">
                    <button className="slider-nav prev" onClick={prevSlide}>
                        <ChevronLeft size={24} />
                    </button>

                    <div className="testimonial-slide">
                        <div className="testimonial-card slider-card">
                            <Quote className="quote-icon" size={40} />
                            <p className="testimonial-text slider-text">
                                {reviews[currentIndex].text}
                            </p>
                            <div className="testimonial-author">
                                <h4 className="author-name" style={{ color: '#1a1a1a' }}>{reviews[currentIndex].author}</h4>
                                <div className="stars author-stars">
                                    {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            size={16} 
                                            fill={i < reviews[currentIndex].rating ? "#d4af37" : "transparent"} 
                                            color="#d4af37" 
                                        />
                                    ))}
                                </div>
                                <p className="author-info" style={{ color: '#888' }}>{reviews[currentIndex].detail}</p>
                            </div>
                        </div>
                    </div>

                    <button className="slider-nav next" onClick={nextSlide}>
                        <ChevronRight size={24} />
                    </button>

                    {reviews.length > 1 && (
                        <div className="slider-dots">
                            {reviews.map((_, index) => (
                                <button
                                    key={index}
                                    className={`dot ${index === currentIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentIndex(index)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
