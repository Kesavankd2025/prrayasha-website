"use client";

import { useState, useEffect, useRef } from "react";
import { ShoppingBag, User, Heart, Menu, X, Instagram, Facebook, Youtube } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { siteNav } from "@/lib/storefront-data";
import apiHome from "@/apiProvider/home.provider";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const pathname = usePathname();
    const { wishlistItems } = useWishlist();
    const { cartCount } = useCart();
    const { isLoggedIn } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mobileMenuOpen && navRef.current && !navRef.current.contains(event.target as Node)) {
                setMobileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [mobileMenuOpen]);

    useEffect(() => {
        const fetchCategories = async () => {
            const { status, response } = await apiHome.getCategoryList();
            if (status) {
                setCategories(response.data);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav ref={navRef} className={`navbar ${scrolled ? "scrolled" : ""}`}>

            <div className="logo-bar">
                <div className="logo-bar-inner">
                    <div className="logo-side-icons">
                        <a href="https://www.instagram.com/prrayashacollections/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="header-icon-link"><Instagram size={16} /></a>
                        <a href="https://www.facebook.com/people/Prrayasha-Collections/61554943980619/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="header-icon-link"><Facebook size={16} /></a>
                        <a href="https://www.youtube.com/@prrayashacollections" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="header-icon-link"><Youtube size={16} /></a>
                    </div>

                    <Link href="/" className="logo-container" style={{ width: 'auto', height: 'auto', display: 'flex', flexDirection: 'column' }}>
                        <span style={{
                            fontFamily: "var(--font-aclonica), 'Aclonica', sans-serif",
                            fontSize: 'clamp(9px, 2.5vw, 19px)',
                            fontWeight: '500',
                            color: '#ffffff',
                            letterSpacing: '0.05em',
                            lineHeight: '1.2',
                            whiteSpace: 'nowrap'
                        }}>
                            <span className="logo-highlight">P</span>RRAYASHA <span className="logo-highlight">C</span>OLLECTIONS
                        </span>
                    </Link>

                    <div className="logo-action-icons">
                        <Link href={isLoggedIn ? "/my-account" : "/login"} aria-label="Account" className="header-icon-link"><User size={16} /></Link>
                        <Link href="/wishlist" aria-label="Wishlist" className="header-icon-link" style={{ position: 'relative' }}>
                            <Heart size={16} />
                            {wishlistItems.length > 0 && (
                                <span className="icon-badge">{wishlistItems.length}</span>
                            )}
                        </Link>
                        <Link href="/cart" aria-label="Cart" className="header-icon-link" style={{ position: 'relative' }}>
                            <ShoppingBag size={16} />
                            {cartCount > 0 && (
                                <span className="icon-badge">{cartCount}</span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="navbar-container">
                <button
                    className="mobile-menu-btn"
                    type="button"
                    aria-label="Toggle navigation menu"
                    onClick={() => setMobileMenuOpen((prev) => !prev)}
                >
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                <div className={`nav-links ${mobileMenuOpen ? "open" : ""}`}>
                    {siteNav.map((item) => {
                        const active = item.href === '/'
                            ? pathname === '/'
                            : pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

                        return item.children ? (
                            <div key={item.label} className="nav-item nav-dropdown">
                                <button className="nav-link nav-link-button" type="button" style={{ color: active ? 'var(--gold)' : undefined }}>
                                    {item.label.toUpperCase()}
                                </button>
                                <div className="dropdown-menu">
                                    <Link href={item.href} className="dropdown-link" onClick={() => setMobileMenuOpen(false)}>
                                        Shop All
                                    </Link>
                                    {categories.map((category) => (
                                        <Link key={category.id} href={`/shop?categoryId=${category.id}`} className="dropdown-link" onClick={() => setMobileMenuOpen(false)}>
                                            {category.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <Link key={item.label} href={item.href} className="nav-link" style={{ color: active ? 'var(--gold)' : undefined }} onClick={() => setMobileMenuOpen(false)}>
                                {item.label.toUpperCase()}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
