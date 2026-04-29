"use client";

import { motion } from "framer-motion";

export default function BannerHeading() {
    return (
        <section className="py-20 bg-[#1a1210] overflow-hidden flex flex-col items-center text-center px-4">
            <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="w-full max-w-4xl h-[2px] bg-white mb-16 origin-center"
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="space-y-4 mb-12"
            >
                <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold font-playfair tracking-tighter text-white uppercase leading-none">
                    Raw Silk
                </h2>
                <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold font-playfair tracking-tighter text-white uppercase leading-none">
                    Long Maxi
                </h2>
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="max-w-md text-gray-400 text-lg md:text-xl font-light leading-relaxed font-sans"
            >
                Fashion is very important. It is life-enhancing and, like everything that gives pleasure, it is worth doing well.
            </motion.p>
        </section>
    );
}
