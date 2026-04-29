"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import apiAddress from "@/apiProvider/address.provider";
import { useToast } from "@/context/ToastContext";
import { INDIAN_STATES } from "@/constants/states";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  addressId?: string | null;
  initialData?: any;
}

export default function AddressModal({ isOpen, onClose, onSuccess, addressId, initialData }: AddressModalProps) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    label: "Home",
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    isDefault: false,
  });

  // The scroll lock is now handled by the parent using the 'isOpen' state
  // to avoid direct body style manipulation.

  // Handle Editing State
  useEffect(() => {
    if (isOpen && addressId && initialData) {
      setFormData({
        label: initialData.label || "Home",
        name: initialData.name || "",
        phone: initialData.phone || "",
        street: initialData.street || "",
        city: initialData.city || "",
        state: initialData.state || "",
        pincode: initialData.pincode || "",
        country: "India",
        isDefault: initialData.isDefault || false,
      });
    } else if (isOpen && !addressId) {
      // Reset for new address
      setFormData({
        label: "Home",
        name: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        isDefault: false,
      });
    }
  }, [isOpen, addressId, initialData]);

  const handleSave = async () => {
    const newErrors: Record<string, string> = {};
    const requiredFields = ["name", "phone", "street", "state", "city", "pincode"];

    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    if (formData.phone && formData.phone.length !== 10) {
      newErrors.phone = "Must be 10 digits";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    let doorNo = "";
    let streetName = formData.street;

    const commaIndex = formData.street.indexOf(',');
    if (commaIndex !== -1) {
      doorNo = formData.street.substring(0, commaIndex).trim();
      streetName = formData.street.substring(commaIndex + 1).trim();
    }

    const finalData = {
      ...formData,
      doorNo: doorNo,
      street: streetName,
      email: "" // Kept empty as removed from UI
    };

    try {
      let res;
      if (addressId) {
        res = await apiAddress.update(addressId, finalData);
      } else {
        res = await apiAddress.add(finalData);
      }

      if (res.status) {
        showToast(res.response?.message || `Address ${addressId ? 'updated' : 'added'} successfully`, "success");
        onSuccess();
        onClose();
      } else {
        document.body.style.overflow = "unset";
        setErrors({}); // Clear errors when closing
        const errorMsg = (res as any).error?.response?.data?.message || "Failed to save address";
        showToast(errorMsg, "error");
      }
    } catch (error) {
      console.error("Save address error:", error);
      showToast("An unexpected error occurred", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="boutique-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{addressId ? "Edit Address" : "Add New Address"}</h3>
          <button onClick={onClose} className="close-x"><X size={24} /></button>
        </div>

        <div className="modal-form">
          {/* Label & Full Name */}
          <div className="form-row">
            <div className="f-group">
              <label>Label</label>
              <select
                className="b-input"
                value={formData.label}
                onChange={e => setFormData({ ...formData, label: e.target.value })}
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="f-group">
              <label>Full Name <span className="req">*</span></label>
              <input
                type="text"
                className={`b-input ${errors.name ? 'input-err' : ''}`}
                placeholder="Recipient's Name"
                value={formData.name}
                onChange={e => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
              />
              {errors.name && <span className="err-msg">Full name required</span>}
            </div>
          </div>

          {/* Mobile Number */}
          <div className="f-group">
            <label>Mobile Number <span className="req">*</span></label>
            <input
              type="tel"
              className={`b-input ${errors.phone ? 'input-err' : ''}`}
              placeholder="10-digit mobile number"
              value={formData.phone}
              onChange={e => {
                setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) });
                if (errors.phone) setErrors({ ...errors, phone: "" });
              }}
            />
            {errors.phone && <span className="err-msg">{errors.phone}</span>}
          </div>

          {/* Street Address */}
          <div className="f-group">
            <label>Street Address <span className="req">*</span></label>
            <input
              type="text"
              className={`b-input ${errors.street ? 'input-err' : ''}`}
              placeholder="Door No, Street Name, Area"
              value={formData.street}
              onChange={e => {
                setFormData({ ...formData, street: e.target.value });
                if (errors.street) setErrors({ ...errors, street: "" });
              }}
            />
            {errors.street && <span className="err-msg">Street Address is required</span>}
          </div>

          {/* Town / City & State */}
          <div className="form-row">
            <div className="f-group">
              <label>Town / City <span className="req">*</span></label>
              <input
                type="text"
                className={`b-input ${errors.city ? 'input-err' : ''}`}
                placeholder="City"
                value={formData.city}
                onChange={e => {
                  const val = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                  setFormData({ ...formData, city: val });
                  if (errors.city) setErrors({ ...errors, city: "" });
                }}
              />
              {errors.city && <span className="err-msg">{errors.city}</span>}
            </div>
            <div className="f-group">
              <label>State <span className="req">*</span></label>
              <select
                className={`b-input ${errors.state ? 'input-err' : ''}`}
                value={formData.state}
                onChange={e => {
                  setFormData({ ...formData, state: e.target.value });
                  if (errors.state) setErrors({ ...errors, state: "" });
                }}
              >
                <option value="">Select State</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.state && <span className="err-msg">{errors.state}</span>}
            </div>
          </div>

          <div className="f-group">
            <label>Pincode <span className="req">*</span></label>
            <input
              type="text"
              className={`b-input ${errors.pincode ? 'input-err' : ''}`}
              placeholder="6-digit ZIP"
              value={formData.pincode}
              onChange={e => {
                setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) });
                if (errors.pincode) setErrors({ ...errors, pincode: "" });
              }}
            />
            {errors.pincode && <span className="err-msg">{errors.pincode}</span>}
          </div>

          <div className="f-group checkbox-group">
            <label className="checkbox-wrap">
              <input
                type="checkbox"
                className="standard-check"
                checked={formData.isDefault}
                onChange={e => setFormData({ ...formData, isDefault: e.target.checked })}
              />
              <span className="check-label-text">Set as Default Address</span>
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-pill" onClick={onClose} disabled={isSubmitting}>Cancel</button>
          <button className="save-pill" onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Address"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 1.5rem;
        }

        .boutique-modal {
          background: #fff;
          width: 100%;
          max-width: 580px;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 40px 100px rgba(0,0,0,0.1);
          animation: modalSlide 0.5s cubic-bezier(0.19, 1, 0.22, 1);
          max-height: 90vh;
          overflow-y: auto;
          overflow-x: hidden;
        }

        @keyframes modalSlide {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .modal-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .modal-head h3 {
          font-family: var(--font-playfair), serif;
          font-size: 22px;
          color: #36533f;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .close-x {
          background: none;
          border: none;
          color: #aaa;
          cursor: pointer;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .f-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          position: relative;
        }

        .f-group label {
          font-size: 11px;
          font-weight: 700;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .req {
          color: #dc3545;
          font-size: 14px;
        }

        .b-input {
          width: 100%;
          padding: 0.85rem 1.1rem;
          border-radius: 12px;
          border: 1.5px solid #f2ece8;
          background: #fdfaf9;
          font-size: 14px;
          font-weight: 600;
          color: #1a1210;
          transition: all 0.2s;
        }

        .b-input:focus {
          outline: none;
          border-color: #36533f;
          background: #fff;
        }

        .input-err {
          border-color: #dc3545;
          background: #fff5f5;
        }

        .err-msg {
          font-size: 10px;
          color: #dc3545;
          font-weight: 700;
          margin-top: 2px;
          padding-left: 4px;
        }

        .checkbox-group {
          padding-top: 0.5rem;
        }

        .checkbox-wrap {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
        }

        .standard-check {
          accent-color: #36533f;
          width: 16px;
          height: 16px;
        }

        .check-label-text {
          font-size: 13px;
          color: #666;
          font-weight: 500;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 1.5rem;
          align-items: center;
        }

        .cancel-pill {
          background: none;
          border: none;
          color: #888;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
        }

        .save-pill {
          background: #36533f;
          color: #fff;
          padding: 0.9rem 2.5rem;
          border-radius: 10px;
          font-weight: 700;
          font-size: 14px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .save-pill:hover:not(:disabled) {
          background: #2a4132;
          transform: translateY(-1px);
        }

        .save-pill:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
