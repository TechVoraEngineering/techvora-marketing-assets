import { useState } from "react";
import BookingForm from "../BookingForms/booking-form";

const sections = [
  {
    id: "cloud",
    title: "Cloud Readiness",
    icon: "☁️",
    questions: [
      {
        q: "How much of your infrastructure is currently running in the cloud?",
        options: ["None — fully on-premise", "Less than 25%", "25–75% hybrid", "75%+ cloud-native"]
      },
      {
        q: "How do you currently handle system outages or downtime?",
        options: ["Manually — reactive firefighting", "Some monitoring, mostly reactive", "Proactive monitoring with some automation", "Self-healing systems with automated recovery"]
      },
      {
        q: "How would you describe your cloud cost visibility?",
        options: ["No visibility — bills are unpredictable", "Basic billing view only", "Some tagging and cost tracking", "Full visibility with optimization in place"]
      },
      {
        q: "How are new infrastructure changes deployed?",
        options: ["Manually by engineers", "Mix of manual and scripted", "Mostly automated with some manual steps", "Fully automated pipelines"]
      },
      {
        q: "How confident are you in migrating workloads to the cloud without disrupting operations?",
        options: ["Not confident at all", "Somewhat uncertain", "Fairly confident with some gaps", "Very confident — proven process in place"]
      }
    ]
  },
  {
    id: "security",
    title: "Security & Compliance",
    icon: "🔒",
    questions: [
      {
        q: "When did you last pass a security audit without major findings?",
        options: ["Never / we've failed recent audits", "More than 2 years ago", "Within the last 1–2 years", "Within the last 12 months — clean audit"]
      },
      {
        q: "How are security vulnerabilities currently identified in your environment?",
        options: ["Reactively — after incidents occur", "Periodic manual reviews", "Automated scanning with manual review", "Continuous automated monitoring and remediation"]
      },
      {
        q: "How would you rate your current compliance posture (HIPAA, SOC2, financial regs)?",
        options: ["At risk — significant gaps exist", "Partially compliant with known gaps", "Mostly compliant with minor gaps", "Fully compliant and audit-ready"]
      },
      {
        q: "How is access to your systems and data managed?",
        options: ["Minimal controls in place", "Basic role-based access", "Role-based access with some MFA", "Zero-trust architecture with full MFA and audit logging"]
      },
      {
        q: "How quickly can your team detect and respond to a security incident?",
        options: ["Hours to days — no formal process", "Same day with manual effort", "Within hours with some automation", "Minutes — automated detection and response"]
      }
    ]
  },
  {
    id: "automation",
    title: "Automation Maturity",
    icon: "⚙️",
    questions: [
      {
        q: "What percentage of your team's time is spent on manual, repetitive IT tasks?",
        options: ["75%+ — mostly maintenance work", "50–75% manual", "25–50% manual", "Less than 25% — mostly strategic work"]
      },
      {
        q: "How are software deployments currently handled?",
        options: ["Fully manual — engineers push changes", "Some scripts, mostly manual", "CI/CD pipeline with some manual gates", "Fully automated CI/CD with zero-touch deployments"]
      },
      {
        q: "How is your infrastructure provisioned?",
        options: ["Manually configured each time", "Some reusable scripts", "Infrastructure-as-code for most resources", "Fully automated IaC with drift detection"]
      },
      {
        q: "How often does your team deploy to production?",
        options: ["Monthly or less", "Weekly", "Multiple times per week", "Multiple times per day on demand"]
      },
      {
        q: "How would you describe your testing and validation process before production releases?",
        options: ["Minimal — mostly manual QA", "Some automated tests, mostly manual", "Automated testing with parallel environments", "Full parallel environment validation — zero-risk deployments"]
      }
    ]
  },
  {
    id: "ai",
    title: "AI Readiness",
    icon: "🤖",
    questions: [
      {
        q: "How would you describe the state of your data across the organization?",
        options: ["Scattered across legacy systems — siloed", "Some consolidation but still fragmented", "Mostly centralized with some gaps", "Unified data platform — single source of truth"]
      },
      {
        q: "Has your organization successfully deployed any AI or ML tools in production?",
        options: ["No — haven't started", "Exploring / in pilot phase", "1–2 tools deployed with limited scale", "Multiple AI tools in production at scale"]
      },
      {
        q: "How clean and accessible is your data for analytics or AI use?",
        options: ["Poor quality — inconsistent and hard to access", "Usable but requires significant prep work", "Mostly clean with a defined pipeline", "High quality — ready for AI/ML consumption"]
      },
      {
        q: "How is decision-making currently supported by data in your organization?",
        options: ["Mostly gut feel and experience", "Ad hoc reporting — slow and manual", "Regular dashboards but limited real-time insight", "Real-time data driving automated decisions"]
      },
      {
        q: "What is your leadership's appetite for AI-driven transformation?",
        options: ["Low — not a current priority", "Interested but no clear roadmap", "Committed with budget allocated", "AI is a core strategic initiative — actively investing"]
      }
    ]
  }
];

