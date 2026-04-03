// Dashboard Page

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TeamTasksPage from "./Tasks/TeamTasks";
import TeamMembers from "./Team/Members";
import EnquiryPage from "./Sales/EnquiryPage";
import Attendance from "./Attendance/Attendance";
import Branches from "./Branches/Branches";
import Courses from "./Courses/Courses";
import Settings from "./Settings/Settings";
import { getStoredUserRole } from "../../services/session.service";

const NAV_ITEMS = [
  { icon: "⊞", label: "Dashboard", id: "dashboard" },
  { icon: "👥", label: "Team", id: "team" },
  { icon: "T", label: "Tasks", id: "tasks" },
  { icon: "⏱", label: "Attendance", id: "attendance" },
  { icon: "🏢", label: "Branches", id: "branches" },
  { icon: "📚", label: "Courses", id: "courses" },
  { icon: "E", label: "Enquiry", id: "enquiry" },
  { icon: "📋", label: "Projects", id: "projects" },
  { icon: "📊", label: "Analytics", id: "analytics" },
  { icon: "🔗", label: "Integrations", id: "integrations" },
  { icon: "⚙️", label: "Settings", id: "settings" },
];

const STATS = [
  { label: "Total Members", value: "248", change: "+12 this week", up: true, color: "#3b82f6" },
  { label: "Active Projects", value: "34", change: "+3 this month", up: true, color: "#8b5cf6" },
  { label: "Tasks Completed", value: "1,284", change: "+89 today", up: true, color: "#10b981" },
  { label: "Pending Reviews", value: "17", change: "-4 since yesterday", up: false, color: "#f59e0b" },
];

const RECENT_ACTIVITY = [
  { user: "Rahul M.", action: "completed task", target: "Q1 Report Design", time: "2m ago", avatar: "R" },
  { user: "Priya N.", action: "added member", target: "Engineering Team", time: "18m ago", avatar: "P" },
  { user: "Amit D.", action: "created project", target: "Product Launch v2", time: "1h ago", avatar: "A" },
  { user: "Sara K.", action: "submitted review", target: "Marketing Deck", time: "3h ago", avatar: "S" },
  { user: "Dev T.", action: "updated settings", target: "Billing & Plans", time: "5h ago", avatar: "D" },
];

const PROJECTS = [
  { name: "Product Launch v2", progress: 72, members: 8, due: "Mar 28", status: "On Track", color: "#3b82f6" },
  { name: "Q1 Marketing Campaign", progress: 45, members: 5, due: "Apr 5", status: "At Risk", color: "#f59e0b" },
  { name: "Backend Refactor", progress: 90, members: 4, due: "Mar 20", status: "On Track", color: "#10b981" },
  { name: "Mobile App Redesign", progress: 28, members: 6, due: "Apr 18", status: "In Progress", color: "#8b5cf6" },
];

