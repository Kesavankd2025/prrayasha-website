"use client";

import { useState } from "react";
import AccountShell from "@/components/AccountShell";
import { User, Mail, Phone, ShieldCheck, Save, Edit3, Camera, Sparkles } from "lucide-react";

export default function MyProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Prrayasha Guest",
    email: "",
    phone: "+91 91590 24967"
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const handleSave = () => {
    const newErrors = {
      name: !profile.name ? "Please enter full name." : "",
      email: !profile.email ? "Please enter email address." : (!/\S+@\S+\.\S+/.test(profile.email) ? "Please enter a valid email." : ""),
      phone: !profile.phone ? "Please enter mobile number." : (profile.phone.length < 10 ? "Please enter a valid 10-digit number." : "")
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    setIsEditing(false);
  };

  return (
    <AccountShell 
      activeHref="/my-profile" 
      title="Personal Vault" 
      description="Managing your signature identity within the Prrayasha boutique."
      action={
        !isEditing && (
          <button className="edit-trigger-btn" onClick={() => setIsEditing(true)}>
            <Edit3 size={15} />
            <span>Edit Details</span>
          </button>
        )
      }
    >
      <div className="profile-wrapper">
        
        <div className="profile-hero-mini">
          <div className="profile-avatar-box">
            <div className="avatar-preview">{profile.name.charAt(0)}</div>
            {isEditing && (
              <button className="camera-trigger">
                <Camera size={12} />
              </button>
            )}
          </div>
          <div className="profile-intro">
            <h3>{profile.name}</h3>
            <div className="tier-tag">
              <Sparkles size={10} />
              <span>ELITE PATRON</span>
            </div>
          </div>
        </div>

        <form className={`profile-form-layout ${isEditing ? 'is-editing' : 'is-viewing'}`}>
          <div className="form-fields-grid">
            <div className="field-block">
              <label><User size={12} /> Full Signature Name <span style={{ color: '#ff4d4f' }}>*</span></label>
              <input 
                type="text" 
                value={profile.name} 
                readOnly={!isEditing}
                onChange={(e) => {
                  setProfile({...profile, name: e.target.value.replace(/[^a-zA-Z\s]/g, '')});
                  if (errors.name) setErrors(prev => ({ ...prev, name: "" }));
                }}
                placeholder="Enter the name"
                className="boutique-input"
                style={{ borderColor: errors.name ? '#ff4d4f' : '' }}
              />
              {isEditing && errors.name && <p style={{ color: '#ff4d4f', fontSize: '11px', marginTop: '0.2rem' }}>{errors.name}</p>}
            </div>
            <div className="field-block">
              <label><Mail size={12} /> Email Identity <span style={{ color: '#ff4d4f' }}>*</span></label>
              <input 
                type="email" 
                value={profile.email} 
                readOnly={!isEditing}
                onChange={(e) => {
                  setProfile({...profile, email: e.target.value});
                  if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                }}
                placeholder="Enter the Email"
                className="boutique-input"
                style={{ borderColor: errors.email ? '#ff4d4f' : '' }}
              />
              {isEditing && errors.email && <p style={{ color: '#ff4d4f', fontSize: '11px', marginTop: '0.2rem' }}>{errors.email}</p>}
            </div>
            <div className="field-block">
              <label><Phone size={12} /> Contact Connection <span style={{ color: '#ff4d4f' }}>*</span></label>
              <input 
                type="tel" 
                value={profile.phone} 
                readOnly={!isEditing}
                onChange={(e) => {
                  setProfile({...profile, phone: e.target.value.replace(/\D/g, '').slice(0, 10)});
                  if (errors.phone) setErrors(prev => ({ ...prev, phone: "" }));
                }}
                placeholder="Enter the number"
                className="boutique-input"
                style={{ borderColor: errors.phone ? '#ff4d4f' : '' }}
              />
              {isEditing && errors.phone && <p style={{ color: '#ff4d4f', fontSize: '11px', marginTop: '0.2rem' }}>{errors.phone}</p>}
            </div>
          </div>

          {isEditing && (
            <div className="form-action-footer">
              <button type="button" className="cancel-text-btn" onClick={() => setIsEditing(false)}>Cancel</button>
              <button type="button" className="save-action-btn" onClick={handleSave}>
                <Save size={16} />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </form>

        {!isEditing && (
          <div className="privacy-trust-banner">
            <ShieldCheck size={20} />
            <p>Your signature details are protected with end-to-end boutique encryption.</p>
          </div>
        )}

      </div>

      <style jsx>{`
        .profile-wrapper {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          max-width: 800px;
        }

        .profile-hero-mini {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          background: #fdfaf9;
          padding: 2rem;
          border-radius: 24px;
          border: 1px solid #f2ece8;
        }

        .profile-avatar-box {
          position: relative;
        }

        .avatar-preview {
          width: 70px;
          height: 70px;
          background: #36533f;
          color: #fff;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-serif);
          font-size: 28px;
          font-weight: 600;
        }

        .camera-trigger {
          position: absolute;
          bottom: -4px;
          right: -4px;
          width: 24px;
          height: 24px;
          background: var(--gold);
          border: 2px solid #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          cursor: pointer;
        }

        .profile-intro h3 {
          font-family: var(--font-serif);
          font-size: 18px;
          color: #36533f;
          margin: 0 0 4px 0;
        }

        .tier-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #fff;
          padding: 0.3rem 0.6rem;
          border-radius: 100px;
          font-size: 9px;
          font-weight: 800;
          color: var(--gold);
          border: 1px solid #eee;
        }

        .edit-trigger-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: var(--gold);
          font-weight: 700;
          font-size: 13px;
          text-transform: uppercase;
          cursor: pointer;
        }

        .profile-form-layout {
          background: #fff;
          border-radius: 24px;
        }

        .form-fields-grid {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .field-block {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .field-block label {
          font-size: 11px;
          font-weight: 700;
          color: #aaa;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .boutique-input {
          width: 100%;
          padding: 1rem 1.25rem;
          border-radius: 14px;
          border: 1px solid #f2ece8;
          background: #fff;
          font-size: 14.5px;
          font-weight: 600;
          transition: border-color 0.3s ease;
          color: #1a1a1a;
        }

        .is-viewing .boutique-input {
          border-color: transparent;
          background: #fdfaf9;
          color: #666;
          cursor: default;
        }

        .is-editing .boutique-input:focus {
          outline: none;
          border-color: #36533f;
        }

        .form-action-footer {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 2rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #f8f8f8;
        }

        .cancel-text-btn {
          background: none;
          border: none;
          color: #aaa;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
        }

        .save-action-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #36533f;
          color: #fff;
          padding: 0.8rem 1.75rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 14px;
          border: none;
          cursor: pointer;
        }

        .privacy-trust-banner {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.5rem;
          background: #36533f0a;
          border-radius: 18px;
          color: #36533f;
          font-size: 12px;
          font-weight: 600;
        }

        @media (max-width: 640px) {
          .profile-wrapper {
            gap: 1.5rem;
          }
          .profile-hero-mini {
            flex-direction: column;
            text-align: center;
            padding: 1.5rem 1rem;
            gap: 1rem;
          }
          .form-action-footer {
            flex-direction: column-reverse;
            gap: 1.25rem;
            align-items: stretch;
          }
          .save-action-btn {
            width: 100%;
            justify-content: center;
          }
          .privacy-trust-banner {
            flex-direction: column;
            text-align: center;
            padding: 1.25rem 1rem;
            gap: 0.75rem;
          }
        }
      `}</style>
    </AccountShell>
  );
}