const tiers = [
  {
    label: "Legacy",
    range: "0–40%",
    color: "#e74c3c",
    bg: "#fdf0ef",
    border: "#e74c3c",
    headline: "Your infrastructure is holding you back.",
    description: "Your current environment carries significant risk and is likely preventing your team from innovating. The good news: companies at this stage typically see the fastest and most dramatic ROI from modernization — often recovering costs within the first 90 days.",
    next: "Book a free IT Modernization Assessment with a TechVora architect to build your roadmap.",
    cta: "Book Your Free Consultation"
  },
  {
    label: "Transitioning",
    range: "41–70%",
    color: "#f39c12",
    bg: "#fef9f0",
    border: "#f39c12",
    headline: "You've started the journey — but gaps remain.",
    description: "You've made real progress, but inconsistencies in security, automation, or data maturity are likely creating hidden costs and slowing down your AI ambitions. Targeted optimization at this stage delivers outsized returns.",
    next: "Book a free strategy session with a TechVora architect to close your gaps and accelerate your roadmap.",
    cta: "Book Your Strategy Session"
  },
  {
    label: "Modern",
    range: "71–100%",
    color: "#27ae60",
    bg: "#f0faf4",
    border: "#27ae60",
    headline: "You're ahead of the curve.",
    description: "Your infrastructure is well-positioned for AI-driven growth. The focus now is on optimizing further, scaling AI initiatives, and ensuring your competitive advantage compounds over time.",
    next: "Talk to TechVora about advanced AI implementation and competitive differentiation.",
    cta: "Talk to an Expert"
  }
];

const sectionColors = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981"];

