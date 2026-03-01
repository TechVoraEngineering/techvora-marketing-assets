import { useState } from "react";
import BookingForm from "../BookingForms/booking-form";

const BRAND = "#1e3a5f";

// ─── Data ─────────────────────────────────────────────────────────────────

const INDUSTRIES = [
  { label: "Healthcare", downtimeRate: 0.85 },
  { label: "Financial Services", downtimeRate: 0.90 },
  { label: "Manufacturing", downtimeRate: 0.65 },
  { label: "Retail / eCommerce", downtimeRate: 0.55 },
  { label: "Other", downtimeRate: 0.60 },
];

const REVENUE_OPTIONS = [
  { label: "Under $5M", midpoint: 2_500_000 },
  { label: "$5M – $25M", midpoint: 15_000_000 },
  { label: "$25M – $100M", midpoint: 62_500_000 },
  { label: "$100M – $500M", midpoint: 300_000_000 },
  { label: "Over $500M", midpoint: 750_000_000 },
];

const TEAM_SIZE_OPTIONS = [
  { label: "1–5 IT staff", midpoint: 3 },
  { label: "6–15 IT staff", midpoint: 10 },
  { label: "16–50 IT staff", midpoint: 30 },
  { label: "50+ IT staff", midpoint: 75 },
];

const OUTAGE_FREQ_OPTIONS = [
  { label: "None — zero unplanned outages last year", midpoint: 0 },
  { label: "1–3 outages", midpoint: 2 },
  { label: "4–8 outages", midpoint: 6 },
  { label: "9–15 outages", midpoint: 12 },
  { label: "16+ outages", midpoint: 20 },
];

const OUTAGE_DURATION_OPTIONS = [
  { label: "Less than 1 hour on average", midpoint: 0.5 },
  { label: "1–4 hours on average", midpoint: 2.5 },
  { label: "4–12 hours on average", midpoint: 8 },
  { label: "12+ hours on average", midpoint: 18 },
];

const CLOUD_SPEND_OPTIONS = [
  { label: "We don't use cloud services", monthly: 0 },
  { label: "$1K – $10K / month", monthly: 5_500 },
  { label: "$10K – $50K / month", monthly: 30_000 },
  { label: "$50K – $200K / month", monthly: 125_000 },
  { label: "Over $200K / month", monthly: 250_000 },
];

const CLOUD_VISIBILITY_OPTIONS = [
  { label: "No visibility — bills are unpredictable", wasteRate: 0.35 },
  { label: "Basic billing view only", wasteRate: 0.28 },
  { label: "Some tagging and cost tracking", wasteRate: 0.18 },
  { label: "Full visibility with active optimization", wasteRate: 0.10 },
];

const COMPLIANCE_OPTIONS = [
  { label: "No specific compliance requirements", baseRisk: 25_000 },
  { label: "HIPAA", baseRisk: 150_000 },
  { label: "SOC 2", baseRisk: 75_000 },
  { label: "PCI-DSS", baseRisk: 100_000 },
  { label: "Multiple / complex requirements", baseRisk: 250_000 },
];

const AUDIT_STATUS_OPTIONS = [
  { label: "Never been formally audited", multiplier: 2.5 },
  { label: "Failed with major findings", multiplier: 2.0 },
  { label: "Passed with minor findings", multiplier: 1.2 },
  { label: "Clean pass — fully audit-ready", multiplier: 0.3 },
];

const MANUAL_PCT_OPTIONS = [
  { label: "75%+ — mostly maintenance and firefighting", rate: 0.80 },
  { label: "50–75% on manual work", rate: 0.625 },
  { label: "25–50% on manual work", rate: 0.375 },
  { label: "Less than 25% — mostly strategic work", rate: 0.15 },
];

const AI_COMPETITOR_OPTIONS = [
  { label: "Far behind — competitors are scaling AI now", multiplier: 1.8 },
  { label: "Somewhat behind — watching but not acting", multiplier: 1.4 },
  { label: "Keeping pace with the industry", multiplier: 1.0 },
  { label: "Ahead of competitors in AI adoption", multiplier: 0.5 },
];

const AVG_IT_COST = 120_000;

// ─── Types ─────────────────────────────────────────────────────────────────

