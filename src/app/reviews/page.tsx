import React from "react";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function ReviewsPage() {
  const mockReviews = [
    {
      id: 1,
      name: "Jeyanthi RK",
      stars: 5,
      content: "Very good fabric and reasonable price I am very satisfied to purchase prrayasha collection"
    },
    {
      id: 2,
      name: "CSJ Deepa",
      stars: 5,
      content: "I have purchased lot of kurtis from Prayasha collections.very reasonable price .nice collections also.Jeni sister also very patience with the customers.i am very satisfied with Prayasha"
    }
  ];

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingBottom: '0' }}>
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #f2ece8', paddingTop: '1.5rem' }}>
        <Breadcrumbs 
          items={[
            { label: "Home", href: "/" },
            { label: "Reviews" }
          ]} 
        />
      </div>

      <section className="store-page-section" style={{ padding: '0 0 6rem', width: '100%', margin: '0 auto', backgroundColor: '#fff' }}>
        <div style={{ backgroundColor: '#fff', padding: '1.5rem 5% 4rem', borderRadius: '0' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '3rem' }}>Reviews</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '4rem', alignItems: 'start' }}>
          
          {/* Reviews List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {mockReviews.map((review) => (
              <div key={review.id} style={{ backgroundColor: '#fff', border: '1px solid #f2ece8', padding: '1.5rem', borderRadius: '16px', display: 'flex', gap: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <div style={{ 
                  width: '45px', 
                  height: '45px', 
                  borderRadius: '50%', 
                  backgroundColor: '#36533f', 
                  color: '#fff', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '20px', 
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" height="24" width="24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#000', marginBottom: '0.25rem' }}>
                    {review.name}
                  </h3>
                  <div style={{ color: '#fbbf24', fontSize: '18px', marginBottom: '0.75rem', display: 'flex', gap: '2px' }}>
                    ★ ★ ★ ★ ★
                  </div>
                  <p style={{ color: '#000', fontSize: '13px', lineHeight: '1.6' }}>
                    {review.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Login Promt Card */}
          <div style={{ backgroundColor: '#fff', border: '1px solid #f2ece8', borderRadius: '16px', padding: '3rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#000' }}>
              Please Login to add review !
            </h3>
          </div>

        </div>
        </div>
      </section>
    </div>
  );
}
