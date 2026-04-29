"use client";

import { useEffect, useState } from "react";
import AccountShell from "@/components/AccountShell";
import { CheckCircle2, Eye, Truck, Star, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import apiOrder from "@/apiProvider/order.provider";
import apiNotifyMe from "@/apiProvider/notifyme.provider";
import { IMAGE_BASE_URL } from "@/lib/api-client";
import { useToast } from "@/context/ToastContext";

type OrderStatus = "Pending" | "Packed" | "Shipped" | "Delivered" | "Return" | "Cancelled" | "Returned";

export default function MyOrdersPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [trackingOrder, setTrackingOrder] = useState<any | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ from: 0, to: 0, totalPages: 0 });

  const [reviewModalOrder, setReviewModalOrder] = useState<any | null>(null);
  const [reviewData, setReviewData] = useState<Record<string, { rating: number; comment: string }>>({});
  const [reviewedProducts, setReviewedProducts] = useState<Set<string>>(new Set());

  const [orderReviewStatus, setOrderReviewStatus] = useState<Record<string, boolean>>({});
  const [loadingReviews, setLoadingReviews] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await apiOrder.list({
        page,
        limit,
        search: searchQuery
      });
      console.log(res, "rrrrr");

      if (res.status) {
        setOrders(res.response.data);
        setTotal(res.response.total);
        setMeta({
          from: res.response.from,
          to: res.response.to,
          totalPages: res.response.totalPages
        });

        const deliveredOrders = res.response.data.filter(
          (o: any) => o.orderStatus === "Delivered"
        );

        const statusMap: Record<string, boolean> = {};

        await Promise.all(
          deliveredOrders.map(async (order: any) => {
            const uniqueProducts = Array.from(
              new Map(order.products.map((p: any) => [p.productId, p])).values()
            ) as any[];

            const results = await Promise.all(
              uniqueProducts.map(async (product: any) => {
                try {
                  const r = await apiNotifyMe.checkUserReview({
                    productId: product.productId,
                    orderId: order._id
                  });
                  return r.status && r.response?.data?.exists;
                } catch {
                  return false;
                }
              })
            );

            statusMap[order._id] = results.every(Boolean);
          })
        );

        setOrderReviewStatus(statusMap);
        const { data, total, from, to, totalPages } = res.response;
        setOrders(data);
        setTotal(total);
        setMeta({ from, to, totalPages });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReviewModal = async (order: any) => {
    setReviewModalOrder(order);
    setLoadingReviews(true);

    try {
      const uniqueProducts = Array.from(
        new Map(order.products.map((p: any) => [p.productId, p])).values()
      ) as any[];

      const alreadyReviewed = new Set<string>(reviewedProducts);

      await Promise.all(
        uniqueProducts.map(async (product: any) => {
          try {
            const res = await apiNotifyMe.checkUserReview({
              productId: product.productId,
              orderId: order._id
            });
            if (res.status && res.response?.data?.exists) {
              alreadyReviewed.add(`${order._id}_${product.productId}`);
            }
          } catch { }
        })
      );

      setReviewedProducts(alreadyReviewed);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, limit]);

  // Handle instant search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 0) {
        fetchOrders();
      } else {
        setPage(0); // This will trigger the [page, limit] effect
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchOrders();
  };

  const getDisplayStatus = (status: string) => {
    switch (status) {
      case "Shipped": return "Dispatched";
      case "Processing": return "Processing";
      case "Delivered": return "Delivered";
      case "Cancelled": return "Cancelled";
      default: return status;
    }
  };

  return (
    <AccountShell activeHref="/my-orders" title="Orders" description="Follow your selections from our boutique to your doorstep.">
      <div className="orders-page-content">

        <div className="table-controls">
          <div className="entries-control">
            Show
            <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(0); }}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            entries
          </div>
          <div className="search-control">
            Search:
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter orders..."
            />
          </div>
        </div>

        <div className="orders-table-wrapper">
          <table className="orders-data-table">
            <thead>
              <tr>
                <th>S. No <ArrowUpDown size={12} style={{ marginLeft: '4px', opacity: 0.5 }} /></th>
                <th>Order Id <ArrowUpDown size={12} style={{ marginLeft: '4px', opacity: 0.5 }} /></th>
                <th>Order Date <ArrowUpDown size={12} style={{ marginLeft: '4px', opacity: 0.5 }} /></th>
                <th>Payment Status <ArrowUpDown size={12} style={{ marginLeft: '4px', opacity: 0.5 }} /></th>
                <th>Status <ArrowUpDown size={12} style={{ marginLeft: '4px', opacity: 0.5 }} /></th>
                <th>Total <ArrowUpDown size={12} style={{ marginLeft: '4px', opacity: 0.5 }} /></th>
                <th>Action <ArrowUpDown size={12} style={{ marginLeft: '4px', opacity: 0.5 }} /></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr key="loading-row">
                  <td colSpan={7} className="empty-table-state">Loading orders...</td>
                </tr>
              ) : orders && orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr key={order._id?.toString() || order.id || `order-${index}`}>
                    <td>{(page * limit) + index + 1}</td>
                    <td className="order-id-cell">{order.orderId || order.invoiceId}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-')}</td>
                    <td>
                      <span className={`payment-status-pill status-${order.paymentStatus?.toLowerCase()}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="status-cell">
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                        <span>{getDisplayStatus(order.orderStatus)}</span>
                        {order.orderStatus === "Delivered" && (
                          <button
                            className="btn-rate-pulse"
                            onClick={() => !orderReviewStatus[order._id] && handleOpenReviewModal(order)}
                            disabled={orderReviewStatus[order._id]}
                            style={{
                              opacity: orderReviewStatus[order._id] ? 0.5 : 1,
                              cursor: orderReviewStatus[order._id] ? 'not-allowed' : 'pointer',
                              animation: orderReviewStatus[order._id] ? 'none' : undefined
                            }}
                          >
                            {orderReviewStatus[order._id] ? (
                              <>
                                <CheckCircle2 size={14} color="#fff" />
                                <span>Reviewed</span>
                              </>
                            ) : (
                              <>
                                <Star size={14} fill="#facc15" color="#facc15" />
                                <span>Rate Product</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="total-cell">₹{order.grandTotal?.toLocaleString()}</td>
                    <td className="actions-cell">
                      <div className="action-buttons-wrap">
                        <button
                          className="btn-view"
                          onClick={() => router.push(`/my-orders/details/${order._id}`)}
                        >
                          <Eye size={14} /> View
                        </button>
                        <button
                          className="btn-track"
                          onClick={() => setTrackingOrder(order)}
                        >
                          <Truck size={14} /> Track
                        </button>
                      </div>
                    </td>
                  </tr >
                ))
              ) : (
                <tr key="no-orders-row">
                  <td colSpan={7} className="empty-table-state">
                    No matching orders found.
                  </td>
                </tr>
              )
              }
            </tbody >
          </table >
        </div >

        <div className="table-footer">
          <div className="table-info">
            Showing {meta.from} to {meta.to} of {total} entries
          </div>
          <div className="pagination-controls">
            <button
              className={`pagination-btn ${page === 0 ? "disabled" : ""}`}
              onClick={() => page > 0 && setPage(page - 1)}
              disabled={page === 0}
            >
              Previous
            </button>
            {[...Array(meta.totalPages)].map((_, i) => (
              <button
                key={i}
                className={`pagination-btn ${page === i ? "active" : ""}`}
                onClick={() => setPage(i)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className={`pagination-btn ${page >= meta.totalPages - 1 ? "disabled" : ""}`}
              onClick={() => page < meta.totalPages - 1 && setPage(page + 1)}
              disabled={page >= meta.totalPages - 1}
            >
              Next
            </button>
          </div>
        </div>

        {/* Tracking Modal */}
        {
          trackingOrder && (
            <div className="tracking-modal-overlay" onClick={() => setTrackingOrder(null)}>
              <div className="tracking-modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-modal" onClick={() => setTrackingOrder(null)}>×</button>

                <div className="tracking-header">
                  <h3>Order Tracking - {trackingOrder.orderId || trackingOrder.invoiceId}</h3>
                </div>

                <div className="tracking-stepper-container">
                  <div className="stepper-line-bg"></div>
                  <div className="stepper-line-active" style={{
                    width:
                      trackingOrder.orderStatus === "Pending" ? "0%" :
                        trackingOrder.orderStatus === "Packed" ? "33%" :
                          trackingOrder.orderStatus === "Shipped" ? "66%" : "100%"
                  }}></div>

                  <div className="stepper-items">
                    <div className={`stepper-item ${["Pending", "Packed", "Shipped", "Delivered"].includes(trackingOrder.orderStatus) ? "completed" : ""}`}>
                      <div className="step-circle">
                        <CheckCircle2 size={24} fill={["Pending", "Packed", "Shipped", "Delivered"].includes(trackingOrder.orderStatus) ? "#36533f" : "#eee"} color="#fff" />
                      </div>
                      <div className="step-label">Order Placed</div>
                      <div className="step-date">{new Date(trackingOrder.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-')}</div>
                    </div>

                    <div className={`stepper-item ${["Packed", "Shipped", "Delivered"].includes(trackingOrder.orderStatus) ? "completed" : ""}`}>
                      <div className="step-circle">
                        <CheckCircle2 size={24} fill={["Packed", "Shipped", "Delivered"].includes(trackingOrder.orderStatus) ? "#36533f" : "#eee"} color="#fff" />
                      </div>
                      <div className="step-label">Packed</div>
                    </div>

                    <div className={`stepper-item ${["Shipped", "Delivered"].includes(trackingOrder.orderStatus) ? "completed" : ""}`}>
                      <div className="step-circle">
                        <CheckCircle2 size={24} fill={["Shipped", "Delivered"].includes(trackingOrder.orderStatus) ? "#36533f" : "#eee"} color="#fff" />
                      </div>
                      <div className="step-label">Shipped</div>
                    </div>

                    <div className={`stepper-item ${trackingOrder.orderStatus === "Delivered" ? "completed" : ""}`}>
                      <div className="step-circle">
                        <CheckCircle2 size={24} fill={trackingOrder.orderStatus === "Delivered" ? "#36533f" : "#eee"} color="#fff" />
                      </div>
                      <div className="step-label">Delivered</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }

        {/* Review Modal */}
        {
          reviewModalOrder && (
            <div className="tracking-modal-overlay" onClick={() => setReviewModalOrder(null)}>
              <div className="tracking-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto' }}>
                <button className="close-modal" onClick={() => setReviewModalOrder(null)}>×</button>

                <div className="tracking-header" style={{ marginBottom: '1.5rem' }}>
                  <h3>Rate Products - {reviewModalOrder.orderId || reviewModalOrder.invoiceId}</h3>
                </div>

                {loadingReviews ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#888', width: '100%' }}>
                    Checking reviews...
                  </div>
                ) : (
                  <div className="review-products-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {Array.from(new Map(reviewModalOrder.products.map((p: any) => [p.productId, p])).values()).map((product: any) => {
                      const pId = product.productId;
                      const isReviewed = reviewedProducts.has(`${reviewModalOrder._id}_${pId}`);
                      const currentReview = reviewData[pId] || { rating: 5, comment: "" };

                      return (
                        <div key={pId} style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <img src={`${IMAGE_BASE_URL}/${product.image?.path}`} alt={product.productName} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                            <h4 style={{ margin: 0, fontSize: '14px', color: '#333' }}>{product.productName}</h4>
                          </div>

                          {isReviewed ? (
                            <div style={{ color: '#2ecc71', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <CheckCircle2 size={18} /> Reviewed ✓
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    size={24}
                                    fill={star <= currentReview.rating ? '#eab308' : 'none'}
                                    color={star <= currentReview.rating ? '#eab308' : '#cbd5e1'}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setReviewData({ ...reviewData, [pId]: { ...currentReview, rating: star } })}
                                  />
                                ))}
                              </div>
                              <textarea
                                placeholder="Write your review here..."
                                rows={3}
                                value={currentReview.comment}
                                onChange={(e) => setReviewData({ ...reviewData, [pId]: { ...currentReview, comment: e.target.value } })}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', resize: 'none', fontSize: '13px' }}
                              />
                              <button
                                onClick={async () => {
                                  try {
                                    const payload = {
                                      productId: pId,
                                      orderId: reviewModalOrder._id,
                                      rating: currentReview.rating,
                                      comment: currentReview.comment
                                    };
                                    const res = await apiNotifyMe.addReview(payload);
                                    if (res.status) {
                                      showToast(res.response?.message || "Review submitted successfully.", "success");
                                      const newReviewed = new Set(reviewedProducts).add(`${reviewModalOrder._id}_${pId}`);
                                      setReviewedProducts(newReviewed);

                                      const uniqueProducts = Array.from(
                                        new Map(reviewModalOrder.products.map((p: any) => [p.productId, p])).values()
                                      ) as any[];

                                      const allReviewed = uniqueProducts.every((p: any) =>
                                        newReviewed.has(`${reviewModalOrder._id}_${p.productId}`)
                                      );

                                      if (allReviewed) {
                                        setOrderReviewStatus(prev => ({
                                          ...prev,
                                          [reviewModalOrder._id]: true
                                        }));
                                      }
                                    } else {
                                      showToast(res.response?.message || "Failed to submit review.", "error");
                                    }
                                  } catch (err: any) {
                                    console.error("Error submitting review", err);
                                    showToast(err.response?.data?.message || "Failed to submit review.", "error");
                                  }
                                }}
                                style={{ alignSelf: 'flex-start', background: '#36533f', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                              >
                                Submit Review
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )
        }

      </div >

      <style jsx>{`
        .orders-page-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* Controls Styling */
        .table-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          color: #666;
          font-size: 14px;
        }

        .entries-control select {
          margin: 0 0.5rem;
          padding: 0.4rem 0.6rem;
          border: 1px solid #eee;
          border-radius: 4px;
          background: #f9f9f9;
        }

        .search-control input {
          margin-left: 0.5rem;
          padding: 0.5rem 1rem;
          border: 1px solid #eee;
          border-radius: 4px;
          background: #f9f9f9;
          width: 200px;
        }

        .orders-table-wrapper {
          overflow-x: auto;
          background: #fff;
          border-radius: 12px;
          border: 1px solid #e0e7e1;
          margin-bottom: 1rem;
          width: 100%;
        }

        .orders-data-table {
          width: 100%;
          min-width: 900px;
          border-collapse: collapse;
          text-align: center;
          table-layout: auto;
        }

        .orders-data-table th {
          background: #fdf5f6;
          color: #1a1a1a;
          font-weight: 700;
          padding: 0.75rem 0.75rem;
          border-bottom: 1px solid #eee;
          border-right: 1px solid #eee;
          font-size: 14px;
          letter-spacing: 0.01em;
          text-transform: none;
          vertical-align: middle;
        }

        .orders-data-table th:last-child {
          border-right: none;
        }

        .orders-data-table td {
          padding: 0.75rem 0.75rem;
          border-bottom: 1px solid #eee;
          border-right: 1px solid #eee;
          color: #4a5a4e;
          font-size: 15px;
          vertical-align: middle;
        }

        .orders-data-table td:last-child {
          border-right: none;
        }

        .order-id-cell {
          font-weight: 700;
          color: #36533f;
        }

        .status-cell {
          color: #5d7364;
          font-weight: 600;
        }

        .total-cell {
          font-weight: 800;
          color: #1a1a1a;
        }

        .actions-cell {
          width: 170px;
        }

        /* Status Pill */
        .payment-status-pill {
          background: #50cd89;
          color: #fff;
          padding: 0.35rem 0.8rem;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.02em;
          white-space: nowrap;
          display: inline-block;
        }
        
        .status-failed { background: #e74c3c; }
        .status-pending { background: #f39c12; }

        /* Action Buttons */
        .action-buttons-wrap {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.2rem 0;
        }

        .btn-view, .btn-track {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          text-align: center;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          min-width: 80px;
          white-space: nowrap;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }

        .btn-view {
          background: #D4AF37;
          color: #fff;
        }

        .btn-view:hover {
          background: #b8962f;
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(212, 175, 55, 0.2);
        }

        .btn-track {
          background: #376ed4;
          color: #fff;
        }

        .btn-track:hover {
          background: #2851a3;
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(55, 110, 212, 0.2);
        }

        .btn-rate-pulse {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #8a4b65;
          color: #fff;
          border: none;
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 0 0 rgba(138, 75, 101, 0.4);
          animation: pulse 2s infinite;
          white-space: nowrap;
        }

        .btn-rate-pulse:hover {
          background: #6e3a50;
          transform: translateY(-2px);
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(138, 75, 101, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(138, 75, 101, 0); }
          100% { box-shadow: 0 0 0 0 rgba(138, 75, 101, 0); }
        }

        .empty-table-state {
          text-align: center;
          padding: 4rem;
          color: #aaa;
        }

        /* Footer & Pagination Styling */
        .table-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid #f2f6f3;
          font-size: 13px;
          color: #666;
        }

        .pagination-controls {
          display: flex;
          gap: 2px;
        }

        .pagination-btn {
          padding: 0.5rem 0.85rem;
          border: 1px solid #eee;
          background: #fff;
          color: #333;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pagination-btn.active {
          background: #252b5c;
          color: #fff;
          border-color: #252b5c;
        }

        .pagination-btn.disabled {
          color: #ccc;
          cursor: not-allowed;
          background: #f9f9f9;
        }

        .pagination-btn:not(.active):not(.disabled):hover {
          background: #f1f6f3;
          border-color: #36533f;
        }

        @media (max-width: 767px) {
          .table-footer {
            flex-direction: column;
            gap: 1rem;
            align-items: center;
          }
        }

        @media (max-width: 640px) {
          .table-controls {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
            margin-bottom: 1rem;
          }
          .search-control {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 0.5rem;
          }
          .search-control input {
            margin-left: 0;
            width: 100%;
            flex: 1;
          }
        }

        /* Modal & Stepper Styling */
        .tracking-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 1rem;
        }

        .tracking-modal-content {
          background: #fff;
          width: 100%;
          max-width: 900px;
          border-radius: 12px;
          padding: 2.5rem;
          position: relative;
          box-shadow: 0 20px 50px rgba(0,0,0,0.15);
        }

        .close-modal {
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-size: 24px;
          color: #999;
          background: none;
          border: none;
          cursor: pointer;
        }

        .tracking-header {
          text-align: center;
          margin-bottom: 3rem;
          border-bottom: 1px solid #eee;
          padding-bottom: 1rem;
        }

        .tracking-header h3 {
          font-size: 20px;
          color: #252b5c;
          font-weight: 700;
        }

        .tracking-stepper-container {
          position: relative;
          padding: 2rem 0;
          margin: 0 2rem;
        }

        .stepper-line-bg {
          position: absolute;
          top: 62px;
          left: 0;
          right: 0;
          height: 2px;
          background: #eee;
          z-index: 1;
        }

        .stepper-line-active {
          position: absolute;
          top: 62px;
          left: 0;
          height: 2px;
          background: #36533f;
          z-index: 2;
          transition: width 0.5s ease;
        }

        .stepper-items {
          display: flex;
          justify-content: space-between;
          position: relative;
          z-index: 3;
        }

        .stepper-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          width: 120px;
        }

        .step-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          box-shadow: 0 0 0 4px #fff;
        }

        .step-label {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-bottom: 0.25rem;
        }

        .step-date {
          font-size: 13px;
          color: #666;
          font-weight: 500;
        }

        @media (max-width: 767px) {
          .tracking-modal-content { padding: 1.5rem; }
          .stepper-items { flex-direction: column; align-items: flex-start; gap: 2rem; }
          .stepper-line-bg, .stepper-line-active { display: none; }
          .stepper-item { flex-direction: row; text-align: left; width: 100%; gap: 1rem; }
          .step-circle { margin-bottom: 0; }
        }
      `}</style>
    </AccountShell >
  );
}
