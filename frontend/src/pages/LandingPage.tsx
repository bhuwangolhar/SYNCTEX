// Landing Page

import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["Features", "Solutions", "Integrations", "Pricing"];

const STEPS = [
  { num: "01", icon: "🏗️", title: "Set Up Your Workspace", desc: "Configure your organization structure in minutes with guided onboarding." },
  { num: "02", icon: "👥", title: "Invite Your Team", desc: "Import members, assign roles, and get everyone synced instantly." },
  { num: "03", icon: "⚙️", title: "Configure Workflows", desc: "Customize plans, permissions, and automation rules for your needs." },
  { num: "04", icon: "🚀", title: "Manage Everything", desc: "Real-time dashboards, reports, and insights — all in one place." },
];

const SOLUTIONS = [
  { icon: "🏢", title: "Enterprise Teams", desc: "End-to-end management for large orgs with multi-branch support and centralized control.", tag: "Popular" },
  { icon: "🌐", title: "Franchise Networks", desc: "Standardized operations across all locations with franchisor-level visibility.", tag: "" },
  { icon: "📊", title: "Data & Analytics", desc: "Turn raw activity into actionable insights. Track every metric in real-time.", tag: "New" },
  { icon: "🔗", title: "Integrations Hub", desc: "Connect your existing tools — payments, messaging, video, and more.", tag: "" },
];

const STATS = [
  { value: "12K+", label: "Organizations" },
  { value: "98%", label: "Uptime SLA" },
  { value: "3.2M", label: "Tasks Managed" },
  { value: "40%", label: "Productivity Gain" },
];

const TESTIMONIALS = [
  { name: "Rahul Shukla", role: "CEO, BuildFast Inc.", text: "SYNCTEX replaced four tools we were using. The team visibility alone saved us hours every week.", stars: 5 },
  { name: "Payal Dev", role: "Operations Head, EdGrow", text: "Onboarding was seamless. The dashboards are exactly what we needed — clean and powerful.", stars: 5 },
  { name: "Amit Verma", role: "Director, NexaGroup", text: "Multi-branch management is finally stress-free. I can monitor everything from one screen.", stars: 5 },
];

