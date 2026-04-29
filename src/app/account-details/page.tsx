"use client";

import { useState, useEffect } from "react";
import AccountShell from "@/components/AccountShell";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import apiCustomer from "@/apiProvider/customer.provider";

export default function AccountDetailsPage() {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.fullName || user.name || "",
        email: user.email || "",
        phone: user.phoneNumber || user.phone || ""
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return showToast("Name is required", "error");
    if (!formData.phone || formData.phone.length !== 10) return showToast("Enter a valid 10-digit mobile number", "error");
    if (!formData.email.toLowerCase().endsWith("@gmail.com")) {
      return showToast("Please provide a valid Gmail address (e.g., example@gmail.com)", "error");
    }

    setIsSaving(true);
    try {
      const res = await apiCustomer.updateProfile(formData);
      if (res.status) {
        showToast("Account details updated successfully", "success");
        if (res.response?.data?.user) {
          updateUser(res.response.data.user);
        }
      } else {
        const msg = (res as any).response?.data?.message || "Failed to update profile";
        showToast(msg, "error");
      }
    } catch (error) {
      showToast("An unexpected error occurred", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AccountShell
      activeHref="/account-details"
      title="Account Details"
      description="Manage your personal information and contact preferences."
    >
      <div className="account-details-content">
        <div className="details-card">
          <form onSubmit={handleSubmit} className="details-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your Full Name"
                className="details-input"
                disabled={isSaving}
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                className="details-input"
                disabled={isSaving}
              />
            </div>

            <div className="form-group mobile-group">
              <label>Mobile number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setFormData({ ...formData, phone: val });
                }}
                placeholder="Your Mobile Number"
                className="details-input"
                disabled={isSaving}
              />
            </div>

            <div className="form-actions actions-group">
              <button type="submit" className="save-btn" disabled={isSaving}>
                {isSaving ? "SAVING..." : "SAVE CHANGES"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .account-details-content {
          width: 100%;
        }

        :global(.view-content-header) {
          justify-content: center !important;
          text-align: center;
        }

        :global(.header-labels) {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .details-card {
          background: #fff;
          padding: 2rem;
          border-radius: 20px;
          border: 1px solid #f2ece8;
          box-shadow: 0 10px 30px rgba(0,0,0,0.02);
          max-width: 850px;
          margin: 0 auto;
        }

        .details-form {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem 2rem;
          width: 100%;
        }

        .mobile-group {
          grid-column: 1 / -1;
        }
        
        .actions-group {
          grid-column: 1 / -1;
          margin-top: 0.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .form-group label {
          font-size: 13px;
          font-weight: 700;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .details-input {
          width: 100%;
          padding: 1.1rem 1.5rem;
          background: #fdfaf9;
          border: 1px solid #eee;
          border-radius: 14px;
          font-size: 15px;
          color: #1a1a1a;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .details-input:focus {
          outline: none;
          border-color: #36533f;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(54, 83, 63, 0.05);
        }

        .details-input:disabled {
          background: #f5f5f5;
          color: #999;
          cursor: not-allowed;
        }

        .field-note {
          font-size: 11px;
          color: #999;
          margin-top: -0.25rem;
          padding-left: 0.5rem;
        }

        .form-actions {
          margin-top: 0.5rem;
        }

        .save-btn {
          width: 100%;
          background: #36533f;
          color: #fff;
          padding: 1.1rem;
          border-radius: 14px;
          font-weight: 700;
          font-size: 14px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.05em;
        }

        .save-btn:hover {
          background: #2a4132;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(54, 83, 63, 0.2);
        }

        @media (max-width: 600px) {
          .details-card {
            padding: 1.5rem;
          }
          .details-form {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
      `}</style>
    </AccountShell>
  );
}
