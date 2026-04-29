"use client";

import AccountShell from "@/components/AccountShell";
import {
  ChevronRight,
  Eye,
  Truck,
  CheckCircle2,
  Package,
  ShoppingCart,
  Heart
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import apiCustomer from "@/apiProvider/customer.provider";

export default function MyAccountPage() {
  const { user } = useAuth();
  const displayName = user?.fullName || user?.name || "Guest";

  const [stats, setStats] = useState({
    orderCount: 0,
    cartCount: 0,
    wishlistCount: 0,
    latestOrder: null as any
  });
  const [loading, setLoading] = useState(true);
  const [trackingOrder, setTrackingOrder] = useState<any | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiCustomer.getDashboardStats();
        if (res.status) {
          setStats(res.response.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  const padNumber = (num: number) => num.toString().padStart(2, '0');

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
    <AccountShell
      activeHref="/my-account"
      title="Dashboard"
      description="Welcome back to your Prrayasha account. Manage your orders and profile here."
    >
      <div className="dashboard-content">

        <div className="summary-stats-grid">
          <Link href="/my-orders" className="stat-box">
            <Package size={24} />
            <div className="stat-text">
              <span className="stat-val">{loading ? ".." : padNumber(stats.orderCount)}</span>
              <span className="stat-lbl">Orders</span>
            </div>
          </Link>
          <Link href="/cart" className="stat-box">
            <ShoppingCart size={24} />
            <div className="stat-text">
              <span className="stat-val">{loading ? ".." : padNumber(stats.cartCount)}</span>
              <span className="stat-lbl">Cart</span>
            </div>
          </Link>
          <Link href="/wishlist" className="stat-box">
            <Heart size={24} />
            <div className="stat-text">
              <span className="stat-val">{loading ? ".." : padNumber(stats.wishlistCount)}</span>
              <span className="stat-lbl">Wishlist</span>
            </div>
          </Link>
        </div>

        <div className="dashboard-welcome-section">
          <h2 className="welcome-heading">Hello, {displayName}</h2>
          <p className="welcome-subtext">
            From your account dashboard. you can easily check & view your recent orders, manage your shipping and billing addresses and edit your password and account details.
          </p>
        </div>

        <div className="recent-order-highlight">
          <div className="section-header-flex">
            <h3 className="section-title">Recently Ordered:</h3>
          </div>

          {loading ? (
            <div className="premium-order-card loading" style={{ textAlign: 'center' }}>
              <p>Fetching your latest treasure...</p>
            </div>
          ) : stats.latestOrder ? (
            <div className="premium-order-card">
              <div className="order-main-info">
                <div className="order-id-group">
                  <div className="icon-circle">
                    <Package size={20} />
                  </div>
                  <div className="id-stack">
                    <span className="label">Order Id :</span>
                    <span className="value">{stats.latestOrder.orderId || stats.latestOrder.invoiceId}</span>
                  </div>
                </div>
              </div>

              <div className="order-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Order Date :</span>
                  <span className="detail-value">{new Date(stats.latestOrder.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-')}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Payment Status :</span>
                  <span className="detail-value">{stats.latestOrder.paymentStatus}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Order Status :</span>
                  <span className="detail-value status-highlight">{getDisplayStatus(stats.latestOrder.orderStatus)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Total :</span>
                  <span className="detail-value price-highlight">₹{stats.latestOrder.grandTotal?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="premium-order-card no-orders">
              <div className="empty-state-content">
                <Package size={48} strokeWidth={1} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <p>No orders found yet.</p>
                <Link href="/shop" className="shop-link">Begin Your Collection</Link>
              </div>
            </div>
          )}
        </div>

        {/* Tracking Modal */}
        {trackingOrder && (
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
        )}

      </div>

      <style jsx>{`
        .dashboard-content {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .summary-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        .stat-box {
          background: #fff;
          padding: 1.5rem;
          border-radius: 24px;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          border: 1px solid #f2ece8;
          color: #36533f;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          box-shadow: 0 4px 15px rgba(54, 83, 63, 0.02);
        }

        .stat-box:hover {
          border-color: #36533f30;
          transform: translateY(-4px);
          box-shadow: 0 15px 35px rgba(54, 83, 63, 0.06);
        }

        .stat-text {
          display: flex;
          flex-direction: column;
        }

        .stat-val {
          font-size: 24px;
          font-weight: 800;
          line-height: 1;
          color: #1a1a1a;
        }

        .stat-lbl {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: #999;
          margin-top: 5px;
          letter-spacing: 0.05em;
        }

        .dashboard-welcome-section {
          background: linear-gradient(135deg, #36533f08 0%, #ffffff 100%);
          padding: 2.5rem;
          border-radius: 30px;
          border: 1px solid #36533f0a;
        }

        .welcome-heading {
          font-family: var(--font-serif);
          font-size: 32px;
          color: #36533f;
          margin: 0 0 1rem 0;
          letter-spacing: -0.02em;
        }

        .welcome-subtext {
          font-size: 15px;
          color: #666;
          line-height: 1.7;
          max-width: 750px;
          margin: 0;
        }

        .recent-order-highlight {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .section-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .section-title {
          font-size: 20px;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .view-all-link {
          font-size: 13px;
          font-weight: 700;
          color: #36533f;
          text-decoration: none;
          margin: 0;
        }

        .order-summary-card {
          background: #fff;
          border: 1px solid #f2ece8;
          border-radius: 20px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 100%;
        }

        .no-orders {
          text-align: center;
          padding: 3rem 2rem;
          color: #888;
        }

        .shop-link {
          margin-top: 1rem;
          color: var(--gold, #c5a059);
          font-weight: 600;
          text-decoration: underline;
        }

        .order-row {
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all 0.3s ease;
        }

        .view-all-link:hover {
          color: var(--gold);
          gap: 8px;
        }

        .premium-order-card {
          background: #fff;
          border: 1px solid #f2ece8;
          border-radius: 28px;
          padding: 2.5rem;
          box-shadow: 0 10px 40px rgba(0,0,0,0.03);
          width: 100%;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }

        .premium-order-card::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          width: 150px;
          height: 150px;
          background: radial-gradient(circle at top right, #36533f05 0%, transparent 70%);
          pointer-events: none;
        }

        .premium-order-card:hover {
          box-shadow: 0 25px 60px rgba(54, 83, 63, 0.08);
          border-color: #36533f15;
          transform: translateY(-4px);
        }

        .order-main-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #f8f8f8;
        }

        .order-id-group {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .icon-circle {
          width: 48px;
          height: 48px;
          background: #36533f0a;
          color: #36533f;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #36533f10;
        }

        .id-stack {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .id-stack .label {
          font-size: 11px;
          font-weight: 700;
          color: #aaa;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .id-stack .value {
          font-size: 16px;
          font-weight: 800;
          color: #1a1a1a;
        }

        .order-status-badge {
          padding: 8px 18px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 8px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: #f8f8f8;
          color: #666;
        }

        .order-status-badge.status-paid {
          background: #36533f10;
          color: #36533f;
        }

        .order-status-badge.status-pending {
          background: #f39c1215;
          color: #f39c12;
        }

        .order-status-badge.status-failed {
          background: #e74c3c15;
          color: #e74c3c;
        }

        .status-dot {
}

        .dashboard-welcome-section {
          background: linear-gradient(135deg, #36533f08 0%, #ffffff 100%);
          padding: 2.5rem;
          border-radius: 30px;
          border: 1px solid #36533f0a;
        }

        .welcome-heading {
          font-family: var(--font-serif);
          font-size: 32px;
          color: #36533f;
          margin: 0 0 1rem 0;
          letter-spacing: -0.02em;
        }

        .welcome-subtext {
          font-size: 15px;
          color: #666;
          line-height: 1.7;
          max-width: 750px;
          margin: 0;
        }

        .recent-order-highlight {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .section-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .section-title {
          font-size: 20px;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .view-all-link {
          font-size: 13px;
          font-weight: 700;
          color: #36533f;
          text-decoration: none;
          margin: 0;
        }

        .order-summary-card {
          background: #fff;
          border: 1px solid #f2ece8;
          border-radius: 20px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 100%;
        }

        .no-orders {
          text-align: center;
          padding: 3rem 2rem;
          color: #888;
        }

        .shop-link {
          margin-top: 1rem;
          color: var(--gold, #c5a059);
          font-weight: 600;
          text-decoration: underline;
        }

        .order-row {
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all 0.3s ease;
        }

        .view-all-link:hover {
          color: var(--gold);
          gap: 8px;
        }

        .premium-order-card {
          background: #fff;
          border: 1px solid #f2ece8;
          border-radius: 28px;
          padding: 2.5rem;
          box-shadow: 0 10px 40px rgba(0,0,0,0.03);
          width: 100%;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }

        .premium-order-card::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          width: 150px;
          height: 150px;
          background: radial-gradient(circle at top right, #36533f05 0%, transparent 70%);
          pointer-events: none;
        }

        .premium-order-card:hover {
          box-shadow: 0 25px 60px rgba(54, 83, 63, 0.08);
          border-color: #36533f15;
          transform: translateY(-4px);
        }

        .order-main-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #f8f8f8;
        }

        .order-id-group {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .icon-circle {
          width: 48px;
          height: 48px;
          background: #36533f0a;
          color: #36533f;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #36533f10;
        }

        .id-stack {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .id-stack .label {
          font-size: 11px;
          font-weight: 700;
          color: #aaa;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .id-stack .value {
          font-size: 16px;
          font-weight: 800;
          color: #1a1a1a;
        }

        .order-status-badge {
          padding: 8px 18px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 8px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: #f8f8f8;
          color: #666;
        }

        .order-status-badge.status-paid {
          background: #36533f10;
          color: #36533f;
        }

        .order-status-badge.status-pending {
          background: #f39c1215;
          color: #f39c12;
        }

        .order-status-badge.status-failed {
          background: #e74c3c15;
          color: #e74c3c;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          background: currentColor;
          border-radius: 50%;
          display: block;
        }

        .order-details-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          margin-bottom: 0;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .detail-label {
          font-size: 12px;
          color: #888;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .detail-value {
          font-size: 15px;
          color: #1a1a1a;
          font-weight: 700;
        }

        .price-highlight {
          color: #36533f;
          font-size: 22px;
          font-weight: 800;
        }

        .status-highlight {
          color: #d4af37;
          font-weight: 700;
        }

        .order-footer-action {
          display: flex;
        }

        .action-btn-prime {
          background: #36533f;
          color: #fff;
          padding: 1.1rem 2rem;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s ease;
          text-align: center;
          flex: 1;
          letter-spacing: 0.02em;
          box-shadow: 0 10px 25px rgba(54, 83, 63, 0.15);
        }

        .action-btn-prime:hover {
          background: #2a4132;
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(54, 83, 63, 0.25);
        }

        .empty-state-content {
          text-align: center;
          padding: 2rem 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #888;
        }

        .empty-state-content p {
          font-size: 16px;
          margin: 0 0 1.5rem;
          color: #666;
        }
        
        .status-pending {
          color: #f39c12;
        }

        .status-failed {
          color: #e74c3c;
        }

        .btn-view, .btn-track {
           display: inline-flex;
           align-items: center;
           justify-content: center;
           gap: 0.5rem;
           padding: 0.6rem 1.25rem;
           border-radius: 8px;
           font-size: 13px;
           font-weight: 700;
           text-align: center;
           text-decoration: none;
           border: none;
           cursor: pointer;
           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
           flex: 1;
           box-shadow: 0 4px 10px rgba(0,0,0,0.05);
           color: #fff;
         }
 
         .btn-view {
           background: #252b5c;
         }
 
         .btn-track {
           background: #007bff;
         }
 
         .btn-view:hover {
           background: #1a1e42;
           transform: translateY(-2px);
           box-shadow: 0 6px 15px rgba(37, 43, 92, 0.15);
         }
 
         .btn-track:hover {
           background: #0069d9;
           transform: translateY(-2px);
           box-shadow: 0 6px 15px rgba(0, 123, 255, 0.15);
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
 
        .addresses-dashboard-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-top: 1rem;
        }

        .address-column {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        @media (max-width: 1024px) {
          .summary-stats-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 0.75rem;
          }
          .stat-box {
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            text-align: center;
            padding: 1.25rem 0.5rem;
            gap: 0.5rem;
            border-radius: 16px;
            min-height: 120px;
          }
          .stat-box :global(svg) {
            width: 24px;
            height: 24px;
            display: block;
            flex-shrink: 0;
            margin: 0 auto;
          }
          .stat-text {
            align-items: center;
            width: 100%;
            text-align: center;
          }
          .stat-val {
            font-size: 20px;
          }
          .stat-lbl {
            font-size: 10px;
            margin-top: 2px;
          }
          .order-details-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }
          .premium-order-card {
            padding: 1.5rem;
          }
          .tracking-modal-content { padding: 1.5rem; }
          .stepper-items { flex-direction: column; align-items: flex-start; gap: 2rem; }
          .stepper-line-bg, .stepper-line-active { display: none; }
          .stepper-item { flex-direction: row; text-align: left; width: 100%; gap: 1rem; }
          .step-circle { margin-bottom: 0; }
        }

        @media (max-width: 640px) {
          .summary-stats-grid {
            gap: 0.5rem;
          }
          .stat-box {
            min-height: 108px;
            padding: 1rem 0.4rem;
            gap: 0.4rem;
          }
          .stat-box :global(svg) {
            width: 22px;
            height: 22px;
          }
        }

        @media (max-width: 360px) {
          .order-details-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
      `}</style>
    </AccountShell>
  );
}
