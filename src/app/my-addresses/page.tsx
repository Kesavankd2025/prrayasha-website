"use client";

import { useEffect, useState, useCallback } from "react";
import AccountShell from "@/components/AccountShell";
import { Plus, Edit3, Trash2, Home, Briefcase, ChevronRight, MapPin, MapPinned, Phone } from "lucide-react";
import apiAddress from "@/apiProvider/address.provider";
import { useToast } from "@/context/ToastContext";
import AddressModal from "@/components/AddressModal";
import ConfirmModal from "@/components/ConfirmModal";

export default function MyAddressesPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<any[]>([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddrId, setEditingAddrId] = useState<string | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [addrToDelete, setAddrToDelete] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    const res = await apiAddress.list();
    if (res.status) {
      setAddresses(res.response?.data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleOpenAdd = () => {
    setEditingAddrId(null);
    setShowAddModal(true);
  };

  const handleEdit = (addr: any) => {
    setEditingAddrId(addr._id || addr.id);
    setShowAddModal(true);
  };

  const handleDeleteTrigger = (id: string) => {
    setAddrToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!addrToDelete) return;
    const res = await apiAddress.remove(addrToDelete);
    if (res.status) {
      showToast(res.response?.message || "Address removed successfully", "success");
      fetchAddresses();
    } else {
      const msg = (res as any).error?.response?.data?.message || "Failed to remove address";
      showToast(msg, "error");
    }
    setAddrToDelete(null);
    setShowDeleteConfirm(false);
  };

  const handleSetDefault = async (id: string) => {
    const res = await apiAddress.setDefault(id);
    if (res.status) {
      showToast("Default address updated", "success");
      fetchAddresses();
    }
  };

  const getLabelIcon = (label: string) => {
    const l = label?.toLowerCase();
    if (l === 'home') return <Home size={14} />;
    if (l === 'work' || l === 'office') return <Briefcase size={14} />;
    return <MapPinned size={14} />;
  };

  return (
    <AccountShell
      activeHref="/my-addresses"
      title="Addresses"
      description="Curate your delivery locations for a seamless boutique experience."
      action={
        <button className="add-btn-premium" onClick={handleOpenAdd}>
          <Plus size={16} />
          <span>Add New Destination</span>
        </button>
      }
    >
      <div className="addresses-container">

        {loading ? (
          <div className="empty-state" style={{ width: '100%' }}>
            <div className="loader-ring"></div>
            <p>Gathering your destinations...</p>
          </div>
        ) : addresses.length > 0 ? (
          <div className="destination-grid">
            {addresses.map(addr => (
              <div key={addr._id || addr.id} className={`destination-card ${addr.isDefault ? 'is-primary' : ''}`} onClick={() => !addr.isDefault && handleSetDefault(addr._id || addr.id)}>
                <div className="dest-head">
                  <div className="dest-label">
                    {getLabelIcon(addr.label)}
                    <span>{addr.label || "Address"}</span>
                  </div>
                  {addr.isDefault && <div className="primary-tag">Primary</div>}
                </div>

                <div className="dest-body">
                  <div className="recipient-row">
                    <h4 className="rec-name">{addr.name}</h4>
                    {addr.companyName && <span className="rec-company-tag">{addr.companyName}</span>}
                    {addr.phone && (
                      <span className="rec-phone">
                        <Phone size={12} />
                        {addr.phone}
                      </span>
                    )}
                  </div>
                  <p className="street-p">{addr.doorNo}, {addr.street}</p>
                  {addr.landmark && <p className="landmark-p">Landmark: {addr.landmark}</p>}
                  <p className="locale-p">{addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="email-p">{addr.email}</p>
                </div>

                <div className="dest-foot">
                  <div className="foot-actions">
                    <button
                      className="dest-action"
                      onClick={(e) => { e.stopPropagation(); handleEdit(addr); }}
                    >
                      <Edit3 size={18} /> Edit
                    </button>
                    <button
                      className="dest-action remove"
                      onClick={(e) => { e.stopPropagation(); handleDeleteTrigger(addr._id || addr.id); }}
                    >
                      <Trash2 size={18} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ width: '100%' }}>
            <MapPin size={48} strokeWidth={1} color="#cedbd0" />
            <p>You haven&apos;t added any addresses yet.</p>
            <button className="empty-action-btn" onClick={handleOpenAdd}>Add Your First Destination</button>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddressModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchAddresses}
        addressId={editingAddrId}
        initialData={addresses.find(a => (a._id || a.id) === editingAddrId)}
      />

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Remove Destination?"
        message="Are you sure you want to remove this delivery address? This cannot be undone."
        confirmText="Yes, Remove"
        cancelText="Keep Address"
        isDanger={true}
      />

      <style jsx>{`
        .addresses-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .add-btn-premium {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #36533f;
          color: #fff;
          padding: 0.9rem 1.75rem;
          border-radius: 14px;
          font-weight: 700;
          font-size: 13px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .add-btn-premium:hover {
          background: #2a4132;
        }

        .destination-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }

        .destination-card {
          background: #fff;
          border: 1.5px solid #f2f2f2;
          border-radius: 24px;
          padding: 2rem 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          position: relative;
          cursor: pointer;
        }

        .destination-card:hover {
          border-color: #36533f;
          box-shadow: 0 15px 35px rgba(54, 83, 63, 0.05);
          transform: translateY(-2px);
        }

        .destination-card.is-primary {
          border-color: #36533f;
          background: #fdfcfb;
          cursor: default;
        }

        .dest-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.25rem;
        }

        .dest-label {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: #999;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .is-primary .dest-label {
          color: #36533f;
        }

        .primary-tag {
          background: #36533f;
          color: #fff;
          padding: 0.35rem 0.85rem;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .recipient-row {
          display: flex;
          align-items: baseline;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .rec-name {
          font-family: var(--font-playfair), serif;
          font-size: 19px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
        }

        .rec-phone {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 13px;
          color: #888;
          font-weight: 600;
        }

        .street-p {
          font-size: 16px;
          color: #4a4a4a;
          margin: 0 0 4px 0;
          line-height: 1.5;
          font-weight: 500;
        }

        .locale-p {
          font-size: 14px;
          color: #999;
          font-weight: 500;
          margin: 0;
        }

        .landmark-p {
          font-size: 12px;
          color: #36533f;
          margin: 0.4rem 0;
          font-weight: 700;
        }

        .email-p {
          font-size: 11px;
          color: #bbb;
          margin-top: 0.5rem;
          font-weight: 500;
        }

        .rec-company-tag {
          font-size: 10px;
          background: #f5f5f5;
          color: #666;
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .dest-foot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1.5rem;
          margin-top: auto;
          border-top: 1px solid #f8f8f8;
        }

        .foot-actions {
          display: flex;
          gap: 1.5rem;
        }

        .dest-action {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: none;
          border: none;
          color: #666;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .dest-action.remove {
          color: #ccc;
        }

        .dest-action:hover {
          color: #36533f;
        }

        .dest-action.remove:hover {
          color: #d9534f;
        }

        .dest-arrow {
          color: #36533f;
          opacity: 0.4;
          transition: transform 0.3s;
        }

        .destination-card:hover .dest-arrow {
          transform: translateX(4px);
          opacity: 0.8;
        }

        /* Empty State */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          padding: 6rem 0;
          color: #888;
          text-align: center;
          background: #fff;
          border-radius: 32px;
          border: 2px dashed #eee;
        }

        .empty-state p {
          font-size: 16px;
          font-weight: 500;
        }

        .empty-action-btn {
          background: #fff;
          border: 1.5px solid #36533f;
          color: #36533f;
          padding: 0.8rem 1.75rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .empty-action-btn:hover {
          background: #36533f;
          color: #fff;
        }

        .loader-ring {
          width: 40px;
          height: 40px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #36533f;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .destination-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 767px) {
          .destination-card {
            padding: 1.5rem;
          }
        }

        @media (max-width: 360px) {
          .destination-card {
            padding: 1.25rem;
          }
          .recipient-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          .rec-name {
            font-size: 17px;
          }
          .dest-head {
            flex-wrap: wrap;
            gap: 0.5rem;
          }
        }
      `}</style>
    </AccountShell>
  );
}