interface Inputs {
  revenue: typeof REVENUE_OPTIONS[number] | null;
  industry: typeof INDUSTRIES[number] | null;
  teamSize: typeof TEAM_SIZE_OPTIONS[number] | null;
  outageFreq: typeof OUTAGE_FREQ_OPTIONS[number] | null;
  outageDuration: typeof OUTAGE_DURATION_OPTIONS[number] | null;
  cloudSpend: typeof CLOUD_SPEND_OPTIONS[number] | null;
  cloudVisibility: typeof CLOUD_VISIBILITY_OPTIONS[number] | null;
  compliance: typeof COMPLIANCE_OPTIONS[number] | null;
  auditStatus: typeof AUDIT_STATUS_OPTIONS[number] | null;
  manualPct: typeof MANUAL_PCT_OPTIONS[number] | null;
  aiCompetitor: typeof AI_COMPETITOR_OPTIONS[number] | null;
}

type Screen = "intro" | "context" | "downtime" | "cloud" | "security" | "ai" | "results";

const QUESTION_SCREENS: Screen[] = ["context", "downtime", "cloud", "security", "ai"];

const SECTION_META: Record<string, { icon: string; title: string; subtitle: string; color: string }> = {
  context: { icon: "🏢", title: "About Your Business", subtitle: "We'll use this to calibrate your estimates.", color: "#6366f1" },
  downtime: { icon: "⚡", title: "Unplanned Downtime", subtitle: "Industry average: $300K–$5M per incident.", color: "#ef4444" },
  cloud:    { icon: "☁️", title: "Cloud Waste", subtitle: "Organizations waste an average of 32% of cloud spend.", color: "#f59e0b" },
  security: { icon: "🔒", title: "Security & Compliance Risk", subtitle: "Average breach cost: $4.45M (IBM, 2023).", color: "#8b5cf6" },
  ai:       { icon: "🤖", title: "AI & Productivity Gap", subtitle: "Modern teams ship 8× faster with automation.", color: "#10b981" },
};

// ─── Utilities ─────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n.toLocaleString()}`;
}

function calcCosts(inputs: Inputs) {
  const revenue = inputs.revenue?.midpoint ?? 0;
  const downtimeRate = inputs.industry?.downtimeRate ?? 0.60;
  const teamMidpoint = inputs.teamSize?.midpoint ?? 0;

  const hourlyRevenue = revenue / (260 * 8);
  const annualOutageHours = (inputs.outageFreq?.midpoint ?? 0) * (inputs.outageDuration?.midpoint ?? 1);
  const downtimeCost = Math.round(hourlyRevenue * downtimeRate * annualOutageHours);

  const annualCloudSpend = (inputs.cloudSpend?.monthly ?? 0) * 12;
  const cloudWasteCost = Math.round(annualCloudSpend * (inputs.cloudVisibility?.wasteRate ?? 0.28));

  const securityCost = Math.round(
    (inputs.compliance?.baseRisk ?? 25_000) * (inputs.auditStatus?.multiplier ?? 1.5)
  );

  const productivityLoss = Math.round(
    teamMidpoint * AVG_IT_COST * (inputs.manualPct?.rate ?? 0.50) * 0.4 * (inputs.aiCompetitor?.multiplier ?? 1.0)
  );

  const total = downtimeCost + cloudWasteCost + securityCost + productivityLoss;
  return { downtimeCost, cloudWasteCost, securityCost, productivityLoss, total };
}

function canAdvance(screen: Screen, inputs: Inputs): boolean {
  if (screen === "context")  return !!(inputs.revenue && inputs.industry && inputs.teamSize);
  if (screen === "downtime") return !!(inputs.outageFreq && inputs.outageDuration);
  if (screen === "cloud")    return !!(inputs.cloudSpend && inputs.cloudVisibility);
  if (screen === "security") return !!(inputs.compliance && inputs.auditStatus);
  if (screen === "ai")       return !!(inputs.manualPct && inputs.aiCompetitor);
  return false;
}

// ─── Sub-components ────────────────────────────────────────────────────────

function OptionBtn({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: "left", padding: "12px 16px", borderRadius: 8,
        border: `2px solid ${selected ? BRAND : "#e2e8f0"}`,
        background: selected ? "#1e3a5f12" : "white",
        cursor: "pointer", fontSize: 14, color: "#334155",
        fontWeight: selected ? 600 : 400,
        display: "flex", alignItems: "center", gap: 10, width: "100%",
        transition: "all 0.15s",
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: "50%",
        border: `2px solid ${selected ? BRAND : "#cbd5e1"}`,
        background: selected ? BRAND : "white",
        flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {selected && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "white" }} />}
      </div>
      {label}
    </button>
  );
}

function QuestionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 10 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{children}</div>
    </div>
  );
}

