"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
    id: string;
    message: string;
    type: ToastType;
    onRemove: (id: string) => void;
}

const theme = {
    success: {
        bg: "rgba(240, 253, 244, 0.95)",
        border: "rgba(34, 197, 94, 0.2)",
        accent: "#22c55e",
        icon: CheckCircle2,
        color: "#166534"
    },
    error: {
        bg: "rgba(254, 242, 242, 0.95)",
        border: "rgba(239, 68, 68, 0.2)",
        accent: "#ef4444",
        icon: AlertCircle,
        color: "#991b1b"
    },
    info: {
        bg: "rgba(255, 251, 235, 0.95)",
        border: "rgba(245, 158, 11, 0.2)",
        accent: "#f59e0b",
        icon: Info,
        color: "#92400e"
    }
};

export function ToastItem({ id, message, type, onRemove }: ToastProps) {
    const [visible, setVisible] = useState(false);
    const config = theme[type];
    const Icon = config.icon;

    useEffect(() => {
        const enterTimer = setTimeout(() => setVisible(true), 10);
        
        const exitTimer = setTimeout(() => {
            setVisible(false);
            setTimeout(() => onRemove(id), 400);
        }, 3500);

        return () => {
            clearTimeout(enterTimer);
            clearTimeout(exitTimer);
        };
    }, [id, onRemove]);

    return (
        <div style={{
            background: config.bg,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            color: config.color,
            padding: "16px 20px",
            borderRadius: "16px",
            fontSize: "14px",
            fontWeight: 500,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
            border: `1px solid ${config.border}`,
            borderLeft: `4px solid ${config.accent}`,
            transform: visible ? "translateX(0) scale(1)" : "translateX(40px) scale(0.95)",
            opacity: visible ? 1 : 0,
            transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
            maxWidth: "380px",
            width: "fit-content",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "12px",
            position: "relative",
            pointerEvents: "auto",
        }}>
            <Icon size={20} strokeWidth={2.5} style={{ flexShrink: 0 }} />
            <span style={{ lineHeight: "1.4" }}>{message}</span>
            <button 
                onClick={() => {
                    setVisible(false);
                    setTimeout(() => onRemove(id), 400);
                }}
                style={{
                    padding: "4px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "inherit",
                    opacity: 0.5,
                    transition: "opacity 0.2s",
                    marginLeft: "8px"
                }}
                onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseOut={(e) => (e.currentTarget.style.opacity = "0.5")}
            >
                <X size={16} />
            </button>
        </div>
    );
}

export function ToastContainer({ toasts, onRemove }: { toasts: any[]; onRemove: (id: string) => void }) {
    return (
        <div style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            zIndex: 100000,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            pointerEvents: "none"
        }}>
            {toasts.map((t) => (
                <ToastItem key={t.id} {...t} onRemove={onRemove} />
            ))}
        </div>
    );
}
