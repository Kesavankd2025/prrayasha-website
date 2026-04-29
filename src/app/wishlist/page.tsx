"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import { useWishlist } from "@/context/WishlistContext";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function WishlistPage() {
  const { wishlistItems, fetchWishlist } = useWishlist();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return (
    <div className="wishlist-page-root">
      <Navbar />

      <main>
        <PageHero
          eyebrow="Curated for You"
          title="Signature Favourites"
          description="Handpicked pieces from the Prrayasha House, saved for your next boutique experience."
        />

        <div className="wishlist-container">
          <div className="breadcrumb-wrap">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "My Wishlist", href: "/wishlist" }]} />
          </div>

          <div className="wishlist-flow">
            {!isLoggedIn ? (
              <div className="empty-wishlist">
                <div className="empty-icon-wrap">
                  <Heart size={64} strokeWidth={1} />
                </div>
                <h3>Secure Your Selection</h3>
                <p>Please sign in to view and manage your boutique wishlist.</p>
                <Link href="/login" className="continue-btn">
                  Sign In Now
                </Link>
              </div>
            ) : wishlistItems.length > 0 ? (
              <div className="wishlist-grid">
                {wishlistItems.map((item, index) => (
                  <div key={item._id || item.id || `wish-${index}`} className="wish-card-wrap">
                    <ProductCard product={item.product} combination={item.combination} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-wishlist">
                <div className="empty-icon-wrap">
                  <Heart size={64} strokeWidth={1} />
                </div>
                <h3>Your Wishbook is Empty</h3>
                <p>Seems like you haven't saved any boutique treasures yet.</p>
                <Link href="/shop" className="continue-btn">
                  Explore Collection
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* <Footer /> */}

      <style jsx>{`
        .wishlist-page-root {
          background: #fdfaf9;
          min-height: 100vh;
        }

        .wishlist-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }

        .breadcrumb-wrap {
          margin-bottom: 3rem;
        }

        .wishlist-flow {
          padding-bottom: 5rem;
        }

        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2.5rem;
        }

        .wish-card-wrap {
          animation: slideUpFade 0.7s ease-out forwards;
        }

        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Empty State */
        .empty-wishlist {
          text-align: center;
          padding: 6rem 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          background: #fff;
          border-radius: 32px;
          border: 1.5px solid #f2ece8;
          max-width: 600px;
          margin: 0 auto;
        }

        .empty-icon-wrap {
          color: #eee;
          margin-bottom: 1rem;
        }

        .empty-wishlist h3 {
          font-family: var(--font-playfair), serif;
          font-size: 28px;
          color: #1a1210;
          margin: 0;
        }

        .empty-wishlist p {
          color: #888;
          font-size: 16px;
          max-width: 400px;
          margin: 0 0 1.5rem;
          line-height: 1.6;
        }

        .continue-btn {
          background: #36533f;
          color: #fff;
          padding: 1.1rem 3rem;
          border-radius: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s;
          box-shadow: 0 10px 20px rgba(54, 83, 63, 0.1);
          font-size: 15px;
        }

        .continue-btn:hover {
          background: #2a4132;
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(54, 83, 63, 0.2);
        }

        @media (max-width: 1024px) {
          .wishlist-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
          }
          .wishlist-container {
            padding: 1rem;
          }
        }

        @media (max-width: 767px) {
          .wishlist-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 500px) {
          .wishlist-grid {
            gap: 0.75rem;
          }
          .empty-wishlist {
            padding: 4rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
