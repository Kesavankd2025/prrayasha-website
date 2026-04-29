"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import apiAuth from "@/apiProvider/auth.provider";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();
  
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    phoneNumber: "",
    fullName: "",
    email: ""
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async () => {
    const newErrors = {
      phoneNumber: !phoneNumber ? "Please enter mobile number." : (phoneNumber.length < 10 ? "Please enter a valid 10-digit number." : ""),
      fullName: !fullName ? "Please enter full name." : "",
      email: !email ? "Please enter email address." : (!/\S+@\S+\.\S+/.test(email) ? "Please enter a valid email." : "")
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some(error => error)) return;

    setLoading(true);
    try {
      const result = await apiAuth.sendRegisterOtp(phoneNumber);

      if (result.status) {
        setOtpSent(true);
        setTimer(30);
        showToast(result.response?.message || "OTP sent successfully", "success");
      } else {
        const errorData = result.response as any;
        showToast(errorData?.response?.data?.message || "Failed to send OTP", "error");
      }
    } catch (err: any) {
      showToast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    const otpString = otp.join("");
    try {
      const result = await apiAuth.verifyRegisterOtp({ phoneNumber, otp: otpString, fullName, email });

      if (result.status) {
        const data = result.response;
        login(data.data.token, data.data.user);
        showToast(data.message || "Welcome to Prrayasha!", "success");
        router.push("/");
      } else {
        const errorData = result.response as any;
        showToast(errorData?.response?.data?.message || "Invalid OTP", "error");
      }
    } catch (err: any) {
      showToast("Verification failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (timer === 0) handleSendOtp();
  };

  const maskedPhone = phoneNumber ? `+91 ${phoneNumber.slice(0, 4)}****` : "+91 91590****";

  useEffect(() => {
    if (otpSent) {
      const firstInput = document.getElementById('otp-0');
      if (firstInput) firstInput.focus({ preventScroll: true });
    }
  }, [otpSent]);

  return (
    <main className="auth-page">
      <style jsx global>{`
        .navbar, .top-strip, footer { display: none !important; }
        body, html { 
          margin: 0 !important; padding: 0 !important; 
          background-color: #f5f5f5 !important;
          background-image: url('https://www.transparenttextures.com/patterns/natural-paper.png') !important;
        }
        @media (min-width: 1025px) {
          body, html {
            height: 100vh !important;
            overflow: hidden !important;
          }
        }
        @media (max-width: 1024px) {
          body, html {
            /* height: auto !important; */
            /* min-height: 100dvh !important; */
            /* overflow-x: hidden !important; */
          }
        }

      `}</style>

      {/* Subtle Mandala Watermark Backgrounds */}
      <div className="auth-container">
        <div className="auth-card">
          {/* Left Section - Branding */}
          <div className="auth-left">
            <Link href="/">
              <img src="/logo.jpg" alt="Prrayasha Collections" className="auth-brand-logo" style={{ cursor: 'pointer' }} />
            </Link>
          </div>

          {/* Right Section - Forms */}
          <div className="auth-right">
            <div className="form-viewport">
              {otpSent ? (
                <div className="form-step animate-fade-in">
                  <h2 className="auth-title">Verification</h2>
                  <p className="auth-subtitle">Code sent to {maskedPhone}</p>

                  <div className="otp-minimal-grid">
                    {otp.map((val, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete={i === 0 ? "one-time-code" : "off"}
                        maxLength={1}
                        value={val}
                        className="otp-input-underline"
                        onChange={(e) => {
                          const newVal = e.target.value.replace(/\D/g, '');
                          if (newVal.length <= 1) {
                            const nextOtp = [...otp];
                            nextOtp[i] = newVal;
                            setOtp(nextOtp);

                            if (newVal && i < otp.length - 1) {
                              const next = document.getElementById(`otp-${i + 1}`);
                              if (next) next.focus({ preventScroll: true });
                            }
                          }
                        }}
                        onKeyUp={(e) => {
                          const target = e.target as HTMLInputElement;
                          if (e.key >= '0' && e.key <= '9' && target.value) {
                            const next = document.getElementById(`otp-${i + 1}`);
                            if (next) next.focus({ preventScroll: true });
                          } else if (e.key === 'Backspace') {
                            const prev = document.getElementById(`otp-${i - 1}`);
                            if (prev) prev.focus({ preventScroll: true });
                          }
                        }}
                      />
                    ))}
                  </div>

                  <button className="auth-primary-btn" onClick={handleVerifyOtp} disabled={loading}>
                    {loading ? "VERIFYING..." : "VERIFY OTP"}
                  </button>

                  <div className="auth-resend-area">
                    {timer > 0 ? (
                      <span>Resend in {timer}s</span>
                    ) : (
                      <button onClick={handleResend} className="auth-link-btn">Resend Code</button>
                    )}
                  </div>
                  <button className="auth-back-btn" onClick={() => setOtpSent(false)}>
                    <ArrowLeft size={16} /> Back to Register
                  </button>
                </div>
              ) : (
                <div className="form-step animate-fade-in">
                  <h2 className="auth-title">Create Account</h2>

                  <div className="auth-input-stack">
                    <div className="auth-input-group">
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value.replace(/[^a-zA-Z\s]/g, ''));
                          if (errors.fullName) setErrors(prev => ({ ...prev, fullName: "" }));
                        }}
                        className={errors.fullName ? "has-error" : ""}
                      />
                      {errors.fullName && <span className="auth-err">{errors.fullName}</span>}
                    </div>

                    <div className="auth-input-group">
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                        }}
                        className={errors.email ? "has-error" : ""}
                      />
                      {errors.email && <span className="auth-err">{errors.email}</span>}
                    </div>

                    <div className="auth-input-group">
                      <input
                        type="tel"
                        placeholder="Enter your mobile number"
                        value={phoneNumber}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10));
                          if (errors.phoneNumber) setErrors(prev => ({ ...prev, phoneNumber: "" }));
                        }}
                        className={errors.phoneNumber ? "has-error" : ""}
                      />
                      {errors.phoneNumber && <span className="auth-err">{errors.phoneNumber}</span>}
                    </div>
                  </div>

                  <button className="auth-primary-btn" onClick={handleSendOtp} disabled={loading}>
                    {loading ? "SENDING..." : "Sign up"}
                  </button>

                  <div className="auth-footer-links">
                    <Link href="/login" className="auth-link-btn underlined">Back to login</Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 20px;
        }

        @media (max-width: 1024px) {
          .auth-page {
            height: auto;
            min-height: 100dvh;
            overflow: visible;
            padding: 20px 15px;
            justify-content: center;
            align-items: center;
          }
        }

        .auth-container {
          width: 100%;
          max-width: 1200px;
          height: auto;
          position: relative;
          z-index: 10;
          display: flex;
        }

        .auth-card {
          width: 100%;
          display: flex;
          flex-direction: row;
          border-radius: 30px;
          height: 528px;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(0,0,0,0.15);
        }

        .auth-left {
          flex: 1;
          background-color: #365341;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px;
        }

        .auth-brand-logo {
          width: 100%;
          max-width: 480px;
          height: auto;
          display: block;
        }

        .auth-right {
          flex: 0 0 420px;
          max-width: 420px;
          background-color: #1E2D24;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          color: #ffffff;
        }

        .form-viewport {
          width: 100%;
          max-width: 380px;
          text-align: left;
        }

        .auth-title {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 25px;
          letter-spacing: 0.02em;
          text-align: left;
        }

        .auth-subtitle {
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          margin-bottom: 30px;
        }

        .auth-input-stack {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 20px;
        }

        .auth-input-group {
          position: relative;
          text-align: left;
        }

        .auth-input-group input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid #ffffff;
          padding: 12px 0;
          color: #ffffff;
          font-size: 15px;
          outline: none;
          transition: all 0.3s ease;
          text-align: left;
        }

        .auth-input-group input:focus {
          border-bottom-color: #ffffff;
        }

        .auth-input-group input.has-error {
          border-bottom-color: #ff4d4f;
        }

        .auth-input-group input::placeholder {
          color: #ffffff;
          font-size: 15px;
        }

        .auth-err {
          font-size: 11px;
          color: #ff4d4f;
          margin-top: 6px;
          display: block;
        }

        .auth-primary-btn {
          width: 100%;
          background-color: #ffffff;
          color: #1E2D24;
          padding: 16px;
          border-radius: 100px;
          font-weight: 800;
          font-size: 14px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 15px;
        }

        .auth-primary-btn:hover {
          background-color: #f0f0f0;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }

        .auth-primary-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-footer-links {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          width: 100%;
        }

        .auth-link-btn {
          background: none;
          border: none;
          color: #ffffff;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          padding: 0;
          transition: opacity 0.3s;
          text-decoration: none;
          display: inline-block;
        }

        .auth-link-btn:hover { opacity: 0.8; }
        .underlined { text-decoration: underline; text-underline-offset: 4px; }

        .otp-minimal-grid {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 40px;
          width: 100%;
        }

        .otp-input-underline {
          width: 45px;
          height: 50px;
          background: transparent;
          border: none;
          border-bottom: 2px solid rgba(255,255,255,0.3);
          text-align: center;
          color: #ffffff;
          font-size: 24px;
          font-weight: 700;
          outline: none;
          transition: border-color 0.3s;
        }

        .otp-input-underline:focus {
          border-bottom-color: #ffffff;
        }

        .auth-resend-area {
          margin-bottom: 30px;
          font-size: 13px;
          color: rgba(255,255,255,0.5);
        }

        .auth-back-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: none;
          border: none;
          color: rgba(255,255,255,0.6);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          margin: 0 auto;
        }

        .animate-fade-in {
          animation: authFadeIn 0.8s ease-out forwards;
        }

        @keyframes authFadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 1024px) {
          .auth-container { max-width: 90%; height: auto; }
          .auth-card { flex-direction: column; height: auto; }
          .auth-left { padding: 40px; }
          .auth-right { padding: 40px 20px; flex: 1 1 auto; max-width: 100%; }
          .auth-brand-logo { max-width: 280px; }
        }



        @media (max-width: 480px) {
          .watermark-overlay { display: none; }
          .auth-container { max-width: 100%; padding: 0; }
          .auth-card { border-radius: 20px; }
          .auth-left { padding: 30px 20px; }
          .auth-right { padding: 30px 15px; }
          .auth-brand-logo { max-width: 200px; }
          .auth-title { font-size: 26px; margin-bottom: 20px; }
          .auth-subtitle { font-size: 13px; }
          .auth-primary-btn { font-size: 13px; padding: 14px; }
        }

        @media (max-width: 320px) {
          body, html {
            height: auto !important;
            min-height: 100svh !important;
            overflow-x: hidden !important;
            overflow-y: auto !important;
          }

          .auth-page {
            height: auto;
            min-height: 100svh;
            overflow-x: hidden;
            overflow-y: auto;
            padding: 16px 15px;
          }

          .auth-container {
            max-width: 100%;
            min-height: calc(100svh - 32px);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .auth-card {
            max-height: none;
          }

          .auth-left { padding: 24px 20px; }
          .auth-right { padding: 24px 15px; }
        }
      `}</style>
    </main>
  );
}
