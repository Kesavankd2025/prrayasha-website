import Breadcrumbs from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";
import type { PolicyContent } from "@/lib/storefront-data";

export default function PolicyPage({ policy }: { policy: PolicyContent }) {
  return (
    <>
      <PageHero
        eyebrow="Customer Care"
        title={policy.title}
        description={policy.intro}
        accent="Clear policies, thoughtful service, and a smoother customer journey designed to feel as polished as the storefront itself."
      />
      <section className="store-page-section">
        <div className="store-page-shell">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: policy.title }]} />
          <div className="policy-stack">
            {policy.sections.map((section) => (
              <article key={section.heading} className="policy-card">
                <h2>{section.heading}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
