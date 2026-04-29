import AccountShell from "@/components/AccountShell";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";

export default function MyReviewsPage() {
  return (
    <>
      <PageHero
        eyebrow="Account"
        title="My Reviews"
        description="Reviews now appear in the same boutique-styled account environment, with clearer surfaces and a more premium reading rhythm."
        accent="Post-purchase moments should still feel part of the brand, and this reviews page now follows the same visual system."
      />
      <section className="store-page-section">
        <div className="store-page-shell">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "My Reviews" }]} />
          <AccountShell activeHref="/my-reviews" title="My Reviews" description="Review pages now use the same shell, spacing, and card language as the rest of the site.">
            <div className="list-stack">
              <div className="list-card"><strong>Emerald Kanchipuram Heirloom</strong><span>Beautiful fall, elegant zari, premium finish.</span></div>
            </div>
          </AccountShell>
        </div>
      </section>
    </>
  );
}
