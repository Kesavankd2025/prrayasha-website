"use client";

import Link from "next/link";
import { accountLinks } from "@/lib/storefront-data";
import {
  LayoutDashboard,
  User,
  MapPin,
  Heart,
  ChevronRight,
  LogOut,
  Package
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";

/**
 * Standardized icon map for consistent sidebar navigation.
 */
const iconMap: Record<string, any> = {
  "Dashboard": LayoutDashboard,
  "Account Details": User,
  "Orders": Package,
  "Address": MapPin
};

export default function AccountShell({
  activeHref,
  title,
  description,
  action,
  children,
}: {
  activeHref: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleSignOut = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmSignOut = () => {
    logout();
    router.push("/login");
    showToast("Successfully signed out", "success");
  };
  return (
    <div className="account-shell-root">
      <div className="account-layout-container">

        {/* SIDEBAR */}
        <aside className="account-sidebar-nav">
          <div className="sidebar-inner-card">

            {/* User Branding */}
            <div className="user-profile-summary">
              <div className="user-avatar-placeholder">
                {user?.fullName?.[0] || user?.name?.[0] || 'P'}
              </div>
              <div className="user-text-info">
                <h3>{user?.fullName || user?.name || " Guest"}</h3>
                <p>{user?.email}</p>
              </div>
            </div>



            {/* Navigation Menu */}
            <nav className="sidebar-links-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(accountLinks || []).map((link) => {
                const Icon = iconMap[link.label] || LayoutDashboard;
                const isActive = activeHref === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`sidebar-nav-item ${isActive ? "is-active" : ""}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: '14px',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      backgroundColor: isActive ? '#36533f' : 'transparent',
                      color: isActive ? '#fff' : '#666',
                      fontWeight: isActive ? '700' : '500'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ color: isActive ? 'var(--gold)' : 'inherit', display: 'flex', alignItems: 'center' }}>
                        <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                      </div>
                      <span style={{ fontSize: '14px' }}>{link.label}</span>
                    </div>
                    <ChevronRight
                      size={14}
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? 'translateX(0)' : 'translateX(-10px)',
                        transition: 'all 0.3s ease',
                        color: isActive ? 'var(--gold)' : 'inherit'
                      }}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Action Footer */}
            <div className="sidebar-end-actions">
              <button className="signout-btn-action" onClick={handleSignOut}>
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="account-main-view">
          <div className="view-content-card">
            <header className="view-content-header">
              <div className="header-labels">
                <h2>{title}</h2>
                <p>{description}</p>
              </div>
              {action && <div className="header-action">{action}</div>}
            </header>
            <div className="view-content-body">
              {children}
            </div>
          </div>
        </main>
      </div>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmSignOut}
        title="Sign Out"
        message="Are you sure you want to log out of your account? You will need to sign in again to manage your orders."
        confirmText="Yes, Sign Out"
        cancelText="Cancel"
        isDanger={true}
      />

      <style jsx>{`
        .account-shell-root {
          background: #fdfaf9;
          min-height: 100vh;
          padding: 0 1rem 4rem;
        }

        .account-layout-container {
          max-width: 1600px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 1.5rem;
          padding: 0 0.5rem;
          align-items: start;
          margin-top: 3rem;
        }

        /* Sidebar Styling */
        .account-sidebar-nav {
          position: sticky;
          top: 100px;
        }

        .sidebar-inner-card {
          background: #fff;
          border-radius: 28px;
          padding: 1.5rem 1.25rem;
          box-shadow: 0 15px 50px rgba(0,0,0,0.02);
          border: 1px solid #f2ece8;
        }

        .user-profile-summary {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding: 0 0.5rem;
        }

        .user-avatar-placeholder {
          width: 50px;
          height: 50px;
          background: #36533f0a;
          color: #36533f;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 800;
          border: 1px solid #36533f10;
          flex-shrink: 0;
        }

        .user-text-info h3 {
          font-family: var(--font-serif);
          font-size: 16px;
          color: #1a1a1a;
          margin: 0 0 2px 0;
        }

        .user-text-info p {
          font-size: 11px;
          color: #aaa;
          margin: 0;
          font-weight: 500;
        }


        .sidebar-links-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        .sidebar-nav-item {
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          border-radius: 16px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: #777;
          text-decoration: none;
          position: relative;
        }

        .sidebar-nav-item:hover {
          background: #fdfaf9;
          color: #36533f;
          transform: translateX(4px);
        }

        .sidebar-nav-item.is-active {
          background: #36533f0c;
          color: #36533f;
          font-weight: 800;
        }

        .sidebar-nav-item.is-active::before {
          content: "";
          position: absolute;
          left: 0;
          top: 20%;
          bottom: 20%;
          width: 4px;
          background: #36533f;
          border-radius: 0 4px 4px 0;
        }

        .item-content {
          display: flex;
          align-items: center;
          gap: 1.15rem;
          flex: 1;
        }


        .item-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          color: inherit;
          transition: color 0.3s ease;
        }

        .is-active .item-icon-wrap {
          color: var(--gold);
        }

        .item-label {
          font-size: 14.5px;
          letter-spacing: -0.01em;
        }

        .item-chevron {
          color: var(--gold);
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .sidebar-nav-item:hover .item-chevron,
        .sidebar-nav-item.is-active .item-chevron {
          opacity: 1;
          transform: translateX(0);
        }

        .sidebar-end-actions {
          border-top: 1px solid #f8f8f8;
          padding-top: 0.75rem;
        }

        .signout-btn-action {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #d9534f;
          font-size: 14px;
          font-weight: 700;
          padding: 0.75rem 1.25rem;
          width: 100%;
          border-radius: 14px;
          transition: all 0.3s ease;
          background: #d9534f05;
          border: none;
          cursor: pointer;
        }

        .signout-btn-action:hover {
          background: #d9534f10;
          transform: translateY(-2px);
        }

        /* View Content Styling */
        .account-main-view {
          min-width: 0;
        }

        .view-content-card {
          background: #fff;
          border-radius: 32px;
          padding: 2.5rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.02);
          border: 1px solid #f2ece8;
          min-height: auto;
        }

        .view-content-header {
          margin-bottom: 1.5rem;
          border-bottom: 1px solid #f8f8f8;
          padding-bottom: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 2rem;
        }

        .header-labels h2 {
          font-family: var(--font-serif);
          font-size: 32px;
          color: #36533f;
          margin: 0 0 0.4rem 0;
          letter-spacing: -0.02em;
        }

        .header-labels p {
          font-size: 15px;
          color: #999;
          margin: 0;
          line-height: 1.5;
        }


        @media (max-width: 1024px) {
          .account-layout-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .account-sidebar-nav {
            position: static;
          }
          .view-content-card {
            padding: 2rem;
          }
        }

        @media (max-width: 640px) {
          .account-shell-root {
            padding: 1.5rem 0 3rem 0;
          }
          .account-layout-container {
            gap: 1.5rem;
            margin-top: 1rem;
          }
          .view-content-card {
            padding: 1.5rem;
            min-height: auto;
          }
          .sidebar-inner-card {
            padding: 1.5rem 1.25rem;
          }
          .header-labels h2 {
            font-size: 24px;
          }
          .view-content-header {
            flex-direction: column;
            gap: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}
