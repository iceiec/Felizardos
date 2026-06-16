import { useState, useMemo, useEffect, createContext, useContext } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  LayoutDashboard, Tent, Waves, Trophy, MoreHorizontal, X, Search, Plus,
  ChevronLeft, ChevronRight, Bell, User, CalendarDays, TrendingUp,
  Sun, Moon, LogOut, Eye, EyeOff, Shield, Wrench, Settings as SettingsIcon, Menu,
} from "lucide-react";

// ─── TYPES ───────────────────────────────────────────────────────────────────
type Page = "dashboard" | "pavilion" | "pool" | "courts" | "maintenance" | "settings";
type Period = "day" | "month" | "year";
type RepairStatus = "Pending" | "In Progress" | "Completed";
type RepairPriority = "Low" | "Medium" | "High";

interface VenueEvent {
  id: string; clientName: string; phone: string; eventType: string;
  capacity: number; date: string; deposit: number; total: number;
}
interface CourtSchedule {
  id: string; clientName: string; phone: string; court: string;
  schedule: string; deposit: number; balance: number;
}
interface Repair {
  id: string; area: string; description: string; reportedBy: string;
  date: string; priority: RepairPriority; status: RepairStatus; cost: number;
}
interface StoredUser { username: string; email: string; password: string; }

// ─── CONTEXTS ────────────────────────────────────────────────────────────────
const ThemeCtx = createContext<{ theme: "dark" | "light"; toggle: () => void }>({ theme: "dark", toggle: () => {} });
const useTheme = () => useContext(ThemeCtx);
const AuthCtx = createContext<{ user: string | null; login: (u: string) => void; logout: () => void }>({ user: null, login: () => {}, logout: () => {} });
const useAuth = () => useContext(AuthCtx);

// ─── STORAGE ─────────────────────────────────────────────────────────────────
const ls = {
  getUsers: (): StoredUser[] => { try { return JSON.parse(localStorage.getItem("va_users") ?? "[]"); } catch { return []; } },
  saveUsers: (u: StoredUser[]) => localStorage.setItem("va_users", JSON.stringify(u)),
  getSession: () => localStorage.getItem("va_session"),
  setSession: (u: string) => localStorage.setItem("va_session", u),
  clearSession: () => localStorage.removeItem("va_session"),
  getTheme: (): "dark" | "light" => (localStorage.getItem("va_theme") as "dark" | "light") ?? "dark",
  setTheme: (t: "dark" | "light") => localStorage.setItem("va_theme", t),
};

// ─── DUMMY DATA ───────────────────────────────────────────────────────────────
const PAVILION_EVENTS: VenueEvent[] = [
  { id: "PAV-001", clientName: "Maria Santos", phone: "0917-123-4567", eventType: "Wedding Reception", capacity: 200, date: "2026-06-20", deposit: 15000, total: 45000 },
  { id: "PAV-002", clientName: "Juan dela Cruz", phone: "0928-234-5678", eventType: "Birthday Party", capacity: 80, date: "2026-06-25", deposit: 5000, total: 15000 },
  { id: "PAV-003", clientName: "Ana Reyes", phone: "0935-345-6789", eventType: "Corporate Event", capacity: 150, date: "2026-07-05", deposit: 20000, total: 60000 },
  { id: "PAV-004", clientName: "Carlos Bautista", phone: "0946-456-7890", eventType: "Debut", capacity: 120, date: "2026-07-12", deposit: 10000, total: 35000 },
  { id: "PAV-005", clientName: "Sofia Lim", phone: "0957-567-8901", eventType: "Wedding Reception", capacity: 250, date: "2026-07-18", deposit: 18000, total: 55000 },
  { id: "PAV-006", clientName: "Miguel Torres", phone: "0968-678-9012", eventType: "Family Reunion", capacity: 100, date: "2026-07-22", deposit: 8000, total: 25000 },
  { id: "PAV-007", clientName: "Lovely Garcia", phone: "0979-789-0123", eventType: "Christening", capacity: 60, date: "2026-08-03", deposit: 4000, total: 12000 },
  { id: "PAV-008", clientName: "Roberto Mendoza", phone: "0982-890-1234", eventType: "Graduation Party", capacity: 90, date: "2026-08-10", deposit: 6000, total: 18000 },
];
const POOL_BOOKINGS: VenueEvent[] = [
  { id: "POL-001", clientName: "Jasmine Cruz", phone: "0917-111-2222", eventType: "Pool Party", capacity: 50, date: "2026-06-21", deposit: 3000, total: 8000 },
  { id: "POL-002", clientName: "Rafael Santos", phone: "0928-222-3333", eventType: "Kids Swimming Party", capacity: 30, date: "2026-06-28", deposit: 2000, total: 5500 },
  { id: "POL-003", clientName: "Kristine Aquino", phone: "0939-333-4444", eventType: "Private Pool Party", capacity: 70, date: "2026-07-04", deposit: 5000, total: 12000 },
  { id: "POL-004", clientName: "Dennis Villanueva", phone: "0945-444-5555", eventType: "Team Building", capacity: 40, date: "2026-07-10", deposit: 3500, total: 9000 },
  { id: "POL-005", clientName: "Grace Tan", phone: "0956-555-6666", eventType: "Pool Party", capacity: 60, date: "2026-07-15", deposit: 4000, total: 10000 },
  { id: "POL-006", clientName: "Patrick Ramos", phone: "0967-666-7777", eventType: "Birthday Pool Party", capacity: 45, date: "2026-07-25", deposit: 3000, total: 7500 },
];
const ANDOY_SCHEDULES: CourtSchedule[] = [
  { id: "AND-001", clientName: "Marco Rivera", phone: "0917-123-1111", court: "Andoy Court", schedule: "Jun 17, 2026 | 5:00–7:00 PM", deposit: 500, balance: 500 },
  { id: "AND-002", clientName: "Patricia Dela Rosa", phone: "0928-234-2222", court: "Andoy Court", schedule: "Jun 18, 2026 | 7:00–9:00 PM", deposit: 500, balance: 0 },
  { id: "AND-003", clientName: "Bong Macaraeg", phone: "0939-345-3333", court: "Andoy Court", schedule: "Jun 19, 2026 | 9:00–11:00 PM", deposit: 500, balance: 500 },
  { id: "AND-004", clientName: "Cynthia Park", phone: "0950-456-4444", court: "Andoy Court", schedule: "Jun 20, 2026 | 5:00–7:00 PM", deposit: 500, balance: 0 },
  { id: "AND-005", clientName: "Ernesto Flores", phone: "0961-567-5555", court: "Andoy Court", schedule: "Jun 21, 2026 | 7:00–9:00 PM", deposit: 500, balance: 500 },
];
const JULIET_SCHEDULES: CourtSchedule[] = [
  { id: "JUL-001", clientName: "Diana Soriano", phone: "0917-123-9999", court: "Juliet Court", schedule: "Jun 17, 2026 | 4:00–6:00 PM", deposit: 500, balance: 0 },
  { id: "JUL-002", clientName: "Francis Navarro", phone: "0928-234-0000", court: "Juliet Court", schedule: "Jun 18, 2026 | 6:00–8:00 PM", deposit: 500, balance: 500 },
  { id: "JUL-003", clientName: "Helena Abad", phone: "0939-345-1111", court: "Juliet Court", schedule: "Jun 19, 2026 | 8:00–10:00 PM", deposit: 500, balance: 0 },
  { id: "JUL-004", clientName: "Ivan Ocampo", phone: "0950-456-2222", court: "Juliet Court", schedule: "Jun 20, 2026 | 10:00 PM–12:00 AM", deposit: 500, balance: 500 },
];
const REPAIR_DATA: Repair[] = [
  { id: "REP-001", area: "Pavilion", description: "Broken ceiling fan — Unit 3", reportedBy: "Juan Reyes", date: "2026-06-01", priority: "High", status: "In Progress", cost: 2500 },
  { id: "REP-002", area: "Pool", description: "Water pump leaking — Filter room", reportedBy: "Ana Cruz", date: "2026-06-03", priority: "High", status: "Pending", cost: 8000 },
  { id: "REP-003", area: "Andoy Court", description: "Net post loose — North end", reportedBy: "Marco Santos", date: "2026-06-05", priority: "Medium", status: "Completed", cost: 500 },
  { id: "REP-004", area: "Juliet Court", description: "Flood light flickering — East side", reportedBy: "Sofia Lim", date: "2026-06-08", priority: "Medium", status: "In Progress", cost: 1800 },
  { id: "REP-005", area: "Pavilion", description: "Restroom faucet not working", reportedBy: "Carlos Bautista", date: "2026-06-10", priority: "Low", status: "Pending", cost: 700 },
  { id: "REP-006", area: "Pool", description: "Pool tiles cracked — Shallow end", reportedBy: "Grace Tan", date: "2026-06-12", priority: "High", status: "Pending", cost: 15000 },
  { id: "REP-007", area: "Andoy Court", description: "Paint recoating needed", reportedBy: "Patrick Ramos", date: "2026-06-14", priority: "Low", status: "Completed", cost: 3000 },
];

