"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";
import apiClient from "@/lib/api-client";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    message: ""
  });
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === "fullName") {
      newValue = value.replace(/[^a-zA-Z\s]/g, '');
    } else if (name === "mobileNumber") {
      newValue = value.replace(/\D/g, '').slice(0, 10);
    }
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const newErrors = {
      fullName: !formData.fullName ? "Please enter full name." : "",
      email: !formData.email ? "Please enter email address." : (!/\S+@\S+\.\S+/.test(formData.email) ? "Please enter a valid email." : ""),
      mobileNumber: !formData.mobileNumber ? "Please enter mobile number." : (formData.mobileNumber.length < 10 ? "Please enter a valid 10-digit number." : ""),
      message: !formData.message ? "Please enter your message." : ""
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post("/contact/submit", formData);
      if (res.data.statusCode === 200) {
        alert("Thank you! Your message has been sent successfully.");
        setFormData({ fullName: "", email: "", mobileNumber: "", message: "" });
        setErrors({ fullName: "", email: "", mobileNumber: "", message: "" });
      } else {
        alert(res.data.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#fff', color: '#1a1210' }}>
      <PageHero
        eyebrow="Contact Us"
        title="We'd Love to Hear From You"
        description="Whether you're looking for styling advice or tracking an heirloom piece, our boutique team is here to assist you with a personal touch."
      />

      <section className="store-page-section contact-main-section">
        <div className="section-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
          </div>

          <div className="contact-grid">
            {/* Info Column */}
            <div className="contact-card">
              <p className="contact-eyebrow" style={{ color: 'var(--gold)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '11px', marginBottom: '0.75rem' }}>Get in Touch</p>
              <h2 className="contact-heading" style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', color: '#36533f', marginBottom: '2.5rem', lineHeight: '1.2' }}>Prrayasha Collections</h2>
              
              <div className="contact-info-stack" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1, justifyContent: 'center' }}>
                <div className="contact-info-item" style={{ display: 'flex', gap: '1.25rem', alignItems: 'start' }}>
                  <div className="contact-info-icon" style={{ width: '44px', height: '44px', backgroundColor: '#fdfaf9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', flexShrink: 0 }}>
                    <MapPin size={20} />
                  </div>
                  <div className="contact-info-copy">
                    <h4 className="contact-info-title" style={{ fontSize: '15px', fontWeight: '700', marginBottom: '0.4rem' }}>Our Boutique</h4>
                    <p className="contact-info-text" style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>Provident Cosmo City, DR Abdul Kalam Road, Pudhupakkam Village, Chengalpet - 603103</p>
                  </div>
                </div>

                <div className="contact-info-item" style={{ display: 'flex', gap: '1.25rem', alignItems: 'start' }}>
                  <div className="contact-info-icon" style={{ width: '44px', height: '44px', backgroundColor: '#fdfaf9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', flexShrink: 0 }}>
                    <Phone size={20} />
                  </div>
                  <div className="contact-info-copy">
                    <h4 className="contact-info-title" style={{ fontSize: '15px', fontWeight: '700', marginBottom: '0.4rem' }}>Call Us</h4>
                    <p className="contact-info-text" style={{ fontSize: '14px', color: '#666' }}>+91 91590 24967</p>
                    <p className="contact-info-meta" style={{ fontSize: '12px', color: '#999', marginTop: '0.2rem' }}>Available 10:00 AM – 8:00 PM</p>
                  </div>
                </div>

                <div className="contact-info-item" style={{ display: 'flex', gap: '1.25rem', alignItems: 'start' }}>
                  <div className="contact-info-icon" style={{ width: '44px', height: '44px', backgroundColor: '#fdfaf9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', flexShrink: 0 }}>
                    <Mail size={20} />
                  </div>
                  <div className="contact-info-copy">
                    <h4 className="contact-info-title" style={{ fontSize: '15px', fontWeight: '700', marginBottom: '0.4rem' }}>Email Us</h4>
                    <p className="contact-info-text" style={{ fontSize: '14px', color: '#666' }}>prayashacollections@gmail.com</p>
                  </div>
                </div>

                <div className="contact-info-item" style={{ display: 'flex', gap: '1.25rem', alignItems: 'start' }}>
                  <div className="contact-info-icon" style={{ width: '44px', height: '44px', backgroundColor: '#fdfaf9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', flexShrink: 0 }}>
                    <Clock size={20} />
                  </div>
                  <div className="contact-info-copy">
                    <h4 className="contact-info-title" style={{ fontSize: '15px', fontWeight: '700', marginBottom: '0.4rem' }}>Store Hours</h4>
                    <p className="contact-info-text" style={{ fontSize: '14px', color: '#666' }}>Open Every Day: 10:00 AM – 8:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="contact-card">
              <h3 className="contact-form-heading" style={{ fontSize: '24px', fontFamily: 'var(--font-serif)', marginBottom: '2rem', color: '#36533f' }}>Send us a message</h3>
              <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888' }}>
                    Full Name <span style={{ color: '#ff4d4f' }}>*</span>
                  </label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter the name" 
                    style={{ 
                      width: '100%', 
                      padding: '0.875rem 1.25rem', 
                      borderRadius: '12px', 
                      border: errors.fullName ? '1px solid #ff4d4f' : '1px solid #eee', 
                      backgroundColor: '#f9f9f9', 
                      fontSize: '14px', 
                      outline: 'none', 
                      transition: 'all 0.3s ease' 
                    }}
                    className="premium-input"
                  />
                  {errors.fullName && <p style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '0.4rem', marginLeft: '0.2rem' }}>{errors.fullName}</p>}
                </div>
                
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888' }}>
                    Mobile Number <span style={{ color: '#ff4d4f' }}>*</span>
                  </label>
                  <input 
                    type="tel" 
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="Enter the number" 
                    style={{ 
                      width: '100%', 
                      padding: '0.875rem 1.25rem', 
                      borderRadius: '12px', 
                      border: errors.mobileNumber ? '1px solid #ff4d4f' : '1px solid #eee', 
                      backgroundColor: '#f9f9f9', 
                      fontSize: '14px', 
                      outline: 'none', 
                      transition: 'all 0.3s ease' 
                    }}
                    className="premium-input"
                  />
                  {errors.mobileNumber && <p style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '0.4rem', marginLeft: '0.2rem' }}>{errors.mobileNumber}</p>}
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888' }}>
                    Email Address <span style={{ color: '#ff4d4f' }}>*</span>
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter the Email" 
                    style={{ 
                      width: '100%', 
                      padding: '0.875rem 1.25rem', 
                      borderRadius: '12px', 
                      border: errors.email ? '1px solid #ff4d4f' : '1px solid #eee', 
                      backgroundColor: '#f9f9f9', 
                      fontSize: '14px', 
                      outline: 'none', 
                      transition: 'all 0.3s ease' 
                    }}
                    className="premium-input"
                  />
                  {errors.email && <p style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '0.4rem', marginLeft: '0.2rem' }}>{errors.email}</p>}
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888' }}>
                    How can we help? <span style={{ color: '#ff4d4f' }}>*</span>
                  </label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4} 
                    placeholder="Tell us about your requirements..." 
                    style={{ 
                      width: '100%', 
                      height: '120px', 
                      padding: '0.875rem 1.25rem', 
                      borderRadius: '12px', 
                      border: errors.message ? '1px solid #ff4d4f' : '1px solid #eee', 
                      backgroundColor: '#f9f9f9', 
                      fontSize: '14px', 
                      outline: 'none', 
                      transition: 'all 0.3s ease', 
                      resize: 'none' 
                    }}
                    className="premium-input"
                  />
                  {errors.message && <p style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '0.4rem', marginLeft: '0.2rem' }}>{errors.message}</p>}
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  style={{ 
                    backgroundColor: '#36533f', 
                    color: '#fff', 
                    padding: '1.125rem', 
                    borderRadius: '12px', 
                    fontSize: '15px', 
                    fontWeight: '700', 
                    border: 'none', 
                    cursor: loading ? 'not-allowed' : 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '0.75rem',
                    transition: 'all 0.3s ease',
                    marginTop: 'auto',
                    opacity: loading ? 0.7 : 1
                  }}
                  className="send-button"
                >
                  {loading ? "Sending..." : "Send Message"} <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 350px), 1fr));
          gap: 2rem;
          align-items: stretch;
        }

        .contact-card {
          background-color: #fff;
          padding: 3.5rem;
          border-radius: 32px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.06);
          border: 1px solid #f0f0f0;
          display: flex;
          flex-direction: column;
        }

        .premium-input:focus {
          border-color: var(--gold) !important;
          background-color: #fff !important;
          box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1);
        }
        .send-button:hover {
          background-color: #2a4132 !important;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(54, 83, 63, 0.2);
        }

        @media (max-width: 1024px) {
          .contact-card {
            padding: 2.5rem;
            border-radius: 28px;
          }
        }

        @media (max-width: 768px) {
          .contact-main-section {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          .contact-grid {
            grid-template-columns: 1fr;
          }
          .contact-card {
            padding: 2rem;
            border-radius: 24px;
          }
        }

        @media (max-width: 480px) {
          .contact-main-section {
            padding-left: 0.875rem !important;
            padding-right: 0.875rem !important;
          }
          .contact-grid {
            gap: 1.5rem;
          }
          .contact-card {
            padding: 1.5rem;
            border-radius: 20px;
          }
        }

        @media (max-width: 360px) {
          .contact-grid {
            grid-template-columns: 1fr;
            /* Allow minmax to gracefully collapse on very small screens instead of overflowing */
          }
          .contact-card {
            padding: 1.25rem;
            border-radius: 16px;
          }
        }

        @media (max-width: 320px) {
          .contact-main-section {
            padding-left: 0.75rem !important;
            padding-right: 0.75rem !important;
          }
          .contact-grid {
            gap: 1rem;
          }
          .contact-card {
            padding: 1rem;
            border-radius: 14px;
          }
          .contact-eyebrow {
            font-size: 10px !important;
            letter-spacing: 0.14em !important;
          }
          .contact-heading {
            font-size: 24px !important;
            margin-bottom: 1.5rem !important;
          }
          .contact-form-heading {
            font-size: 20px !important;
            margin-bottom: 1.25rem !important;
          }
          .contact-info-stack {
            gap: 1.25rem !important;
          }
          .contact-info-item {
            gap: 0.875rem !important;
          }
          .contact-info-icon {
            width: 36px !important;
            height: 36px !important;
            border-radius: 10px !important;
          }
          .contact-info-copy {
            min-width: 0;
          }
          .contact-info-title {
            font-size: 13px !important;
          }
          .contact-info-text {
            font-size: 12px !important;
            line-height: 1.55 !important;
            overflow-wrap: anywhere;
          }
          .contact-info-meta {
            font-size: 11px !important;
            line-height: 1.45 !important;
          }
          .form-group label {
            font-size: 11px !important;
            margin-bottom: 0.5rem !important;
          }
          .premium-input {
            padding: 0.75rem 0.9rem !important;
            font-size: 13px !important;
            border-radius: 10px !important;
          }
          textarea.premium-input {
            height: 108px !important;
          }
          .send-button {
            padding: 0.95rem !important;
            font-size: 13px !important;
            border-radius: 10px !important;
            gap: 0.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
