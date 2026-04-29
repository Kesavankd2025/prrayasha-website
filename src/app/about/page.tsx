"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";
import Image from "next/image";
import { Sparkles, ShieldCheck, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: '#fff', color: '#1a1210' }}>
      <PageHero
        eyebrow="Our Story"
        title="Elevating Ethnic Elegance"
        description="Prrayasha is more than a boutique; it's a celebration of heritage, craftsmanship, and the modern woman's grace."
        titleClassName="about-hero-title"
      />

      <section className="store-page-section about-intro-section">
        <div className="section-container" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />

          <div style={{ marginTop: '2.5rem' }}>
            <h2 className="about-main-heading" style={{
              fontSize: '28px',
              fontFamily: 'var(--font-serif)',
              color: '#36533f',
              marginBottom: '1.5rem',
              lineHeight: '1.4'
            }}>
              A boutique house for festive dressing, heirloom silks, and elegant everyday celebration
            </h2>
            <p style={{ fontSize: '16px', color: '#555', lineHeight: '1.7', maxWidth: '800px', margin: '0 auto' }}>
              Prrayasha brings together rich fabrics, soft editorial styling, and a warm in-store sensibility so every visit feels considered from discovery to checkout. We believe that every garment tells a story of tradition reimagined for today.
            </p>
          </div>
        </div>
      </section>

      {/* Heritage Section */}
      <section style={{ padding: '4rem 5%', backgroundColor: '#fff' }}>
        <div className="heritage-section" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'stretch' }}>
          <div className="heritage-image-wrapper" style={{ flex: '1 1 500px', position: 'relative', minHeight: '500px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 40px rgba(0,0,0,0.08)' }}>
            <Image
              src="/images/RSM2625.jpeg"
              alt="Heritage Silk"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="heritage-text-wrapper" style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ color: 'var(--gold)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '11px', marginBottom: '0.75rem' }}>Our Heritage</p>
            <h2 className="about-section-heading" style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', marginBottom: '1.5rem', lineHeight: '1.2', color: '#36533f' }}>
              Prrayasha Collections - Clothing Mankind Since 2021
            </h2>
            <div style={{ fontSize: '15px', lineHeight: '1.8', color: '#555' }}>
              <p style={{ marginBottom: '1.2rem' }}>
                Founded in 2021, Prrayasha Collections pioneered Women’s clothing, evolving and innovating not only the product, but also the way it has been marketed over the years. Prrayasha Collections is a leading manufacturer and marketer of comfort and premium apparel sold in more than 30 States and Union Territories in India and also in few other countries.
              </p>
              <p>
                The company is committed to quality, comfort, fashion, innovation and value. As Prrayasha Collections grows and sophistication, the simple commitment to serve its consumer’s need for comfort continues to be the brand’s hallmark.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section style={{ padding: '4rem 5%', backgroundColor: '#36533f', color: '#fff' }}>
        <div className="section-container" style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="about-section-heading" style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', marginBottom: '0.75rem' }}>The Prrayasha Signature</h2>
            <div style={{ width: '50px', height: '2.5px', backgroundColor: 'var(--gold)', margin: '0 auto' }}></div>
          </div>

          <div className="values-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', padding: '2.5rem 2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', transition: 'all 0.3s ease' }} className="value-card">
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: 'var(--gold)' }}>
                <Sparkles size={28} />
              </div>
              <h3 className="about-card-heading" style={{ fontSize: '18px', fontWeight: '700', marginBottom: '0.8rem' }}>Curated Curation</h3>
              <p style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.6' }}>Every piece is handpicked to ensure it meets our standards of elegance and timeless style.</p>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', padding: '2.5rem 2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', transition: 'all 0.3s ease' }} className="value-card">
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: 'var(--gold)' }}>
                <ShieldCheck size={28} />
              </div>
              <h3 className="about-card-heading" style={{ fontSize: '18px', fontWeight: '700', marginBottom: '0.8rem' }}>Authentic Quality</h3>
              <p style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.6' }}>We source from heritage weavers to bring you authentic fabrics that last generations.</p>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', padding: '2.5rem 2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', transition: 'all 0.3s ease' }} className="value-card">
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: 'var(--gold)' }}>
                <Heart size={28} />
              </div>
              <h3 className="about-card-heading" style={{ fontSize: '18px', fontWeight: '700', marginBottom: '0.8rem' }}>Personal Connect</h3>
              <p style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.6' }}>Our service is built on warmth and personal guidance, mirroring a true boutique experience.</p>
            </div>
          </div>
        </div>

      </section>

      {/* Philosophy Section */}
      <section style={{ padding: '5rem 5%', textAlign: 'center', backgroundColor: '#fdfaf9' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 className="about-philosophy-heading" style={{ fontSize: '20px', fontStyle: 'italic', fontFamily: 'var(--font-cursive, serif)', color: 'var(--gold)', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>Our Philosophy</h2>
          <div style={{ position: 'relative', display: 'inline-block', padding: '1rem 0' }}>
            <span className="philosophy-quote-top" style={{ position: 'absolute', top: '-1rem', left: '0', fontSize: '80px', color: 'rgba(212, 175, 55, 0.1)', fontFamily: 'serif', lineHeight: '1', zIndex: 0 }}>&ldquo;</span>
            <p className="philosophy-text" style={{
              fontSize: '26px',
              fontFamily: 'var(--font-serif)',
              lineHeight: '1.6',
              color: '#36533f',
              fontWeight: '500',
              padding: '0 1rem',
              position: 'relative',
              zIndex: 1
            }}>
              To provide a calmer browsing flow for discovery, gifting, and festive shopping, where tradition and modern design live in perfect harmony.
            </p>
            <span className="philosophy-quote-bottom" style={{ position: 'absolute', bottom: '-2rem', right: '0', fontSize: '80px', color: 'rgba(212, 175, 55, 0.1)', fontFamily: 'serif', lineHeight: '1', zIndex: 0 }}>&rdquo;</span>
          </div>
        </div>
      </section>

      <style jsx>{`
        .value-card:hover {
          transform: translateY(-8px);
          background-color: rgba(255,255,255,0.07) !important;
          border-color: var(--gold) !important;
        }

        @media (max-width: 767px) {
          .heritage-section {
            flex-direction: column !important;
            gap: 2.5rem !important;
          }
          .heritage-image-wrapper {
            flex: 1 1 auto !important;
            min-height: 350px !important;
            width: 100% !important;
          }
          .heritage-text-wrapper {
            flex: 1 1 auto !important;
            width: 100% !important;
          }
          .values-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 320px) {
          .about-hero-title {
            font-size: 38px !important;
          }

          .about-main-heading {
            font-size: 24px !important;
          }

          .about-section-heading {
            font-size: 28px !important;
          }

          .about-card-heading {
            font-size: 14px !important;
          }

          .about-philosophy-heading {
            font-size: 16px !important;
          }

          .philosophy-text {
            font-size: 24px !important;
          }

          .philosophy-quote-top,
          .philosophy-quote-bottom {
            font-size: 60px !important;
          }
        }
      `}</style>
    </div>
  );
}
