"use client";

import Image from "next/image";

const collections = [
    { name: "CHIFFON COLLECTIONS", image: "/images/LAWS2601.jpeg" },
    { name: "2 PIECE KURTI SET", image: "/images/LAK2618.jpeg" },
    { name: "3 PIECE KURTI SET", image: "/images/LAWS2607.jpeg" },
    { name: "MAXI COLLECTIONS", image: "/images/RSM2602.jpeg" },
    { name: "LONG MAXI", image: "/images/LAK2610.jpeg" },
];

export default function FavouriteCollections() {
    return (
        <section className="saree-collections-section">
            <div className="section-container">
                <div className="saree-collections-header">
                    <h2 className="saree-collections-title text-center">Favourite Collections</h2>
                </div>

                <div className="saree-collections-grid">
                    {collections.map((collection, index) => (
                        <div key={index} className="saree-collection-card">
                            <Image
                                src={collection.image}
                                alt={collection.name}
                                fill
                                className="saree-collection-image"
                                sizes="(max-width: 767px) 50vw, (max-width: 1200px) 33vw, 20vw"
                                style={{ objectFit: "cover" }}
                            />
                            <div className="saree-collection-overlay" />
                            <h3 className="saree-collection-name">{collection.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