export default function App() {
  const [screen, setScreen] = useState("intro"); // intro | section | results
  const [sectionIdx, setSectionIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({}); // key: "s-q" => 0-3
  const [selected, setSelected] = useState(null);
  const [showBooking, setShowBooking] = useState(false);

  const totalQuestions = sections.reduce((a, s) => a + s.questions.length, 0);
  const answeredCount = Object.keys(answers).length;
  const progress = answeredCount / totalQuestions;

  const currentSection = sections[sectionIdx];
  const currentQuestion = currentSection?.questions[questionIdx];

  function handleSelect(val: any) {
    setSelected(val);
  }

  function handleNext() {
    if (selected === null) return;
    const key = `${sectionIdx}-${questionIdx}`;
    const newAnswers = { ...answers, [key]: selected };
    setAnswers(newAnswers);
    setSelected(null);

    if (questionIdx < currentSection.questions.length - 1) {
      setQuestionIdx(questionIdx + 1);
    } else if (sectionIdx < sections.length - 1) {
      setSectionIdx(sectionIdx + 1);
      setQuestionIdx(0);
    } else {
      setScreen("results");
    }
  }

  function calcResults() {
    const sectionScores = sections.map((sec, si) => {
      let total = 0;
      sec.questions.forEach((_, qi) => {
        const val = answers[`${si}-${qi}`] ?? 0;
        total += val; // 0–3
      });
      const max = sec.questions.length * 3;
      return Math.round((total / max) * 100);
    });
    const overall = Math.round(sectionScores.reduce((a, b) => a + b, 0) / sectionScores.length);
    return { sectionScores, overall };
  }

  function getTier(score: any) {
    if (score <= 40) return tiers[0];
    if (score <= 70) return tiers[1];
    return tiers[2];
  }

  // INTRO
  if (screen === "intro") return (
    <div style={{ padding: "16px", fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ background: "#558DD9", borderRadius: 16, padding: "32px", color: "white", marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "#7ec8f0", marginBottom: 10 }}>TechVora Solutions</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 12px", lineHeight: 1.3 }}>IT Modernization Readiness Assessment</h1>
        <p style={{ fontSize: 15, color: "#c8dff0", lineHeight: 1.6, margin: 0 }}>Find out exactly where your infrastructure stands — and what to do next. 20 questions across 4 key areas. Takes about 4 minutes.</p>
      </div>
      <div style={{ background: "white", borderRadius: 16, padding: "24px 28px", marginBottom: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          {sections.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: sectionColors[i] + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1e3a5f" }}>{s.title}</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{s.questions.length} questions</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={() => setScreen("section")} className="btn-primary" style={{ width: "100%" }}>
        Start Assessment →
      </button>
    </div>
  );

  // RESULTS
  if (screen === "results") {
    const { sectionScores, overall } = calcResults();
    const tier = getTier(overall);
    return (
      <div style={{ padding: "16px", fontFamily: "'Segoe UI', sans-serif" }}>
          <div style={{ background: "#1e3a5f", borderRadius: 16, padding: "32px", color: "white", marginBottom: 16, textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "#7ec8f0", marginBottom: 8 }}>Your Results</div>
            <div style={{ fontSize: 64, fontWeight: 800, color: tier.color, lineHeight: 1 }}>{overall}%</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 8 }}>{tier.label}</div>
          </div>

          {/* Section breakdown */}
          <div style={{ background: "white", borderRadius: 16, padding: "24px 28px", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", letterSpacing: 1, textTransform: "uppercase", marginBottom: 18 }}>Score by Area</div>
            {sections.map((sec, i) => (
              <div key={i} style={{ marginBottom: i < sections.length - 1 ? 16 : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{sec.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#1e3a5f" }}>{sec.title}</span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: sectionColors[i] }}>{sectionScores[i]}%</span>
                </div>
                <div style={{ height: 8, background: "#f1f5f9", borderRadius: 8, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${sectionScores[i]}%`, background: sectionColors[i], borderRadius: 8, transition: "width 1s ease" }} />
                </div>
              </div>
            ))}
          </div>

          {/* Tier result */}
          <div style={{ background: tier.bg, border: `1.5px solid ${tier.border}`, borderRadius: 16, padding: "24px 28px", marginBottom: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: tier.color, marginBottom: 10 }}>{tier.headline}</div>
            <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.7, margin: "0 0 16px" }}>{tier.description}</p>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>Recommended next step:</div>
            <div style={{ fontSize: 14, color: "#334155", marginTop: 4 }}>{tier.next}</div>
          </div>

          <button onClick={() => setShowBooking(true)} className="btn-primary" style={{ width: "100%", marginBottom: 12 }}>
            {tier.cta} →
          </button>
          {showBooking && (
            <BookingForm
              overallScore={overall}
              sectionScores={sections.map((s, i) => ({ label: s.title, score: sectionScores[i] }))}
              tier={tier.label}
              answersDetail={sections.map((sec, si) =>
                `--- ${sec.title} ---\n` +
                sec.questions.map((q, qi) => {
                  const val = answers[`${si}-${qi}`];
                  const answer = val !== undefined ? q.options[val] : "Not answered";
                  return `Q: ${q.q}\nA: ${answer}`;
                }).join("\n\n")
              ).join("\n\n")}
              onClose={() => setShowBooking(false)}
            />
          )}
          <button onClick={() => { setScreen("intro"); setSectionIdx(0); setQuestionIdx(0); setAnswers({}); setSelected(null); }}
            style={{ width: "100%", background: "transparent", color: "#64748b", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "14px", fontSize: 14, cursor: "pointer" }}>
            Retake Assessment
          </button>
      </div>
    );
  }

  // QUESTION
  const prevAnswered = answers[`${sectionIdx}-${questionIdx}`];
  const displaySelected = selected !== null ? selected : (prevAnswered !== undefined ? prevAnswered : null);

  return (
    <div style={{ padding: "16px", fontFamily: "'Segoe UI', sans-serif" }}>
        {/* Progress */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>{currentSection.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#1e3a5f" }}>{currentSection.title}</span>
            </div>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>{answeredCount} of {totalQuestions}</span>
          </div>
          <div style={{ height: 6, background: "#e2e8f0", borderRadius: 6, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress * 100}%`, background: sectionColors[sectionIdx], borderRadius: 6, transition: "width 0.3s ease" }} />
          </div>
          {/* Section pills */}
          <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
            {sections.map((s, i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i < sectionIdx ? sectionColors[i] : i === sectionIdx ? sectionColors[i] + "60" : "#e2e8f0" }} />
            ))}
          </div>
        </div>

        {/* Question card */}
        <div style={{ background: "white", borderRadius: 16, padding: "32px 28px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>
            Question {questionIdx + 1} of {currentSection.questions.length}
          </div>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1e3a5f", margin: "0 0 24px", lineHeight: 1.4 }}>{currentQuestion.q}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {currentQuestion.options.map((opt, i) => {
              const isSelected = displaySelected === i;
              return (
                <button key={i} onClick={() => handleSelect(i)}
                  style={{
                    textAlign: "left", padding: "14px 16px", borderRadius: 10, border: `2px solid ${isSelected ? sectionColors[sectionIdx] : "#e2e8f0"}`,
                    background: isSelected ? sectionColors[sectionIdx] + "12" : "white", cursor: "pointer", fontSize: 14, color: "#334155",
                    fontWeight: isSelected ? 600 : 400, transition: "all 0.15s ease", display: "flex", alignItems: "center", gap: 12
                  }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${isSelected ? sectionColors[sectionIdx] : "#cbd5e1"}`, background: isSelected ? sectionColors[sectionIdx] : "white", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {isSelected && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "white" }} />}
                  </div>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        <button onClick={handleNext} disabled={displaySelected === null} className="btn-primary" style={{ width: "100%" }}>
          {sectionIdx === sections.length - 1 && questionIdx === currentSection.questions.length - 1 ? "See My Results →" : "Next Question →"}
        </button>
    </div>
  );
}
