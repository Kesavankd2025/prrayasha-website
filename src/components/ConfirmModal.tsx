"use client";

import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDanger = false,
}: ConfirmModalProps) {
  // Lock scroll
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
    <div className="confirm-backdrop" onClick={onClose}>
      <div className="confirm-card" onClick={(e) => e.stopPropagation()}>
        <button className="confirm-close" onClick={onClose}><X size={20} /></button>
        
        <div className="confirm-icon-wrap">
          <div className={`icon-bg ${isDanger ? 'bg-danger' : 'bg-primary'}`}>
            <AlertTriangle size={24} color={isDanger ? '#dc3545' : '#355440'} />
          </div>
        </div>

        <div className="confirm-content">
          <h3>{title}</h3>
          <p>{message}</p>
        </div>

        <div className="confirm-actions">
          <button className="btn-cancel" onClick={onClose}>{cancelText}</button>
          <button 
            className={`btn-confirm ${isDanger ? 'confirm-danger' : 'confirm-primary'}`} 
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style jsx>{`
        .confirm-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3000;
          padding: 1.5rem;
        }

        .confirm-card {
          background: #fff;
          width: 100%;
          max-width: 400px;
          border-radius: 24px;
          padding: 2rem;
          position: relative;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
          text-align: center;
          animation: confirmPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes confirmPop {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        .confirm-close {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          background: none;
          border: none;
          color: #ccc;
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .confirm-close:hover {
          background: #f8f9fa;
          color: #333;
        }

        .confirm-icon-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .icon-bg {
          width: 60px;
          height: 60px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bg-danger { background: #fff5f5; }
        .bg-primary { background: #f0f7f2; }

        .confirm-content h3 {
          font-family: var(--font-serif);
          font-size: 22px;
          color: #1a1210;
          margin: 0 0 0.75rem;
        }

        .confirm-content p {
          font-size: 14px;
          color: #666;
          line-height: 1.6;
          margin: 0 0 2rem;
        }

        .confirm-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .btn-cancel {
          background: #f8f9fa;
          color: #666;
          border: none;
          padding: 0.8rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-cancel:hover {
          background: #e9ecef;
          color: #333;
        }

        .btn-confirm {
          border: none;
          padding: 0.8rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 14px;
          color: #fff;
          cursor: pointer;
          transition: all 0.2s;
        }

        .confirm-danger {
          background: #dc3545;
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.2);
        }

        .confirm-danger:hover {
          background: #c82333;
          transform: translateY(-1px);
        }

        .confirm-primary {
          background: #36533f;
          box-shadow: 0 4px 12px rgba(54, 83, 63, 0.2);
        }

        .confirm-primary:hover {
          background: #2a4132;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
