"use client";

import { useEffect } from "react";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
}

export default function SuccessModal({ isOpen, onClose, orderId }: SuccessModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="success-backdrop">
      <div className="success-card">
        <div className="success-icon-wrap">
          <div className="icon-circle">
            <CheckCircle size={48} color="#fff" strokeWidth={2.5} />
          </div>
        </div>

        <div className="success-content">
          <h2>Order Confirmed!</h2>
          <p className="success-msg">Your selection has been curated and is now being prepared with care.</p>
          
          {orderId && (
            <div className="order-badge">
              <span className="badge-lbl">Order ID</span>
              <span className="badge-val">#{orderId}</span>
            </div>
          )}

          <p className="delivery-hint">A confirmation email has been sent to your registered address.</p>
        </div>

        <div className="success-actions">
          <button 
            className="btn-orders" 
            onClick={() => {
              onClose();
              router.push("/my-orders");
            }}
          >
            <ShoppingBag size={18} />
            <span>View My Orders</span>
          </button>
          
          <button 
            className="btn-continue" 
            onClick={() => {
              onClose();
              router.push("/shop");
            }}
          >
            <span>Continue Shopping</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .success-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(26, 18, 16, 0.6);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5000;
          padding: 1.5rem;
        }

        .success-card {
          background: #fff;
          width: 100%;
          max-width: 480px;
          border-radius: 32px;
          padding: 3rem 2rem;
          position: relative;
          box-shadow: 0 40px 100px rgba(0,0,0,0.25);
          text-align: center;
          overflow: hidden;
          animation: successPop 0.6s cubic-bezier(0.19, 1, 0.22, 1);
        }

        @keyframes successPop {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .success-icon-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .icon-circle {
          width: 88px;
          height: 88px;
          background: #36533f;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 15px 35px rgba(54, 83, 63, 0.25);
          animation: iconBounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
        }

        @keyframes iconBounce {
          0% { transform: scale(0); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .success-content h2 {
          font-family: var(--font-playfair), serif;
          font-size: 32px;
          color: #1a1210;
          margin: 0 0 1rem;
          letter-spacing: -0.01em;
        }

        .success-msg {
          font-size: 16px;
          color: #666;
          line-height: 1.6;
          margin: 0 0 2rem;
          max-width: 320px;
          margin-inline: auto;
        }

        .order-badge {
          display: inline-flex;
          flex-direction: column;
          background: #fdfaf9;
          border: 1px solid #f2ece8;
          padding: 0.75rem 2rem;
          border-radius: 16px;
          margin-bottom: 2rem;
        }

        .badge-lbl {
          font-size: 10px;
          text-transform: uppercase;
          color: #aaa;
          font-weight: 800;
          letter-spacing: 0.1em;
          margin-bottom: 0.25rem;
        }

        .badge-val {
          font-size: 18px;
          color: #36533f;
          font-weight: 700;
        }

        .delivery-hint {
          font-size: 13px;
          color: #999;
          margin-bottom: 2.5rem;
        }

        .success-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .btn-orders {
          background: #36533f;
          color: #fff;
          border: none;
          padding: 1.1rem;
          border-radius: 16px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: all 0.3s;
        }

        .btn-orders:hover {
          background: #2a4132;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(54, 83, 63, 0.2);
        }

        .btn-continue {
          background: #fff;
          color: #36533f;
          border: 1.5px solid #f2ece8;
          padding: 1.1rem;
          border-radius: 16px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: all 0.3s;
        }

        .btn-continue:hover {
          background: #fdfaf9;
          border-color: #36533f;
        }
      `}</style>
    </div>
  );
}
