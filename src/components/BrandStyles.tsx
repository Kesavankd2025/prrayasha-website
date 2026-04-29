"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface StyleCardProps {
    image: string;
    name: string;
    price: string;
}

const StyleCard = ({ image, name, price }: StyleCardProps) => (
    <div className="brand-style-card">
        <div className="style-image-wrapper">
            <Image
                src={image}
                alt={name}
                fill
                style={{ objectFit: 'cover' }}
                className="style-img"
            />
            <div className="style-overlay">
                <button className="style-view-btn">View Details</button>
            </div>
        </div>
        <div className="style-info">
            <h4 className="style-name">{name}</h4>
            <p className="style-price">{price}</p>
            <a href="#" className="style-link">
                Explore <ArrowRight size={14} />
            </a>
        </div>
    </div>
);

export default function BrandStyles() {
    const styles = [
        { name: "Lime Green Ethnic Set", price: "₹1,499", image: "/images/style%201.jpg" },
        { name: "Teal Blue Floral Ensemble", price: "₹2,299", image: "/images/Style%202.jpg" },
        { name: "Ash Grey Printed Suit", price: "₹1,950", image: "/images/style%203.jpg" }
    ];

    return (
        <section className="brand-styles-section">
            <div className="section-container">
                <div className="brand-styles-header">
                    <h2 className="brand-styles-title">Prrayasha Styles</h2>
                    <div className="title-underline"></div>
                </div>

                <div className="brand-styles-grid">
                    {styles.map((style, index) => (
                        <StyleCard key={index} {...style} />
                    ))}
                </div>
            </div>
        </section>
    );
}

