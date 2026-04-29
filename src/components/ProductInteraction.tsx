"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, Minus, Plus, Truck, Award, ShieldCheck, RotateCcw, Calendar, Star } from "lucide-react";
import apiClient, { IMAGE_BASE_URL } from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import apiCart from "@/apiProvider/cart.provider";
import apiNotifyMe from "@/apiProvider/notifyme.provider";

export default function ProductInteraction({ product }: { product: any }) {
  const { user, isLoggedIn } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { fetchCart, cartItems } = useCart();
  const { showToast } = useToast();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [selectedMainImage, setSelectedMainImage] = useState<string | null>(null);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [deliveryDates, setDeliveryDates] = useState<{ start: string; end: string } | null>(null);

  useEffect(() => {
    if (activeTab === 'reviews' && reviews.length === 0) {
      const fetchReviews = async () => {
        setReviewsLoading(true);
        try {
          const productId = product?._id || product?.id;
          if (!productId) return;
          const res = await apiNotifyMe.reviews(productId);
          if (res.status && res.response.data) {
            setReviews(res.response.data);
          }
        } catch (error) {
          console.error("Failed to fetch reviews", error);
        } finally {
          setReviewsLoading(false);
        }
      };
      fetchReviews();
    }
  }, [activeTab, product, reviews.length]);

  useEffect(() => {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 7);

    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
    const startStr = today.toLocaleDateString('en-GB', options);
    const endStr = endDate.toLocaleDateString('en-GB', options);

    setDeliveryDates({ start: startStr, end: endStr });
  }, []);

  // Step 1: Get attribute order (all unique attribute names across all combinations)
  const attributeOrder = useMemo(() => {
    const names = new Set<string>();
    product.attributes?.forEach((attr: any) => {
      attr.combination?.forEach((c: any) => {
        if (c.attributeName) names.add(c.attributeName);
      });
    });
    return Array.from(names);
  }, [product]);

  // Step 2: Collect ALL unique values per attribute across all combinations
  const allAttributeValues = useMemo(() => {
    const groups: Record<string, { values: Set<string>; swatches: Record<string, string | null> }> = {};

    product.attributes?.forEach((attr: any) => {
      attr.combination?.forEach((combo: any) => {
        if (!groups[combo.attributeName]) {
          groups[combo.attributeName] = { values: new Set(), swatches: {} };
        }
        groups[combo.attributeName].values.add(combo.value);
        if (combo.valueImage?.path && !groups[combo.attributeName].swatches[combo.value]) {
          groups[combo.attributeName].swatches[combo.value] = `${IMAGE_BASE_URL}/${combo.valueImage.path}`;
        }
      });
    });

    const ordered: Record<string, { values: string[]; swatches: Record<string, string | null> }> = {};
    attributeOrder.forEach((name: string) => {
      if (groups[name]) {
        ordered[name] = {
          values: Array.from(groups[name].values),
          swatches: groups[name].swatches,
        };
      }
    });
    Object.keys(groups).forEach((name) => {
      if (!ordered[name]) {
        ordered[name] = {
          values: Array.from(groups[name].values),
          swatches: groups[name].swatches,
        };
      }
    });

    return ordered;
  }, [product, attributeOrder]);

  const searchParams = useSearchParams();

  // Step 3: Default to URL params (v=valueId1,valueId2) or first combination's selections on load
  useEffect(() => {
    const vParam = searchParams.get('v');
    const initial: Record<string, string> = {};

    if (vParam && product.attributes) {
      const targetValueIds = vParam.split(',');

      // Find the attribute that matches these valueIds
      const matchedAttr = product.attributes.find((attr: any) =>
        targetValueIds.every(vid =>
          attr.combination?.some((c: any) => String(c.valueId) === String(vid))
        )
      );

      if (matchedAttr) {
        matchedAttr.combination.forEach((c: any) => {
          initial[c.attributeName] = c.value;
        });
      }
    }

    // Fallback: If no match or no param, use first attribute
    if (Object.keys(initial).length === 0 && product.attributes?.[0]?.combination) {
      product.attributes[0].combination.forEach((c: any) => {
        initial[c.attributeName] = c.value;
      });
    }

    if (Object.keys(initial).length > 0) {
      setSelections(initial);
    }
  }, [product, searchParams]);

  // Step 4: Check if a value is available given current other selections
  const isValueAvailable = (attrName: string, val: string): boolean => {
    const attrIndex = attributeOrder.indexOf(attrName);

    if (attrIndex === 0) {
      return product.attributes?.some((attr: any) =>
        attr.combination?.some((c: any) => c.attributeName === attrName && c.value === val)
      ) || false;
    }

    return product.attributes?.some((attr: any) => {
      const hasThisValue = attr.combination?.some(
        (c: any) => c.attributeName === attrName && c.value === val
      );
      if (!hasThisValue) return false;

      return attr.combination?.every((c: any) => {
        if (c.attributeName === attrName) return true;
        const sel = selections[c.attributeName];
        if (!sel) return true;
        return sel === c.value;
      });
    }) || false;
  };

  // Step 5: Handle selection — smart reset to compatible combo if invalid
  const handleSelection = (attrName: string, val: string) => {
    const attrIndex = attributeOrder.indexOf(attrName);

    if (attrIndex === 0) {
      // First attribute — full combo auto-select (prefer in-stock)
      let compatibleAttr = product.attributes?.find((attr: any) =>
        attr.combination?.some((c: any) => c.attributeName === attrName && c.value === val)
        && attr.stock > 0
      );

      if (!compatibleAttr) {
        compatibleAttr = product.attributes?.find((attr: any) =>
          attr.combination?.some((c: any) => c.attributeName === attrName && c.value === val)
        );
      }

      if (compatibleAttr) {
        const autoSelections: Record<string, string> = {};
        compatibleAttr.combination?.forEach((c: any) => {
          autoSelections[c.attributeName] = c.value;
        });
        setSelections(autoSelections);
      }
      return;
    }

    // Subsequent attributes — find exact match or compatible auto-select
    if (isValueAvailable(attrName, val)) {
      const newSelections = { ...selections, [attrName]: val };

      const exactMatch = product.attributes?.find((attr: any) =>
        attr.combination?.every((c: any) => {
          const sel = newSelections[c.attributeName];
          if (!sel) return false;
          return sel === c.value;
        })
      );

      if (exactMatch) {
        setSelections(newSelections);
      } else {
        // Find compatible combo and auto-select (prefer in-stock)
        let compatibleAttr = product.attributes?.find((attr: any) =>
          attr.combination?.some((c: any) => c.attributeName === attrName && c.value === val)
          && attr.combination?.every((c: any) => {
            if (c.attributeName === attrName) return true;
            const sel = selections[c.attributeName];
            if (!sel) return true;
            return sel === c.value;
          })
          && attr.stock > 0
        );

        if (!compatibleAttr) {
          compatibleAttr = product.attributes?.find((attr: any) =>
            attr.combination?.some((c: any) => c.attributeName === attrName && c.value === val)
            && attr.combination?.every((c: any) => {
              if (c.attributeName === attrName) return true;
              const sel = selections[c.attributeName];
              if (!sel) return true;
              return sel === c.value;
            })
          );
        }

        if (compatibleAttr) {
          const autoSelections: Record<string, string> = {};
          compatibleAttr.combination?.forEach((c: any) => {
            autoSelections[c.attributeName] = c.value;
          });
          setSelections(autoSelections);
        }
      }
    }
  };

  // Step 6: Find best matching active attribute
  const activeAttribute = useMemo(() => {
    // Try exact match first
    const exact = product.attributes?.find((attr: any) =>
      attr.combination?.every((c: any) => selections[c.attributeName] === c.value)
    );
    if (exact) return exact;

    // Partial match — most matching combos
    let best = product.attributes?.[0];
    let bestScore = 0;
    product.attributes?.forEach((attr: any) => {
      const score = attr.combination?.filter(
        (c: any) => selections[c.attributeName] === c.value
      ).length || 0;
      if (score > bestScore) {
        bestScore = score;
        best = attr;
      }
    });
    return best;
  }, [product, selections]);

  const currentCombination = useMemo(() => {
    return activeAttribute?.combination?.map((c: any) => ({
      attributeId: c.attributeId,
      valueId: c.valueId,
      value: c.value,
    }));
  }, [activeAttribute]);

  const { active: isWishlisted } = isInWishlist(product._id || product.id, currentCombination);

  const handleWishlistToggle = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    await toggleWishlist(product, currentCombination);
  };

  // Step 7: Images
  const allImages = useMemo(() => {
    return (activeAttribute?.images || []).map(
      (img: any) => `${IMAGE_BASE_URL}/${img.path}`
    );
  }, [activeAttribute]);

  useEffect(() => {
    setSelectedMainImage(null);
  }, [activeAttribute]);

  const displayImage = selectedMainImage || allImages[0] || null;

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    try {
      const combination = activeAttribute?.combination?.map((c: any) => ({
        attributeId: c.attributeId,
        attributeName: c.attributeName,
        value: c.value,
        valueId: c.valueId,
        valueImage: c.valueImage || null
      }));

      const res = await apiCart.add({
        userId: user?._id || user?.id,
        productId: product._id,
        qty: quantity,
        combination
      });

      if (res.status) {
        showToast(res.response.message || "Product added to cart", "success");
        await fetchCart(); // Re-fetch global cart to update header count
      }
    } catch (error: any) {
      console.error("Cart error:", error);
      const msg = error.response?.data?.message || "Failed to add to cart";
      showToast(msg, "error");
    }
  };

  const handleNotifyMe = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    try {
      const combination = activeAttribute?.combination?.map((c: any) => ({
        attributeId: c.attributeId,
        valueId: c.valueId,
        value: c.value,
      }));

      const res = await apiNotifyMe.add({
        userId: user?._id || user?.id,
        productId: product._id,
        combination
      });

      if (res.status) {
        showToast(res.response?.message || "You will be notified when the product is back in stock", "success");
      }
    } catch (error: any) {
      console.error("Notify error:", error);
      const msg = error.response?.data?.message || "Failed to notify";
      showToast(msg, "error");
    }
  };

  const isInCart = useMemo(() => {
    if (!cartItems?.length || !activeAttribute) return false;

    return cartItems.some((item: any) => {
      // Product match
      const productMatch =
        item.productId === product._id ||
        item.product?._id === product._id;
      if (!productMatch) return false;

      // Combination match — every current valueId cart-ல இருக்கா
      const currentValueIds = activeAttribute.combination?.map((c: any) => String(c.valueId)) || [];
      const cartValueIds = item.combination?.map((c: any) => String(c.valueId)) || [];

      if (currentValueIds.length !== cartValueIds.length) return false;
      return currentValueIds.every((vid: string) => cartValueIds.includes(vid));
    });
  }, [cartItems, activeAttribute, product._id]);

  useEffect(() => {
    if (activeAttribute && activeAttribute.stock <= 0) {
      setQuantity(0);
    } else if (activeAttribute && quantity > activeAttribute.stock) {
      setQuantity(activeAttribute.stock);
    } else if (activeAttribute && activeAttribute.stock > 0 && quantity <= 0) {
      setQuantity(1);
    }
  }, [activeAttribute]);

  return (
    <div className="product-interaction-container" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', marginTop: '3rem' }}>
      <div className="product-main-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 1.1fr', gap: '4rem', alignItems: 'flex-start' }}>

        {/* Left: Image Gallery */}
        <div className="gallery-section">
          <div className="product-thumbs-column" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '80px' }}>
            {allImages.map((img: string, idx: number) => (
              <div
                key={idx}
                className="product-thumb-tile"
                onClick={() => setSelectedMainImage(img)}
                style={{
                  width: '80px', height: '100px', borderRadius: '8px', overflow: 'hidden',
                  cursor: 'pointer',
                  border: displayImage === img ? '2px solid #8a4b65' : '1px solid #eee',
                  transition: 'all 0.3s ease',
                }}
              >
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>

          <div className="product-main-image-wrap" style={{ position: 'relative', flex: 1, aspectRatio: '3/4', backgroundColor: '#fcfcfc', borderRadius: '12px', overflow: 'hidden' }}>
            {displayImage && (
              <img src={displayImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
            <button
              className="product-wishlist-btn"
              onClick={handleWishlistToggle}
              style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10, background: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', cursor: 'pointer' }}
            >
              <Heart size={20} fill={isWishlisted ? "#e53e3e" : "none"} color={isWishlisted ? "#e53e3e" : "#1a1a1a"} />
            </button>
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="product-info-panel" style={{ padding: '0 10px' }}>
          <p style={{ color: '#8a4b65', fontSize: '13px', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            {product.category?.name}
          </p>
          <h1 className="product-detail-title" style={{ fontSize: '38px', fontWeight: '800', color: '#1a1a1a', marginBottom: '1rem', lineHeight: '1.1', fontFamily: 'var(--font-serif)' }}>
            {product.name}
          </h1>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '1.5rem' }}>{product.brand?.name}</p>

          <div className="product-price-row" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '0.75rem' }}>
            <span className="product-price-main" style={{ fontSize: '32px', fontWeight: '800', color: '#8a4b65' }}>
              ₹{(activeAttribute?.price || 0).toLocaleString('en-IN')}
            </span>
            {activeAttribute?.mrp > activeAttribute?.price && (
              <span style={{ fontSize: '18px', color: '#a0aec0', textDecoration: 'line-through' }}>
                ₹{activeAttribute.mrp.toLocaleString('en-IN')}
              </span>
            )}
            {activeAttribute?.mrp > activeAttribute?.price && (
              <span style={{ fontSize: '16px', color: '#48bb78', fontWeight: '700' }}>
                {Math.round((1 - activeAttribute.price / activeAttribute.mrp) * 100)}% off
              </span>
            )}
          </div>
          {deliveryDates ? (
            <div style={{ marginBottom: '1.5rem' }}>
              <div className="product-delivery-note" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1a1a1a', fontWeight: '600', fontSize: '14px', marginBottom: '6px' }}>
                <Calendar size={16} strokeWidth={2} color="#1a1a1a" className="product-delivery-icon" />
                <span>Estimated delivery between {deliveryDates.start} - {deliveryDates.end}</span>
              </div>
              <p className="product-delivery-subtext" style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>Tax Included. Shipping calculated at checkout</p>
            </div>
          ) : (
            <div style={{ height: '52px', marginBottom: '2.5rem' }}></div>
          )}

          {/* All Attribute Selectors */}
          <div className="product-attribute-stack" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '2.5rem' }}>
            {Object.entries(allAttributeValues).map(([name, { values, swatches }]) => {
              const isColor = name.toLowerCase().includes('color');
              const attrIndex = attributeOrder.indexOf(name);
              const prevAttrName = attrIndex > 0 ? attributeOrder[attrIndex - 1] : null;
              const isPrevSelected = prevAttrName ? !!selections[prevAttrName] : true;

              return (
                <div key={name}>
                  <p style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '1.25rem', color: '#1a1a1a' }}>
                    SELECT {name}:{' '}
                    <span style={{ color: '#8a4b65' }}>{selections[name] || '—'}</span>
                  </p>
                  <div className="product-option-row" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {values.map((val) => {
                      const isSelected = selections[name] === val;
                      const available = isValueAvailable(name, val);
                      const swatchUrl = swatches[val];
                      const isClickable = isPrevSelected && available;

                      if (isColor) {
                        return (
                          <button
                            key={val}
                            onClick={() => isClickable && handleSelection(name, val)}
                            title={val}
                            style={{
                              width: '36px', height: '36px', borderRadius: '50%',
                              backgroundImage: swatchUrl ? `url(${swatchUrl})` : undefined,
                              backgroundColor: swatchUrl ? undefined : val.toLowerCase().replace(' ', ''),
                              backgroundSize: 'cover', backgroundPosition: 'center',
                              border: '2px solid transparent',
                              outline: isSelected ? '2px solid #8a4b65' : 'none',
                              outlineOffset: '2px',
                              cursor: isClickable ? 'pointer' : 'not-allowed',
                              opacity: isPrevSelected ? (available ? 1 : 0.3) : 0.2,
                              transition: 'all 0.2s ease',
                              padding: 0,
                            }}
                          />
                        );
                      }

                      return (
                        <button
                          key={val}
                          onClick={() => isClickable && handleSelection(name, val)}
                          style={{
                            padding: '0.5rem 1.25rem',
                            border: isSelected ? '1.5px solid #8a4b65' : '1px solid #ddd',
                            background: isSelected ? '#fff5f7' : '#fff',
                            color: isSelected ? '#8a4b65' : isClickable ? '#4a5568' : '#bbb',
                            fontSize: '15px', fontWeight: '600', borderRadius: '4px',
                            cursor: isClickable ? 'pointer' : 'not-allowed',
                            opacity: isPrevSelected ? (available ? 1 : 0.4) : 0.2,
                            minWidth: '50px',
                            transition: 'all 0.2s ease',
                            textDecoration: (isPrevSelected && !available) ? 'line-through' : 'none',
                          }}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', fontSize: '15px', color: activeAttribute?.stock > 0 ? '#48bb78' : '#e53e3e', fontWeight: '700' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'currentColor' }} />
            {activeAttribute?.stock > 0
              ? activeAttribute.stock <= (product.lowStockAlert || 10)
                ? `Only ${activeAttribute.stock} left!`
                : `In Stock: ${activeAttribute.stock}`
              : 'Out of Stock'}
          </div>

          {/* Quantity + Add to Cart */}
          <div className="product-cart-block" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase' }}>Quantity</p>
            <div className="product-cart-row" style={{ display: 'flex', gap: '1rem' }}>
              <div className="product-qty-control" style={{ display: 'flex', alignItems: 'center', border: '1px solid #eee', borderRadius: '4px', background: '#fcfcfc', opacity: activeAttribute?.stock === 0 ? 0.5 : 1 }}>
                <button
                  className="product-qty-btn"
                  disabled={quantity <= 1 || activeAttribute?.stock === 0}
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{ width: '50px', height: '50px', border: 'none', background: 'none', cursor: (quantity <= 1 || activeAttribute?.stock <= 0) ? 'not-allowed' : 'pointer' }}
                >
                  <Minus size={18} />
                </button>
                <span className="product-qty-value" style={{ width: '50px', textAlign: 'center', fontWeight: '700', fontSize: '18px' }}>{quantity}</span>
                <button
                  className="product-qty-btn"
                  disabled={quantity >= (activeAttribute?.stock || 0) || activeAttribute?.stock === 0}
                  onClick={() => setQuantity(q => Math.min(activeAttribute?.stock || 99, q + 1))}
                  style={{ width: '50px', height: '50px', border: 'none', background: 'none', cursor: (quantity >= (activeAttribute?.stock || 0) || activeAttribute?.stock <= 0) ? 'not-allowed' : 'pointer' }}
                >
                  <Plus size={18} />
                </button>
              </div>
              {/* Dynamic Action Button */}
              {activeAttribute?.stock > 0 ? (
                isInCart ? (
                  <button
                    className="product-add-cart-btn"
                    onClick={() => router.push("/cart")}
                    style={{ flex: 1, height: '50px', background: '#8a4b65', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: '700', fontSize: '15px', letterSpacing: '0.05em', cursor: 'pointer' }}
                  >
                    GO TO CART
                  </button>
                ) : (
                  <button
                    className="product-add-cart-btn"
                    onClick={handleAddToCart}
                    disabled={!activeAttribute || activeAttribute.stock <= 0}
                    style={{ flex: 1, height: '50px', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: '700', fontSize: '15px', letterSpacing: '0.05em', cursor: 'pointer' }}
                  >
                    ADD TO CART
                  </button>
                )
              ) : (
                <button
                  className="product-add-cart-btn"
                  onClick={handleNotifyMe}
                  disabled={!activeAttribute}
                  style={{ flex: 1, height: '50px', background: '#fff', color: '#e53e3e', border: '1px solid #e53e3e', borderRadius: '4px', fontWeight: '700', fontSize: '15px', letterSpacing: '0.05em', cursor: 'pointer' }}
                >
                  NOTIFY ME
                </button>
              )}
            </div>
          </div>

          {/* Static Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', borderTop: '1px solid #f2ece8', paddingTop: '2rem', marginTop: '1rem' }}>
            {/* Size Chart */}
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', marginBottom: '12px' }}>Size Chart :</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <tbody>
                  <tr>
                    <td style={{ border: '1px solid #e2e8f0', padding: '10px', fontSize: '14px', fontWeight: '700', color: '#1a1a1a' }}>SIZE</td>
                    <td style={{ border: '1px solid #e2e8f0', padding: '10px', fontSize: '14px', fontWeight: '700', color: '#1a1a1a' }}>S</td>
                    <td style={{ border: '1px solid #e2e8f0', padding: '10px', fontSize: '14px', fontWeight: '700', color: '#1a1a1a' }}>M</td>
                    <td style={{ border: '1px solid #e2e8f0', padding: '10px', fontSize: '14px', fontWeight: '700', color: '#1a1a1a' }}>L</td>
                    <td style={{ border: '1px solid #e2e8f0', padding: '10px', fontSize: '14px', fontWeight: '700', color: '#1a1a1a' }}>XL</td>
                    <td style={{ border: '1px solid #e2e8f0', padding: '10px', fontSize: '14px', fontWeight: '700', color: '#1a1a1a' }}>XXL</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #e2e8f0', padding: '10px', fontSize: '14px', fontWeight: '700', color: '#1a1a1a' }}>BUST</td>
                    <td style={{ border: '1px solid #e2e8f0', padding: '10px', fontSize: '14px', color: '#666' }}>36</td>
                    <td style={{ border: '1px solid #e2e8f0', padding: '10px', fontSize: '14px', color: '#666' }}>38</td>
                    <td style={{ border: '1px solid #e2e8f0', padding: '10px', fontSize: '14px', color: '#666' }}>40</td>
                    <td style={{ border: '1px solid #e2e8f0', padding: '10px', fontSize: '14px', color: '#666' }}>42</td>
                    <td style={{ border: '1px solid #e2e8f0', padding: '10px', fontSize: '14px', color: '#666' }}>44</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Wash Care */}
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>Wash Care:</h3>
              <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                Hand Wash Or Machine wash cold with mild detergent, tumble dry low, iron if needed.
              </p>
            </div>

            {/* Note */}
            <div>
              <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                <span style={{ fontWeight: '700', color: '#1a1a1a' }}>Note : </span>
                The color of the real product may slightly differ from the image displayed on the screen, owning to screen resolution and photography effects.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="product-tabs-shell" style={{ marginTop: '1.5rem' }}>
        <div className="product-tabs-row" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          {(['description', 'specifications', 'reviews'] as const).map((t) => (
            <button
              key={t}
              className="product-tab-btn"
              onClick={() => setActiveTab(t)}
              style={{
                padding: '1rem 2rem',
                background: activeTab === t ? '#8a4b65' : '#f9f9f9',
                color: activeTab === t ? '#fff' : '#666',
                border: 'none', borderRadius: '50px',
                fontSize: '14px', fontWeight: '700', textTransform: 'uppercase',
                cursor: 'pointer', transition: '0.3s'
              }}
            >{t}</button>
          ))}
        </div>
        <div className="product-tab-panel" style={{ padding: '3rem', border: '1px solid #f2ece8', borderRadius: '24px', backgroundColor: '#fff' }}>
          {activeTab === 'description' && (
            <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#4a5568' }}
              dangerouslySetInnerHTML={{ __html: product.fullDescription || 'No description available.' }} />
          )}
          {activeTab === 'specifications' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
              {product.specifications?.filter((s: any) => s.key && s.value).length > 0 ? (
                product.specifications.filter((s: any) => s.key && s.value).map((s: any, i: number) => (
                  <div key={i} style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.5rem', 
                    padding: '1.5rem', 
                    backgroundColor: '#fdfcfb', 
                    borderRadius: '16px',
                    border: '1px solid #f2ece8'
                  }}>
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: '800', 
                      color: '#8a4b65', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.1em' 
                    }}>{s.key}</span>
                    <span style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: '#1a1a1a',
                      lineHeight: '1.4'
                    }}>{s.value}</span>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  No specifications available for this product.
                </div>
              )}
            </div>
          )}
          {activeTab === 'reviews' && (
            <div>
              {reviewsLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666', width: '100%' }}>Loading reviews...</div>
              ) : reviews.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {reviews.map((r: any, i: number) => (
                    <div key={i} style={{ 
                      padding: '1.25rem', 
                      backgroundColor: '#fdfcfb', 
                      borderRadius: '12px',
                      border: '1px solid #f2ece8' 
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            {[...Array(5)].map((_, idx) => (
                              <Star key={idx} size={14} fill={idx < r.rating ? '#eab308' : 'none'} color={idx < r.rating ? '#eab308' : '#cbd5e1'} />
                            ))}
                          </div>
                          <span style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a' }}>{r.customerName || 'Customer'}</span>
                        </div>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
                        </span>
                      </div>
                      <p style={{ 
                        fontSize: '14px', 
                        color: '#475569', 
                        lineHeight: '1.5', 
                        margin: 0,
                        fontWeight: '400' 
                      }}>
                        {r.description || r.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666', width: '100%' }}>No reviews yet. Be the first to review!</div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .product-main-layout {
            gap: 2rem !important;
            grid-template-columns: 1fr 1fr !important;
          }

          .gallery-section {
            flex-direction: column-reverse !important;
            gap: 1rem !important;
          }

          .product-thumbs-column {
            width: 100% !important;
            flex-direction: row !important;
            overflow-x: auto;
            padding-bottom: 0.25rem;
          }

          .product-thumb-tile {
            width: 72px !important;
            height: 92px !important;
            flex: 0 0 auto;
          }

          .product-detail-title {
            font-size: 26px !important;
          }

          .product-price-main {
            font-size: 24px !important;
          }

          .product-attribute-stack {
            gap: 1.25rem !important;
          }

          .product-qty-btn {
            width: 36px !important;
            height: 44px !important;
          }

          .product-qty-value {
            width: 36px !important;
            font-size: 16px !important;
          }

          .product-service-strip {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1.25rem 1rem !important;
          }
        }

        .gallery-section {
          display: flex;
          gap: 1.5rem;
          position: sticky;
          top: 120px;
        }

        @media (max-width: 767px) {
          .gallery-section {
            position: static;
            flex-direction: column;
            gap: 1rem;
          }
        }

        @media (max-width: 767px) {
          .product-interaction-container {
            margin-top: 2rem !important;
            gap: 2rem !important;
          }

          .product-main-layout {
            grid-template-columns: 1fr !important;
            gap: 2.25rem !important;
          }

          .gallery-section {
            position: static !important;
            top: auto !important;
            flex-direction: column-reverse;
            gap: 1rem !important;
          }

          .product-thumbs-column {
            width: 100% !important;
            flex-direction: row !important;
            overflow-x: auto;
            padding-bottom: 0.25rem;
          }

          .product-thumb-tile {
            width: 72px !important;
            height: 92px !important;
            flex: 0 0 auto;
          }

          .product-info-panel {
            padding: 0 !important;
          }

          .product-detail-title {
            font-size: 32px !important;
          }

          .product-price-row {
            flex-wrap: wrap;
            gap: 0.75rem 1rem !important;
            align-items: baseline !important;
          }

          .product-cart-row {
            flex-direction: row !important;
            gap: 0.5rem !important;
            align-items: stretch;
          }

          .product-qty-control {
            width: auto !important;
            min-height: 50px;
            border-radius: 8px !important;
            overflow: hidden;
            justify-content: center;
          }

          .product-qty-btn {
            width: 36px !important;
            height: 50px !important;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .product-qty-value {
            width: 32px !important;
            flex: none;
            text-align: center;
            line-height: 1;
          }

          .product-add-cart-btn {
            flex: 1 !important;
            width: auto !important;
            min-height: 50px !important;
            border-radius: 8px !important;
            font-size: 14px !important;
            letter-spacing: 0.05em !important;
          }

          .product-service-strip {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 1.25rem !important;
          }

          .product-tabs-shell {
            margin-top: 1rem !important;
          }

          .product-tab-panel {
            padding: 2rem !important;
          }
        }

        @media (max-width: 640px) {
          .product-interaction-container {
            margin-top: 1.25rem !important;
          }

          .product-info-panel {
            padding: 0 !important;
          }

          .gallery-section {
            gap: 0.85rem !important;
          }

          .product-main-image-wrap {
            border-radius: 10px !important;
          }

          .product-wishlist-btn {
            top: 12px !important;
            right: 12px !important;
            width: 36px !important;
            height: 36px !important;
          }

          .product-detail-title {
            font-size: 28px !important;
            line-height: 1.15 !important;
          }

          .product-price-main {
            font-size: 28px !important;
          }

          .product-attribute-stack {
            gap: 1.25rem !important;
            margin-bottom: 2rem !important;
          }

          .product-option-row {
            gap: 0.6rem !important;
          }

          .product-cart-block {
            margin-bottom: 2rem !important;
          }

          .product-cart-row {
            gap: 0.5rem !important;
          }

          .product-qty-btn {
            width: 36px !important;
            height: 48px !important;
          }

          .product-qty-control {
            min-height: 48px !important;
            height: 48px !important;
          }

          .product-qty-value {
            font-size: 16px !important;
            width: 28px !important;
          }

          .product-add-cart-btn {
            min-height: 48px !important;
            height: 48px !important;
            font-size: 13px !important;
            flex: 1 !important;
          }

          .product-service-strip {
            grid-template-columns: 1fr 1fr !important;
            gap: 1rem !important;
            padding-top: 1.5rem !important;
          }

          .product-tabs-row {
            flex-wrap: wrap;
            gap: 0.75rem !important;
            margin-bottom: 1.25rem !important;
          }

          .product-tab-btn {
            padding: 0.85rem 1.25rem !important;
            font-size: 12px !important;
          }

          .product-tab-panel {
            padding: 1.25rem !important;
            border-radius: 18px !important;
          }

          .product-spec-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
        }

        @media (max-width: 320px) {
          .product-delivery-note {
            font-size: 12px !important;
          }
          .product-delivery-subtext {
            font-size: 12px !important;
          }
          .product-delivery-icon {
            width: 13px !important;
            height: 13px !important;
          }
          .product-detail-title {
            font-size: 26px !important;
          }
          .product-price-main {
            font-size: 26px !important;
          }
          .product-price-row span:not(.product-price-main) {
            font-size: 14px !important;
          }
          .product-qty-control {
            min-height: 40px !important;
            height: 40px !important;
          }
          .product-qty-btn {
            width: 30px !important;
            height: 40px !important;
          }
          .product-qty-value {
            font-size: 14px !important;
            width: 24px !important;
          }
          .product-add-cart-btn {
            font-size: 11px !important;
            min-height: 40px !important;
            height: 40px !important;
          }
          .product-tab-btn {
            font-size: 10px !important;
          }
          .product-service-strip span {
            font-size: 11px !important;
          }
          .product-attribute-stack p {
            font-size: 12px !important;
          }
          .product-option-row button {
            font-size: 13px !important;
            padding: 0.4rem 1rem !important;
          }
          .product-cart-block > p {
            font-size: 11px !important;
          }
          .product-info-panel > p:first-child {
            font-size: 11px !important;
          }
          .product-info-panel > p:nth-of-type(2) {
            font-size: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}
