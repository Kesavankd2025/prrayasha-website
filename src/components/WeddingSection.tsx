"use client";

import Image from "next/image";

export default function WeddingSection() {
    return (
        <section className="wedding-section" style={{ height: 'auto', minHeight: '400px' }}>
            <div className="wedding-bg">
                <Image
                    src="/images/image.png"
                    alt="Special Collection Banner"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                />
            </div>

            {/* 
        We keep the interactive container but it's now transparent 
        to allow the text in the image to be the primary focus,
        while keeping SEO and accessibility.
      */}
            <div className="wedding-content" style={{ opacity: 0 }}>
                <div className="wedding-container">
                    <div className="wedding-text-box">
                        <h2 className="wedding-title">SPECIAL COLLECTION</h2>
                        <p className="wedding-description">
                            Get our best seller products only in our online and offline store<br />
                            www.prrayashacollections.com
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
