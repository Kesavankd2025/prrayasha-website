"use client";

import { useEffect, useState, use } from "react";

import apiOrder from "@/apiProvider/order.provider";
import Link from "next/link";
import { ChevronLeft, Printer } from "lucide-react";

// Helper to convert number to words (simple version for INR)
const numberToWords = (num) => {
  if (num === 0) return "Zero";
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const g = ['', 'Thousand', 'Million', 'Billion', 'Trillion', 'Quadrillion', 'Quintillion', 'Sextillion', 'Septillion', 'Octillion', 'Nonillion'];

  const makeGrp = (n) => {
    let st = '';
    if (n >= 100) {
      st += a[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      st += b[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      st += a[n] + ' ';
    }
    return st;
  };

  let str = '';
  let i = 0;
  let integerPart = Math.floor(num);
  let decimalPart = Math.round((num - integerPart) * 100);

  while (integerPart > 0) {
    if (integerPart % 1000 !== 0) {
      str = makeGrp(integerPart % 1000) + g[i] + ' ' + str;
    }
    integerPart = Math.floor(integerPart / 1000);
    i++;
  }

  let result = "INR " + str.trim();
  if (decimalPart > 0) {
    result += " and " + makeGrp(decimalPart).trim() + " Paise";
  }

  return result;
};

export default function OrderDetailsPage({ params }) {
  const { id } = use(params);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await apiOrder.getById(id);
        if (res.status) {
          setOrder(res.response.data);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="order-details-root">
        <div className="invoice-container">
          <div className="loading-state" style={{ width: '100%' }}>Loading order details...</div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-details-root">
        <div className="invoice-container">
          <div className="error-state">
            <h3>Order not found</h3>
            <Link href="/my-orders" className="back-link">
              <ChevronLeft size={16} /> Back to orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate taxes (assuming 5% total split into 2.5% each if taxAmount exists)
  const cgst = (order.taxAmount || 0) / 2;
  const sgst = (order.taxAmount || 0) / 2;
  const subtotal = order.totalAmount || (order.grandTotal - (order.taxAmount || 0) - (order.shippingCharge || 0) + (order.overallDiscount || 0));

  return (
    <div className="order-details-root">
      <div className="invoice-container">

        <div className="invoice-header-actions no-print">
          <Link href="/my-orders" className="back-btn">
            <ChevronLeft size={18} /> Back to Orders
          </Link>
          <button onClick={handlePrint} className="print-btn">
            <Printer size={18} /> Print Invoice
          </button>
        </div>

        <div className="invoice-paper" id="invoice-sheet">
          <div className="tax-invoice-label">TAX INVOICE</div>

          <div className="invoice-top-section">
            <div className="company-branding">
              <img src="/logo.jpg" alt="Logo" className="invoice-logo" />
              <div className="company-details">
                <h1 className="company-name">Prrayasha Collections</h1>
                <p className="gstn">GSTN : 33AWPPJ9059B2ZD</p>
                <div className="company-address">
                  Provident Cosmo City, DR Abdul Kalam Road,<br />
                  Pudhupakkam Village, Chengalpet 603103<br />
                  +91 91590 24967
                </div>
              </div>
            </div>

            <div className="invoice-meta-grid">
              <div className="meta-col">
                <div className="meta-row">
                  <span className="meta-lbl">Invoice #</span>
                  <span className="meta-val">{order.orderId || order.invoiceId}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-lbl">Invoice Date:</span>
                  <span className="meta-val">
                    {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
              <div className="meta-col">
                <div className="meta-row">
                  <span className="meta-lbl">Payment Status :</span>
                  <span className={`meta-val status-pill ${order.paymentStatus?.toLowerCase()}`}>{order.paymentStatus}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-lbl">Payment Method :</span>
                  <span className="meta-val">{order.paymentMethod}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="addresses-grid">
            <div className="address-box">
              <h3 className="box-title">Billing Address :</h3>
              <div className="address-content">
                <strong>Name: {order.address?.name}</strong><br />
                {order.address?.companyName && <span>Company: {order.address?.companyName}<br /></span>}
                Phone: {order.address?.phone}<br />
                Email: {order.address?.email}<br />
                Address: {order.address?.doorNo}, {order.address?.street}<br />
                {order.address?.landmark && <span>Landmark: {order.address?.landmark}<br /></span>}
                City: {order.address?.city}<br />
                State: {order.address?.state}<br />
                Zip: {order.address?.pincode}
              </div>
            </div>
            <div className="address-box">
              <h3 className="box-title">Shipping Address :</h3>
              <div className="address-content">
                <strong>Name: {order.address?.name}</strong><br />
                {order.address?.companyName && <span>Company: {order.address?.companyName}<br /></span>}
                Phone: {order.address?.phone}<br />
                Email: {order.address?.email}<br />
                Address: {order.address?.doorNo}, {order.address?.street}<br />
                {order.address?.landmark && <span>Landmark: {order.address?.landmark}<br /></span>}
                City: {order.address?.city}<br />
                State: {order.address?.state}<br />
                Zip: {order.address?.pincode}
              </div>
            </div>
          </div>

          <div className="additional-meta-grid">
            <div className="meta-item">
              <span className="meta-lbl">Place of Supply</span>
              <span className="meta-val">89 - Chengalpattu</span>
            </div>
            <div className="meta-item">
              <span className="meta-lbl">Due Date:</span>
              <span className="meta-val">Immediate on Receipt</span>
            </div>
          </div>

          <div className="table-resp-wrap">
            <table className="items-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>#</th>
                  <th style={{ textAlign: 'left' }}>Item</th>
                  <th>HSN/SAC</th>
                  <th>SIZE / COLOR</th>
                  <th>Quantity</th>
                  <th style={{ textAlign: 'right' }}>Rate/Item</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.products?.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                    <td>
                      <div className="item-name">{item.productName}</div>
                    </td>
                    <td style={{ textAlign: 'center' }}>877553</td>
                    <td style={{ textAlign: 'center' }}>
                      {item.combination && item.combination.length > 0 ? (
                        item.combination.map((c, i) => (
                          <div key={i} style={{ fontSize: '11px', lineHeight: '1.2' }}>
                            <span style={{ color: '#888' }}>{c.attributeName || 'Attr'}:</span> {c.valueName || c.value}
                          </div>
                        ))
                      ) : (
                        <span style={{ color: '#ccc' }}>-</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>{item.qty} Nos</td>
                    <td style={{ textAlign: 'right' }}>₹{item.price?.toFixed(2)}</td>
                    <td style={{ textAlign: 'right' }}>₹{item.total?.toFixed(2)}</td>
                  </tr>
                ))}

                <tr className="summary-row border-top">
                  <td colSpan={6} style={{ textAlign: 'right' }}>Total Amount - Inc. all vat/tax</td>
                  <td style={{ textAlign: 'right' }}>₹{subtotal.toFixed(2)}</td>
                </tr>
                <tr className="summary-row">
                  <td colSpan={6} style={{ textAlign: 'right' }}>CGST 2.5%</td>
                  <td style={{ textAlign: 'right' }}>₹{cgst.toFixed(2)}</td>
                </tr>
                <tr className="summary-row">
                  <td colSpan={6} style={{ textAlign: 'right' }}>SGST 2.5%</td>
                  <td style={{ textAlign: 'right' }}>₹{sgst.toFixed(2)}</td>
                </tr>
                <tr className="summary-row">
                  <td colSpan={6} style={{ textAlign: 'right' }}>Shipping Amount</td>
                  <td style={{ textAlign: 'right' }}>₹{order.shippingCharge?.toFixed(2) || '0.00'}</td>
                </tr>
                {order.shippingDiscount > 0 && (
                  <tr className="summary-row">
                    <td colSpan={6} style={{ textAlign: 'right' }}>Shipping Discount</td>
                    <td style={{ textAlign: 'right' }}>-₹{order.shippingDiscount?.toFixed(2)}</td>
                  </tr>
                )}
                {order.couponDiscount > 0 && (
                  <tr className="summary-row">
                    <td colSpan={6} style={{ textAlign: 'right' }}>Coupon Applied ({order.couponCode || 'N/A'})</td>
                    <td style={{ textAlign: 'right' }}>-₹{order.couponDiscount?.toFixed(2)}</td>
                  </tr>
                )}
                {/* {order.overallDiscount > 0 && (
                  <tr className="summary-row">
                    <td colSpan={6} style={{ textAlign: 'right', fontWeight: 'bold' }}>Overall Discount</td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>-₹{order.overallDiscount?.toFixed(2)}</td>
                  </tr>
                )} */}
                <tr className="summary-row grand-total-row">
                  <td colSpan={6} style={{ textAlign: 'right' }}>Total</td>
                  <td style={{ textAlign: 'right' }}>₹{order.grandTotal?.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="amount-chargeable">
            <span>Amount Chargeable (in words): </span>
            <span className="words-val">{numberToWords(order.grandTotal)}</span>
          </div>

          <div className="amount-payable-bar">
            <span>Amount Payable: </span>
            <span className="amt-val">₹{order.grandTotal?.toLocaleString()}</span>
          </div>

          <div className="invoice-footer">
            <div className="footer-left">
              <div className="notes-section">
                <h4>Notes:</h4>
                <p>Thank you for the Shopping</p>
                {order.orderNotes && (
                  <div className="order-instructions">
                    <h4 style={{ marginTop: '1rem' }}>Order Instructions:</h4>
                    <p style={{ color: '#333', fontStyle: 'italic' }}>{order.orderNotes}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="footer-right">
              <div className="signatory-box">
                <h4 className="signatory-label">For Prrayasha Collection</h4>
                <div className="signature-area">
                  <img src="/signature.png" alt="Signature" className="sig-img" />
                </div>
              </div>
            </div>
          </div>

          <div className="terms-section">
            <h4>Terms and Conditions:</h4>
            <ul>
              <li>Products once sold cannot be returned or exchanged unless damage issue.</li>
              <li>To return or exchange for damage reasons, parcel opening video without any edits and cuts is must and has to shared with us through email (prrayashacollections@gmail.com) or whatsapp (91590 24967) with your order details.</li>
              <li>No return or exchange for size issues.</li>
              <li>For any queries or disputes related to products or payments: Email prrayashacollections@gmail.com (response within 2 working days).</li>
              <li>If no response, contact WhatsApp 91590 24967 (response within 2 working days).</li>
              <li>If unresolved thereafter, you may proceed with legal action as per applicable laws.</li>
            </ul>
          </div>
        </div>

        {/* <div className="print-footer no-print">
            <button onClick={handlePrint} className="print-action-btn">PRINT</button>
        </div> */}

      </div>

      <style jsx>{`
        .order-details-root {
          background: #fdfaf9;
          min-height: 100vh;
          padding: 2rem 0;
        }

        .invoice-container {
          padding: 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .invoice-header-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #36533f;
          text-decoration: none;
          font-weight: 700;
          font-size: 14px;
          padding: 0.5rem 1rem;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .back-btn :global(svg) {
          display: block;
          margin-top: -1px;
        }

        .print-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #36533f;
          color: #fff;
          border: none;
          padding: 0.75rem 1.25rem;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
        }

        .print-btn :global(svg) {
          display: block;
          margin-top: -1px;
        }

        .invoice-paper {
          background: #fff;
          border: 1px solid #eee;
          padding: 0;
          box-shadow: 0 10px 40px rgba(0,0,0,0.05);
          font-family: 'Inter', sans-serif;
          color: #333;
        }

        .tax-invoice-label {
          background: #fdfaf9;
          text-align: center;
          padding: 0.5rem;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.1em;
          border-bottom: 1px solid #eee;
        }

        .invoice-top-section {
          padding: 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-bottom: 1px solid #eee;
        }

        .company-branding {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
        }

        .invoice-logo {
          width: 80px;
          height: auto;
        }

        .company-name {
          font-size: 24px;
          font-weight: 800;
          color: #36533f;
          margin: 0 0 0.25rem 0;
        }

        .gstn {
          font-size: 12px;
          font-weight: 700;
          color: #666;
          margin-bottom: 1rem;
        }

        .company-address {
          font-size: 12px;
          color: #888;
          line-height: 1.6;
        }

        .invoice-meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          background: #fdfaf9;
          padding: 1rem;
          border: 1px solid #f2ece8;
          border-radius: 8px;
        }

        .meta-row {
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem;
        }

        .meta-lbl {
          font-size: 11px;
          text-transform: uppercase;
          color: #999;
          font-weight: 700;
          margin-bottom: 0.2rem;
        }

        .meta-val {
          font-size: 14px;
          font-weight: 700;
          color: #333;
        }

        .status-pill {
          color: #2ecc71;
        }

        .addresses-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-bottom: 1px solid #eee;
        }

        .address-box {
          padding: 1.5rem 2rem;
          border-right: 1px solid #eee;
        }

        .address-box:last-child {
          border-right: none;
        }

        .box-title {
          font-size: 14px;
          font-weight: 800;
          margin: 0 0 1rem 0;
          color: #333;
        }

        .address-content {
          font-size: 13px;
          color: #555;
          line-height: 1.6;
        }

        .additional-meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding: 1rem 2rem;
          border-bottom: 1px solid #eee;
          background: #fff;
        }

        .meta-item {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }

        .table-resp-wrap {
          overflow-x: auto;
        }

        .items-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 600px;
        }

        .items-table th {
          background: #fff;
          font-size: 11px;
          text-transform: uppercase;
          font-weight: 800;
          padding: 1rem 0.5rem;
          border-bottom: 2px solid #333;
          color: #333;
        }

        .items-table td {
          padding: 1rem 0.75rem;
          font-size: 13px;
          border-bottom: 1px solid #eee;
        }

        .item-name {
          font-weight: 700;
          color: #333;
        }

        .summary-row td {
          padding: 0.5rem 0.75rem;
          font-size: 12px;
          font-weight: 600;
          color: #666;
          border: none;
        }

        .summary-row.border-top td {
          border-top: 1px solid #eee;
          padding-top: 1rem;
        }

        .grand-total-row td {
          font-size: 16px;
          font-weight: 800;
          color: #333;
          padding-top: 1rem;
          padding-bottom: 1rem;
        }

        .amount-chargeable {
          padding: 1.5rem 2rem;
          font-size: 11px;
          color: #666;
          border-top: 1px solid #eee;
        }

        .words-val {
          font-weight: 700;
          color: #333;
        }

        .amount-payable-bar {
          background: #fff;
          text-align: right;
          padding: 0.75rem 2rem;
          font-size: 14px;
          font-weight: 700;
          border-bottom: 1px solid #eee;
        }

        .amt-val {
            font-size: 18px;
            color: #36533f;
            margin-left: 0.5rem;
        }

        .invoice-footer {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-bottom: 1px solid #eee;
        }

        .footer-left {
          padding: 2rem;
          border-right: 1px solid #eee;
        }

        .footer-right {
          padding: 2rem;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }

        .notes-section h4 {
          font-size: 12px;
          margin: 0 0 0.5rem 0;
        }

        .notes-section p {
          font-size: 12px;
          color: #666;
        }

        .signatory-box {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .signatory-label {
          font-size: 13px;
          font-weight: 800;
          color: #333;
          margin: 0;
        }

        .sig-img {
          height: 60px;
          width: auto;
          mix-blend-mode: multiply;
          filter: contrast(1.2);
          opacity: 0.9;
        }

        .terms-section {
          padding: 2rem;
          background: #fff;
        }

        .terms-section h4 {
          font-size: 12px;
          margin: 0 0 1rem 0;
        }

        .terms-section ul {
          margin: 0;
          padding-left: 1.2rem;
        }

        .terms-section li {
          font-size: 11px;
          color: #777;
          margin-bottom: 0.5rem;
          line-height: 1.5;
        }

        .print-footer {
          margin-top: 2rem;
          text-align: center;
        }

        .print-action-btn {
          background: #6c5ce7;
          color: #fff;
          border: none;
          padding: 1rem 3rem;
          border-radius: 8px;
          font-weight: 800;
          cursor: pointer;
        }

        .loading-state, .error-state {
          text-align: center;
          padding: 5rem;
          color: #666;
          background: #fff;
          border-radius: 12px;
          border: 1px solid #eee;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
          color: #36533f;
          text-decoration: none;
          font-weight: 700;
        }

        @media print {
          :global(.navbar), :global(.footer-section), .no-print, [class*="scroll-to-top"], button[class*="scroll"] {
            display: none !important;
          }
          
          @page {
            size: A4;
            margin: 0mm;
          }

          html, body {
            height: auto !important;
            overflow: visible !important;
            background: #fff !important;
          }

          .order-details-root {
            background: #fff !important;
            padding: 10mm !important;
            margin: 0 !important;
          }

          .invoice-container {
            padding: 0 !important;
            margin: 0 !important;
            max-width: none !important;
            width: 100% !important;
          }

          .invoice-paper {
            border: none !important;
            box-shadow: none !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .invoice-top-section, 
          .addresses-grid, 
          .items-table, 
          .invoice-footer, 
          .terms-section {
            page-break-inside: avoid;
          }

          .items-table th {
            background-color: #f1f6f3 !important;
            -webkit-print-color-adjust: exact;
          }

          .tax-invoice-label {
            background-color: #fdfaf9 !important;
            -webkit-print-color-adjust: exact;
          }

          .amt-val {
            color: #36533f !important;
          }

          .invoice-top-section {
            padding: 10mm !important;
          }

          .address-box {
            padding: 5mm 10mm !important;
          }

          .additional-meta-grid {
            padding: 5mm 10mm !important;
          }

          .items-table td, .items-table th {
            padding: 3mm 5mm !important;
            font-size: 11px !important;
          }

          .terms-section {
            padding: 5mm 10mm !important;
          }

          .company-name {
            font-size: 20px !important;
          }

          .amount-payable-bar {
            padding: 3mm 10mm !important;
          }

          .invoice-footer {
            padding: 0 !important;
          }

          .footer-left, .footer-right {
            padding: 5mm 10mm !important;
          }

          .invoice-top-section, 
          .addresses-grid, 
          .invoice-footer {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
          }

          .company-branding {
            display: flex !important;
            flex-direction: row !important;
            align-items: flex-start !important;
            text-align: left !important;
          }

          .address-box {
            border-right: 1px solid #eee !important;
            border-bottom: none !important;
          }

          /* Ensure images print */
          img {
            max-width: 100% !important;
          }
        }

        @media screen and (max-width: 1024px) {
          .invoice-container {
            padding: 1rem;
          }
          .invoice-top-section,
          .address-box,
          .footer-left,
          .footer-right {
            padding: 1.5rem;
          }
          .additional-meta-grid {
            padding: 1rem 1.5rem;
          }
          .amount-chargeable {
            padding: 1.5rem;
          }
        }

        @media screen and (max-width: 768px) {
          .invoice-top-section, .addresses-grid, .invoice-footer, .additional-meta-grid {
            grid-template-columns: 1fr;
          }
          .invoice-meta-grid {
            margin-top: 1.5rem;
          }
          .address-box {
            border-right: none;
            border-bottom: 1px solid #eee;
          }
          .footer-left {
            border-right: none;
            border-bottom: 1px solid #eee;
          }
          .footer-right {
            justify-content: center;
          }
          .company-branding {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
        }

        @media screen and (max-width: 480px) {
          .company-name {
            font-size: 20px;
          }
          .invoice-logo {
            width: 60px;
          }
          .invoice-top-section, .address-box, .footer-left, .footer-right {
            padding: 1rem;
          }
          .amount-chargeable {
            padding: 1rem;
          }
          .amount-payable-bar {
            padding: 1rem;
          }
        }

        @media screen and (max-width: 360px) {
          :global(.back-btn), :global(.back-link), :global(.print-btn) {
            display: flex !important;
            align-items: center !important;
            font-size: 13px !important;
            padding: 0.4rem 0.6rem !important;
          }
          :global(.back-btn svg), :global(.back-link svg), :global(.print-btn svg) {
            width: 13px !important;
            height: 13px !important;
            display: block !important;
            margin-top: -1px !important;
          }
          .invoice-header-actions {
            gap: 0.5rem;
          }
          .invoice-meta-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
