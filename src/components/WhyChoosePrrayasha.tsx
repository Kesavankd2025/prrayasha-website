"use client";

import { Heart, Truck, ShieldCheck, PackagePlus } from "lucide-react";

const items = [
    {
        icon: Heart,
        title: "Handpicked Collections",
        description: "Curated ethnic styles chosen for comfort and elegance."
    },
    {
        icon: Truck,
        title: "Free Shipping",
        description: "Free delivery on eligible orders across India."
    },
    {
        icon: ShieldCheck,
        title: "100% Secure Checkout",
        description: "Trusted payment options with safe transactions."
    },
    {
        icon: PackagePlus,
        title: "10,000+ Happy Orders",
        description: "Loved by customers for quality and value."
    }
];

export default function WhyChoosePrrayasha() {
    return (
        <section className="why-prrayasha-section">
            <div className="section-container">
                <div className="why-prrayasha-grid">
                    {items.map((item) => {
                        const Icon = item.icon;
                        return (
                            <article key={item.title} className="why-prrayasha-card">
                                <div className="why-prrayasha-icon-wrap">
                                    <Icon size={44} strokeWidth={2.1} />
                                </div>
                                <h3 className="why-prrayasha-title">{item.title}</h3>
                                <p className="why-prrayasha-text">{item.description}</p>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
