import Breadcrumbs from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";

export default function OrderConfirmationPage() {
  return (
    <>
      <PageHero
        eyebrow="Success"
        title="Order Confirmed"
        description="Confirmation now feels like a polished final step in the same boutique flow, rather than a disconnected afterthought."
        accent="The purchase journey now closes with the same calm brand expression seen across discovery, cart, and account pages."
      />
      <section className="store-page-section">
        <div className="store-page-shell">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Order Confirmed" }]} />
          <div className="summary-card success-card">
            <h2>Thank you for your order</h2>
            <p>Your order has been placed successfully and the collection will be prepared for dispatch soon.</p>
            <a href="/my-orders" className="store-cta">View Orders</a>
          </div>
        </div>
      </section>
    </>
  );
}
