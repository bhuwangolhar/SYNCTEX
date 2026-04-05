import { useNavigate } from "react-router-dom";
import { useOrganization } from "../../hooks/useOrganization";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const STATS = [
  { label: "Total Members", value: "01", change: "+1 this week", up: true, color: "#3b82f6" },
  { label: "Courses sold", value: "0", change: "+0 this month", up: true, color: "#8b5cf6" },
  { label: "Tasks Completed", value: "0", change: "+0 today", up: true, color: "#10b981" },
  { label: "Pending Enquiries", value: "0", change: "-0 since yesterday", up: false, color: "#f59e0b" },
];

const RECENT_ACTIVITY = [];

const COURSES = [];

const BRANCH_ENQUIRIES = [
  { name: "Head Office", enquiries: 0 },
];


export default function DashboardHome() {
  const navigate = useNavigate();
  const { organization } = useOrganization();
  const storedUserName = localStorage.getItem("userName")?.trim() || "";
  const userName = storedUserName || "Welcome back";
  const orgName = organization?.name || localStorage.getItem("orgName") || "Your Organization";

  return (
    <>
      {/* WELCOME BANNER */}
      <div style={s.welcomeBanner}>
        <div style={s.welcomeContent}>
          <h2 style={s.welcomeTitle}>Welcome {organization?.founder_name || "User"} 👋</h2>
        </div>
        <div style={s.welcomeActions}>
          <button style={s.welcomeBtnOutline} onClick={() => navigate("/dashboard/hr")}>
            Invite Member
          </button>
        </div>
        <div style={s.welcomeGlow} />
      </div>

      {/* STAT CARDS */}
      <div style={s.statsGrid}>
        {STATS.map((stat, i) => (
          <div
            key={i}
            className="stat-card"
            style={{
              ...s.statCard,
              animationDelay: `${i * 0.08}s`,
              borderTop: `3px solid ${stat.color}`,
            }}
          >
            <div style={s.statLabel}>{stat.label}</div>
            <div style={{ ...s.statValue, color: stat.color }}>{stat.value}</div>
            <div style={{ ...s.statChange, color: stat.up ? "#10b981" : "#f87171" }}>
              {stat.up ? "↑" : "↓"} {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* MID ROW */}
      <div style={s.midRow}>
        {/* CHART */}
        <div style={s.chartCard}>
          <div style={s.cardHeader}>
            <div>
              <div style={s.cardTitle}>Branch Wise Enquiries</div>
              <div style={s.cardSub}>Enquiries by branch</div>
            </div>
            <select style={s.cardSelect}>
              <option>2026</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={BRANCH_ENQUIRIES} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: "12px" }} />
              <YAxis stroke="#64748b" style={{ fontSize: "12px" }} label={{ value: "No of Enquiries", angle: -90, position: "insideLeft", dx: 10, dy: 50 }} />
              <Tooltip 
                contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
              />
              <Bar dataKey="enquiries" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* RECENT ACTIVITY */}
        <div style={s.activityCard}>
          <div style={s.cardHeader}>
            <div>
              <div style={s.cardTitle}>Recent Activity</div>
            </div>
            <a style={s.seeAll} href="#">See all</a>
          </div>
          {RECENT_ACTIVITY.length === 0 ? (
            <div style={s.emptyState}>
              <p style={s.emptyText}>No recent activity</p>
            </div>
          ) : (
            RECENT_ACTIVITY.map((act, i) => (
              <div
                key={i}
                className="activity-row"
                style={{ ...s.activityRow, animationDelay: `${i * 0.07}s` }}
              >
                <div
                  style={{
                    ...s.activityAvatar,
                    background: `hsl(${i * 60}, 70%, 55%)`,
                  }}
                >
                  {act.avatar}
                </div>
                <div style={s.activityText}>
                  <span style={s.activityUser}>{act.user}</span>{" "}
                  <span style={s.activityAction}>{act.action}</span>{" "}
                  <span style={s.activityTarget}>{act.target}</span>
                </div>
                <div style={s.activityTime}>{act.time}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* COURSES ANALYTICS TABLE */}
      <div style={s.projectsCard}>
        <div style={s.cardHeader}>
          <div>
            <div style={s.cardTitle}>Courses Analytics</div>
          </div>
          <a style={s.seeAll} href="#" onClick={() => navigate("/dashboard/courses")}>View all</a>
        </div>
        <table style={s.table}>
          <thead style={s.tableHead}>
            <tr>
              <th style={s.th}>Course Name</th>
              <th style={s.th}>Enrollment</th>
              <th style={s.th}>Revenue</th>
              <th style={s.th}>Progress</th>
              <th style={s.th}>Trend</th>
            </tr>
          </thead>
          <tbody>
            <tr style={s.tableRow} className="table-row">
              <td style={{ ...s.td, ...s.projName }}>No courses available</td>
              <td style={s.td}>0</td>
              <td style={s.td}>₹0</td>
              <td style={{ ...s.td, marginRight: "24px" }}>
                <div style={s.progressWrap}>
                  <div style={s.progressTrack}>
                    <div style={{ ...s.progressBar, width: "0%", background: "#cbd5e1" }} />
                  </div>
                  <span style={{ ...s.progressPct, color: "#64748b" }}>0%</span>
                </div>
              </td>
              <td style={{ ...s.td, marginLeft: "50px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "18px" }}>📉</span>
                  <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 500 }}>No data</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

const s: Record<string, React.CSSProperties> = {
  welcomeBanner: { background: "linear-gradient(135deg,#3b82f6 0%,#7c3aed 100%)", borderRadius: 20, padding: "32px 36px", color: "#fff", position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24, animation: "fadeUp 0.5s ease both", marginBottom: 24 },
  welcomeContent: { flex: 1, display: "flex", flexDirection: "column", gap: 8 },
  welcomeEyebrow: { fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.2, margin: 0, opacity: 0.9, background: "transparent" },
  welcomeTitle: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, margin: 0 },
  welcomeSub: { fontSize: 13, opacity: 0.92, lineHeight: 1.6, margin: 0, background: "transparent" },
  welcomeSubStrong: { fontWeight: 700, background: "transparent" },
  welcomeActions: { display: "flex", gap: 12, flexShrink: 0 },
  welcomeBtn: { background: "rgba(255,255,255,0.25)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", padding: "10px 20px", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s" },
  welcomeBtnOutline: { background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.4)", padding: "10px 20px", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s" },
  welcomeGlow: { position: "absolute", top: -60, right: -40, width: 200, height: 200, background: "radial-gradient(circle,rgba(255,255,255,0.2) 0%,transparent 70%)", borderRadius: "50%", pointerEvents: "none" },

  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 },
  statCard: { background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "22px 24px", transition: "transform 0.2s, box-shadow 0.2s", animation: "fadeUp 0.5s ease both", cursor: "default" },
  statLabel: { fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 },
  statValue: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32, marginBottom: 6 },
  statChange: { fontSize: 12, fontWeight: 500 },

  midRow: { display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, marginBottom: 24 },
  chartCard: { background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "24px", animation: "fadeUp 0.5s ease 0.2s both" },
  activityCard: { background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "24px", animation: "fadeUp 0.5s ease 0.25s both" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  cardTitle: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "#1e293b" },
  cardSub: { fontSize: 12, color: "#64748b", marginTop: 4 },
  cardSelect: { background: "#f1f5f9", border: "1px solid #e2e8f0", color: "#475569", borderRadius: 8, padding: "6px 10px", fontSize: 12, cursor: "pointer" },
  seeAll: { textDecoration: "none", color: "#3b82f6", fontSize: 12, fontWeight: 600 },

  chartArea: { display: "flex", alignItems: "flex-end", gap: 6, height: 140 },
  chartCol: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" },
  chartBar: { width: "100%", borderRadius: "4px 4px 0 0", transition: "height 0.6s ease", animation: "fadeUp 0.5s ease both" },
  chartLabel: { fontSize: 9, color: "#64748b", fontWeight: 500 },

  activityRow: { display: "flex", alignItems: "center", gap: 12, padding: "10px 8px", borderRadius: 8, transition: "background 0.15s", animation: "fadeUp 0.4s ease both" },
  activityAvatar: { width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 12, color: "#fff", flexShrink: 0 },
  activityText: { flex: 1, fontSize: 13, lineHeight: 1.5 },
  activityUser: { fontWeight: 600, color: "#1e293b" },
  activityAction: { color: "#64748b" },
  activityTarget: { color: "#3b82f6", fontWeight: 500 },
  activityTime: { fontSize: 11, color: "#64748b", flexShrink: 0 },
  emptyState: { padding: "24px", textAlign: "center", color: "#94a3b8" },
  emptyText: { margin: 0, fontSize: 14, fontWeight: 500 },

  projectsCard: { background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "24px", animation: "fadeUp 0.5s ease 0.3s both" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: 4 },
  tableHead: { borderBottom: "1px solid #e2e8f0" },
  th: { textAlign: "left" as const, padding: "10px 14px", fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: 0.8 },
  tableRow: { borderBottom: "1px solid #f1f5f9", transition: "background 0.15s" },
  td: { padding: "14px 14px", fontSize: 13 },
  projName: { fontWeight: 500, color: "#1e293b" },
  progressWrap: { display: "flex", alignItems: "center", gap: 10 },
  progressTrack: { flex: 1, height: 6, background: "#e2e8f0", borderRadius: 99, overflow: "hidden" },
  progressBar: { height: "100%", borderRadius: 99, transition: "width 0.6s ease" },
  progressPct: { fontSize: 12, fontWeight: 600, minWidth: 36, textAlign: "right" as const },
  statusBadge: { padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, display: "inline-block" },
};