// ─── CHART DATA ───────────────────────────────────────────────────────────────
const chartData = {
  day: {
    pavilion: [{ label: "Mon", value: 12000 }, { label: "Tue", value: 8500 }, { label: "Wed", value: 15000 }, { label: "Thu", value: 11000 }, { label: "Fri", value: 18000 }, { label: "Sat", value: 22000 }, { label: "Sun", value: 9000 }],
    pool:     [{ label: "Mon", value: 2500 }, { label: "Tue", value: 3200 }, { label: "Wed", value: 1800 }, { label: "Thu", value: 4100 }, { label: "Fri", value: 5500 }, { label: "Sat", value: 8200 }, { label: "Sun", value: 6000 }],
    courts:   [{ label: "Mon", value: 1000 }, { label: "Tue", value: 1500 }, { label: "Wed", value: 2000 }, { label: "Thu", value: 1000 }, { label: "Fri", value: 2500 }, { label: "Sat", value: 3500 }, { label: "Sun", value: 2000 }],
  },
  month: {
    pavilion: [{ label: "Jan", value: 120000 }, { label: "Feb", value: 85000 }, { label: "Mar", value: 145000 }, { label: "Apr", value: 110000 }, { label: "May", value: 165000 }, { label: "Jun", value: 135000 }, { label: "Jul", value: 190000 }, { label: "Aug", value: 155000 }, { label: "Sep", value: 140000 }, { label: "Oct", value: 175000 }, { label: "Nov", value: 200000 }, { label: "Dec", value: 230000 }],
    pool:     [{ label: "Jan", value: 25000 }, { label: "Feb", value: 30000 }, { label: "Mar", value: 45000 }, { label: "Apr", value: 55000 }, { label: "May", value: 70000 }, { label: "Jun", value: 80000 }, { label: "Jul", value: 90000 }, { label: "Aug", value: 85000 }, { label: "Sep", value: 60000 }, { label: "Oct", value: 40000 }, { label: "Nov", value: 30000 }, { label: "Dec", value: 35000 }],
    courts:   [{ label: "Jan", value: 18000 }, { label: "Feb", value: 22000 }, { label: "Mar", value: 28000 }, { label: "Apr", value: 32000 }, { label: "May", value: 38000 }, { label: "Jun", value: 42000 }, { label: "Jul", value: 45000 }, { label: "Aug", value: 48000 }, { label: "Sep", value: 35000 }, { label: "Oct", value: 30000 }, { label: "Nov", value: 25000 }, { label: "Dec", value: 28000 }],
  },
  year: {
    pavilion: [{ label: "2023", value: 980000 }, { label: "2024", value: 1250000 }, { label: "2025", value: 1580000 }, { label: "2026", value: 850000 }],
    pool:     [{ label: "2023", value: 280000 }, { label: "2024", value: 420000 }, { label: "2025", value: 590000 }, { label: "2026", value: 310000 }],
    courts:   [{ label: "2023", value: 180000 }, { label: "2024", value: 250000 }, { label: "2025", value: 320000 }, { label: "2026", value: 180000 }],
  },
};
const CHART_TRENDS = { pavilion: 12, pool: 8, courts: 5 };

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = (n: number) => `₱${n.toLocaleString()}`;
const MONTHS_LONG = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS_MIN = ["Su","Mo","Tu","We","Th","Fr","Sa"];
let _idCounter = 200;
const nextId = () => String(++_idCounter);

const STATUS_STYLE: Record<RepairStatus, { background: string; color: string }> = {
  "Pending":     { background: "rgba(251,146,60,0.15)",  color: "#f97316" },
  "In Progress": { background: "rgba(56,189,248,0.15)",   color: "#38bdf8" },
  "Completed":   { background: "rgba(16,185,129,0.15)",   color: "#10b981" },
};
const PRIORITY_STYLE: Record<RepairPriority, { background: string; color: string }> = {
  Low:    { background: "rgba(100,116,139,0.15)", color: "#64748b" },
  Medium: { background: "rgba(251,191,36,0.15)",  color: "#f59e0b" },
  High:   { background: "rgba(239,68,68,0.15)",   color: "#ef4444" },
};
const VENUE_AREAS = ["Pavilion", "Pool", "Andoy Court", "Juliet Court", "Parking", "Entrance", "Restrooms", "Storage", "Other"];
const ANDOY_SLOTS = ["5:00–7:00 PM", "7:00–9:00 PM", "9:00–11:00 PM", "Custom"];
const JULIET_SLOTS = ["4:00–6:00 PM", "6:00–8:00 PM", "8:00–10:00 PM", "10:00 PM–12:00 AM", "Custom"];

