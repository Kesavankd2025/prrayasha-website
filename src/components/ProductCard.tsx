"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IMAGE_BASE_URL } from "@/lib/api-client";
import { Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import apiCart from "@/apiProvider/cart.provider";

import type { Product } from "@/lib/storefront-data";

export default function ProductCard({ product, combination: favoriteCombination }: { product: any, combination?: any[] }) {
  const { user, isLoggedIn } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { fetchCart } = useCart();
  const { showToast } = useToast();
  const router = useRouter();

  if (!product) return null;

  // Find the matching attribute if a specific combination is provided (e.g. from Wishlist)
  const activeAttr = favoriteCombination
    ? product.attributes?.find((attr: any) =>
      attr.combination?.every((ac: any) =>
        favoriteCombination.some((fc: any) =>
          fc.attributeId === ac.attributeId && fc.valueId === ac.valueId
        )
      )
    ) || product.attributes?.[0]
    : product.attributes?.[0];

  const displayImage = activeAttr?.images?.[0]?.path
    ? `${IMAGE_BASE_URL}/${activeAttr.images[0].path}`
    : (product.image?.path
      ? `${IMAGE_BASE_URL}/${product.image.path}`
      : (typeof product.image === 'string'
        ? (product.image.startsWith('http') || product.image.startsWith('/') ? product.image : `${IMAGE_BASE_URL}/${product.image}`)
        : ''));

  const displayPrice = (activeAttr?.price || product.price) || 0;
  const displayRegularPrice = activeAttr?.mrp || product.regularPrice;
  const displayCategory = product.category?.name || product.category;

  const currentCombination = favoriteCombination || activeAttr?.combination?.map((c: any) => ({
    attributeId: c.attributeId,
    valueId: c.valueId,
    value: c.value
  }));

  const { active: isWishlisted } = isInWishlist(product._id || product.id, currentCombination);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    await toggleWishlist(product, currentCombination);
  };

  const variantQuery = favoriteCombination 
    ? (currentCombination || []).map((c: any) => c.valueId).filter(Boolean).join(',') 
    : '';

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/product/${product.slug}${variantQuery ? `?v=${variantQuery}` : ''}`);
  };

  return (
    <article className="store-product-card" style={{ position: 'relative', borderRadius: '15px', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Heart Icon Top Right */}
      <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 30 }}>
        <button
          title="Add to Wishlist"
          onClick={handleWishlistToggle}
          style={{
            background: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: 'clamp(28px, 8vw, 36px)',
            height: 'clamp(28px, 8vw, 36px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            color: isWishlisted ? '#e53e3e' : '#1a1a1a',
            transition: 'all 0.3s ease'
          }}
        >
          <Heart size={16} fill={isWishlisted ? "#e53e3e" : "none"} />
        </button>
      </div>

      <div 
        onClick={() => router.push(`/product/${product.slug}${variantQuery ? `?v=${variantQuery}` : ''}`)}
        className="store-product-card-link" 
        style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
      >
        <div className="store-product-media" style={{ position: 'relative', display: 'block', aspectRatio: '3/4', overflow: 'hidden' }}>
          {displayImage && (
            <img
              src={displayImage}
              alt={product.name}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
            />
          )}
          {/* View Product Button (Hover logic in globals.css) */}
          <div className="view-product-btn">
            VIEW PRODUCT
          </div>
          <span className="store-product-shine" />
        </div>
        <div className="store-product-copy" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, textAlign: 'center', padding: 'clamp(0.75rem, 2vw, 1.25rem) clamp(0.5rem, 1.5vw, 1rem)' }}>
          <p className="store-product-category" style={{ margin: '0 0 0.4rem 0', fontWeight: '700', fontSize: 'clamp(8px, 1vw, 10px)', letterSpacing: '0.12em', color: '#36533f', textTransform: 'uppercase' }}>{displayCategory}</p>
          <h3 style={{ margin: '0 0 0.8rem 0', fontSize: 'clamp(12px, 1.5vw + 8px, 16px)', fontWeight: '500', color: '#1a1a1a', letterSpacing: '0.01em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {product.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', width: '100%', marginTop: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <strong style={{ fontSize: 'clamp(13px, 2vw + 10px, 18px)', color: '#36533f', fontWeight: '700' }}>₹{displayPrice?.toLocaleString("en-IN")}</strong>
              {displayRegularPrice > displayPrice ? (
                <span style={{ fontSize: 'clamp(9px, 1.2vw + 6px, 12px)', color: '#888', textDecoration: 'line-through' }}>₹{displayRegularPrice.toLocaleString("en-IN")}</span>
              ) : null}
            </div>
            {/* Buy Now Button (Styles in globals.css) */}
            <button
              className="buy-now-btn"
              onClick={handleBuyNow}
            >
              BUY NOW
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
