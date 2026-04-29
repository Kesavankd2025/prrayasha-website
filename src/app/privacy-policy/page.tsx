import React from "react";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function PrivacyPolicy() {
  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingBottom: '0' }}>
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #f2ece8', paddingTop: '1.5rem' }}>
        <Breadcrumbs 
          items={[
            { label: "Home", href: "/" },
            { label: "Privacy policy" }
          ]} 
        />
      </div>

      <section className="store-page-section">
        <div style={{ backgroundColor: '#fff', padding: '1.5rem 5% 0', borderRadius: '0', borderBottom: '1px solid #f2ece8', position: 'relative' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '2.5rem' }}>Privacy policy</h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', color: '#000', lineHeight: '1.8' }}>
            <div style={{ fontSize: '13px', color: '#888', fontStyle: 'italic', marginBottom: '-1rem' }}>
              Last updated: 01 March 2024
            </div>
            
            <section>
              <p>
                This Privacy Policy describes how Prrayasha Collections (the "Site", "we", "us", or "our") collects, uses, and discloses your personal information when you visit, use our services, or make a purchase from prrayashacollections.in (the "Site") or otherwise communicate with us (collectively, the "Services"). For purposes of this Privacy Policy, "you" and "your" means you as the user of the Services, whether you are a customer, website visitor, or another individual whose information we have collected pursuant to this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#36533f', marginBottom: '1rem', textTransform: 'capitalize' }}>Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time, including to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will post the revised Privacy Policy on the Site, update the "Last updated" date and take any other steps required by applicable law.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#36533f', marginBottom: '1rem', textTransform: 'capitalize' }}>How We Collect and Use Your Personal Information</h2>
              <p>
                To provide the Services, we collect and have collected over the past 12 months personal information about you from a variety of sources, as set out below. The information that we collect and use varies depending on how you interact with us. In addition to the specific uses set out below, we may use information we collect about you to communicate with you, provide the Services, comply with any applicable legal obligations, enforce any applicable terms of service, and to protect or defend the Services, our rights, and the rights of our users or others.
              </p>
            </section>
            
            <section>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#36533f', marginBottom: '1rem', textTransform: 'capitalize' }}>What Personal Information We Collect</h2>
              <p>
                The types of personal information we obtain about you depends on how you interact with our Site and use our Services. When we use the term "personal information", we are referring to information that identifies, relates to, describes or can be associated with you. The following sections describe the categories and specific types of personal information we collect.
              </p>
            </section>
            
            <section>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#36533f', marginBottom: '1rem', textTransform: 'capitalize' }}>Information We Collect Directly from You</h2>
              <p>Information that you directly submit to us through our Services may include:</p>
              <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li>Basic contact details including your name, address, phone number, email.</li>
                <li>Order information including your name, billing address, shipping address, payment confirmation, email address, phone number.</li>
                <li>Account information including your username, password, security questions.</li>
                <li>Shopping information including the items you view, put in your cart or add to your wishlist.</li>
              </ul>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