// Shared form styles
const inputCls = "w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary transition-colors";
const labelCls = "block text-xs font-medium text-muted-foreground mb-1.5";

// ─── AUTH SCREEN ──────────────────────────────────────────────────────────────
function AuthScreen() {
  const { login } = useAuth();
  const { theme } = useTheme();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const setF = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setError("");
  };

  const users = ls.getUsers();

  const handleSignIn = () => {
    if (!form.username || !form.password) { setError("Please fill in all fields."); return; }
    const match = users.find((u) => u.username.toLowerCase() === form.username.toLowerCase() && u.password === form.password);
    if (!match) { setError("Incorrect username or password."); return; }
    ls.setSession(match.username);
    login(match.username);
  };

  const handleSignUp = () => {
    if (!form.username || !form.password || !form.confirm) { setError("Please fill in all required fields."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (users.find((u) => u.username.toLowerCase() === form.username.toLowerCase())) { setError("Username already taken."); return; }
    const newUser: StoredUser = { username: form.username, email: form.email, password: form.password };
    ls.saveUsers([...users, newUser]);
    ls.setSession(newUser.username);
    login(newUser.username);
  };

  const isDark = theme === "dark";
  const cardBg = isDark ? "#131929" : "#ffffff";
  const pageBg = isDark ? "#0b0f19" : "#f1f5f9";
  const border = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.09)";
  const inputBg = isDark ? "#1a2540" : "#f8fafc";
  const primary = isDark ? "#10b981" : "#059669";
  const fg = isDark ? "#e2e8f0" : "#0f172a";
  const muted = "#64748b";
  const tabBg = isDark ? "#1a2540" : "#f1f5f9";

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: pageBg, fontFamily: "Instrument Sans, sans-serif" }}>
      <div className="w-full max-w-sm rounded-2xl shadow-2xl" style={{ background: cardBg, border: `1px solid ${border}` }}>
        <div className="px-8 pt-8 pb-5 text-center">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: `${primary}20` }}>
            <Shield size={22} style={{ color: primary }} />
          </div>
          <h1 className="text-xl font-semibold" style={{ fontFamily: "Epilogue, sans-serif", color: fg }}>VenueAdmin</h1>
          <p className="text-sm mt-1" style={{ color: muted }}>
            {tab === "signin" ? "Sign in to your account" : "Create your admin account"}
          </p>
        </div>

        <div className="px-8 mb-5">
          <div className="flex rounded-xl p-1" style={{ background: tabBg }}>
            {(["signin", "signup"] as const).map((t) => (
              <button key={t} onClick={() => { setTab(t); setError(""); setForm({ username: "", email: "", password: "", confirm: "" }); }}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ background: tab === t ? cardBg : "transparent", color: tab === t ? fg : muted, boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.15)" : "none" }}>
                {t === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>
        </div>

        <div className="px-8 pb-8 space-y-4">
          {tab === "signin" && users.length === 0 && (
            <div className="rounded-lg px-3 py-2.5 text-xs text-center" style={{ background: `${primary}15`, color: primary }}>
              No account yet — switch to Sign Up to create one.
            </div>
          )}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: muted }}>Username</label>
            <input type="text" value={form.username} onChange={setF("username")} onKeyDown={(e) => e.key === "Enter" && (tab === "signin" ? handleSignIn() : handleSignUp())}
              placeholder="e.g. admin" autoComplete="username"
              className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors"
              style={{ background: inputBg, border: `1px solid ${border}`, color: fg }} />
          </div>
          {tab === "signup" && (
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: muted }}>Email <span style={{ fontWeight: 400 }}>(optional)</span></label>
              <input type="email" value={form.email} onChange={setF("email")} placeholder="you@example.com" autoComplete="email"
                className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors"
                style={{ background: inputBg, border: `1px solid ${border}`, color: fg }} />
            </div>
          )}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: muted }}>Password</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={form.password} onChange={setF("password")}
                onKeyDown={(e) => e.key === "Enter" && (tab === "signin" ? handleSignIn() : handleSignUp())}
                placeholder="••••••••" autoComplete={tab === "signin" ? "current-password" : "new-password"}
                className="w-full rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none transition-colors"
                style={{ background: inputBg, border: `1px solid ${border}`, color: fg }} />
              <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors" style={{ color: muted }}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          {tab === "signup" && (
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: muted }}>Confirm Password</label>
              <input type={showPw ? "text" : "password"} value={form.confirm} onChange={setF("confirm")}
                onKeyDown={(e) => e.key === "Enter" && handleSignUp()} placeholder="••••••••" autoComplete="new-password"
                className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors"
                style={{ background: inputBg, border: `1px solid ${border}`, color: fg }} />
            </div>
          )}
          {error && <p className="text-xs rounded-lg px-3 py-2" style={{ background: "#ef444420", color: "#ef4444" }}>{error}</p>}
          <button onClick={tab === "signin" ? handleSignIn : handleSignUp}
            className="w-full py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 mt-2"
            style={{ background: primary, color: "#ffffff" }}>
            {tab === "signin" ? "Sign In" : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MINI CALENDAR ────────────────────────────────────────────────────────────
function MiniCalendar({ eventDates = [] }: { eventDates?: string[] }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const isToday = (d: number) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  const hasEvent = (d: number) => eventDates.some((ds) => { const [y, m, day] = ds.split("-").map(Number); return y === year && m - 1 === month && day === d; });

  const prev = () => { if (month === 0) { setMonth(11); setYear((y) => y - 1); } else setMonth((m) => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear((y) => y + 1); } else setMonth((m) => m + 1); };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>{MONTHS_LONG[month]} {year}</span>
        <div className="flex gap-1">
          <button onClick={prev} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><ChevronLeft size={14} /></button>
          <button onClick={next} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><ChevronRight size={14} /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DAYS_MIN.map((d) => <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => (
          <div key={i} className={`relative flex flex-col items-center justify-center rounded h-7 text-xs transition-colors ${day === null ? "" : isToday(day) ? "bg-primary text-primary-foreground font-semibold" : "text-foreground hover:bg-muted cursor-default"}`}>
            {day}
            {day !== null && !isToday(day) && hasEvent(day) && (
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── REVENUE CHART ────────────────────────────────────────────────────────────
type ChartKey = "pavilion" | "pool" | "courts";

function RevenueChart({ title, dataKey, color }: { title: string; dataKey: ChartKey; color: string }) {
  const [period, setPeriod] = useState<Period>("month");
  const { theme } = useTheme();
  const data = chartData[period][dataKey];
  const total = data.reduce((s, d) => s + d.value, 0);
  const isDark = theme === "dark";

  return (
    <div className="bg-card rounded-xl border border-border p-4 sm:p-5">
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-xl font-semibold text-foreground mt-0.5" style={{ fontFamily: "Epilogue, sans-serif" }}>{fmt(total)}</p>
        </div>
        <div className="flex gap-0.5 bg-muted rounded-lg p-0.5 flex-shrink-0">
          {(["day", "month", "year"] as Period[]).map((p) => (
            <button key={p} onClick={() => setPeriod(p)} className="px-2 py-1 rounded-md text-xs font-medium transition-colors capitalize"
              style={{ background: period === p ? "var(--card)" : "transparent", color: period === p ? "var(--foreground)" : "var(--muted-foreground)", boxShadow: period === p ? "0 1px 2px rgba(0,0,0,0.1)" : "none" }}>
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1.5 mb-3">
        <TrendingUp size={12} style={{ color }} />
        <span className="text-xs" style={{ color }}>+{CHART_TRENDS[dataKey]}% vs last period</span>
      </div>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
          <CartesianGrid key={`grid-${dataKey}`} strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)"} vertical={false} />
          <XAxis key={`x-${dataKey}`} dataKey="label" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis key={`y-${dataKey}`} tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false}
            tickFormatter={(v: number) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)} />
          <Tooltip key={`tooltip-${dataKey}`}
            contentStyle={{ background: isDark ? "#1a2540" : "#ffffff", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)"}`, borderRadius: "8px", color: isDark ? "#e2e8f0" : "#0f172a", fontSize: "12px" }}
            formatter={(v: number) => [fmt(v), "Revenue"]}
            cursor={{ fill: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }} />
          <Bar key={`bar-${dataKey}`} dataKey="value" fill={color} radius={[3, 3, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── MODAL SHELL ──────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-card border border-border rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <h2 className="text-base font-semibold text-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><X size={15} /></button>
        </div>
        <div className="px-5 py-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

// ─── EVENT MODAL ──────────────────────────────────────────────────────────────
const EMPTY_EVENT = { clientName: "", phone: "", eventType: "", capacity: "", date: "", deposit: "", total: "" };

function EventModal({ open, onClose, title, idPrefix, onAdd }: {
  open: boolean; onClose: () => void; title: string; idPrefix: string; onAdd: (e: VenueEvent) => void;
}) {
  const [form, setForm] = useState(EMPTY_EVENT);
  const [error, setError] = useState("");
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const handleClose = () => { setForm(EMPTY_EVENT); setError(""); onClose(); };
  const handleSubmit = () => {
    if (!form.clientName.trim() || !form.date) { setError("Client name and date are required."); return; }
    onAdd({ id: `${idPrefix}-${nextId()}`, clientName: form.clientName.trim(), phone: form.phone, eventType: form.eventType, capacity: Number(form.capacity) || 0, date: form.date, deposit: Number(form.deposit) || 0, total: Number(form.total) || 0 });
    handleClose();
  };
  return (
    <Modal open={open} onClose={handleClose} title={title}>
      <div className="space-y-3">
        <div><label className={labelCls}>Client's Name <span className="text-destructive">*</span></label><input type="text" value={form.clientName} onChange={set("clientName")} placeholder="e.g. Maria Santos" className={inputCls} /></div>
        <div><label className={labelCls}>Phone Number</label><input type="tel" value={form.phone} onChange={set("phone")} placeholder="e.g. 0917-123-4567" className={inputCls} /></div>
        <div><label className={labelCls}>Event Type / Name</label><input type="text" value={form.eventType} onChange={set("eventType")} placeholder="e.g. Wedding Reception" className={inputCls} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Capacity</label><input type="number" min="0" value={form.capacity} onChange={set("capacity")} placeholder="150" className={inputCls} /></div>
          <div><label className={labelCls}>Date <span className="text-destructive">*</span></label><input type="date" value={form.date} onChange={set("date")} className={inputCls} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Deposit (₱)</label><input type="number" min="0" value={form.deposit} onChange={set("deposit")} placeholder="0" className={inputCls} /></div>
          <div><label className={labelCls}>Total Amount (₱)</label><input type="number" min="0" value={form.total} onChange={set("total")} placeholder="0" className={inputCls} /></div>
        </div>
        {error && <p className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>}
        <div className="flex gap-3 pt-1">
          <button onClick={handleClose} className="flex-1 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Add Event</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── COURT MODAL ──────────────────────────────────────────────────────────────
const EMPTY_COURT = { clientName: "", phone: "", timeSlot: "", customTime: "", date: "", deposit: "", balance: "" };

function CourtModal({ open, onClose, court, onAdd }: { open: boolean; onClose: () => void; court: "andoy" | "juliet"; onAdd: (s: CourtSchedule) => void }) {
  const [form, setForm] = useState(EMPTY_COURT);
  const [error, setError] = useState("");
  const slots = court === "andoy" ? ANDOY_SLOTS : JULIET_SLOTS;
  const courtName = court === "andoy" ? "Andoy Court" : "Juliet Court";
  const setI = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setS = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const handleClose = () => { setForm(EMPTY_COURT); setError(""); onClose(); };
  const handleSubmit = () => {
    if (!form.clientName.trim() || !form.date) { setError("Client name and date are required."); return; }
    if (!form.timeSlot) { setError("Please select a time slot."); return; }
    if (form.timeSlot === "Custom" && !form.customTime.trim()) { setError("Please enter a custom time."); return; }
    const time = form.timeSlot === "Custom" ? form.customTime.trim() : form.timeSlot;
    const d = new Date(form.date + "T00:00:00");
    onAdd({ id: `${court === "andoy" ? "AND" : "JUL"}-${nextId()}`, clientName: form.clientName.trim(), phone: form.phone, court: courtName, schedule: `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} | ${time}`, deposit: Number(form.deposit) || 0, balance: Number(form.balance) || 0 });
    handleClose();
  };
  return (
    <Modal open={open} onClose={handleClose} title={`Add Schedule — ${courtName}`}>
      <div className="space-y-3">
        <div><label className={labelCls}>Client's Name <span className="text-destructive">*</span></label><input type="text" value={form.clientName} onChange={setI("clientName")} placeholder="e.g. Marco Rivera" className={inputCls} /></div>
        <div><label className={labelCls}>Phone Number</label><input type="tel" value={form.phone} onChange={setI("phone")} placeholder="e.g. 0917-123-4567" className={inputCls} /></div>
        <div>
          <label className={labelCls}>Time Slot <span className="text-destructive">*</span></label>
          <select value={form.timeSlot} onChange={setS("timeSlot")} className={inputCls}>
            <option value="">Select time slot</option>
            {slots.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {form.timeSlot === "Custom" && <div><label className={labelCls}>Custom Time</label><input type="text" value={form.customTime} onChange={setI("customTime")} placeholder="e.g. 3:00–5:00 PM" className={inputCls} /></div>}
        <div><label className={labelCls}>Date <span className="text-destructive">*</span></label><input type="date" value={form.date} onChange={setI("date")} className={inputCls} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Deposit (₱)</label><input type="number" min="0" value={form.deposit} onChange={setI("deposit")} placeholder="0" className={inputCls} /></div>
          <div><label className={labelCls}>Balance (₱)</label><input type="number" min="0" value={form.balance} onChange={setI("balance")} placeholder="0" className={inputCls} /></div>
        </div>
        {error && <p className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>}
        <div className="flex gap-3 pt-1">
          <button onClick={handleClose} className="flex-1 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Add Schedule</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── REPAIR MODAL ─────────────────────────────────────────────────────────────
const EMPTY_REPAIR = { area: "", description: "", reportedBy: "", date: "", priority: "Medium" as RepairPriority, status: "Pending" as RepairStatus, cost: "" };

function RepairModal({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (r: Repair) => void }) {
  const [form, setForm] = useState(EMPTY_REPAIR);
  const [error, setError] = useState("");
  const setI = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setS = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const handleClose = () => { setForm(EMPTY_REPAIR); setError(""); onClose(); };
  const handleSubmit = () => {
    if (!form.area || !form.description.trim() || !form.date) { setError("Area, description, and date are required."); return; }
    onAdd({ id: `REP-${nextId()}`, area: form.area, description: form.description.trim(), reportedBy: form.reportedBy, date: form.date, priority: form.priority, status: form.status, cost: Number(form.cost) || 0 });
    handleClose();
  };
  return (
    <Modal open={open} onClose={handleClose} title="Log Repair">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Area <span className="text-destructive">*</span></label>
            <select value={form.area} onChange={setS("area")} className={inputCls}>
              <option value="">Select area</option>
              {VENUE_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div><label className={labelCls}>Date Reported <span className="text-destructive">*</span></label><input type="date" value={form.date} onChange={setI("date")} className={inputCls} /></div>
        </div>
        <div>
          <label className={labelCls}>Description <span className="text-destructive">*</span></label>
          <textarea value={form.description} onChange={setI("description")} placeholder="Describe the issue…" rows={3} className={`${inputCls} resize-none`} />
        </div>
        <div><label className={labelCls}>Reported By</label><input type="text" value={form.reportedBy} onChange={setI("reportedBy")} placeholder="e.g. Juan Reyes" className={inputCls} /></div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>Priority</label>
            <select value={form.priority} onChange={setS("priority")} className={inputCls}>
              <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Status</label>
            <select value={form.status} onChange={setS("status")} className={inputCls}>
              <option value="Pending">Pending</option><option value="In Progress">In Progress</option><option value="Completed">Completed</option>
            </select>
          </div>
          <div><label className={labelCls}>Cost (₱)</label><input type="number" min="0" value={form.cost} onChange={setI("cost")} placeholder="0" className={inputCls} /></div>
        </div>
        {error && <p className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>}
        <div className="flex gap-3 pt-1">
          <button onClick={handleClose} className="flex-1 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Log Repair</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── REUSABLE TABLE COMPONENTS ────────────────────────────────────────────────
function EventTable({ events, accentColor }: { events: VenueEvent[]; accentColor: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="border-b border-border">
            {["ID", "Client's Name", "Phone", "Event Type", "Cap.", "Date", "Deposit", "Total", ""].map((h) => (
              <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {events.length === 0 ? (
            <tr><td colSpan={9} className="px-4 py-8 text-center text-sm text-muted-foreground">No events found.</td></tr>
          ) : events.map((ev) => (
            <tr key={ev.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors group">
              <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap" style={{ fontFamily: "DM Mono, monospace" }}>{ev.id}</td>
              <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{ev.clientName}</td>
              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs" style={{ fontFamily: "DM Mono, monospace" }}>{ev.phone}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: `${accentColor}18`, color: accentColor }}>{ev.eventType || "—"}</span>
              </td>
              <td className="px-4 py-3 text-muted-foreground text-center">{ev.capacity || "—"}</td>
              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">{ev.date ? new Date(ev.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</td>
              <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ fontFamily: "DM Mono, monospace", color: "var(--foreground)" }}>{fmt(ev.deposit)}</td>
              <td className="px-4 py-3 font-medium whitespace-nowrap text-xs" style={{ fontFamily: "DM Mono, monospace", color: accentColor }}>{fmt(ev.total)}</td>
              <td className="px-4 py-3"><button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"><MoreHorizontal size={14} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CourtTable({ schedules, accentColor }: { schedules: CourtSchedule[]; accentColor: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[580px]">
        <thead>
          <tr className="border-b border-border">
            {["ID", "Client's Name", "Phone", "Court", "Schedule", "Deposit", "Balance", ""].map((h) => (
              <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {schedules.length === 0 ? (
            <tr><td colSpan={8} className="px-4 py-8 text-center text-sm text-muted-foreground">No schedules found.</td></tr>
          ) : schedules.map((s) => (
            <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors group">
              <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap" style={{ fontFamily: "DM Mono, monospace" }}>{s.id}</td>
              <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{s.clientName}</td>
              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs" style={{ fontFamily: "DM Mono, monospace" }}>{s.phone}</td>
              <td className="px-4 py-3 whitespace-nowrap"><span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: `${accentColor}18`, color: accentColor }}>{s.court}</span></td>
              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">{s.schedule}</td>
              <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ fontFamily: "DM Mono, monospace", color: "var(--foreground)" }}>{fmt(s.deposit)}</td>
              <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ fontFamily: "DM Mono, monospace" }}>
                {s.balance === 0 ? <span className="text-emerald-500 font-medium">Fully Paid</span> : <span className="text-amber-500">{fmt(s.balance)}</span>}
              </td>
              <td className="px-4 py-3"><button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"><MoreHorizontal size={14} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Shared filter bar for management pages
function FilterBar({ search, onSearch, placeholder, filterEl }: { search: string; onSearch: (v: string) => void; placeholder: string; filterEl?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input type="text" value={search} onChange={(e) => onSearch(e.target.value)} placeholder={placeholder}
          className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>
      {filterEl}
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage() {
  const allDates = [...PAVILION_EVENTS, ...POOL_BOOKINGS].map((e) => e.date);
  const upcoming = [...PAVILION_EVENTS, ...POOL_BOOKINGS].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 6);

  const stats = [
    { label: "Pavilion Revenue (Jun)", value: "₱135,000", sub: "+12% vs May", icon: Tent, hex: "#10b981" },
    { label: "Pool Revenue (Jun)", value: "₱80,000", sub: "+8% vs May", icon: Waves, hex: "#38bdf8" },
    { label: "Courts Revenue (Jun)", value: "₱42,000", sub: "+5% vs May", icon: Trophy, hex: "#a78bfa" },
    { label: "Total Events", value: "14", sub: "this month", icon: CalendarDays, hex: "#fb923c" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Overview of your venue performance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-3 sm:p-4 flex items-start gap-3">
            <div className="p-2 rounded-lg flex-shrink-0" style={{ background: `${s.hex}20` }}>
              <s.icon size={14} style={{ color: s.hex }} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground leading-tight">{s.label}</p>
              <p className="text-base sm:text-lg font-semibold text-foreground mt-0.5" style={{ fontFamily: "Epilogue, sans-serif" }}>{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: s.hex }}>{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RevenueChart title="Pavilion Revenue" dataKey="pavilion" color="#10b981" />
        <RevenueChart title="Pool Revenue" dataKey="pool" color="#38bdf8" />
        <RevenueChart title="Courts Revenue" dataKey="courts" color="#a78bfa" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <MiniCalendar eventDates={allDates} />
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4" style={{ fontFamily: "Epilogue, sans-serif" }}>Upcoming Events</h3>
          <div>
            {upcoming.map((ev, i) => (
              <div key={ev.id} className={`flex items-center justify-between py-2.5 ${i < upcoming.length - 1 ? "border-b border-border" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ev.id.startsWith("PAV") ? "#10b981" : "#38bdf8" }} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{ev.clientName}</p>
                    <p className="text-xs text-muted-foreground">{ev.eventType}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-xs font-medium text-foreground">{new Date(ev.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                  <p className="text-xs text-muted-foreground" style={{ fontFamily: "DM Mono, monospace" }}>{fmt(ev.total)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAVILION PAGE ────────────────────────────────────────────────────────────
function PavilionPage() {
  const [events, setEvents] = useState<VenueEvent[]>(PAVILION_EVENTS);
  const [search, setSearch] = useState(""); const [typeFilter, setTypeFilter] = useState(""); const [modalOpen, setModalOpen] = useState(false);
  const eventTypes = useMemo(() => [...new Set(events.map((e) => e.eventType).filter(Boolean))], [events]);
  const filtered = useMemo(() => events.filter((e) => { const q = search.toLowerCase(); return (e.clientName.toLowerCase().includes(q) || e.id.toLowerCase().includes(q)) && (!typeFilter || e.eventType === typeFilter); }), [events, search, typeFilter]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>Pavilion Management</h1><p className="text-sm text-muted-foreground mt-0.5">{events.length} events scheduled</p></div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"><Plus size={14} /><span className="hidden sm:inline">Add Event</span><span className="sm:hidden">Add</span></button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-3">
          <FilterBar search={search} onSearch={setSearch} placeholder="Search by name or ID…" filterEl={
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
              <option value="">All Types</option>{eventTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          } />
          <div className="bg-card rounded-xl border border-border overflow-hidden"><EventTable events={filtered} accentColor="#10b981" /></div>
        </div>
        <div className="space-y-3">
          <MiniCalendar eventDates={events.map((e) => e.date)} />
          <div className="bg-card rounded-xl border border-border p-4 text-xs text-muted-foreground space-y-2">
            <p className="font-semibold uppercase tracking-wider text-[10px]">Legend</p>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary" />Event scheduled</div>
          </div>
        </div>
      </div>
      <EventModal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Pavilion Event" idPrefix="PAV" onAdd={(e) => setEvents((p) => [e, ...p])} />
    </div>
  );
}

// ─── POOL PAGE ────────────────────────────────────────────────────────────────
function PoolPage() {
  const [events, setEvents] = useState<VenueEvent[]>(POOL_BOOKINGS);
  const [search, setSearch] = useState(""); const [typeFilter, setTypeFilter] = useState(""); const [modalOpen, setModalOpen] = useState(false);
  const eventTypes = useMemo(() => [...new Set(events.map((e) => e.eventType).filter(Boolean))], [events]);
  const filtered = useMemo(() => events.filter((e) => { const q = search.toLowerCase(); return (e.clientName.toLowerCase().includes(q) || e.id.toLowerCase().includes(q)) && (!typeFilter || e.eventType === typeFilter); }), [events, search, typeFilter]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>Pool Management</h1><p className="text-sm text-muted-foreground mt-0.5">{events.length} bookings scheduled</p></div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"><Plus size={14} /><span className="hidden sm:inline">Add Booking</span><span className="sm:hidden">Add</span></button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-3">
          <FilterBar search={search} onSearch={setSearch} placeholder="Search by name or ID…" filterEl={
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
              <option value="">All Types</option>{eventTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          } />
          <div className="bg-card rounded-xl border border-border overflow-hidden"><EventTable events={filtered} accentColor="#38bdf8" /></div>
        </div>
        <div className="space-y-3">
          <MiniCalendar eventDates={events.map((e) => e.date)} />
          <div className="bg-card rounded-xl border border-border p-4 text-xs text-muted-foreground space-y-2">
            <p className="font-semibold uppercase tracking-wider text-[10px]">Legend</p>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary" />Booking date</div>
          </div>
        </div>
      </div>
      <EventModal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Pool Booking" idPrefix="POL" onAdd={(e) => setEvents((p) => [e, ...p])} />
    </div>
  );
}

// ─── COURTS PAGE ──────────────────────────────────────────────────────────────
function CourtsPage() {
  const [andoy, setAndoy] = useState<CourtSchedule[]>(ANDOY_SCHEDULES);
  const [juliet, setJuliet] = useState<CourtSchedule[]>(JULIET_SCHEDULES);
  const [andoySearch, setAndoySearch] = useState(""); const [julietSearch, setJulietSearch] = useState("");
  const [andoyModal, setAndoyModal] = useState(false); const [julietModal, setJulietModal] = useState(false);
  const filtAndoy = useMemo(() => andoy.filter((s) => s.clientName.toLowerCase().includes(andoySearch.toLowerCase())), [andoy, andoySearch]);
  const filtJuliet = useMemo(() => juliet.filter((s) => s.clientName.toLowerCase().includes(julietSearch.toLowerCase())), [juliet, julietSearch]);

  return (
    <div className="space-y-8">
      <div><h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>Court Schedules</h1><p className="text-sm text-muted-foreground mt-0.5">Manage Andoy and Juliet court bookings</p></div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5"><div className="w-2.5 h-2.5 rounded-full bg-primary" /><h2 className="text-base font-semibold text-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>Andoy Court</h2><span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted">{andoy.length}</span></div>
          <button onClick={() => setAndoyModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 transition-opacity"><Plus size={13} />Add Schedule</button>
        </div>
        <FilterBar search={andoySearch} onSearch={setAndoySearch} placeholder="Search clients…" />
        <div className="bg-card rounded-xl border border-border overflow-hidden"><CourtTable schedules={filtAndoy} accentColor="#10b981" /></div>
      </div>

      <div className="border-t border-border" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5"><div className="w-2.5 h-2.5 rounded-full" style={{ background: "#a78bfa" }} /><h2 className="text-base font-semibold text-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>Juliet Court</h2><span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted">{juliet.length}</span></div>
          <button onClick={() => setJulietModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-90 transition-opacity" style={{ background: "#a78bfa20", color: "#a78bfa" }}><Plus size={13} />Add Schedule</button>
        </div>
        <FilterBar search={julietSearch} onSearch={setJulietSearch} placeholder="Search clients…" />
        <div className="bg-card rounded-xl border border-border overflow-hidden"><CourtTable schedules={filtJuliet} accentColor="#a78bfa" /></div>
      </div>

      <CourtModal open={andoyModal} onClose={() => setAndoyModal(false)} court="andoy" onAdd={(s) => setAndoy((p) => [s, ...p])} />
      <CourtModal open={julietModal} onClose={() => setJulietModal(false)} court="juliet" onAdd={(s) => setJuliet((p) => [s, ...p])} />
    </div>
  );
}

// ─── MAINTENANCE PAGE ─────────────────────────────────────────────────────────
function MaintenancePage() {
  const [repairs, setRepairs] = useState<Repair[]>(REPAIR_DATA);
  const [search, setSearch] = useState(""); const [statusFilter, setStatusFilter] = useState<RepairStatus | "">("");
  const [priorityFilter, setPriorityFilter] = useState<RepairPriority | "">("");  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => repairs.filter((r) => { const q = search.toLowerCase(); return (r.description.toLowerCase().includes(q) || r.area.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)) && (!statusFilter || r.status === statusFilter) && (!priorityFilter || r.priority === priorityFilter); }), [repairs, search, statusFilter, priorityFilter]);

  const summary = useMemo(() => ({ total: repairs.length, pending: repairs.filter((r) => r.status === "Pending").length, inProgress: repairs.filter((r) => r.status === "In Progress").length, completed: repairs.filter((r) => r.status === "Completed").length, totalCost: repairs.reduce((s, r) => s + r.cost, 0) }), [repairs]);

  const summaryCards = [
    { label: "Total", value: String(summary.total), color: "var(--foreground)" },
    { label: "Pending", value: String(summary.pending), color: "#f97316" },
    { label: "In Progress", value: String(summary.inProgress), color: "#38bdf8" },
    { label: "Completed", value: String(summary.completed), color: "#10b981" },
    { label: "Est. Cost", value: fmt(summary.totalCost), color: "#a78bfa" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>Maintenance</h1><p className="text-sm text-muted-foreground mt-0.5">Track and manage venue repairs</p></div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"><Plus size={14} /><span className="hidden sm:inline">Log Repair</span><span className="sm:hidden">Log</span></button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {summaryCards.map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border px-4 py-3">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-semibold mt-0.5" style={{ fontFamily: "Epilogue, sans-serif", color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by area, description, or ID…" className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <div className="flex gap-2">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as RepairStatus | "")} className="flex-1 sm:flex-none bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
            <option value="">All Status</option><option value="Pending">Pending</option><option value="In Progress">In Progress</option><option value="Completed">Completed</option>
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as RepairPriority | "")} className="flex-1 sm:flex-none bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
            <option value="">All Priority</option><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option>
          </select>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-border">
                {["ID", "Area", "Description", "Reported By", "Date", "Priority", "Status", "Cost", ""].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-sm text-muted-foreground">No repairs found.</td></tr>
              ) : filtered.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors group">
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap" style={{ fontFamily: "DM Mono, monospace" }}>{r.id}</td>
                  <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{r.area}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">{r.description}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{r.reportedBy || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">{r.date ? new Date(r.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap"><span className="px-2 py-0.5 rounded-full text-xs font-medium" style={PRIORITY_STYLE[r.priority]}>{r.priority}</span></td>
                  <td className="px-4 py-3 whitespace-nowrap"><span className="px-2 py-0.5 rounded-full text-xs font-medium" style={STATUS_STYLE[r.status]}>{r.status}</span></td>
                  <td className="px-4 py-3 text-foreground whitespace-nowrap text-xs" style={{ fontFamily: "DM Mono, monospace" }}>{r.cost > 0 ? fmt(r.cost) : "—"}</td>
                  <td className="px-4 py-3"><button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"><MoreHorizontal size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <RepairModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={(r) => setRepairs((p) => [r, ...p])} />
    </div>
  );
}

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────
function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const storedUser = ls.getUsers().find((u) => u.username === user);
  const [profileForm, setProfileForm] = useState({ username: storedUser?.username ?? "", email: storedUser?.email ?? "" });
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [pwMsg, setPwMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const setP = (k: keyof typeof profileForm) => (e: React.ChangeEvent<HTMLInputElement>) => setProfileForm((f) => ({ ...f, [k]: e.target.value }));
  const setPw = (k: keyof typeof pwForm) => (e: React.ChangeEvent<HTMLInputElement>) => setPwForm((f) => ({ ...f, [k]: e.target.value }));

  const saveProfile = () => {
    if (!profileForm.username.trim()) { setProfileMsg({ type: "err", text: "Username cannot be empty." }); return; }
    const users = ls.getUsers();
    if (users.find((u) => u.username.toLowerCase() === profileForm.username.toLowerCase() && u.username !== user)) { setProfileMsg({ type: "err", text: "That username is already taken." }); return; }
    ls.saveUsers(users.map((u) => u.username === user ? { ...u, username: profileForm.username.trim(), email: profileForm.email } : u));
    ls.setSession(profileForm.username.trim());
    setProfileMsg({ type: "ok", text: "Profile updated successfully." });
    setTimeout(() => setProfileMsg(null), 3000);
  };

  const savePassword = () => {
    const users = ls.getUsers(); const current = users.find((u) => u.username === user);
    if (!current) return;
    if (current.password !== pwForm.current) { setPwMsg({ type: "err", text: "Current password is incorrect." }); return; }
    if (pwForm.next.length < 6) { setPwMsg({ type: "err", text: "New password must be at least 6 characters." }); return; }
    if (pwForm.next !== pwForm.confirm) { setPwMsg({ type: "err", text: "Passwords do not match." }); return; }
    ls.saveUsers(users.map((u) => u.username === user ? { ...u, password: pwForm.next } : u));
    setPwForm({ current: "", next: "", confirm: "" });
    setPwMsg({ type: "ok", text: "Password updated successfully." });
    setTimeout(() => setPwMsg(null), 3000);
  };

  const card = "bg-card rounded-xl border border-border p-5 sm:p-6 space-y-5";
  const sectionHead = (t: string) => <div className="pb-4 border-b border-border"><h2 className="text-base font-semibold text-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>{t}</h2></div>;
  const msgCls = (type: "ok" | "err") => `text-xs rounded-lg px-3 py-2 ${type === "ok" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`;

  return (
    <div className="space-y-5 max-w-2xl">
      <div><h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>Settings</h1><p className="text-sm text-muted-foreground mt-0.5">Manage your account and preferences</p></div>

      <div className={card}>
        {sectionHead("Profile")}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0"><User size={20} className="text-primary" /></div>
          <div><p className="font-medium text-foreground">{profileForm.username || user}</p><p className="text-xs text-muted-foreground mt-0.5">{profileForm.email || "No email set"}</p></div>
        </div>
        <div className="space-y-3">
          <div><label className={labelCls}>Username</label><input type="text" value={profileForm.username} onChange={setP("username")} className={inputCls} /></div>
          <div><label className={labelCls}>Email <span className="text-muted-foreground font-normal">(optional)</span></label><input type="email" value={profileForm.email} onChange={setP("email")} placeholder="you@example.com" className={inputCls} /></div>
          {profileMsg && <p className={msgCls(profileMsg.type)}>{profileMsg.text}</p>}
          <div className="flex justify-end"><button onClick={saveProfile} className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">Save Profile</button></div>
        </div>
      </div>

      <div className={card}>
        {sectionHead("Change Password")}
        <div className="space-y-3">
          {([["Current Password", "current", "Enter current password"], ["New Password", "next", "At least 6 characters"], ["Confirm New Password", "confirm", "Repeat new password"]] as const).map(([label, key, placeholder]) => (
            <div key={key}>
              <label className={labelCls}>{label}</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={pwForm[key]} onChange={setPw(key)} placeholder={placeholder} className={`${inputCls} pr-10`} />
                {key === "current" && <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">{showPw ? <EyeOff size={14} /> : <Eye size={14} />}</button>}
              </div>
            </div>
          ))}
          {pwMsg && <p className={msgCls(pwMsg.type)}>{pwMsg.text}</p>}
          <div className="flex justify-end"><button onClick={savePassword} className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">Update Password</button></div>
        </div>
      </div>

      <div className={card}>
        {sectionHead("Appearance")}
        <div className="flex items-center justify-between">
          <div><p className="text-sm font-medium text-foreground">Theme</p><p className="text-xs text-muted-foreground mt-0.5">Switch between dark and light mode</p></div>
          <button onClick={toggle} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
            {theme === "dark" ? <><Sun size={14} /> Light</> : <><Moon size={14} /> Dark</>}
          </button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-destructive/30 p-5 sm:p-6 space-y-4">
        {(() => { const t = "Danger Zone"; return <div className="pb-4 border-b border-border"><h2 className="text-base font-semibold text-destructive" style={{ fontFamily: "Epilogue, sans-serif" }}>{t}</h2></div>; })()}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div><p className="text-sm font-medium text-foreground">Delete Account</p><p className="text-xs text-muted-foreground mt-0.5">Permanently remove this account from the system.</p></div>
          <button onClick={() => { if (window.confirm("Are you sure? This cannot be undone.")) { ls.saveUsers(ls.getUsers().filter((u) => u.username !== user)); ls.clearSession(); window.location.reload(); } }}
            className="px-4 py-2 rounded-lg border border-destructive/40 text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors whitespace-nowrap">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard" as Page, label: "Dashboard", icon: LayoutDashboard },
  { id: "pavilion" as Page, label: "Pavilion Management", icon: Tent },
  { id: "pool" as Page, label: "Pool Management", icon: Waves },
  { id: "courts" as Page, label: "Court Schedules", icon: Trophy },
];
const NAV_BOTTOM = [
  { id: "maintenance" as Page, label: "Maintenance", icon: Wrench },
  { id: "settings" as Page, label: "Settings", icon: SettingsIcon },
];

function Sidebar({ page, setPage, onClose }: { page: Page; setPage: (p: Page) => void; onClose?: () => void }) {
  const { user, logout } = useAuth();
  const navigate = (p: Page) => { setPage(p); onClose?.(); };

  return (
    <aside className="h-full w-56 flex flex-col bg-card border-r border-border">
      <div className="px-5 py-5 flex items-center gap-3 border-b border-border flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-primary-foreground text-xs font-bold" style={{ fontFamily: "Epilogue, sans-serif" }}>V</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground leading-tight" style={{ fontFamily: "Epilogue, sans-serif" }}>VenueAdmin</p>
          <p className="text-[10px] text-muted-foreground">Management Portal</p>
        </div>
      </div>

      <nav className="flex-1 px-2 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map((item) => (
          <button key={item.id} onClick={() => navigate(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${page === item.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
            <item.icon size={15} className="flex-shrink-0" />
            <span className="leading-tight">{item.label}</span>
          </button>
        ))}
        <div className="border-t border-border my-2" />
        {NAV_BOTTOM.map((item) => (
          <button key={item.id} onClick={() => navigate(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${page === item.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
            <item.icon size={15} className="flex-shrink-0" />
            <span className="leading-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="px-2 py-3 border-t border-border space-y-1 flex-shrink-0">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0"><User size={12} className="text-primary" /></div>
          <div className="min-w-0"><p className="text-xs font-medium text-foreground truncate">{user}</p><p className="text-[10px] text-muted-foreground">Admin</p></div>
        </div>
        <button onClick={() => { ls.clearSession(); logout(); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <LogOut size={14} /><span className="text-xs">Sign out</span>
        </button>
      </div>
    </aside>
  );
}

// ─── DASHBOARD SHELL ──────────────────────────────────────────────────────────
function DashboardShell() {
  const [page, setPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggle } = useTheme();

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const titles: Record<Page, string> = {
    dashboard: "Dashboard", pavilion: "Pavilion", pool: "Pool", courts: "Courts",
    maintenance: "Maintenance", settings: "Settings",
  };

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <DashboardPage />;
      case "pavilion": return <PavilionPage />;
      case "pool": return <PoolPage />;
      case "courts": return <CourtsPage />;
      case "maintenance": return <MaintenancePage />;
      case "settings": return <SettingsPage />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex fixed left-0 top-0 h-screen w-56 z-40 flex-col">
        <Sidebar page={page} setPage={setPage} />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 flex flex-col h-full w-56 shadow-2xl">
            <Sidebar page={page} setPage={setPage} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-56 min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 flex-shrink-0 bg-background/90 border-b border-border" style={{ backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="hidden sm:inline text-muted-foreground/50">VenueAdmin</span>
              <span className="hidden sm:inline text-muted-foreground/40">/</span>
              <span className="text-foreground font-medium">{titles[page]}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden md:block">
              {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
            </span>
            <button onClick={toggle} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title={theme === "dark" ? "Switch to light" : "Switch to dark"}>
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative">
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
            </button>
          </div>
        </header>

        {/* Page */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-5 lg:py-6">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">(() => ls.getTheme());
  const [user, setUser] = useState<string | null>(() => ls.getSession());

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    ls.setTheme(theme);
  }, [theme]);

  return (
    <ThemeCtx.Provider value={{ theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) }}>
      <AuthCtx.Provider value={{ user, login: (u) => setUser(u), logout: () => setUser(null) }}>
        {user ? <DashboardShell /> : <AuthScreen />}
      </AuthCtx.Provider>
    </ThemeCtx.Provider>
  );
}
