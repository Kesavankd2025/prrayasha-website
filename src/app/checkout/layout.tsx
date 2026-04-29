import React from 'react';

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="checkout-layout-wrapper">
      {/* We use a specific div to hide the global navbar/footer via CSS if needed, 
          or we can just let this page render above them. To truly hide them without rewriting root layout, 
          we apply a global css override for standard navbars. */}
      {children}
      
      {/* The global navbar and footer are now visible as requested */}
    </div>
  );
}
