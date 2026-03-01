import { useState } from "react";
import emailjs from "@emailjs/browser";

// ------------------------------------------------------------------
// EmailJS config — fill these in from your EmailJS dashboard:
//   https://dashboard.emailjs.com
// ------------------------------------------------------------------
const EMAILJS_SERVICE_ID = "service_9u9vtfh";
const EMAILJS_TEMPLATE_ID = "template_71b8h9v";
const EMAILJS_PUBLIC_KEY = "6r5IExXFdRhsECATX";
// ------------------------------------------------------------------

interface BookingFormProps {
  /** Overall score (0–100) from the assessment */
  overallScore: number;
  /** Per-section scores e.g. { Cloud: 80, Security: 60, ... } */
  sectionScores: { label: string; score: number }[];
  /** Tier label e.g. "Legacy" | "Transitioning" | "Modern" */
  tier: string;
  /** Full Q&A breakdown from the assessment */
  answersDetail: string;
  onClose: () => void;
}

type Status = "idle" | "sending" | "success" | "error";

export default function BookingForm({
  overallScore,
  sectionScores,
  tier,
  answersDetail,
  onClose,
}: BookingFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const scoresText = sectionScores
      .map((s) => `${s.label}: ${s.score}%`)
      .join(" | ");

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: name,
          from_email: email,
          company,
          phone,
          overall_score: `${overallScore}%`,
          tier,
          section_scores: scoresText,
          answers_detail: answersDetail,
        },
        EMAILJS_PUBLIC_KEY
      );
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 8,
    border: "1.5px solid #e2e8f0",
    fontSize: 14,
    color: "#1e293b",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#475569",
    marginBottom: 6,
  };

  if (status === "success") {
    return (
      <Overlay onClose={onClose}>
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1e3a5f", margin: "0 0 10px" }}>
            You're booked in!
          </h2>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: "0 0 24px" }}>
            We'll be in touch within one business day to confirm your consultation.
          </p>
          <button onClick={onClose} className="btn-primary" style={{ width: "100%" }}>
            Done
          </button>
        </div>
      </Overlay>
    );
  }

  return (
    <Overlay onClose={onClose}>
      <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "#7ec8f0", marginBottom: 6 }}>
        TechVora Solutions
      </div>
      <h2 style={{ fontSize: 19, fontWeight: 700, color: "#1e3a5f", margin: "0 0 4px" }}>
        Book Your Free Consultation
      </h2>
      <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 20px", lineHeight: 1.5 }}>
        Your results ({overallScore}% — {tier}) will be included automatically.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>Full name *</label>
            <input
              required
              style={inputStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Smith"
            />
          </div>
          <div>
            <label style={labelStyle}>Work email *</label>
            <input
              required
              type="email"
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@company.com"
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
          <div>
            <label style={labelStyle}>Company</label>
            <input
              style={inputStyle}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme Corp"
            />
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <input
              style={inputStyle}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555 000 0000"
            />
          </div>
        </div>

        {status === "error" && (
          <p style={{ fontSize: 13, color: "#e74c3c", marginBottom: 14 }}>
            Something went wrong. Please try again or email us directly.
          </p>
        )}

        <button
          type="submit"
          disabled={status === "sending" || !name || !email}
          className="btn-primary"
          style={{ width: "100%" }}
        >
          {status === "sending" ? "Sending…" : "Book Consultation →"}
        </button>
      </form>
    </Overlay>
  );
}

// --------------- shared sub-components ---------------

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24, zIndex: 100, fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white", borderRadius: 16, padding: "32px 32px 28px",
          width: "100%", maxWidth: 520, boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16, background: "none",
            border: "none", fontSize: 20, color: "#94a3b8", cursor: "pointer", lineHeight: 1,
          }}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

