"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Lock, ChevronLeft, Tag, ShoppingBag, X } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";
import { IMAGE_BASE_URL } from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import apiCart from "@/apiProvider/cart.provider";
import apiCoupon from "@/apiProvider/coupon.provider";
import { useCart } from "@/context/CartContext";

import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const { cartItems, fetchCart, loading } = useCart();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  useEffect(() => {
    const savedCode = localStorage.getItem("applied_coupon_code");
    if (savedCode) setCouponCodeInput(savedCode);
  }, []);

  const handleUpdateQty = async (id: string, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;

    try {
      const res = await apiCart.updateQty(id, newQty);
      if (res.status) {
        showToast(res.response.message || "Quantity updated", "success");
        await fetchCart();
      }
    } catch (error: any) {
      console.error("Update qty error:", error);
      // Backend returns message in res.data.message
      const msg = error.response?.data?.message || error.message || "Error updating quantity";
      showToast(msg, "error");
    }
  };

  const handleRemove = async (id: string) => {
    try {
      const { status, response } = await apiCart.remove(id);
      if (status) {
        showToast(response.message || "Item removed from cart", "success");
        await fetchCart(); // Updates global context
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to remove item";
      showToast(msg, "error");
    }
  };

  const handleClearCart = async () => {
    const userId = user?._id || user?.id;

    if (!userId) return;

    try {
      const { status, response } = await apiCart.clear(userId);
      if (status) {
        showToast(response.message || "Cart cleared successfully", "success");
        await fetchCart(); // Updates global context
        setShowClearConfirm(false);
      } else {
        showToast("Failed to clear cart", "error");
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Error clearing cart";
      showToast(msg, "error");
    }
  };

  const handleValidateCoupon = async () => {
    if (!couponCodeInput.trim()) {
      showToast("Please enter a coupon code", "info");
      return;
    }

    const payload = {
      code: couponCodeInput,
      subTotal: subtotal,
      customerId: user?._id || user?.id,
      cartItems: validItems.map(item => ({
        productId: item.product?._id || item.productId,
        categoryId: item.product?.categoryId,
        price: getItemPrice(item),
        quantity: item.qty
      }))
    };

    const res = await apiCoupon.validate(payload);
    if (res.status) {
      setAppliedCoupon(res.response.data);
      localStorage.setItem("applied_coupon_code", couponCodeInput);
      showToast(res.response.message || "Coupon applied!", "success");
    } else {
      const msg = (res as any).error?.response?.data?.message || "Invalid coupon code";
      showToast(msg, "error");
      setAppliedCoupon(null);
    }
  };

  const proceedToCheckout = () => {
    router.push("/checkout");
  };

  const getItemImage = (item: any) => {
    const matchingAttr = item.product?.attributes?.find((attr: any) => {
      if (!item.combination || !attr.combination) return false;
      return item.combination.every((ic: any) =>
        attr.combination.some((pc: any) =>
          pc.attributeId?.toString() === ic.attributeId?.toString() &&
          pc.valueId?.toString() === ic.valueId?.toString()
        )
      );
    });
    const path = matchingAttr?.images?.[0]?.path || item.product?.image?.path || item.product?.image;
    if (!path) return "/images/placeholder.jpg";
    if (path.startsWith("http")) return path;
    return `${IMAGE_BASE_URL}/${path}`;
  };

  const getItemPrice = (item: any) => {
    const matchingAttr = item.product?.attributes?.find((attr: any) => {
      if (!item.combination || !attr.combination) return false;
      return item.combination.every((ic: any) =>
        attr.combination.some((pc: any) =>
          pc.attributeId?.toString() === ic.attributeId?.toString() &&
          pc.valueId?.toString() === ic.valueId?.toString()
        )
      );
    });
    return matchingAttr?.price || item.product?.price || 0;
  };

  const getItemStock = (item: any): number => {
    const matchingAttr = item.product?.attributes?.find((attr: any) => {
      if (!item.combination || !attr.combination) return false;
      return item.combination.every((ic: any) =>
        attr.combination.some((pc: any) =>
          pc.attributeId?.toString() === ic.attributeId?.toString() &&
          pc.valueId?.toString() === ic.valueId?.toString()
        )
      );
    });
    return matchingAttr?.stock ?? 0;
  };

  const isItemOutOfStock = (item: any): boolean => {
    return getItemStock(item) <= 0;
  };

  const outOfStockItems = cartItems.filter(item => isItemOutOfStock(item));
  const validItems = cartItems.filter(item => !isItemOutOfStock(item));

  const subtotal = validItems.reduce((sum, item) => {
    return sum + (getItemPrice(item) * item.qty);
  }, 0);

  const couponApplied = appliedCoupon?.discountAmount || 0;
  const total = subtotal - couponApplied;

  const revalidateCoupon = useCallback(async (currentSubtotal: number, currentValidItems: any[]) => {
    const savedCode = localStorage.getItem("applied_coupon_code");
    if (!savedCode || currentSubtotal === 0 || currentValidItems.length === 0) return;

    const res = await apiCoupon.validate({
      code: savedCode,
      subTotal: currentSubtotal,
      customerId: user?._id || user?.id,
      cartItems: currentValidItems.map(item => {
        const matchingAttr = item.product?.attributes?.find((attr: any) => {
          if (!item.combination || !attr.combination) return false;
          return item.combination.every((ic: any) =>
            attr.combination.some((pc: any) =>
              pc.attributeId?.toString() === ic.attributeId?.toString() &&
              pc.valueId?.toString() === ic.valueId?.toString()
            )
          );
        });
        return {
          productId: item.product?._id || item.productId,
          categoryId: item.product?.categoryId,
          price: matchingAttr?.price || item.product?.price || 0,
          quantity: item.qty
        };
      })
    });

    if (res.status) {
      setAppliedCoupon(res.response.data);
    } else {
      setAppliedCoupon(null);
      localStorage.removeItem("applied_coupon_code");
      const msg = (res as any).error?.response?.data?.message || "Coupon is no longer valid for this cart";
      showToast(msg, "error");
    }
  }, [user, showToast]);

  useEffect(() => {
    if (subtotal > 0 && validItems.length > 0) {
      revalidateCoupon(subtotal, validItems);
    }
  }, [subtotal]);

  return (
    <div className="cart-modern-container">
      <main className="cart-content-shell">
        <div className="cart-flex-layout">
          {/* Left: Items Section */}
          <div className="cart-items-column">
            <div className="cart-items-card shadow-premium">
              <h1 className="cart-section-title">Your Items</h1>

              {loading ? (
                <div className="cart-loading" style={{ width: '100%' }}>Curating your collection...</div>
              ) : cartItems.length > 0 ? (
                <div className="cart-items-stack">
                  {cartItems.map((item) => {
                    const outOfStock = isItemOutOfStock(item);
                    return (
                      <div key={item._id} className={`cart-item-row ${outOfStock ? 'out-of-stock-row' : ''}`}>
                        <div className="cart-item-info">
                          <div className="cart-item-img" style={{ opacity: outOfStock ? 0.5 : 1 }}>
                            <img src={getItemImage(item)} alt={item.product?.name} />
                          </div>
                          <div className="cart-item-details">
                            <h3 className="cart-item-name">{item.product?.name}</h3>
                            <p className="cart-item-variant">
                              Variant: {item.combination?.map((c: any) => c.value).join(" | ")}
                            </p>
                            {outOfStock ? (
                              <p style={{ fontSize: '12px', color: '#e53e3e', fontWeight: '700', marginTop: '4px' }}>
                                ⚠ Out of Stock — Removed from total
                              </p>
                            ) : (
                              <p className="cart-item-price">₹{getItemPrice(item).toLocaleString("en-IN")}</p>
                            )}
                          </div>
                        </div>

                        <div className="cart-item-actions">
                          <div className="quantity-tool" style={{ opacity: outOfStock ? 0.4 : 1 }}>
                            <button
                              onClick={() => !outOfStock && handleUpdateQty(item._id, item.qty, -1)}
                              disabled={item.qty <= 1 || outOfStock}
                            >−</button>
                            <span>{item.qty}</span>
                            <button
                              onClick={() => !outOfStock && handleUpdateQty(item._id, item.qty, 1)}
                              disabled={outOfStock}
                            >+</button>
                          </div>
                          <button className="remove-item-btn" onClick={() => handleRemove(item._id)}>
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="cart-empty-msg">
                  <div className="empty-visual">
                    <ShoppingBag size={70} strokeWidth={0.8} />
                  </div>
                  <h2 className="empty-title">Your Boutique Bag is Empty</h2>
                  <p className="empty-subtitle">
                    Discover our curated collection of signature saris and boutique pieces that reflect your unique grace.
                  </p>
                  <Link href="/shop" className="explore-btn-premium">
                    Explore Collection
                  </Link>
                </div>
              )}
            </div>

            {!loading && cartItems.length > 0 && (
              <div className="cart-bottom-links">
                <Link href="/shop" className="continue-shopping">
                  <ChevronLeft size={18} /> Continue Shopping
                </Link>
                <button className="clear-all-btn" onClick={() => setShowClearConfirm(true)}>
                  Clear all items
                </button>
              </div>
            )}
          </div>

          {/* Right: Order Summary Section */}
          {!loading && cartItems.length > 0 && (
            <div className="cart-summary-column">
              <div className="cart-summary-card shadow-premium">
                <h2 className="summary-title">Order Summary</h2>

                {outOfStockItems.length > 0 && (
                  <div style={{
                    padding: '12px',
                    background: '#fff5f5',
                    border: '1px solid #fed7d7',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    fontSize: '12px',
                    color: '#c53030',
                    fontWeight: '600'
                  }}>
                    ⚠ {outOfStockItems.length} item(s) out of stock — excluded from total
                  </div>
                )}

                <div className="coupon-container">
                  <div className="coupon-input-group">
                    <input
                      type="text"
                      placeholder="ENTER COUPON CODE"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                    />
                    <button className="apply-coupon-btn" onClick={handleValidateCoupon}>APPLY</button>
                  </div>
                  {appliedCoupon && (
                    <div className="applied-tag">
                      <span>Code <strong>{appliedCoupon.code}</strong> applied!</span>
                      <button onClick={() => {
                        setAppliedCoupon(null);
                        setCouponCodeInput("");
                        localStorage.removeItem("applied_coupon_code");
                      }} className="remove-tag">Remove</button>
                    </div>
                  )}
                </div>

                <div className="summary-rows">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  {couponApplied > 0 ? (
                    <div className="summary-row" style={{ color: '#48bb78', fontWeight: '700' }}>
                      <span>Coupon Discount</span>
                      <span style={{ background: '#f0fff4', padding: '2px 8px', borderRadius: '4px' }}>−₹{couponApplied.toLocaleString("en-IN")}</span>
                    </div>
                  ) : (
                    <div className="summary-row" style={{ opacity: 0.5 }}>
                      <span>Coupon Discount</span>
                      <span>₹0</span>
                    </div>
                  )}
                </div>

                <div className="summary-total-row">
                  <span>Total Payment</span>
                  <span className="total-val-large">₹{total.toLocaleString("en-IN")}</span>
                </div>

                <p className="shipping-note">Shipping & taxes calculated at checkout.</p>

                <div className="checkout-btn-wrap">
                  <button
                    onClick={proceedToCheckout}
                    className="secure-checkout-btn"
                  >
                    SECURE CHECKOUT
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {showClearConfirm && (
          <div className="modal-backdrop">
            <div className="boutique-modal">
              <div className="modal-icon-wrap">
                <ShoppingBag size={40} strokeWidth={1.5} />
              </div>
              <h3>Clear Shopping Bag?</h3>
              <p className="modal-desc">
                Are you sure you want to remove all items from your boutique cart? This action cannot be undone.
              </p>
              <div className="modal-actions">
                <button className="cancel-pill" onClick={() => setShowClearConfirm(false)}>
                  Cancel
                </button>
                <button className="clear-confirm-btn" onClick={handleClearCart}>
                  Yes, Clear Bag
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .cart-modern-container {
          background-color: #fdfaf9;
          min-height: 100vh;
          padding: 2rem 0;
          color: #1a1210;
        }

        .cart-content-shell {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .cart-flex-layout {
          display: flex;
          gap: 3rem;
          align-items: flex-start;
        }

        .cart-items-column {
          flex: 1;
        }

        .cart-summary-column {
          width: 450px;
          position: sticky;
          top: 130px;
        }

        /* Card Styles */
        .shadow-premium {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(0, 0, 0, 0.02);
          overflow: hidden;
        }

        .cart-items-card {
          padding: 1.5rem 2rem;
        }

        .cart-summary-card {
          padding: 3rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          background-color: #ffffff !important;
          border: 1px solid #f2ece8;
        }

        .cart-section-title {
          font-family: var(--font-serif);
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 0.75rem;
        }

        .summary-title {
          font-family: var(--font-serif);
          font-size: 26px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 0.5rem;
        }

        /* Item Row Styles */
        .cart-items-stack {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .cart-item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          transition: all 0.3s ease;
          margin-bottom: 0.25rem;
        }

        .cart-item-row:hover {
          background-color: #fdf2f2;
          transform: translateX(8px);
        }

        .cart-item-row:last-child {
          border-bottom: none;
        }

        .cart-item-info {
          display: flex;
          gap: 1.25rem;
          align-items: center;
        }

        .cart-item-img {
          width: 75px;
          height: 95px;
          border-radius: 10px;
          overflow: hidden;
          background: #fdfaf9;
        }

        .cart-item-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cart-item-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .cart-item-name {
          font-size: 17px;
          font-weight: 700;
          color: #1a1210;
        }

        .cart-item-variant {
          font-size: 11px;
          color: #9c9c9c;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        .cart-item-price {
          font-size: 17px;
          font-weight: 700;
          margin-top: 4px;
        }

        /* Actions */
        .cart-item-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .quantity-tool {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #fdf2f2;
          width: 110px;
          padding: 8px 14px;
          border-radius: 100px;
          gap: 12px;
        }

        .quantity-tool button {
          border: none;
          background: none;
          font-size: 18px;
          color: #1a1210;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0 4px;
        }

        .quantity-tool span {
          font-weight: 800;
          font-size: 15px;
        }

        .remove-item-btn {
          color: #ff5e7b;
          background: none;
          border: none;
          cursor: pointer;
          opacity: 0.6;
          transition: 0.2s;
        }

        .remove-item-btn:hover {
          opacity: 1;
        }

        /* Summary Sections */
        .coupon-container {
          padding: 1.5rem;
          border: 1.5px dashed #36533f44;
          border-radius: 12px;
          margin-bottom: 0.5rem;
        }

        .coupon-input-group {
          display: flex;
          gap: 12px;
          background: #fff;
        }

        .coupon-input-group input {
          flex: 1;
          border: none;
          font-size: 16px;
          font-weight: 700;
          color: #1a1210;
          outline: none;
          letter-spacing: 0.05em;
        }

        .apply-coupon-btn {
          background: #1a1210;
          color: white;
          border-radius: 8px;
          padding: 10px 22px;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.05em;
          border: none;
          cursor: pointer;
          transition: 0.2s;
        }

        .apply-coupon-btn:hover {
          background: #36533f;
        }

        .applied-tag {
          margin-top: 1rem;
          padding: 8px 12px;
          background: #f0fff4;
          border: 1px solid #c6f6d5;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #2f855a;
        }

        .remove-tag {
          background: none;
          border: none;
          color: #c53030;
          font-weight: 700;
          cursor: pointer;
          font-weight: 600;
        }
        
        .out-of-stock-row {
          background: #fff5f5 !important;
          border: 1px solid #fed7d7;
          border-radius: 12px;
        }

        .summary-rows {
          padding: 0.5rem 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: #6d6d6d;
          font-weight: 500;
          margin-bottom: 0.6rem;
        }

        .summary-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.6rem;
          font-size: 19px;
          font-weight: 700;
        }

        .total-val-large {
          font-size: 24px;
          color: #36533f;
        }

        .shipping-note {
          font-size: 11px;
          color: #9c9c9c;
          text-align: center;
          font-style: italic;
          margin-bottom: 0.25rem;
        }

        .secure-checkout-btn {
          display: flex !important;
          width: 100%;
          align-items: center;
          justify-content: center;
          background-color: #36533f !important;
          color: #ffffff !important;
          height: 60px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 14px;
          letter-spacing: 0.12em;
          text-align: center;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px rgba(54, 83, 63, 0.2);
          border: none;
          cursor: pointer;
        }

        .secure-checkout-btn:hover {
          background: #2a4132;
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(54, 83, 63, 0.3);
          color: #ffffff;
        }

        .checkout-btn-wrap {
          margin-top: 1.5rem;
          display: flex;
          justify-content: center;
        }

        .cart-bottom-links {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2rem;
          padding: 0 1rem;
        }

        .continue-shopping {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #666;
          transition: 0.2s;
        }

        .continue-shopping:hover {
          color: #36533f;
        }

        .clear-all-btn {
          font-size: 13px;
          font-weight: 700;
          color: #666;
          background: none;
          border: none;
          cursor: pointer;
        }

        .clear-all-btn:hover {
          color: #1a1210;
        }

        .cart-loading {
          text-align: center;
          padding: 5rem 0;
          color: #888;
        }

        /* Modal Styles */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(26, 18, 16, 0.45);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 1.5rem;
          animation: fadeIn 0.3s ease;
        }

        .boutique-modal {
          background: #fff;
          padding: 3rem;
          border-radius: 32px;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 40px 100px rgba(0,0,0,0.15);
          text-align: center;
          animation: slideUp 0.5s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .modal-icon-wrap {
          width: 80px;
          height: 80px;
          background: #fdf2f2;
          color: #36533f;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }

        .boutique-modal h3 {
          font-family: var(--font-serif);
          font-size: 26px;
          color: #1a1210;
          margin-bottom: 0.75rem;
        }

        .modal-desc {
          font-size: 14px;
          color: #888;
          line-height: 1.6;
          margin-bottom: 2.5rem;
        }

        .modal-actions {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2.5rem;
        }

        .cancel-pill {
          background: none;
          border: none;
          color: #888;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .cancel-pill:hover {
          color: #1a1210;
        }

        .clear-confirm-btn {
          background: #36533f;
          color: #fff;
          padding: 1rem 2.5rem;
          border-radius: 14px;
          font-weight: 700;
          font-size: 15px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 20px rgba(54, 83, 63, 0.2);
        }

        .clear-confirm-btn:hover {
          background: #2a4132;
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(54, 83, 63, 0.3);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .cart-empty-msg {
          text-align: center;
          padding: 6rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          min-height: 550px;
        }

        .empty-visual {
          color: #36533f;
          opacity: 0.15;
          margin-bottom: 1rem;
          animation: floatItem 3s ease-in-out infinite;
        }

        @keyframes floatItem {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        .empty-title {
          font-family: var(--font-serif);
          font-size: 26px;
          color: #1a1210;
          font-weight: 700;
          margin: 0;
        }

        .empty-subtitle {
          font-size: 15px;
          color: #888;
          max-width: 450px;
          line-height: 1.6;
          margin: -0.5rem 0 1rem 0;
        }

        .explore-btn-premium {
          background: #36533f;
          color: #fff;
          padding: 1.1rem 2.75rem;
          border-radius: 14px;
          font-weight: 700;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px rgba(54, 83, 63, 0.2);
        }

        .explore-btn-premium:hover {
          background: #2a4132;
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(54, 83, 63, 0.3);
          color: #fff;
        }

        .browse-link {
          color: #36533f;
          font-weight: 800;
          text-decoration: underline;
        }

        @media (max-width: 1024px) {
          .cart-content-shell {
            padding: 0 1.5rem;
          }
          .cart-summary-column {
            width: 320px;
          }
          .cart-flex-layout {
            gap: 1.5rem;
          }
          .cart-items-card {
            padding: 1.25rem 1.5rem;
          }
          .cart-summary-card {
            padding: 2rem;
          }
          .cart-section-title {
            font-size: 24px;
          }
          .summary-title {
            font-size: 22px;
          }
          .cart-item-row {
            padding: 0.9rem 0.75rem;
          }
          .cart-item-info {
            gap: 1rem;
          }
          .cart-item-img {
            width: 68px;
            height: 88px;
          }
          .cart-item-name {
            font-size: 15px;
          }
          .cart-item-price {
            font-size: 15px;
          }
          .cart-item-actions {
            gap: 0.9rem;
          }
          .quantity-tool {
            width: 96px;
            padding: 7px 10px;
          }
          .secure-checkout-btn {
            height: 54px;
            font-size: 13px;
            letter-spacing: 0.08em;
          }
        }

        @media (max-width: 850px) {
          .cart-content-shell {
            padding: 0 1.25rem;
          }
          .cart-flex-layout {
            flex-direction: column;
            align-items: stretch;
            gap: 1.5rem;
          }
          .cart-items-column,
          .cart-summary-column {
            width: 100%;
            position: static;
          }
          .cart-items-card,
          .cart-summary-card {
            padding: 1.5rem;
          }
          .cart-summary-card {
            gap: 1.25rem;
          }
          .cart-bottom-links {
            padding: 0;
          }
          .cart-item-row {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
            padding: 0.9rem 0.75rem;
          }
          .cart-item-info {
            width: auto;
            gap: 1rem;
            align-items: center;
          }
          .cart-item-actions {
            width: auto;
            justify-content: flex-end;
            margin-top: 0;
          }
        }

        @media (max-width: 767px) {
          .cart-flex-layout {
            flex-direction: column;
            align-items: stretch;
          }
          .cart-items-column,
          .cart-summary-column {
            width: 100%;
            position: static;
          }
        }

        @media (max-width: 991px) {
          .cart-item-info {
            gap: 0.75rem;
          }
          .cart-item-img {
            width: 65px;
            height: 85px;
          }
          .cart-item-name {
            font-size: 15px;
          }
          .cart-item-price {
            font-size: 15px;
          }
          .quantity-tool {
            width: 95px;
            padding: 6px 10px;
          }
          .cart-item-actions {
            gap: 1rem;
          }
        }

        @media (max-width: 767px) {
          .cart-content-shell {
            padding: 0 1.5rem;
          }
          .cart-summary-card {
            padding: 2rem;
          }
        }

        @media (max-width: 640px) {
          .cart-content-shell {
            padding: 0 1rem;
          }
          .cart-flex-layout {
            gap: 1.5rem;
          }
          .cart-items-card {
            padding: 1rem;
          }
          .cart-summary-card {
            padding: 1.5rem;
          }
          .cart-item-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
            padding: 1rem 0.5rem;
          }
          .cart-item-info {
            width: 100%;
            gap: 1rem;
          }
          .cart-item-actions {
            width: 100%;
            justify-content: space-between;
            margin-top: 0.5rem;
          }
          .cart-bottom-links {
            flex-direction: column;
            gap: 1.5rem;
            align-items: center;
          }
          .coupon-input-group {
            flex-direction: column;
            gap: 0.5rem;
          }
          .apply-coupon-btn {
            width: 100%;
          }
        }

        @media (max-width: 320px) {
          .cart-content-shell {
            padding: 0 0.5rem;
          }
          .cart-items-card, .cart-summary-card {
            padding: 1rem;
          }
          .cart-item-img {
            width: 60px;
            height: 80px;
          }
          .cart-item-name {
            font-size: 14px;
          }
          .quantity-tool {
            width: 90px;
            padding: 6px 10px;
          }
          .quantity-tool button, .quantity-tool span {
            font-size: 14px;
          }
          .summary-total-row {
            font-size: 16px;
          }
          .total-val-large {
            font-size: 20px;
          }
          .secure-checkout-btn {
            height: 50px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}
