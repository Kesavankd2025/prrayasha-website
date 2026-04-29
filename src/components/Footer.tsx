"use client";

import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ChevronsRight = ({ className, size }: { className?: string, size?: number }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size || 20} 
        height={size || 20} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <polyline points="13 17 18 12 13 7"></polyline>
        <polyline points="6 17 11 12 6 7"></polyline>
    </svg>
);

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-section">
            <div className="section-container">
                <div className="footer-grid">
                    {/* Brand Section */}
                    <div className="footer-brand">
                        <Link href="/" className="footer-logo-link">
                            <div className="logo-no-frame">
                                <Image
                                    src="/logo.jpg"
                                    alt="Prrayasha Logo"
                                    width={70}
                                    height={70}
                                    className="logo-img-clean"
                                />
                            </div>
                            <span className="brand-name-white">
                                PRRAYASHA COLLECTIONS
                            </span>
                        </Link>
                        <p className="brand-tagline-white">
                            Discover the essence of elegance with our premium handpicked ethnic collections.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-column quick-links-col">
                        <h4 className="column-title-white">Quick Links</h4>
                        <ul className="footer-list">
                            <li className="contact-item-white">
                                <Link href="/about" className="footer-link-group">
                                    <span className="footer-link-row">
                                        <ChevronsRight size={20} className="link-arrow" />
                                        <span className="footer-link-text">About Us</span>
                                    </span>
                                </Link>
                            </li>
                            <li className="contact-item-white">
                                <Link href="/cart" className="footer-link-group">
                                    <span className="footer-link-row">
                                        <ChevronsRight size={20} className="link-arrow" />
                                        <span className="footer-link-text">Cart</span>
                                    </span>
                                </Link>
                            </li>
                            <li className="contact-item-white">
                                <Link href="/shop" className="footer-link-group">
                                    <span className="footer-link-row">
                                        <ChevronsRight size={20} className="link-arrow" />
                                        <span className="footer-link-text">Shop Now</span>
                                    </span>
                                </Link>
                            </li>
                            <li className="contact-item-white">
                                <Link href="/contact" className="footer-link-group">
                                    <span className="footer-link-row">
                                        <ChevronsRight size={20} className="link-arrow" />
                                        <span className="footer-link-text">Contact Us</span>
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Support */}
                    <div className="footer-column">
                        <h4 className="column-title-white">Customer Support</h4>
                        <ul className="footer-list">
                            <li className="contact-item-white">
                                <Link href="/terms-conditions" className="footer-link-group">
                                    <span className="footer-link-row">
                                        <ChevronsRight size={20} className="link-arrow" />
                                        <span className="footer-link-text">Terms and Conditions</span>
                                    </span>
                                </Link>
                            </li >
                            <li className="contact-item-white">
                                <Link href="/privacy-policy" className="footer-link-group">
                                    <span className="footer-link-row">
                                        <ChevronsRight size={20} className="link-arrow" />
                                        <span className="footer-link-text">Privacy Policy</span>
                                    </span>
                                </Link>
                            </li>
                            <li className="contact-item-white">
                                <Link href="/reviews" className="footer-link-group">
                                    <span className="footer-link-row">
                                        <ChevronsRight size={20} className="link-arrow" />
                                        <span className="footer-link-text">Reviews</span>
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Information */}
                    <div className="footer-column">
                        <h4 className="column-title-white">Information</h4>
                        <ul className="footer-list contact-list-white">
                            <li className="contact-item-white">
                                <MapPin size={20} className="contact-icon-white contact-icon-location" />
                                <span>Provident Cosmo City, DR Abdul Kalam Road, Pudhupakkam Village, Chengalpet 603103</span>
                            </li>
                            <li className="contact-item-white">
                                <Phone size={20} className="contact-icon-white" />
                                <span>+91 91590 24967</span>
                            </li>
                            <li className="contact-item-white">
                                <Mail size={20} className="contact-icon-white" />
                                <span>prayashacollections@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom-slim">
                    <p className="copyright-white">
                        &copy; Prrayasha Collections {currentYear}. All Rights Reserved
                    </p>
                    <p className="developer-white">
                        Developed & maintained by <a href="https://www.oceansoftwares.com/" target="_blank" rel="noopener noreferrer">Ocean Softwares</a>
                    </p>
                </div>
            </div>

            <style jsx>{`   
                .footer-section {
                    background-color: #36533f;
                    color: #ffffff;
                    padding: 2.5rem 1.5rem 1rem;
                    overflow-x: clip;
                }
                .section-container {
                    max-width: 1440px;
                    margin: 0 auto;
                    width: 100%;
                }
                .footer-grid {
                    display: grid;
                    grid-template-columns: 1.5fr repeat(3, 1fr);
                    gap: 3rem;
                    margin-bottom: 2rem;
                    align-items: start;
                }
                .footer-column,
                .footer-brand {
                    min-width: 0;
                }
                .footer-column {
                    display: flex;
                    flex-direction: column;
                }
                
                .footer-brand {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .footer-logo-link {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    text-decoration: none;
                }
                .logo-no-frame {
                    width: 70px;
                    height: 70px;
                    overflow: hidden;
                }
                :global(.logo-img-clean) {
                    object-fit: contain !important;
                    background: transparent !important;
                }
                .brand-name-white {
                    font-family: var(--font-aclonica), 'Aclonica', sans-serif;
                    font-size: clamp(12px, 2vw, 15px);
                    font-weight: 500;
                    color: #ffffff;
                    letter-spacing: 0.05em;
                    line-height: 1.4;
                    text-transform: uppercase;
                }
                .brand-tagline-white {
                    font-size: clamp(10px, 1.5vw, 11.5px);
                    color: #ffffff;
                    line-height: 1.6;
                    max-width: 250px;
                    opacity: 0.9;
                }
                
                .quick-links-col {
                    margin-top: 0;
                }

                .footer-link-text {
                    display: block;
                    line-height: 1.35;
                    padding-top: 1px;
                }

                .footer-link-row {
                    display: grid;
                    grid-template-columns: 20px minmax(0, 1fr);
                    align-items: center;
                    column-gap: 0.75rem;
                    width: 100%;
                    max-width: 100%;
                }

                .column-title-white {
                    font-size: clamp(12px, 1.5vw + 2px, 14px);
                    font-weight: 800;
                    color: #ffffff;
                    margin-bottom: 1.25rem;
                    position: relative;
                    padding-bottom: 0.4rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .column-title-white::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 20px;
                    height: 2px;
                    background: #d4af37;
                }
                
                .footer-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 0.6rem;
                }
                .footer-list > li {
                    width: 100%;
                }
                .footer-link-group {
                    color: #ffffff;
                    font-size: 13.5px;
                    text-decoration: none;
                    transition: all 0.3s ease-in-out;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    width: 100%;
                    max-width: 100%;
                }
                :global(.link-arrow) {
                    color: #d4af37;
                    transition: transform 0.3s ease;
                    flex-shrink: 0;
                    width: 20px;
                    height: 20px;
                    min-width: 20px;
                    display: block;
                    margin-top: 0;
                    align-self: center;
                }
                .footer-link-group:hover,
                .footer-link-group:hover span,
                .footer-link-group:hover :global(svg),
                .footer-link-group:hover :global(*) {
                  color: #d4af37 !important;
                }

                .footer-link-group:hover {
                  transform: translateX(5px);
                }

                .contact-list-white {
                    gap: 1.25rem;
                }
                .contact-item-white {
                    display: flex;
                    gap: 1.15rem;
                    font-size: 12.5px;
                    color: #ffffff;
                    line-height: 1.5;
                    font-weight: 700;
                    letter-spacing: 0.03em;
                    transition: all 0.3s ease;
                    align-items: flex-start;
                }
                .contact-item-white > span {
                    display: block;
                    padding-top: 2px;
                }
                .contact-item-white:hover {
                    color: #d4af37;
                }
                .contact-item-white:hover :global(svg) {
                  color: #d4af37 !important;
                }
                
                :global(.contact-icon-white) {
                  color: #ffffff !important;
                  flex-shrink: 0;
                  width: 20px !important;
                  height: 20px !important;
                  min-width: 20px !important;
                  margin-top: 2px;
                }
                :global(.contact-icon-location) {
                  width: 20px !important;
                  height: 20px !important;
                  min-width: 20px !important;
                  margin-top: 2px;
                }

                .footer-bottom-slim {
                    padding-top: 1.25rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .copyright-white {
                    font-size: 10px;
                    color: #ffffff;
                    opacity: 0.6;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }
                .developer-white {
                    font-size: 10px;
                    color: #ffffff;
                    opacity: 0.6;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }
                .developer-white a {
                    color: #d4af37;
                    text-decoration: none;
                    font-weight: 700;
                    transition: all 0.3s ease;
                }
                .developer-white a:hover {
                    opacity: 0.8;
                    text-decoration: underline;
                }

                @media (max-width: 1024px) {
                    .footer-grid {
                        grid-template-columns: 1fr 1fr;
                        gap: 2.5rem 2rem;
                    }
                    .quick-links-col {
                        margin-top: 0;
                    }
                    .brand-tagline-white {
                        font-size: 13.5px;
                    }
                }
                @media (max-width: 640px) {
                    .footer-grid {
                        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
                        gap: 2rem 1rem;
                    }
                    .footer-brand {
                        grid-column: span 2;
                    }
                    .quick-links-col {
                        margin-top: 0;
                    }
                    .footer-column:last-child {
                        grid-column: span 2;
                    }
                    .footer-section {
                        padding: 2.5rem 1rem 1rem;
                    }
                    .footer-bottom-slim {
                        flex-direction: column;
                        gap: 8px;
                        text-align: center;
                    }
                    .brand-name-white {
                        font-size: 14px;
                    }
                    .brand-tagline-white {
                        font-size: 12px;
                        max-width: 100%;
                    }
                }
                @media (max-width: 380px) {
                    .footer-grid {
                        gap: 2rem 0.875rem;
                    }
                    .footer-link-group {
                        font-size: 10px;
                        white-space: normal;
                    }
                    .column-title-white {
                        font-size: 10px;
                        white-space: normal;
                    }
                    .footer-link-row {
                        grid-template-columns: 18px minmax(0, 1fr);
                        align-items: center;
                        column-gap: 8px;
                    }
                    .footer-link-text {
                        white-space: normal;
                        overflow-wrap: anywhere;
                    }
                    :global(.link-arrow) {
                        width: 18px;
                        height: 18px;
                        min-width: 18px;
                    }
                }
                @media (max-width: 320px) {
                    .footer-section {
                        padding: 2.5rem 0.875rem 1rem;
                    }
                    .footer-grid {
                        gap: 2rem 0.75rem;
                        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
                    }
                    .quick-links-col {
                        margin-top: 0;
                    }
                    .brand-name-white {
                        font-size: 12px;
                    }
                    .brand-tagline-white {
                        font-size: 10px;
                    }
                    .column-title-white {
                        font-size: 10px;
                    }
                    .footer-link-group {
                        font-size: 8px;
                    }
                    .contact-item-white {
                        font-size: 10.5px;
                    }
                    .contact-list-white {
                        gap: 1rem;
                    }
                    .contact-item-white {
                        gap: 0.75rem;
                        align-items: flex-start;
                    }
                    .contact-item-white > span {
                        padding-top: 1px;
                    }
                    .contact-icon-white,
                    .contact-icon-location {
                        width: 16px;
                        height: 16px;
                        min-width: 16px;
                        min-height: 16px;
                        margin-top: 1px;
                    }
                    .copyright-white {
                        font-size: 8px;
                        display: block;
                        width: 100%;
                        text-align: center;
                        letter-spacing: 0.04em;
                        white-space: normal;
                        max-width: 100%;
                        overflow-wrap: anywhere;
                    }
                    .developer-white {
                        font-size: 8px;
                        width: 100%;
                        text-align: center;
                        white-space: normal;
                        overflow-wrap: anywhere;
                    }
                    .developer-white a {
                        font-size: 8px;
                    }
                }
            `}</style>
        </footer>
    );
}

