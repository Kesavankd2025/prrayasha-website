"use client";

import { useState, useEffect } from "react";
import AccountShell from "@/components/AccountShell";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useRouter, useParams } from "next/navigation";

export default function EditAddressPage() {
  const router = useRouter();
  const { id } = useParams();

  // Mock data for initial state - in a real app, you'd fetch this using the ID
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to save address would go here
    router.push("/my-addresses");
  };

  return (
    <AccountShell
      activeHref="/my-addresses"
      title="Edit Address"
      description="Update your delivery information for a personalized experience."
    >
      <div className="edit-address-page">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Edit Address" }]} />

        <div className="form-container">
          <div className="section-title">
            <h2>Edit Address</h2>
            <div className="underline"></div>
          </div>

          <form onSubmit={handleSubmit} className="address-form">
            <div className="form-row">
              <div className="form-group">
                <label>First name <span>*</span></label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value.replace(/[^a-zA-Z\s]/g, "") })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last name <span>*</span></label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value.replace(/[^a-zA-Z\s]/g, "") })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setFormData({ ...formData, phone: val });
                }}
              />
            </div>

            <div className="form-group">
              <label>Address <span>*</span></label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address"
                required
                className="mb-2"
              />
              <input
                type="text"
                value={formData.apartment}
                onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                placeholder="Apartment, suite, unit etc. (optional)"
              />
            </div>

            <div className="form-group">
              <label>Town / City <span>*</span></label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value.replace(/[^a-zA-Z\s]/g, "") })}
                required
              />
            </div>

            <div className="form-group">
              <label>State <span>*</span></label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Pincode</label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setFormData({ ...formData, pincode: val });
                }}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">SUBMIT</button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .edit-address-page {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .section-title {
          margin-bottom: 2.5rem;
        }

        .section-title h2 {
          font-size: 20px;
          font-weight: 700;
          color: #252b5c;
          margin-bottom: 0.5rem;
        }

        .underline {
          width: 50px;
          height: 3px;
          background: #ff4d6d;
          border-radius: 2px;
        }

        .address-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 800px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .form-group label {
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        .form-group label span {
          color: #ff4d6d;
        }

        .form-group input {
          width: 100%;
          padding: 1.1rem 1.5rem;
          background: #f5f5f5;
          border: 1px solid #eee;
          border-radius: 4px;
          font-size: 14px;
          color: #666;
          transition: all 0.2s;
        }

        .form-group input:focus {
          outline: none;
          border-color: #36533f;
          background: #fff;
        }

        .mb-2 {
          margin-bottom: 0.5rem;
        }

        .form-actions {
          margin-top: 2rem;
        }

        .submit-btn {
          background: #1e1b39;
          color: #fff;
          padding: 1rem 3rem;
          border-radius: 4px;
          font-weight: 700;
          font-size: 14px;
          border: none;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .submit-btn:hover {
          opacity: 0.9;
        }

        @media (max-width: 767px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </AccountShell>
  );
}
