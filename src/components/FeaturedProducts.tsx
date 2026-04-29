"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const products = [
    {
        id: 1,
        name: "Raw Silk Maxi RSM2614",
        price: "₹899.00",
        image: "/images/RSM2615.jpeg",
        category: "New Arrivals",
    },
    {
        id: 2,
        name: "Elegant 3 Piece Kurti Set",
        price: "₹1299.00",
        image: "/images/LAK2614.jpeg",
        category: "Kurti Collection",
    },
    {
        id: 3,
        name: "Classic Silk Maxi RSM2613",
        price: "₹899.00",
        image: "/images/RSM2625.jpeg",
        category: "Maxi Collections",
    },
    {
        id: 4,
        name: "Signature 2 Piece Chiffon Set",
        price: "₹1099.00",
        image: "/images/Chiffon%20with%20Shawl.jpg",
        category: "Chiffon Collections",
    },
];

export default function FeaturedProducts() {
    return (
        <section className="py-24 bg-[#1a1210] relative z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col md:flex-row justify-between flex-end md:items-end mb-16"
                >
                    <div>
                        <h2 className="text-[#d4af37] text-sm uppercase tracking-[0.3em] font-sans mb-4">
                            Curated Just For You
                        </h2>
                        <h3 className="text-4xl md:text-5xl font-heading font-light text-white uppercase tracking-wider">
                            Favourite Collections
                        </h3>
                    </div>
                    <a href="#" className="mt-8 md:mt-0 uppercase tracking-widest text-[#d4af37] text-sm hover:text-white transition-colors border-b border-[#d4af37]/30 hover:border-white pb-1">
                        View All Arrivals
                    </a>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                    {products.map((product, i) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15, duration: 0.7 }}
                            className="group cursor-pointer"
                        >
                            <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-[#111]">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-[2000ms] group-hover:scale-105 opacity-80 group-hover:opacity-100"
                                />

                                {/* Overlay Add to cart */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <span className="border border-[#d4af37] text-[#d4af37] px-6 py-3 uppercase tracking-widest text-xs hover:bg-[#d4af37] hover:text-black transition-colors">
                                        Quick View
                                    </span>
                                </div>
                            </div>

                            <div className="text-center px-2">
                                <span className="text-gray-500 text-[10px] uppercase tracking-widest mb-2 block font-sans">
                                    {product.category}
                                </span>
                                <h4 className="text-white font-heading text-lg font-light tracking-wide mb-3 group-hover:text-[#d4af37] transition-colors">
                                    {product.name}
                                </h4>
                                <div className="w-12 h-[1px] bg-white/20 mx-auto mb-3 group-hover:bg-[#d4af37]/50 transition-colors" />
                                <p className="text-[#d4af37] font-sans text-sm tracking-wider">
                                    {product.price}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}



