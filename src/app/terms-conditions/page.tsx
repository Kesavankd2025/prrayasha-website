import React from "react";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function TermsAndConditions() {
  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingBottom: '0' }}>
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #f2ece8', paddingTop: '1.5rem' }}>
        <Breadcrumbs 
          items={[
            { label: "Home", href: "/" },
            { label: "Terms and Conditions" }
          ]} 
        />
      </div>

      <section className="store-page-section" style={{ padding: '0 0 6rem', width: '100%', margin: '0 auto', backgroundColor: '#fff' }}>
        <div style={{ backgroundColor: '#fff', padding: '1.5rem 5% 0', borderRadius: '0', borderBottom: '1px solid #f2ece8' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '2.5rem' }}>Terms and Conditions</h1>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', color: '#000', lineHeight: '1.8' }}>
            <section>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#36533f', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OVERVIEW</h2>
              <p>
                This website is operated by Prrayasha Collections. Throughout the site, the terms "we", "us" and "our" refer to Prrayasha Collections. Prrayasha Collections offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.
              </p>
              <p style={{ marginTop: '1rem' }}>
                By visiting our site and/ or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions ("Terms of Service", "Terms"), including those additional terms and conditions and policies referenced herein and/or available by hyperlink.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#36533f', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ONLINE STORE TERMS</h2>
              <p>
                By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#36533f', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>GENERAL CONDITIONS</h2>
              <p>
                We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices.
              </p>
            </section>
            
            <section>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#36533f', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ACCURACY, COMPLETENESS AND TIMELINESS OF INFORMATION</h2>
              <p>
                We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only and should not be relied upon or used as the sole basis for making decisions without consulting primary, more accurate, more complete or more timely sources of information.
              </p>
            </section>
            
            <section>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#36533f', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>MODIFICATIONS TO THE SERVICE AND PRICES</h2>
              <p>
                Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time. We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
