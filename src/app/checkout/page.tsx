"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock, ShoppingBag, Minus, Plus, ShieldCheck, MapPin, Truck, ChevronLeft, PlusCircle, Edit2, Trash2, Home, Briefcase, MapPinned, X, Phone, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import { IMAGE_BASE_URL } from "@/lib/api-client";
import apiAddress from "@/apiProvider/address.provider";
import apiOrder from "@/apiProvider/order.provider";
import apiCart from "@/apiProvider/cart.provider";
import apiShipping from "@/apiProvider/shipping.provider";
import apiCoupon from "@/apiProvider/coupon.provider";
import { INDIAN_STATES } from "@/constants/states";
import AddressModal from "@/components/AddressModal";
import ConfirmModal from "@/components/ConfirmModal";
import OrderSuccessModal from "@/components/OrderSuccessModal";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const { cartItems, fetchCart } = useCart();
  const { showToast } = useToast();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [isAddrLoading, setIsAddrLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'PHONEPE'>('PHONEPE');
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [addrToDelete, setAddrToDelete] = useState<string | null>(null);
  const [shippingCharge, setShippingCharge] = useState(0);
  const [shippingDiscount, setShippingDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccessDetails, setOrderSuccessDetails] = useState<any>(null);

  const fetchAddresses = useCallback(async () => {
    setIsAddrLoading(true);
    const res = await apiAddress.list();
    if (res.status) {
      setAddresses(res.response?.data || []);
    }
    setIsAddrLoading(false);
  }, []);

  useEffect(() => {
    if (isLoggedIn) fetchAddresses();
    fetchCart();

  }, [isLoggedIn, fetchAddresses, fetchCart]);

  // Auto-select logic when addresses list changes
  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      const defaultAddr = addresses.find((a: any) => a.isDefault);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr._id || defaultAddr.id);
      } else {
        setSelectedAddressId(addresses[0]._id || addresses[0].id);
      }
    }
  }, [addresses, selectedAddressId]);

  // Handle phonepe redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const orderIdParam = params.get("orderId");

    if (status === "success" && orderIdParam) {
      // Fetch order details
      apiOrder.getById(orderIdParam).then(res => {
        if (res.status && res.response?.data) {
          setOrderSuccessDetails(res.response.data);
          // clear url
          window.history.replaceState({}, document.title, window.location.pathname);
          fetchCart();
        } else if (res.status && res.response) {
          setOrderSuccessDetails(res.response);
          window.history.replaceState({}, document.title, window.location.pathname);
          fetchCart();
        }
      });
    } else if (status === "failed") {
      showToast("Payment failed. Please try again.", "error");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const getPrice = (item: any) => {
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

  const subtotal = validItems.reduce((acc, item) => {
    return acc + (getPrice(item) * item.qty);
  }, 0);

  // Auto revalidate coupon on checkout
  useEffect(() => {
    const savedCode = localStorage.getItem("applied_coupon_code");
    if (!savedCode || subtotal === 0) return;

    const revalidate = async () => {
      const currentValidItems = cartItems.filter(item => {
        const matchingAttr = item.product?.attributes?.find((attr: any) => {
          if (!item.combination || !attr.combination) return false;
          return item.combination.every((ic: any) =>
            attr.combination.some((pc: any) =>
              pc.attributeId?.toString() === ic.attributeId?.toString() &&
              pc.valueId?.toString() === ic.valueId?.toString()
            )
          );
        });
        return (matchingAttr?.stock ?? 0) > 0;
      });

      if (currentValidItems.length === 0) return;

      const res = await apiCoupon.validate({
        code: savedCode,
        subTotal: subtotal,
        customerId: user?._id || user?.id,
        cartItems: currentValidItems.map(item => ({
          productId: item.product?._id || item.productId,
          categoryId: item.product?.categoryId,
          price: getPrice(item),
          quantity: item.qty
        }))
      });

      if (res.status) {
        setAppliedCoupon(res.response.data);
      } else {
        setAppliedCoupon(null);
        localStorage.removeItem("applied_coupon_code");
        const msg = (res as any).error?.response?.data?.message || "Coupon is no longer valid for this cart";
        showToast(msg, "error");
      }
    };

    revalidate();
  }, [subtotal]);

  // Calculate Shipping based on state and amount
  useEffect(() => {
    const fetchShipping = async () => {
      if (selectedAddressId && subtotal > 0) {
        const selectedAddr = addresses.find(a => (a._id || a.id) === selectedAddressId);
        if (selectedAddr?.state) {
          const res = await apiShipping.calculate({
            state: selectedAddr.state,
            totalAmount: subtotal
          });
          if (res.status) {
            setShippingCharge(res.response?.data?.shippingCharge || 0);
            setShippingDiscount(res.response?.data?.discount || 0);
          }
        }
      }
    };
    fetchShipping();
  }, [selectedAddressId, subtotal, addresses]);

  const couponDiscount = appliedCoupon?.discountAmount || 0;
  const total = subtotal + shippingCharge - shippingDiscount - couponDiscount;

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
  const handleOpenAddModal = () => {
    setEditingAddressId(null);
    setShowAddAddressModal(true);
  };

  const handleEditAddress = (addr: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAddressId(addr._id || addr.id);
    setShowAddAddressModal(true);
  };

  const handleSetDefault = async (id: string) => {
    const res = await apiAddress.setDefault(id);
    if (res.status) {
      setSelectedAddressId(id);
      fetchAddresses();
    }
  };

  const handleDeleteAddress = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setAddrToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!addrToDelete) return;
    const res = await apiAddress.remove(addrToDelete);
    if (res.status) {
      showToast(res.response?.message || "Address deleted", "success");
      fetchAddresses();
      if (selectedAddressId === addrToDelete) setSelectedAddressId(null);
    } else {
      const errorMsg = (res as any).error?.response?.data?.message || "Failed to delete address";
      showToast(errorMsg, "error");
    }
    setAddrToDelete(null);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert("Please select a delivery address.");
      return;
    }

    if (validItems.length === 0) {
      showToast("All items are out of stock. Please update your cart.", "error");
      return;
    }

    setIsPlacingOrder(true);
    const selectedAddr = addresses.find(a => (a._id || a.id) === selectedAddressId);

    const orderData = {
      userId: user?._id || (user as any)?.id,
      products: validItems.map(item => {
        const matchingAttr = item.product?.attributes?.find((attr: any) => {
          if (!item.combination || !attr.combination) return false;
          return item.combination.every((ic: any) =>
            attr.combination.some((ac: any) =>
              ac.valueId === ic.valueId && ac.attributeId === ic.attributeId
            )
          );
        });

        const price = matchingAttr ? matchingAttr.price : (item.product?.price || 0);
        const mrp = matchingAttr ? matchingAttr.mrp : price;

        return {
          productId: item.product?._id || item.productId,
          productName: item.product?.name,
          sku: matchingAttr?.sku || item.product?.sku || "N/A",
          combination: item.combination?.map((c: any) => ({
            attributeId: c.attributeId,
            valueId: c.valueId,
            value: c.value
          })) || [],
          mrp: mrp,
          price: price,
          qty: item.qty as number,
          total: price * (item.qty as number),
          image: {
            path: getItemImage(item).replace(`${IMAGE_BASE_URL}/`, "")
          }
        };
      }),
      totalAmount: subtotal,
      taxAmount: 0,
      shippingCharge: shippingCharge,
      couponCode: appliedCoupon?.code || "",
      couponDiscount: couponDiscount,
      shippingDiscount: shippingDiscount,
      grandTotal: total,
      paymentMethod: paymentMethod.toUpperCase(),
      paymentStatus: "Pending",
      // shippingMethodId: "standard_01",
      deliveryAddressId: selectedAddressId,
      address: {
        name: selectedAddr.name,
        companyName: selectedAddr.companyName,
        email: selectedAddr.email,
        phone: selectedAddr.phone,
        doorNo: selectedAddr.doorNo,
        street: selectedAddr.street,
        landmark: selectedAddr.landmark,
        city: selectedAddr.city,
        state: selectedAddr.state,
        pincode: selectedAddr.pincode
      }
    };

    const res: any = await apiOrder.create(orderData);
    if (res.status) {
      if (paymentMethod === 'PHONEPE' && res.response?.data?.payUrl || res.response?.payUrl) {
        window.location.href = res.response.data.payUrl || res.response?.payUrl;
        return;
      }

      await fetchCart();
      localStorage.removeItem("applied_coupon");
      localStorage.removeItem("applied_coupon_code");
      setOrderSuccessDetails(res.response?.order || res.response?.data || { invoiceId: "Processing..." });
      // router.push("/my-orders"); // Removed redirect to show modal
    } else {
      const errorMsg = res.error?.response?.data?.message || "Failed to place order";
      showToast(errorMsg, "error");
    }
    setIsPlacingOrder(false);
  };

  const getLabelIcon = (label: string) => {
    const l = label?.toLowerCase();
    if (l?.includes('billing') || l === 'home') return <Home size={16} />;
    if (l?.includes('shipping') || l === 'work' || l === 'office') return <Briefcase size={16} />;
    return <MapPinned size={16} />;
  };

  return (
    <div className={`checkout-page-root ${showAddAddressModal ? "no-scroll" : ""}`}>

      {/* Navbar is automatically provided by RootLayout */}

      <main className="checkout-main">
        <div className="checkout-shell">
          <div className="checkout-header">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shopping Bag", href: "/cart" }, { label: "Checkout" }]} />
            <h1 className="checkout-title">Checkout Information</h1>
          </div>

          <div className="checkout-grid">
            {/* Left: Address Selection */}
            <div className="checkout-left">
              <div className="section-head-row">
                <div className="head-label">
                  <MapPin size={20} />
                  <h2>Select Delivery Address</h2>
                </div>
                <button className="add-address-pill" onClick={() => handleOpenAddModal()}>
                  <PlusCircle size={16} />
                  <span>Add New Address</span>
                </button>
              </div>

              <div className="address-selection-grid">
                {isAddrLoading ? (
                  <div className="loading-box" style={{ textAlign: 'center', width: '100%', padding: '2rem' }}>Loading addresses...</div>
                ) : addresses.length > 0 ? (
                  addresses.map((addr) => (
                    <div
                      key={addr._id || addr.id}
                      className={`address-select-card ${selectedAddressId === (addr._id || addr.id) ? 'is-selected' : ''}`}
                      onClick={() => setSelectedAddressId(addr._id || addr.id)}
                    >
                      <div className="addr-card-top">
                        <div className="addr-tag">
                          {getLabelIcon(addr.label)}
                          <span>{addr.label}</span>
                        </div>
                        <div className="addr-right-group">
                          <div className="addr-actions">
                            <button onClick={(e) => handleEditAddress(addr, e)} className="mini-action"><Edit2 size={14} /></button>
                            <button onClick={(e) => handleDeleteAddress(e, addr._id || addr.id)} className="mini-action del"><Trash2 size={14} /></button>
                          </div>
                          <div className="select-indicator">
                            <div className="indicator-dot"></div>
                          </div>
                        </div>
                      </div>
                      <div className="addr-details">
                        <div className="recipient-row">
                          <h4 className="rec-name">{addr.name}</h4>
                          {addr.companyName && <span className="rec-company">({addr.companyName})</span>}
                          <span className="rec-phone">
                            <Phone size={12} strokeWidth={2.5} />
                            {addr.phone}
                          </span>
                        </div>
                        <p className="addr-street">{addr.doorNo}, {addr.street}</p>
                        {addr.landmark && <p className="addr-landmark">Landmark: {addr.landmark}</p>}
                        <p className="addr-locale">{addr.city}, {addr.state} - {addr.pincode}</p>
                        <p className="addr-email">{addr.email}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-addresses">
                    <MapPin size={40} strokeWidth={1} style={{ opacity: 0.2 }} />
                    <p>No addresses found. Click to add one.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Summary & Payment */}
            <aside className="checkout-right">
              <div className="right-stack sticky-container">

                <div className="checkout-sidebar-card shadow-premium">
                  {/* Order Summary */}
                  <div className="sidebar-section">
                    <h3 className="card-title">Order Summary</h3>
                    <div className="mini-items-list">
                      {validItems.map((item) => (
                        <div key={item._id} className="mini-item">
                          <div className="mini-img">
                            <img src={getItemImage(item)} alt={item.product?.name} />
                          </div>
                          <div className="mini-info">
                            <p className="mini-name">{item.product?.name}</p>
                            <p className="mini-qty">Qty: {item.qty}</p>
                          </div>
                          <p className="mini-price">
                            ₹{(item.qty as number * getPrice(item)).toLocaleString("en-IN")}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="summary-table">
                      <div className="summary-tr">
                        <div className="summary-td label">Sub total</div>
                        <div className="summary-td value">₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                      </div>
                      <div className="summary-tr">
                        <div className="summary-td label">Shipping Charges</div>
                        <div className="summary-td value">₹{shippingCharge.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                      </div>
                      <div className="summary-tr">
                        <div className="summary-td label">Discount Amount</div>
                        <div className="summary-td value">₹{shippingDiscount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                      </div>
                      <div className="summary-tr">
                        <div className="summary-td label">Coupon Applied</div>
                        <div className="summary-td value">₹{couponDiscount.toLocaleString("en-IN")}</div>
                      </div>
                      <div className="summary-tr total-row">
                        <div className="summary-td label">Total</div>
                        <div className="summary-td value">₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                      </div>
                    </div>
                  </div>



                  {/* Payment Method */}
                  <div className="sidebar-section">
                    <h3 className="card-title">Payment</h3>
                    <p className="pay-subtitle" style={{ fontSize: '13px', color: '#666', marginBottom: '1rem' }}>All transactions are secure and encrypted.</p>
                    <div className="pay-options">
                      <label className={`pay-option ${paymentMethod === 'PHONEPE' ? 'active' : ''}`} style={{ border: '1px solid #ddd', padding: '1.2rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'PHONEPE'}
                          onChange={() => setPaymentMethod('PHONEPE')}
                          style={{ marginTop: '5px' }}
                        />
                        <div className="pay-content" style={{ width: '100%' }}>
                          <div className="pay-main" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRight: '1px solid #ccc', paddingRight: '1rem' }}>
                              <div style={{ background: '#5f259f', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                                पे
                              </div>
                              <span style={{ fontSize: '20px', fontWeight: 700, color: '#5f259f' }}>PhonePe</span>
                            </div>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#36533f' }}>Cards, UPI, Wallets, Paypal, Netbanking</span>
                          </div>

                          <div className="pay-cards" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{ background: '#fff', border: '1px solid #eee', padding: '2px 6px', borderRadius: '4px' }}>
                              <span style={{ color: '#1434CB', fontWeight: 800, fontSize: '12px', fontStyle: 'italic' }}>VISA</span>
                            </div>
                            <div style={{ background: '#fff', border: '1px solid #eee', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EB001B', position: 'relative', left: '2px', zIndex: 1 }}></div>
                              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F79E1B', position: 'relative', right: '2px' }}></div>
                              <span style={{ fontSize: '8px', marginLeft: '2px', fontWeight: 'bold' }}>MasterCard</span>
                            </div>
                            <div style={{ background: '#2671B9', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>
                              AMEX
                            </div>
                            <div style={{ color: '#005596', border: '1px solid #eee', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', fontStyle: 'italic' }}>
                              RuPay
                            </div>
                            <span style={{ fontSize: '12px', color: '#888', marginLeft: '0.5rem' }}>and more...</span>
                          </div>
                        </div>
                      </label>
                    </div>

                    <div className="checkout-policy-agreement">
                      <label className="checkbox-wrap">
                        <input type="checkbox" required defaultChecked />
                        <span className="check-text">
                          I have read and agree to the website <Link href="/terms-conditions" className="gold-link">Terms and Conditions</Link> & <Link href="/privacy-policy" className="gold-link">Privacy Policy</Link> *
                        </span>
                      </label>
                    </div>

                    <button className="place-order-btn" onClick={handlePlaceOrder} disabled={isPlacingOrder}>
                      {isPlacingOrder ? (
                        <span>PLACING ORDER...</span>
                      ) : (
                        <>
                          <Lock size={18} />
                          <span>CONFIRM & PLACE ORDER</span>
                        </>
                      )}
                    </button>

                    <p className="security-note">
                      Secure 256-bit SSL encrypted transaction
                    </p>
                  </div>
                </div>

              </div>
            </aside>
          </div>
        </div>
      </main>

      <AddressModal
        isOpen={showAddAddressModal}
        onClose={() => setShowAddAddressModal(false)}
        onSuccess={fetchAddresses}
        addressId={editingAddressId}
        initialData={addresses.find(a => (a._id || a.id) === editingAddressId)}
      />

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Address?"
        message="Are you sure you want to remove this delivery destination? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Keep it"
        isDanger={true}
      />

      <OrderSuccessModal
        isOpen={!!orderSuccessDetails}
        orderInfo={orderSuccessDetails}
      />

      {/* Footer is provided by RootLayout */}

      <style jsx>{`
        .checkout-page-root {
          background-color: #fdfaf9;
          min-height: 100vh;
        }

        .checkout-page-root.no-scroll {
          height: 100vh;
          overflow: hidden;
        }

        .checkout-main {
          padding: 2rem 0 6rem;
        }

        .checkout-shell {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .checkout-header {
          margin-bottom: 4rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .checkout-title {
          font-family: var(--font-serif);
          font-size: 42px;
          color: #36533f;
          margin-top: 1rem;
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .checkout-grid {
          display: grid;
          grid-template-columns: 1fr 500px;
          gap: 4rem;
          align-items: flex-start;
        }

        .checkout-left,
        .checkout-right {
          min-width: 0;
        }

        .checkout-sidebar-card {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .sidebar-section + .sidebar-section {
          padding-top: 2rem;
          border-top: 1px solid #f2ece8;
        }

        .loading-box {
          background: #fff;
          border: 1.5px dashed #f2ece8;
          border-radius: 24px;
          color: #888;
          font-weight: 600;
        }

        /* Left Side: Address */
        .section-head-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
          padding-bottom: 1.25rem;
          border-bottom: 1.5px solid #f2ece8;
        }

        .head-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #36533f;
        }

        .head-label h2 {
          font-size: 22px;
          font-weight: 700;
          margin: 0;
        }

        .add-address-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #fff;
          border: 1.5px solid #36533f;
          color: #36533f;
          padding: 0.65rem 1.4rem;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .add-address-pill:hover {
          background: #36533f;
          color: #fff;
          transform: translateY(-1px);
        }

        .address-selection-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        .address-select-card {
          background: #fff;
          border: 1.5px solid #f2ece8;
          border-radius: 15px;
          padding: 1.5rem 1.75rem;
          position: relative;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .address-select-card:hover {
          border-color: #36533f44;
          box-shadow: 0 10px 25px rgba(0,0,0,0.02);
        }

        .address-select-card.is-selected {
          border-color: #36533f;
          background: #fffaff;
          box-shadow: 0 15px 35px rgba(54, 83, 63, 0.06);
        }

        .empty-addresses {
          padding: 6rem 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #fff;
          border-radius: 32px;
          border: 1.5px dashed #f2ece8;
          color: #999;
          gap: 1.25rem;
          width: 100%;
        }

        .addr-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .recipient-row {
          display: flex;
          align-items: baseline;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .rec-name {
          font-family: var(--font-playfair), serif;
          font-size: 18px;
          color: #1a1210;
          margin: 0;
          font-weight: 700;
        }

        .rec-phone {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 13px;
          color: #888;
          font-weight: 500;
        }

        .addr-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #fdf2f2;
          color: #36533f;
          font-size: 10px;
          font-weight: 800;
          padding: 0.35rem 0.8rem;
          border-radius: 6px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .addr-actions {
          display: flex;
          gap: 1rem;
        }

        .addr-right-group {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-left: auto;
        }

        .mini-action {
          background: #fdfaf9;
          border: 1px solid #f2ece8;
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ccc;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mini-action:hover { border-color: #36533f; color: #36533f; }
        .mini-action.del:hover { border-color: #d94e63; color: #d94e63; }

        .addr-user {
          font-size: 15px;
          color: #1a1210;
          margin: 0 0 0.5rem 0;
          display: block;
        }

        .recipient-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.6rem;
          flex-wrap: wrap;
        }

        .rec-name {
          margin: 0;
          font-size: 16px;
          color: #1a1210;
          font-weight: 700;
        }

        .rec-company {
          font-size: 12px;
          color: #666;
          font-weight: 500;
          background: #f5f5f5;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .rec-phone {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #36533f;
          font-weight: 700;
          background: #e8f0eb;
          padding: 2px 10px;
          border-radius: 100px;
        }

        .addr-street {
          font-family: var(--font-serif);
          font-size: 17px;
          color: #1a1210;
          margin: 0 0 0.6rem 0;
          line-height: 1.5;
          font-weight: 600;
        }

        .addr-locale {
          font-size: 13px;
          color: #888;
          margin: 0;
          letter-spacing: 0.3px;
        }

        .addr-landmark {
          font-size: 12px;
          color: #36533f;
          margin: 0.3rem 0;
          font-weight: 700;
        }

        .addr-email {
          font-size: 11px;
          color: #aaa;
          margin-top: 0.5rem;
          font-weight: 500;
        }

        .select-indicator {
          width: 22px;
          height: 22px;
          border: 2px solid #eee;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .is-selected .select-indicator {
          border-color: #36533f;
        }

        .indicator-dot {
          width: 12px;
          height: 12px;
          background: #36533f;
          border-radius: 50%;
          opacity: 0;
          transform: scale(0.4);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .is-selected .indicator-dot {
          opacity: 1;
          transform: scale(1);
        }

        /* Right Column */
        .right-stack {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .sticky-container {
          position: sticky;
          top: 120px;
          height: fit-content;
        }

        .shadow-premium {
          background: #fff;
          border-radius: 28px;
          padding: 2.25rem;
          box-shadow: 0 15px 50px rgba(54, 83, 63, 0.04);
          border: 1.5px solid #f2ece8;
        }

        /* Coupon Improvements */
        .coupon-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .change-link {
          background: none;
          border: none;
          color: #36533f;
          font-weight: 800;
          font-size: 11px;
          text-transform: uppercase;
          cursor: pointer;
          letter-spacing: 0.1em;
          padding: 0;
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        .checkout-coupon {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .coupon-box {
          display: flex;
          align-items: center;
          background: #fdfaf9;
          border: 1.5px solid #f2ece8;
          border-radius: 12px;
          padding: 0.35rem;
          transition: border-color 0.2s;
        }

        .coupon-box:focus-within {
          border-color: #36533f;
        }

        .coupon-box input {
          flex: 1;
          background: none;
          border: none;
          padding: 0.6rem 0.75rem;
          font-size: 13px;
          font-weight: 600;
          outline: none;
          color: #1a1210;
          text-transform: uppercase;
        }

        .coupon-box input::placeholder {
          color: #bbb;
          font-weight: 500;
          text-transform: none;
        }

        .coupon-box button {
          background: #1a1210;
          color: #fff;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 9px;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          transition: background 0.2s;
          letter-spacing: 0.05em;
        }

        .coupon-box button:hover {
          background: #36533f;
        }

        .active-coupon-minimal {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.1rem;
          background: #f0fff4;
          border: 1px solid #c6f6d5;
          border-radius: 14px;
          box-shadow: 0 4px 15px rgba(47, 133, 90, 0.05);
        }

        .c-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 13px;
          color: #2f855a;
          font-weight: 700;
        }

        .c-amt {
          background: #36533f;
          color: white;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.02em;
        }

        .c-remove-btn {
          background: none;
          border: none;
          color: #c53030;
          font-weight: 800;
          font-size: 11px;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .add-promo-trigger {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          background: #fdfaf9;
          border: 1.5px dashed #f2ece8;
          width: 100%;
          padding: 1.25rem;
          border-radius: 14px;
          color: #888;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .add-promo-trigger:hover {
          background: #fff;
          border-color: #36533f;
          color: #36533f;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(54, 83, 63, 0.06);
        }

        .cancel-coupon-btn {
          background: none;
          border: none;
          color: #aaa;
          font-size: 11px;
          font-weight: 700;
          margin-top: 0.25rem;
          width: 100%;
          cursor: pointer;
          transition: color 0.2s;
        }

        .cancel-coupon-btn:hover {
          color: #666;
        }

        .summary-table {
          width: 100%;
          border: 1px solid #f2ece8;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 1.5rem;
        }
        
        .summary-tr {
          display: flex;
          border-bottom: 1px solid #f2ece8;
        }
        
        .summary-tr:last-child {
          border-bottom: none;
        }
        
        .summary-td {
          padding: 1.25rem;
          font-size: 14px;
        }
        
        .summary-td.label {
          flex: 1;
          font-weight: 800;
          color: #1a1210;
          background: #fff;
          border-right: 1px solid #f2ece8;
          display: flex;
          align-items: center;
        }
        
        .summary-td.value {
          width: 150px;
          text-align: right;
          font-weight: 500;
          color: #1a1210;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        
        .summary-tr.total-row {
          background: #fff;
        }
        
        .summary-tr.total-row .summary-td {
          font-size: 18px;
          font-weight: 800;
          color: #000;
          padding: 1.5rem 1.25rem;
        }

        .section-divider {
          height: 1px;
          background: #f2ece8;
          margin: 2rem 0;
        }

        .card-title {
          font-family: var(--font-serif);
          font-size: 20px;
          color: #36533f;
          margin: 0 0 1.75rem 0;
          font-weight: 700;
        }

        .address-selection-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.25rem;
        }

        .mini-items-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f8f8f8;
          margin-bottom: 1rem;
        }

        .mini-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .mini-img {
          width: 45px;
          height: 55px;
          border-radius: 10px;
          overflow: hidden;
          flex-shrink: 0;
          border: 1px solid #f2ece8;
        }

        .mini-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .mini-info {
          flex: 1;
          min-width: 0;
        }

        .mini-name {
          font-size: 13px;
          font-weight: 700;
          margin: 0 0 2px 0;
          color: #1a1210;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mini-qty {
          font-size: 11px;
          color: #999;
          margin: 0;
        }

        .mini-price {
          font-size: 14px;
          font-weight: 800;
          color: #1a1210;
          flex-shrink: 0;
        }



        /* Payment Row Style */
        .pay-options {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .pay-option {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.85rem 1.25rem;
          border: 1.5px solid #f2ece8;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .pay-option:hover {
          border-color: #36533f33;
        }

        .pay-option.active {
          border-color: #36533f;
          background: #fdfafb;
          box-shadow: 0 8px 20px rgba(54, 83, 63, 0.04);
        }

        .pay-option input {
          width: 20px;
          height: 20px;
          margin-top: 4px;
          accent-color: #36533f;
        }

        .pay-content {
          flex: 1;
        }

        .pay-main {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 14px;
          font-weight: 700;
          color: #1a1210;
          margin-bottom: 2px;
        }

        .pay-icon {
          color: #36533f;
          width: 18px;
          height: 18px;
        }

        .pay-desc {
          font-size: 11px;
          color: #999;
          margin: 0;
        }

        .checkout-flex {
          display: flex;
          gap: 3rem;
          align-items: flex-start;
          min-height: 50vh;
        }

        .checkout-policy-agreement {
          margin-bottom: 2rem;
          padding: 1.25rem;
          background: #fdfaf9;
          border-radius: 14px;
          border: 1px solid #f2ece8;
        }

        .checkbox-wrap {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          cursor: pointer;
          font-size: 11px;
          color: #888;
          line-height: 1.5;
        }

        .checkbox-wrap input {
          margin-top: 2px;
          accent-color: #36533f;
        }

        .check-text a {
          color: #36533f;
          text-decoration: underline;
          font-weight: 600;
        }

        .place-order-btn {
          width: 100%;
          background: #36533f;
          color: #fff;
          padding: 1.4rem;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 15px 35px rgba(54, 83, 63, 0.25);
        }

        .place-order-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
          box-shadow: none;
        }

        .place-order-btn:hover:not(:disabled) {
          background: #2a4132;
          transform: translateY(-2px);
          box-shadow: 0 20px 45px rgba(54, 83, 63, 0.35);
        }

        .security-note {
          font-size: 10px;
          color: #ccc;
          text-align: center;
          margin-top: 1.25rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 700;
        }

        /* Modal Refinements */
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
        }

        .boutique-modal {
          background: #fff;
          padding: 3rem;
          border-radius: 32px;
          width: 100%;
          max-width: 600px;
          box-shadow: 0 40px 100px rgba(0,0,0,0.15);
          animation: slideUp 0.5s cubic-bezier(0.19, 1, 0.22, 1);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .modal-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .modal-head h3 {
          font-family: var(--font-serif);
          font-size: 26px;
          color: #36533f;
          margin: 0;
        }

        .close-x {
          background: none;
          border: none;
          color: #aaa;
          cursor: pointer;
        }

        .addr-card-body {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .f-group {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .f-group label {
          font-size: 11px;
          font-weight: 800;
          color: #aaa;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .b-input {
          width: 100%;
          padding: 1rem 1.25rem;
          border-radius: 12px;
          border: 1px solid #f2ece8;
          background: #fdfaf9;
          font-size: 14px;
          font-weight: 600;
          color: #1a1210;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 1.5rem;
          align-items: center;
        }

        .cancel-pill {
          background: none;
          border: none;
          color: #888;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
        }

        .save-pill {
          background: #36533f;
          color: #fff;
          padding: 0.9rem 2.5rem;
          border-radius: 10px;
          font-weight: 700;
          font-size: 14px;
          border: none;
          cursor: pointer;
        }

        @media (max-width: 1300px) {
          .checkout-grid {
            grid-template-columns: minmax(0, 1fr) 390px;
            gap: 2.5rem;
          }
          .checkout-shell {
            padding: 0 1.75rem;
          }
          .address-selection-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 1100px) {
          .checkout-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .sticky-container {
            position: static;
          }
          .checkout-header {
            margin-bottom: 2.75rem;
          }
          .checkout-title {
            font-size: 34px;
          }
          .checkout-shell {
            max-width: 900px;
            padding: 0 1.5rem;
          }
          .shadow-premium {
            padding: 2rem;
          }
        }

        @media (max-width: 900px) {
          .checkout-shell {
            padding: 0 1.25rem;
          }
          .section-head-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .address-select-card {
            padding: 1.35rem 1.25rem;
          }
          .addr-right-group {
            gap: 1rem;
          }
          .summary-td.value {
            width: 140px;
          }
        }

        @media (max-width: 767px) {
          .checkout-shell {
            padding: 0 1.25rem;
          }
          .checkout-header {
            margin-bottom: 2rem;
          }
          .address-select-card {
            padding: 1.5rem;
          }
          .addr-right-group {
            position: absolute;
            top: 1.5rem;
            right: 1.5rem;
            gap: 1rem;
          }
          .mini-item {
            gap: 0.75rem;
          }
          .mini-img {
            width: 40px;
            height: 50px;
          }
        }

        @media (max-width: 640px) {
          .checkout-main {
            padding: 1rem 0 4rem;
          }
          .checkout-shell {
            padding: 0 1rem;
          }
          .checkout-title {
            font-size: 28px;
          }
          .shadow-premium {
            padding: 1.5rem;
            border-radius: 20px;
          }
          .head-label h2 {
            font-size: 20px;
          }
          .add-address-pill {
            width: 100%;
            justify-content: center;
          }
          .form-row {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .boutique-modal {
            padding: 1.5rem;
            border-radius: 24px;
          }
          .modal-head h3 {
            font-size: 20px;
          }
          .summary-td {
            padding: 1rem 0.75rem;
            font-size: 13px;
          }
          .summary-td.value {
            width: 120px;
          }
          .place-order-btn {
            padding: 1.1rem;
            font-size: 15px;
          }
          .address-selection-grid {
            grid-template-columns: 1fr;
          }
          .addr-card-top {
            align-items: flex-start;
            gap: 0.75rem;
          }
          .addr-right-group {
            position: static;
            margin-left: 0;
            width: 100%;
            justify-content: space-between;
          }
          .active-coupon-minimal {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          .summary-td {
            padding: 0.95rem 0.75rem;
          }
        }

        @media (max-width: 320px) {
          .address-select-card {
            padding: 1.1rem;
            border-radius: 18px;
          }
          .addr-card-top {
            align-items: flex-start;
            gap: 0.65rem;
            margin-bottom: 1rem;
          }
          .addr-tag {
            font-size: 8px;
            padding: 0.3rem 0.65rem;
            gap: 0.35rem;
          }
          .addr-right-group {
            gap: 0.75rem;
          }
          .addr-actions {
            gap: 0.5rem;
          }
          .mini-action {
            width: 26px;
            height: 26px;
            border-radius: 7px;
          }
          .select-indicator {
            width: 18px;
            height: 18px;
          }
          .indicator-dot {
            width: 8px;
            height: 8px;
          }
          .recipient-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
          }
          .checkout-title {
            font-size: 26px;
          }
          .head-label h2 {
            font-size: 18px;
          }
          .add-address-pill {
            font-size: 11px;
          }
          .addr-tag {
            font-size: 8px;
          }
          .rec-name {
            font-size: 14px;
            line-height: 1.25;
            word-break: break-word;
          }
          .rec-company {
            font-size: 10px;
          }
          .rec-phone {
            font-size: 11px;
            max-width: 100%;
            padding: 0.2rem 0.55rem;
            overflow-wrap: anywhere;
          }
          .addr-street {
            font-size: 15px;
            line-height: 1.45;
            overflow-wrap: anywhere;
          }
          .addr-locale {
            font-size: 11px;
            line-height: 1.45;
            overflow-wrap: anywhere;
          }
          .addr-landmark {
            font-size: 10px;
          }
          .addr-email {
            font-size: 9px;
            overflow-wrap: anywhere;
          }
          .card-title {
            font-size: 18px;
          }
          .mini-name {
            font-size: 11px;
          }
          .mini-qty {
            font-size: 9px;
          }
          .mini-price {
            font-size: 12px;
          }
          .summary-td {
            font-size: 10px;
          }
          .summary-tr.total-row .summary-td {
            font-size: 13px;
          }
          .pay-main {
            font-size: 12px;
          }
          .pay-desc {
            font-size: 9px;
          }
          .checkbox-wrap {
            font-size: 9px;
          }
          .place-order-btn {
            font-size: 10px;
          }
          .security-note {
            font-size: 8px;
          }
          .modal-head h3 {
            font-size: 18px;
          }
          .f-group label {
            font-size: 9px;
          }
          .b-input {
            font-size: 12px;
          }
          .cancel-pill,
          .save-pill {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}
