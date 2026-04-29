import React from 'react';
import { CheckCircle2, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OrderSuccessModalProps {
  isOpen: boolean;
  orderInfo: any;
}

export default function OrderSuccessModal({ isOpen, orderInfo }: OrderSuccessModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const orderId = orderInfo?.invoiceId || orderInfo?._id || "Processing...";

  return (
    <div className="order-success-overlay">
      <div className="order-success-modal">
        {/* Decorative Top */}
        <div className="modal-decor">
          <div className="decor-circle">
            <CheckCircle2 size={36} className="check-icon" />
          </div>
        </div>

        <div className="modal-content">
          <h2 className="success-title">Order Placed Successfully!</h2>
          <p className="success-desc">
            Thank you for your purchase. Your order <strong>#{orderId}</strong> has been received and is currently being processed.
          </p>

          <div className="action-buttons">
            <button 
              className="btn-primary" 
              onClick={() => router.push('/my-orders')}
            >
              <Package size={18} />
              <span>VIEW MY ORDERS</span>
            </button>
            <button 
              className="btn-secondary"
              onClick={() => router.push('/shop')}
            >
              <ShoppingBag size={18} />
              <span>CONTINUE SHOPPING</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .order-success-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.3s ease;
        }

        .order-success-modal {
          background: #fff;
          width: 100%;
          max-width: 420px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          text-align: center;
        }

        .modal-decor {
          background: linear-gradient(135deg, #d1ffe2 0%, #a8f0c6 100%);
          height: 120px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .decor-circle {
          width: 72px;
          height: 72px;
          background: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
        }

        .check-icon {
          color: #16a34a;
          stroke-width: 2.5;
        }

        .modal-content {
          padding: 3rem 2rem 2.5rem;
        }

        .success-title {
          font-family: var(--font-serif), serif;
          font-size: 24px;
          color: #1a1210;
          margin-bottom: 0.75rem;
          font-weight: 700;
        }

        .success-desc {
          color: #6b7280;
          font-size: 13px;
          line-height: 1.6;
          margin-bottom: 2rem;
          padding: 0 0.5rem;
        }

        .success-desc strong {
          color: #1a1210;
          font-weight: 700;
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .btn-primary, .btn-secondary {
          width: 100%;
          padding: 0.9rem;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background: #1c1817;
          color: #fff;
          border: none;
        }

        .btn-primary:hover {
          background: #000;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .btn-secondary {
          background: #fff;
          color: #8a4b65;
          border: 1px solid #8a4b65;
        }

        .btn-secondary:hover {
          background: #fdfafb;
          transform: translateY(-1px);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes popIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