const INTEGRATIONS = ["WhatsApp API", "Razorpay", "SMS Gateway", "Google Meet", "Zoom", "Finance Partners"];

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={styles.root}>
      {/* NAV */}
      <nav style={{ ...styles.nav, ...(scrolled ? styles.navScrolled : {}) }}>
        <div style={styles.navInner}>
          <span style={styles.navLogo}>SYNCTEX</span>
          <div style={styles.navLinks}>
            {NAV_LINKS.map(l => (
              <a key={l} href="#" style={styles.navLink}>{l}</a>
            ))}
          </div>
          <div style={styles.navActions}>
            <a href="/login" style={styles.navLoginBtn}>Login</a>
            <a href="/signup" style={styles.navCta}>Get Started →</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroBadge}>✦ Now in public beta — free to get started</div>
        <h1 style={styles.heroTitle}>
          Sync Your Entire<br />
          <span style={styles.heroAccent}>Organization</span>
        </h1>
        <p style={styles.heroSub}>
          The all-in-one platform for teams who want less chaos and more clarity.<br />
          Manage people, workflows, and data — beautifully.
        </p>
        <div style={styles.heroBtns}>
          <a href="/register" style={styles.heroPrimary}>Start for free</a>
          <a href="#features" style={styles.heroSecondary}>See how it works ↓</a>
        </div>
        <div style={styles.heroStats}>
          {STATS.map(s => (
            <div key={s.label} style={styles.heroStat}>
              <span style={styles.heroStatVal}>{s.value}</span>
              <span style={styles.heroStatLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="features" style={styles.section}>
        <div style={styles.sectionInner}>
          <p style={styles.eyebrow}>HOW IT WORKS</p>
          <h2 style={styles.sectionTitle}>Up and running in four steps</h2>
          <div style={styles.stepsGrid}>
            {STEPS.map((s, i) => (
              <div key={i} style={styles.stepCard}>
                <div style={styles.stepNum}>{s.num}</div>
                <div style={styles.stepIcon}>{s.icon}</div>
                <h3 style={styles.stepTitle}>{s.title}</h3>
                <p style={styles.stepDesc}>{s.desc}</p>
                {i < STEPS.length - 1 && <div style={styles.stepArrow}>→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTIONS */}
      <section style={{ ...styles.section, background: "#0a0f1e" }}>
        <div style={styles.sectionInner}>
          <p style={{ ...styles.eyebrow, color: "#4f8eff" }}>SOLUTIONS</p>
          <h2 style={{ ...styles.sectionTitle, color: "#fff" }}>Built for every kind of org</h2>
          <div style={styles.solGrid}>
            {SOLUTIONS.map((s, i) => (
              <div key={i} style={styles.solCard}>
                {s.tag && <span style={styles.solTag}>{s.tag}</span>}
                <div style={styles.solIcon}>{s.icon}</div>
                <h3 style={styles.solTitle}>{s.title}</h3>
                <p style={styles.solDesc}>{s.desc}</p>
                <a href="#" style={styles.solLink}>Learn more →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DATA / ANALYTICS BAND */}
      <section style={styles.dataBand}>
        <div style={styles.sectionInner}>
          <div style={styles.dataBandInner}>
            <div style={styles.dataBandText}>
              <p style={{ ...styles.eyebrow, color: "#4f8eff" }}>ANALYTICS</p>
              <h2 style={{ ...styles.sectionTitle, color: "#fff", textAlign: "left" }}>
                Data that drives<br />smarter decisions
              </h2>
              <p style={styles.dataBandSub}>
                Transform raw activity into real insight. Every report, every metric, every trend — live.
              </p>
              <div style={styles.dataChips}>
                {["Revenue Reports", "Performance Metrics", "Conversion Rates", "Growth Analytics"].map(c => (
                  <span key={c} style={styles.dataChip}>{c}</span>
                ))}
              </div>
            </div>
            <div style={styles.dataBandVisual}>
              <div style={styles.mockDashboard}>
                <div style={styles.mockBar}>
                  <span style={styles.mockDot} />
                  <span style={styles.mockDot} />
                  <span style={styles.mockDot} />
                </div>
                <div style={styles.mockChart}>
                  {[60, 80, 45, 90, 70, 95, 55].map((h, i) => (
                    <div key={i} style={{ ...styles.mockChartBar, height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
                <div style={styles.mockMetrics}>
                  <div style={styles.mockMetric}><span style={styles.mockMetricVal}>↑ 40%</span><span style={styles.mockMetricLabel}>Growth</span></div>
                  <div style={styles.mockMetric}><span style={styles.mockMetricVal}>98%</span><span style={styles.mockMetricLabel}>Uptime</span></div>
                  <div style={styles.mockMetric}><span style={styles.mockMetricVal}>3.2M</span><span style={styles.mockMetricLabel}>Events</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section style={styles.section}>
        <div style={styles.sectionInner}>
          <p style={styles.eyebrow}>INTEGRATIONS</p>
          <h2 style={styles.sectionTitle}>Works with the tools you love</h2>
          <div style={styles.intGrid}>
            {INTEGRATIONS.map((name, i) => (
              <div key={i} style={styles.intCard}>
                <div style={styles.intIcon}>⚡</div>
                <span style={styles.intName}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ ...styles.section, background: "#f7f9ff" }}>
        <div style={styles.sectionInner}>
          <p style={styles.eyebrow}>TESTIMONIALS</p>
          <h2 style={styles.sectionTitle}>What people are saying</h2>
          <div style={styles.testiGrid}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={styles.testiCard}>
                <div style={styles.testiStars}>{"★".repeat(t.stars)}</div>
                <p style={styles.testiText}>"{t.text}"</p>
                <div style={styles.testiAuthor}>
                  <div style={styles.testiAvatar}>{t.name[0]}</div>
                  <div>
                    <div style={styles.testiName}>{t.name}</div>
                    <div style={styles.testiRole}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section style={styles.ctaBand}>
        <div style={styles.sectionInner}>
          <h2 style={styles.ctaTitle}>Ready to bring your org in sync?</h2>
          <p style={styles.ctaSub}>Join thousands of organizations already running on SYNCTEX.</p>
          <div style={styles.ctaBtns}>
            <a href="/register" style={styles.heroPrimary}>Create free account</a>
            <a href="#" style={{ ...styles.heroSecondary, borderColor: "rgba(255,255,255,0.3)", color: "#fff" }}>Schedule a demo</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div>
            <div style={styles.footerLogo}>SYNCTEX</div>
            <p style={styles.footerTagline}>Sync your organization.<br />Scale without limits.</p>
          </div>
          <div style={styles.footerLinks}>
            {["Home", "Features", "Pricing", "Contact Us", "Privacy Policy", "Terms of Service"].map(l => (
              <a key={l} href="#" style={styles.footerLink}>{l}</a>
            ))}
          </div>
          <div>
            <div style={styles.footerContactTitle}>Get in Touch</div>
            <p style={styles.footerContact}>support@synctex.io</p>
            <p style={styles.footerContact}>+91 98765 43210</p>
          </div>
        </div>
        <div style={styles.footerBottom}>© 2026 SYNCTEX. All rights reserved.</div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { font-family: 'DM Sans', sans-serif; background: #fff; }
        @keyframes riseBar {
          from { height: 0%; opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: { fontFamily: "'DM Sans', sans-serif", color: "#111", overflowX: "hidden" },

  // NAV
  nav: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "18px 40px", transition: "all 0.3s", background: "transparent" },
  navScrolled: { background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", boxShadow: "0 1px 24px rgba(0,0,0,0.08)" },
  navInner: { maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" },
  navLogo: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: "#0a0f1e", letterSpacing: 1 },
  navLinks: { display: "flex", gap: 36 },
  navLink: { textDecoration: "none", color: "#444", fontSize: 14, fontWeight: 500, transition: "color 0.2s" },
  navActions: { display: "flex", gap: 12, alignItems: "center" },
  navLoginBtn: { textDecoration: "none", color: "#333", fontSize: 14, fontWeight: 500, padding: "8px 18px", borderRadius: 8, border: "1px solid #ddd" },
  navCta: { textDecoration: "none", background: "linear-gradient(90deg,#3b82f6,#7c3aed)", color: "#fff", fontSize: 14, fontWeight: 600, padding: "9px 22px", borderRadius: 8 },

  // HERO
  hero: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "120px 24px 80px", background: "linear-gradient(160deg, #f0f5ff 0%, #fafaff 50%, #eef3ff 100%)", position: "relative" },
  heroBadge: { background: "#fff", border: "1px solid #dde6ff", borderRadius: 99, padding: "6px 18px", fontSize: 13, color: "#4f8eff", fontWeight: 500, marginBottom: 28 },
  heroTitle: { fontFamily: "'Syne', sans-serif", fontSize: "clamp(48px, 7vw, 84px)", fontWeight: 800, lineHeight: 1.05, color: "#0a0f1e", marginBottom: 24 },
  heroAccent: { background: "linear-gradient(90deg, #3b82f6, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  heroSub: { fontSize: 18, color: "#555", lineHeight: 1.7, maxWidth: 540, marginBottom: 40 },
  heroBtns: { display: "flex", gap: 16, marginBottom: 64, flexWrap: "wrap", justifyContent: "center" },
  heroPrimary: { textDecoration: "none", background: "linear-gradient(90deg,#3b82f6,#7c3aed)", color: "#fff", fontSize: 15, fontWeight: 600, padding: "14px 32px", borderRadius: 10 },
  heroSecondary: { textDecoration: "none", border: "1px solid #ccc", color: "#333", fontSize: 15, fontWeight: 500, padding: "14px 28px", borderRadius: 10, background: "#fff" },
  heroStats: { display: "flex", gap: 48, flexWrap: "wrap", justifyContent: "center" },
  heroStat: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  heroStatVal: { fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color: "#0a0f1e" },
  heroStatLabel: { fontSize: 13, color: "#888", fontWeight: 500 },

  // SECTIONS
  section: { padding: "100px 24px", background: "#fff" },
  sectionInner: { maxWidth: 1200, margin: "0 auto" },
  eyebrow: { fontSize: 12, fontWeight: 700, letterSpacing: 2.5, color: "#4f8eff", textTransform: "uppercase", marginBottom: 12 },
  sectionTitle: { fontFamily: "'Syne', sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#0a0f1e", marginBottom: 52, textAlign: "center" },

  // STEPS
  stepsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, position: "relative" },
  stepCard: { padding: "32px 28px", background: "#fff", border: "1px solid #eaecf4", borderRadius: 16, position: "relative", margin: "0 8px" },
  stepNum: { fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, color: "#c0c8e8", letterSpacing: 1, marginBottom: 16 },
  stepIcon: { fontSize: 28, marginBottom: 14 },
  stepTitle: { fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: "#0a0f1e", marginBottom: 10 },
  stepDesc: { fontSize: 14, color: "#666", lineHeight: 1.6 },
  stepArrow: { position: "absolute", right: -20, top: "50%", transform: "translateY(-50%)", fontSize: 20, color: "#c0c8e8", zIndex: 2 },

  // SOLUTIONS
  solGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 },
  solCard: { background: "#111827", border: "1px solid #1e2a45", borderRadius: 16, padding: "36px 32px", position: "relative", transition: "border-color 0.2s" },
  solTag: { position: "absolute", top: 20, right: 20, background: "linear-gradient(90deg,#3b82f6,#7c3aed)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 99 },
  solIcon: { fontSize: 32, marginBottom: 16 },
  solTitle: { fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 10 },
  solDesc: { fontSize: 14, color: "#94a3b8", lineHeight: 1.7, marginBottom: 20 },
  solLink: { textDecoration: "none", color: "#4f8eff", fontSize: 14, fontWeight: 600 },

  // DATA BAND
  dataBand: { background: "#060c1a", padding: "100px 24px" },
  dataBandInner: { display: "flex", gap: 80, alignItems: "center", flexWrap: "wrap" },
  dataBandText: { flex: 1, minWidth: 280 },
  dataBandSub: { color: "#94a3b8", fontSize: 16, lineHeight: 1.7, marginBottom: 28, marginTop: -20 },
  dataChips: { display: "flex", gap: 10, flexWrap: "wrap" },
  dataChip: { background: "#111827", border: "1px solid #1e2a45", color: "#94a3b8", fontSize: 13, padding: "8px 16px", borderRadius: 8, fontWeight: 500 },
  dataBandVisual: { flex: 1, minWidth: 280 },
  mockDashboard: { background: "#111827", borderRadius: 16, padding: 24, border: "1px solid #1e2a45" },
  mockBar: { display: "flex", gap: 6, marginBottom: 20 },
  mockDot: { width: 10, height: 10, borderRadius: "50%", background: "#1e2a45", display: "inline-block" },
  mockChart: { display: "flex", alignItems: "flex-end", gap: 8, height: 120, marginBottom: 20 },
  mockChartBar: { flex: 1, background: "linear-gradient(180deg,#3b82f6,#7c3aed)", borderRadius: "4px 4px 0 0", animation: "riseBar 0.6s ease-out forwards" },
  mockMetrics: { display: "flex", gap: 12 },
  mockMetric: { flex: 1, background: "#0d1525", borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 4 },
  mockMetricVal: { fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: "#fff" },
  mockMetricLabel: { fontSize: 11, color: "#4f8eff", fontWeight: 600 },

  // INTEGRATIONS
  intGrid: { display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" },
  intCard: { display: "flex", alignItems: "center", gap: 10, background: "#f8faff", border: "1px solid #e2e8f8", borderRadius: 12, padding: "14px 22px" },
  intIcon: { fontSize: 18 },
  intName: { fontSize: 14, fontWeight: 600, color: "#333" },

  // TESTIMONIALS
  testiGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 },
  testiCard: { background: "#fff", border: "1px solid #eaecf4", borderRadius: 16, padding: "32px 28px", boxShadow: "0 4px 24px rgba(0,0,0,0.04)" },
  testiStars: { color: "#f59e0b", fontSize: 18, marginBottom: 16, letterSpacing: 2 },
  testiText: { fontSize: 15, color: "#444", lineHeight: 1.7, marginBottom: 24, fontStyle: "italic" },
  testiAuthor: { display: "flex", alignItems: "center", gap: 12 },
  testiAvatar: { width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#7c3aed)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16 },
  testiName: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#0a0f1e" },
  testiRole: { fontSize: 12, color: "#888", marginTop: 2 },

  // CTA BAND
  ctaBand: { background: "linear-gradient(135deg,#1a237e,#3b82f6,#7c3aed)", padding: "100px 24px", textAlign: "center" },
  ctaTitle: { fontFamily: "'Syne', sans-serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, color: "#fff", marginBottom: 16 },
  ctaSub: { fontSize: 18, color: "rgba(255,255,255,0.75)", marginBottom: 40 },
  ctaBtns: { display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" },

  // FOOTER
  footer: { background: "#060c1a", padding: "60px 24px 30px" },
  footerInner: { maxWidth: 1200, margin: "0 auto", display: "flex", gap: 60, flexWrap: "wrap", paddingBottom: 40, borderBottom: "1px solid #1e2a45" },
  footerLogo: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: "#fff", marginBottom: 12, letterSpacing: 1 },
  footerTagline: { fontSize: 13, color: "#4b5a7a", lineHeight: 1.7 },
  footerLinks: { display: "flex", flexDirection: "column", gap: 10, flex: 1 },
  footerLink: { textDecoration: "none", color: "#4b5a7a", fontSize: 13, transition: "color 0.2s" },
  footerContactTitle: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 12 },
  footerContact: { fontSize: 13, color: "#4b5a7a", marginBottom: 6 },
  footerBottom: { maxWidth: 1200, margin: "24px auto 0", fontSize: 12, color: "#2a3a5a", textAlign: "center" },
};