function CostBar({ label, icon, value, color, max }: { label: string; icon: string; value: number; color: string; max: number }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>{icon}</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#1e3a5f" }}>{label}</span>
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color }}>{fmt(value)}</span>
      </div>
      <div style={{ height: 8, background: "#f1f5f9", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 8, transition: "width 1s ease" }} />
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function LegacyCostCalculator() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [inputs, setInputs] = useState<Inputs>({
    revenue: null, industry: null, teamSize: null,
    outageFreq: null, outageDuration: null,
    cloudSpend: null, cloudVisibility: null,
    compliance: null, auditStatus: null,
    manualPct: null, aiCompetitor: null,
  });
  const [showBooking, setShowBooking] = useState(false);

  function set<K extends keyof Inputs>(key: K, val: Inputs[K]) {
    setInputs(prev => ({ ...prev, [key]: val }));
  }

  function nextScreen() {
    const idx = QUESTION_SCREENS.indexOf(screen as any);
    if (idx < QUESTION_SCREENS.length - 1) {
      setScreen(QUESTION_SCREENS[idx + 1]);
    } else {
      setScreen("results");
    }
  }

  const stepIdx = QUESTION_SCREENS.indexOf(screen as any);
  const meta = SECTION_META[screen] ?? null;
  const ready = canAdvance(screen, inputs);

  // ── INTRO ──────────────────────────────────────────────────────────────
  if (screen === "intro") return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ maxWidth: 600, width: "100%" }}>
        <div style={{ background: BRAND, borderRadius: 16, padding: "40px 40px 32px", color: "white", marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "#7ec8f0", marginBottom: 12 }}>TechVora Solutions</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 14px", lineHeight: 1.3 }}>The True Cost of IT Inaction</h1>
          <p style={{ fontSize: 15, color: "#c8dff0", lineHeight: 1.6, margin: 0 }}>
            Most organizations underestimate what legacy infrastructure is really costing them. This calculator puts hard numbers on four categories of hidden loss — so you can see the full picture.
          </p>
        </div>

        <div style={{ background: "white", borderRadius: 16, padding: "24px 28px", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>What we'll calculate</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { icon: "⚡", label: "Unplanned Downtime Losses", desc: "Revenue impact of outages by industry" },
              { icon: "☁️", label: "Cloud Waste & Overprovisioning", desc: "Hidden spend from unmanaged consumption" },
              { icon: "🔒", label: "Security & Compliance Exposure", desc: "Regulatory fines and remediation costs" },
              { icon: "🤖", label: "AI Opportunity Cost", desc: "Productivity and competitive gap from delayed adoption" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1e3a5f" }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => setScreen("context")} className="btn-primary" style={{ width: "100%" }}>
          Calculate My Cost of Inaction →
        </button>
      </div>
    </div>
  );

  // ── RESULTS ────────────────────────────────────────────────────────────
  if (screen === "results") {
    const { downtimeCost, cloudWasteCost, securityCost, productivityLoss, total } = calcCosts(inputs);
    const max = Math.max(downtimeCost, cloudWasteCost, securityCost, productivityLoss, 1);

    const answersDetail = [
      `--- Business Context ---`,
      `Revenue: ${inputs.revenue?.label ?? "—"}`,
      `Industry: ${inputs.industry?.label ?? "—"}`,
      `IT Team Size: ${inputs.teamSize?.label ?? "—"}`,
      ``,
      `--- Unplanned Downtime ---`,
      `Outage frequency: ${inputs.outageFreq?.label ?? "—"}`,
      `Average duration: ${inputs.outageDuration?.label ?? "—"}`,
      `Estimated annual cost: ${fmt(downtimeCost)}`,
      ``,
      `--- Cloud Waste ---`,
      `Monthly cloud spend: ${inputs.cloudSpend?.label ?? "—"}`,
      `Cost visibility: ${inputs.cloudVisibility?.label ?? "—"}`,
      `Estimated annual waste: ${fmt(cloudWasteCost)}`,
      ``,
      `--- Security & Compliance ---`,
      `Compliance requirements: ${inputs.compliance?.label ?? "—"}`,
      `Last audit result: ${inputs.auditStatus?.label ?? "—"}`,
      `Estimated annual exposure: ${fmt(securityCost)}`,
      ``,
      `--- AI & Productivity Gap ---`,
      `Manual work percentage: ${inputs.manualPct?.label ?? "—"}`,
      `AI vs competitors: ${inputs.aiCompetitor?.label ?? "—"}`,
      `Estimated annual productivity loss: ${fmt(productivityLoss)}`,
      ``,
      `TOTAL ESTIMATED ANNUAL COST OF INACTION: ${fmt(total)}`,
    ].join("\n");

    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "32px 24px", fontFamily: "'Segoe UI', sans-serif" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>

          {/* Total cost hero */}
          <div style={{ background: BRAND, borderRadius: 16, padding: "32px", color: "white", marginBottom: 20, textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "#7ec8f0", marginBottom: 8 }}>Estimated Annual Cost of Inaction</div>
            <div style={{ fontSize: 60, fontWeight: 800, color: "#f59e0b", lineHeight: 1 }}>{fmt(total)}</div>
            <div style={{ fontSize: 14, color: "#c8dff0", marginTop: 10, lineHeight: 1.5 }}>
              This is what legacy infrastructure is estimated to cost your organization every year — in downtime, waste, risk, and missed opportunity.
            </div>
          </div>

          {/* Cost breakdown */}
          <div style={{ background: "white", borderRadius: 16, padding: "24px 28px", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", letterSpacing: 1, textTransform: "uppercase", marginBottom: 20 }}>Cost Breakdown</div>
            <CostBar label="Unplanned Downtime" icon="⚡" value={downtimeCost} color="#ef4444" max={max} />
            <CostBar label="Cloud Waste" icon="☁️" value={cloudWasteCost} color="#f59e0b" max={max} />
            <CostBar label="Security & Compliance Risk" icon="🔒" value={securityCost} color="#8b5cf6" max={max} />
            <CostBar label="AI & Productivity Gap" icon="🤖" value={productivityLoss} color="#10b981" max={max} />
          </div>

          {/* Proof points */}
          <div style={{ background: "white", borderRadius: 16, padding: "24px 28px", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>What TechVora Clients Achieve</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { stat: "30%", label: "average infrastructure cost reduction" },
                { stat: "$30K+", label: "monthly Azure savings per client" },
                { stat: "99.999%", label: "reliability through infrastructure design" },
                { stat: "8×", label: "faster automation vs. manual processes" },
                { stat: "Zero", label: "unplanned outages with self-healing systems" },
              ].map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ minWidth: 72, fontSize: 18, fontWeight: 800, color: "#10b981" }}>{p.stat}</div>
                  <div style={{ fontSize: 14, color: "#475569" }}>{p.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ background: "#f0faf4", border: "1.5px solid #10b981", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#065f46", marginBottom: 6 }}>Ready to stop leaving money on the table?</div>
            <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.6 }}>
              Book a free 30-minute consultation and we'll show you exactly where TechVora can recover cost within your first 90 days.
            </div>
          </div>

          <button
            onClick={() => setShowBooking(true)}
            className="btn-primary"
            style={{ width: "100%", marginBottom: 12 }}
          >
            Book My Free Consultation →
          </button>

          {showBooking && (
            <BookingForm
              overallScore={Math.min(Math.round(total / 10_000), 100)}
              sectionScores={[
                { label: "Downtime", score: downtimeCost },
                { label: "Cloud Waste", score: cloudWasteCost },
                { label: "Security Risk", score: securityCost },
                { label: "AI Gap", score: productivityLoss },
              ]}
              tier={total > 500_000 ? "High Exposure" : total > 150_000 ? "Moderate Exposure" : "Lower Exposure"}
              answersDetail={answersDetail}
              onClose={() => setShowBooking(false)}
            />
          )}

          <button
            onClick={() => { setScreen("intro"); setInputs({ revenue: null, industry: null, teamSize: null, outageFreq: null, outageDuration: null, cloudSpend: null, cloudVisibility: null, compliance: null, auditStatus: null, manualPct: null, aiCompetitor: null }); }}
            style={{ width: "100%", background: "transparent", color: "#64748b", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "14px", fontSize: 14, cursor: "pointer" }}
          >
            Recalculate
          </button>
        </div>
      </div>
    );
  }

  // ── QUESTION SCREENS ───────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "32px 24px", fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>

        {/* Progress */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>{meta?.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: BRAND }}>{meta?.title}</span>
            </div>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>Step {stepIdx + 1} of {QUESTION_SCREENS.length}</span>
          </div>
          <div style={{ height: 6, background: "#e2e8f0", borderRadius: 6, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${((stepIdx + 1) / QUESTION_SCREENS.length) * 100}%`, background: meta?.color ?? BRAND, borderRadius: 6, transition: "width 0.3s ease" }} />
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            {QUESTION_SCREENS.map((s, i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i < stepIdx ? (SECTION_META[s]?.color ?? BRAND) : i === stepIdx ? (SECTION_META[s]?.color ?? BRAND) + "60" : "#e2e8f0" }} />
            ))}
          </div>
        </div>

        {/* Card */}
        <div style={{ background: "white", borderRadius: 16, padding: "28px 28px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{meta?.title}</div>
          <div style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>{meta?.subtitle}</div>

          {/* Context screen */}
          {screen === "context" && <>
            <QuestionBlock title="What is your organization's annual revenue?">
              {REVENUE_OPTIONS.map((o, i) => (
                <OptionBtn key={i} label={o.label} selected={inputs.revenue === o} onClick={() => set("revenue", o)} />
              ))}
            </QuestionBlock>
            <QuestionBlock title="Which industry best describes your organization?">
              {INDUSTRIES.map((o, i) => (
                <OptionBtn key={i} label={o.label} selected={inputs.industry === o} onClick={() => set("industry", o)} />
              ))}
            </QuestionBlock>
            <QuestionBlock title="How large is your IT team?">
              {TEAM_SIZE_OPTIONS.map((o, i) => (
                <OptionBtn key={i} label={o.label} selected={inputs.teamSize === o} onClick={() => set("teamSize", o)} />
              ))}
            </QuestionBlock>
          </>}

          {/* Downtime screen */}
          {screen === "downtime" && <>
            <QuestionBlock title="How many unplanned outages did your organization experience last year?">
              {OUTAGE_FREQ_OPTIONS.map((o, i) => (
                <OptionBtn key={i} label={o.label} selected={inputs.outageFreq === o} onClick={() => set("outageFreq", o)} />
              ))}
            </QuestionBlock>
            <QuestionBlock title="What was the average duration of each outage?">
              {OUTAGE_DURATION_OPTIONS.map((o, i) => (
                <OptionBtn key={i} label={o.label} selected={inputs.outageDuration === o} onClick={() => set("outageDuration", o)} />
              ))}
            </QuestionBlock>
          </>}

          {/* Cloud screen */}
          {screen === "cloud" && <>
            <QuestionBlock title="What is your approximate monthly cloud spend (AWS, Azure, GCP)?">
              {CLOUD_SPEND_OPTIONS.map((o, i) => (
                <OptionBtn key={i} label={o.label} selected={inputs.cloudSpend === o} onClick={() => set("cloudSpend", o)} />
              ))}
            </QuestionBlock>
            <QuestionBlock title="How would you describe your cloud cost visibility?">
              {CLOUD_VISIBILITY_OPTIONS.map((o, i) => (
                <OptionBtn key={i} label={o.label} selected={inputs.cloudVisibility === o} onClick={() => set("cloudVisibility", o)} />
              ))}
            </QuestionBlock>
          </>}

          {/* Security screen */}
          {screen === "security" && <>
            <QuestionBlock title="What compliance frameworks apply to your organization?">
              {COMPLIANCE_OPTIONS.map((o, i) => (
                <OptionBtn key={i} label={o.label} selected={inputs.compliance === o} onClick={() => set("compliance", o)} />
              ))}
            </QuestionBlock>
            <QuestionBlock title="What was the result of your most recent security audit?">
              {AUDIT_STATUS_OPTIONS.map((o, i) => (
                <OptionBtn key={i} label={o.label} selected={inputs.auditStatus === o} onClick={() => set("auditStatus", o)} />
              ))}
            </QuestionBlock>
          </>}

          {/* AI screen */}
          {screen === "ai" && <>
            <QuestionBlock title="What percentage of your IT team's time goes to manual, reactive work?">
              {MANUAL_PCT_OPTIONS.map((o, i) => (
                <OptionBtn key={i} label={o.label} selected={inputs.manualPct === o} onClick={() => set("manualPct", o)} />
              ))}
            </QuestionBlock>
            <QuestionBlock title="How does your AI adoption compare to your direct competitors?">
              {AI_COMPETITOR_OPTIONS.map((o, i) => (
                <OptionBtn key={i} label={o.label} selected={inputs.aiCompetitor === o} onClick={() => set("aiCompetitor", o)} />
              ))}
            </QuestionBlock>
          </>}
        </div>

        <button
          onClick={nextScreen}
          disabled={!ready}
          className="btn-primary"
          style={{ width: "100%" }}
        >
          {screen === "ai" ? "Calculate My Cost of Inaction →" : "Next →"}
        </button>
      </div>
    </div>
  );
}
