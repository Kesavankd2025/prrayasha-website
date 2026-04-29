"use client";

import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs-nav">
      <div className="breadcrumbs-container">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <span key={`${item.label}-${index}`} className="breadcrumb-item-wrapper">
              {item.href && !isLast ? (
                <Link href={item.href} className="breadcrumb-link">{item.label}</Link>
              ) : (
                <span className="breadcrumb-current">{item.label}</span>
              )}
              {!isLast && <span className="breadcrumb-separator">/</span>}
            </span>
          );
        })}
      </div>
      <style jsx>{`
        .breadcrumbs-nav {
          padding: 12px 2px;
          background-color: transparent;
        }
        .breadcrumbs-container {
          max-width: 1440px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          flex-wrap: wrap;
        }
        .breadcrumb-item-wrapper {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        .breadcrumb-link {
          color: #36533f;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
          opacity: 0.8;
        }
        .breadcrumb-current {
          color: #dba236;
          font-weight: 600;
        }
        .breadcrumb-separator {
          color: #ccc;
          font-size: 14px;
          font-weight: 400;
        }

        @media (max-width: 767px) {
          .breadcrumbs-container {
            font-size: 10px;
            gap: 0.5rem;
          }
          .breadcrumb-item-wrapper {
            gap: 0.5rem;
          }
          .breadcrumb-separator {
            font-size: 12px;
          }
        }

        @media (max-width: 320px) {
          .breadcrumbs-container {
            font-size: 9px;
            gap: 0.4rem;
          }
          .breadcrumb-item-wrapper {
            gap: 0.4rem;
          }
          .breadcrumb-separator {
            font-size: 10px;
          }
        }
      `}</style>
    </nav>
  );
}