const CHART_DATA = [40, 65, 50, 80, 72, 90, 68, 95, 78, 88, 74, 92];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const orgName = localStorage.getItem("orgName") || "Your Organization";
  const storedUserName = localStorage.getItem("userName")?.trim() || "";
  const userName = storedUserName || "Welcome back";
  const userDisplayName = storedUserName || "User";
  const userRole = getStoredUserRole() || "Member";
  const userInitial = userDisplayName.charAt(0).toUpperCase();
  const isTeamView = activeNav === "team";
  const isTasksView = activeNav === "tasks";
  const isAttendanceView = activeNav === "attendance";
  const isBranchesView = activeNav === "branches";
  const isCoursesView = activeNav === "courses";
  const isEnquiryView = activeNav === "enquiry";
  const isSettingsView = activeNav === "settings";
  const pageTitle = isTeamView
    ? "Team Members"
    : isTasksView
      ? "Team Tasks"
    : isAttendanceView
      ? "Attendance"
    : isBranchesView
      ? "Branches"
    : isCoursesView
      ? "Courses"
    : isEnquiryView
      ? "Enquiries"
    : isSettingsView
      ? "Settings"
      : "Dashboard";
  const pageSubtitle = isTeamView
    ? "Invite employees, share credentials, and manage organization access"
    : isTasksView
      ? "Manage your team's work, priorities, and deadlines"
    : isAttendanceView
      ? "Punch in/out and track today’s sessions in one place"
    : isBranchesView
      ? "Manage your organization's branches and locations"
    : isCoursesView
      ? "Create, manage, and organize your training courses"
    : isEnquiryView
      ? "Track incoming leads, conversations, and follow-ups"
    : isSettingsView
      ? "Manage your organization's preferences and configurations"
      : "Saturday, March 14, 2026";

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("organization_id");
    localStorage.removeItem("orgName");
    navigate("/login", { replace: true });
  };

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to { opacity:1; transform:translateY(0); }
        }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        .nav-item:hover { background: rgba(0,0,0,0.04) !important; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(0,0,0,0.08) !important; }
        .proj-row:hover { background: rgba(0,0,0,0.02) !important; }
        .activity-row:hover { background: rgba(0,0,0,0.02) !important; }
      `}</style>

      {/* SIDEBAR */}
      <aside style={{ ...s.sidebar, width: sidebarOpen ? 240 : 72 }}>
        <div style={s.sidebarTop}>
          <div style={s.logoWrap}>
            {sidebarOpen && <span style={s.logoText}>SYNCTEX</span>}
            {!sidebarOpen && <span style={s.logoIcon}>S</span>}
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={s.collapseBtn}>
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        <nav style={s.navList}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className="nav-item"
              onClick={() => setActiveNav(item.id)}
              style={{
                ...s.navItem,
                background: activeNav === item.id ? "rgba(59,130,246,0.1)" : "transparent",
                borderLeft: activeNav === item.id ? "3px solid #3b82f6" : "3px solid transparent",
                color: activeNav === item.id ? "#3b82f6" : "#64748b",
              }}
            >
              <span style={s.navIcon}>{item.icon}</span>
              {sidebarOpen && <span style={s.navLabel}>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div style={s.sidebarBottom}>
          <div style={s.userChip}>
            <div style={s.userAvatar}>{userInitial}</div>
            {sidebarOpen && (
              <div style={s.userInfo}>
                <div style={s.userName}>{userDisplayName}</div>
                <div style={s.userRole}>{userRole}</div>
                <div style={s.userOrg}>{orgName.slice(0, 16)}</div>
              </div>
            )}
          </div>
          <button
            onClick={handleSignOut}
            style={s.signOutBtn}
            title="Sign out"
          >
            {sidebarOpen ? "Sign out" : "Out"}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={s.main}>

        {/* TOP BAR */}
        <header style={s.topbar}>
          <div>
            <h1 style={s.pageTitle}>{pageTitle}</h1>
            <p style={s.pageSubtitle}>{pageSubtitle}</p>
          </div>
          <div style={s.topbarRight}>
            <div style={s.searchBox}>
              <span style={{ color: "#4b5a7a", marginRight: 8 }}>🔍</span>
              <input placeholder="Search anything..." style={s.searchInput} />
            </div>
            <button style={s.notifBtn}>
              🔔
              <span style={s.notifDot} />
            </button>
            <div style={s.topAvatar}>{userInitial}</div>
          </div>
        </header>

        <div style={s.content}>
          {isTeamView ? (
            <TeamMembers />
          ) : isTasksView ? (
            <TeamTasksPage />
          ) : isAttendanceView ? (
            <Attendance />
          ) : isBranchesView ? (
            <Branches />
          ) : isCoursesView ? (
            <Courses />
          ) : isEnquiryView ? (
            <EnquiryPage />
          ) : isSettingsView ? (
            <Settings />
          ) : (
            <>

          {/* WELCOME BANNER */}
          <div style={s.welcomeBanner}>
            <div>
              <p style={s.welcomeEyebrow}>✦ Welcome back</p>
              <h2 style={s.welcomeTitle}>{userName} 👋</h2>
              <p style={s.welcomeSub}>Here's what's happening across your organization today.</p>
            </div>
            <div style={s.welcomeActions}>
              <button style={s.welcomeBtn}>+ New Project</button>
              <button style={s.welcomeBtnOutline} onClick={() => setActiveNav("team")}>
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

          {/* MIDDLE ROW */}
          <div style={s.midRow}>

            {/* CHART */}
            <div style={s.chartCard}>
              <div style={s.cardHeader}>
                <div>
                  <h3 style={s.cardTitle}>Activity Overview</h3>
                  <p style={s.cardSub}>Tasks completed per month</p>
                </div>
                <select style={s.cardSelect}>
                  <option>2026</option>
                  <option>2025</option>
                </select>
              </div>
              <div style={s.chartArea}>
                {CHART_DATA.map((val, i) => (
                  <div key={i} style={s.chartCol}>
                    <div
                      style={{
                        ...s.chartBar,
                        height: `${val}%`,
                        background: i === 2 ? "linear-gradient(180deg,#3b82f6,#7c3aed)" : "rgba(59,130,246,0.25)",
                        animationDelay: `${i * 0.05}s`,
                      }}
                    />
                    <span style={s.chartLabel}>{MONTHS[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTIVITY FEED */}
            <div style={s.activityCard}>
              <div style={s.cardHeader}>
                <h3 style={s.cardTitle}>Recent Activity</h3>
                <a href="#" style={s.seeAll}>See all</a>
              </div>
              <div>
                {RECENT_ACTIVITY.map((act, i) => (
                  <div key={i} className="activity-row" style={{ ...s.activityRow, animationDelay: `${i * 0.07}s` }}>
                    <div style={{ ...s.activityAvatar, background: ["#3b82f6","#8b5cf6","#10b981","#f59e0b","#ec4899"][i % 5] }}>
                      {act.avatar}
                    </div>
                    <div style={s.activityText}>
                      <span style={s.activityUser}>{act.user}</span>
                      <span style={s.activityAction}> {act.action} </span>
                      <span style={s.activityTarget}>{act.target}</span>
                    </div>
                    <span style={s.activityTime}>{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PROJECTS TABLE */}
          <div style={s.projectsCard}>
            <div style={s.cardHeader}>
              <div>
                <h3 style={s.cardTitle}>Active Projects</h3>
                <p style={s.cardSub}>Track progress across all active workstreams</p>
              </div>
              <button style={s.welcomeBtn}>+ New Project</button>
            </div>
            <table style={s.table}>
              <thead>
                <tr style={s.tableHead}>
                  <th style={s.th}>Project</th>
                  <th style={s.th}>Progress</th>
                  <th style={s.th}>Members</th>
                  <th style={s.th}>Due Date</th>
                  <th style={s.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {PROJECTS.map((p, i) => (
                  <tr key={i} className="proj-row" style={s.tableRow}>
                    <td style={s.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                        <span style={s.projName}>{p.name}</span>
                      </div>
                    </td>
                    <td style={s.td}>
                      <div style={s.progressWrap}>
                        <div style={s.progressTrack}>
                          <div style={{ ...s.progressFill, width: `${p.progress}%`, background: p.color }} />
                        </div>
                        <span style={s.progressPct}>{p.progress}%</span>
                      </div>
                    </td>
                    <td style={s.td}><span style={s.memberBadge}>👤 {p.members}</span></td>
                    <td style={s.td}><span style={s.dueBadge}>{p.due}</span></td>
                    <td style={s.td}>
                      <span style={{
                        ...s.statusBadge,
                        background: p.status === "On Track" ? "rgba(16,185,129,0.15)" : p.status === "At Risk" ? "rgba(245,158,11,0.15)" : "rgba(139,92,246,0.15)",
                        color: p.status === "On Track" ? "#10b981" : p.status === "At Risk" ? "#f59e0b" : "#8b5cf6",
                      }}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  root: { display: "flex", height: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', sans-serif", color: "#1e293b", overflow: "hidden" },

  // SIDEBAR
  sidebar: { background: "#ffffff", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", transition: "width 0.25s ease", flexShrink: 0, overflow: "hidden" },
  sidebarTop: { padding: "24px 16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0" },
  logoWrap: { display: "flex", alignItems: "center" },
  logoText: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "#1e293b", letterSpacing: 1 },
  logoIcon: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "#3b82f6" },
  collapseBtn: { background: "none", border: "1px solid #e2e8f0", color: "#64748b", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 10 },
  navList: { flex: 1, padding: "16px 0", display: "flex", flexDirection: "column", gap: 2 },
  navItem: { display: "flex", alignItems: "center", gap: 12, padding: "11px 20px", cursor: "pointer", border: "none", width: "100%", textAlign: "left", transition: "all 0.15s", borderRadius: 0, fontFamily: "'DM Sans', sans-serif" },
  navIcon: { fontSize: 16, flexShrink: 0 },
  navLabel: { fontSize: 14, fontWeight: 500 },
  sidebarBottom: { padding: "16px", borderTop: "1px solid #e2e8f0" },
  userChip: { display: "flex", alignItems: "center", gap: 10 },
  userAvatar: { width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#fff", flexShrink: 0 },
  userInfo: { overflow: "hidden" },
  userName: { fontWeight: 600, fontSize: 13, color: "#1e293b" },
  userRole: { fontSize: 11, color: "#3b82f6", fontWeight: 600, marginTop: 1, textTransform: "capitalize" as const },
  userOrg: { fontSize: 11, color: "#64748b", marginTop: 1 },
  signOutBtn: { width: "100%", marginTop: 12, background: "#fff5f5", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 10, padding: "9px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },

  // MAIN
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  topbar: { background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 },
  pageTitle: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, color: "#1e293b" },
  pageSubtitle: { fontSize: 12, color: "#64748b", marginTop: 2 },
  topbarRight: { display: "flex", alignItems: "center", gap: 14 },
  searchBox: { display: "flex", alignItems: "center", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 10, padding: "8px 14px", width: 220 },
  searchInput: { background: "none", border: "none", outline: "none", color: "#1e293b", fontSize: 13, width: "100%", fontFamily: "'DM Sans', sans-serif" },
  notifBtn: { background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 10, padding: "8px 12px", cursor: "pointer", position: "relative", fontSize: 15 },
  notifDot: { position: "absolute", top: 6, right: 8, width: 7, height: 7, borderRadius: "50%", background: "#ef4444", animation: "pulse 2s infinite" },
  topAvatar: { width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#fff", cursor: "pointer" },

  // CONTENT
  content: { flex: 1, overflowY: "auto", padding: "28px 32px", display: "flex", flexDirection: "column", gap: 24 },

  // WELCOME BANNER
  welcomeBanner: { background: "linear-gradient(120deg, #eef2ff 0%, #f0f9ff 100%)", border: "1px solid #e2e8f0", borderRadius: 16, padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", overflow: "hidden", animation: "fadeUp 0.5s ease both" },
  welcomeEyebrow: { fontSize: 12, color: "#4f8eff", fontWeight: 600, letterSpacing: 1, marginBottom: 6 },
  welcomeTitle: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, color: "#1e293b", marginBottom: 6 },
  welcomeSub: { fontSize: 14, color: "#64748b" },
  welcomeActions: { display: "flex", gap: 12, flexShrink: 0 },
  welcomeBtn: { background: "linear-gradient(90deg,#3b82f6,#7c3aed)", color: "#fff", border: "none", borderRadius: 9, padding: "10px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  welcomeBtnOutline: { background: "#ffffff", color: "#475569", border: "1px solid #e2e8f0", borderRadius: 9, padding: "10px 22px", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  welcomeGlow: { position: "absolute", right: -60, top: -60, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)" },

  // STATS
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 },
  statCard: { background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "22px 24px", transition: "transform 0.2s, box-shadow 0.2s", animation: "fadeUp 0.5s ease both", cursor: "default" },
  statLabel: { fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 },
  statValue: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32, marginBottom: 6 },
  statChange: { fontSize: 12, fontWeight: 500 },

  // MID ROW
  midRow: { display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20 },
  chartCard: { background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "24px", animation: "fadeUp 0.5s ease 0.2s both" },
  activityCard: { background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "24px", animation: "fadeUp 0.5s ease 0.25s both" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  cardTitle: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "#1e293b" },
  cardSub: { fontSize: 12, color: "#64748b", marginTop: 4 },
  cardSelect: { background: "#f1f5f9", border: "1px solid #e2e8f0", color: "#475569", borderRadius: 8, padding: "6px 10px", fontSize: 12, cursor: "pointer" },
  seeAll: { textDecoration: "none", color: "#3b82f6", fontSize: 12, fontWeight: 600 },

  // CHART
  chartArea: { display: "flex", alignItems: "flex-end", gap: 6, height: 140 },
  chartCol: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" },
  chartBar: { width: "100%", borderRadius: "4px 4px 0 0", transition: "height 0.6s ease", animation: "fadeUp 0.5s ease both" },
  chartLabel: { fontSize: 9, color: "#64748b", fontWeight: 500 },

  // ACTIVITY
  activityRow: { display: "flex", alignItems: "center", gap: 12, padding: "10px 8px", borderRadius: 8, transition: "background 0.15s", animation: "fadeUp 0.4s ease both" },
  activityAvatar: { width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 12, color: "#fff", flexShrink: 0 },
  activityText: { flex: 1, fontSize: 13, lineHeight: 1.5 },
  activityUser: { fontWeight: 600, color: "#1e293b" },
  activityAction: { color: "#64748b" },
  activityTarget: { color: "#3b82f6", fontWeight: 500 },
  activityTime: { fontSize: 11, color: "#64748b", flexShrink: 0 },

  // PROJECTS
  projectsCard: { background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "24px", animation: "fadeUp 0.5s ease 0.3s both" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: 4 },
  tableHead: { borderBottom: "1px solid #e2e8f0" },
  th: { textAlign: "left" as const, padding: "10px 14px", fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: 0.8 },
  tableRow: { borderBottom: "1px solid #f1f5f9", transition: "background 0.15s" },
  td: { padding: "14px 14px", fontSize: 13 },
  projName: { fontWeight: 500, color: "#1e293b" },
  progressWrap: { display: "flex", alignItems: "center", gap: 10 },
  progressTrack: { flex: 1, height: 6, background: "#e2e8f0", borderRadius: 99, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 99, transition: "width 0.8s ease" },
  progressPct: { fontSize: 12, color: "#64748b", width: 32, textAlign: "right" as const },
  memberBadge: { fontSize: 12, color: "#64748b" },
  dueBadge: { fontSize: 12, color: "#64748b", background: "#f1f5f9", borderRadius: 6, padding: "3px 8px" },
  statusBadge: { fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 99 },
};
