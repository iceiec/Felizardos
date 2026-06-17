import { useState } from "react";
import { Shield, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { ls } from "@/lib/storage";
import type { StoredUser } from "@/types";

export function AuthScreen() {
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
    const match = users.find(
      (u) => u.username.toLowerCase() === form.username.toLowerCase() && u.password === form.password
    );
    if (!match) { setError("Incorrect username or password."); return; }
    ls.setSession(match.username);
    login(match.username);
  };

  const handleSignUp = () => {
    if (!form.username || !form.password || !form.confirm) { setError("Please fill in all required fields."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (users.find((u) => u.username.toLowerCase() === form.username.toLowerCase())) {
      setError("Username already taken."); return;
    }
    const newUser: StoredUser = { username: form.username, email: form.email, password: form.password };
    ls.saveUsers([...users, newUser]);
    ls.setSession(newUser.username);
    login(newUser.username);
  };

  const isDark = theme === "dark";
  const cardBg   = isDark ? "#131929" : "#ffffff";
  const pageBg   = isDark ? "#0b0f19" : "#f1f5f9";
  const border   = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.09)";
  const inputBg  = isDark ? "#1a2540" : "#f8fafc";
  const primary  = isDark ? "#10b981" : "#059669";
  const fg       = isDark ? "#e2e8f0" : "#0f172a";
  const muted    = "#64748b";
  const tabBg    = isDark ? "#1a2540" : "#f1f5f9";

  const switchTab = (t: "signin" | "signup") => {
    setTab(t);
    setError("");
    setForm({ username: "", email: "", password: "", confirm: "" });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: pageBg, fontFamily: "Instrument Sans, sans-serif" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl shadow-2xl"
        style={{ background: cardBg, border: `1px solid ${border}` }}
      >
        {/* Brand */}
        <div className="px-8 pt-8 pb-5 text-center">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: `${primary}20` }}>
            <Shield size={22} style={{ color: primary }} />
          </div>
          <h1 className="text-xl font-semibold" style={{ fontFamily: "Epilogue, sans-serif", color: fg }}>Felizardos</h1>
          <p className="text-sm mt-1" style={{ color: muted }}>
            {tab === "signin" ? "Sign in to your account" : "Create your admin account"}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="px-8 mb-5">
          <div className="flex rounded-xl p-1" style={{ background: tabBg }}>
            {(["signin", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: tab === t ? cardBg : "transparent",
                  color: tab === t ? fg : muted,
                  boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.15)" : "none",
                }}
              >
                {t === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="px-8 pb-8 space-y-4">
          {tab === "signin" && users.length === 0 && (
            <div className="rounded-lg px-3 py-2.5 text-xs text-center" style={{ background: `${primary}15`, color: primary }}>
              No account yet — switch to Sign Up to create one.
            </div>
          )}

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: muted }}>Username</label>
            <input
              type="text" value={form.username} onChange={setF("username")} autoComplete="username"
              onKeyDown={(e) => e.key === "Enter" && (tab === "signin" ? handleSignIn() : handleSignUp())}
              placeholder="e.g. admin"
              className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors"
              style={{ background: inputBg, border: `1px solid ${border}`, color: fg }}
            />
          </div>

          {tab === "signup" && (
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: muted }}>
                Email <span style={{ fontWeight: 400 }}>(optional)</span>
              </label>
              <input
                type="email" value={form.email} onChange={setF("email")} autoComplete="email" placeholder="you@example.com"
                className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors"
                style={{ background: inputBg, border: `1px solid ${border}`, color: fg }}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: muted }}>Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"} value={form.password} onChange={setF("password")}
                onKeyDown={(e) => e.key === "Enter" && (tab === "signin" ? handleSignIn() : handleSignUp())}
                placeholder="••••••••" autoComplete={tab === "signin" ? "current-password" : "new-password"}
                className="w-full rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none transition-colors"
                style={{ background: inputBg, border: `1px solid ${border}`, color: fg }}
              />
              <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors" style={{ color: muted }}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {tab === "signup" && (
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: muted }}>Confirm Password</label>
              <input
                type={showPw ? "text" : "password"} value={form.confirm} onChange={setF("confirm")}
                onKeyDown={(e) => e.key === "Enter" && handleSignUp()}
                placeholder="••••••••" autoComplete="new-password"
                className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors"
                style={{ background: inputBg, border: `1px solid ${border}`, color: fg }}
              />
            </div>
          )}

          {error && (
            <p className="text-xs rounded-lg px-3 py-2" style={{ background: "#ef444420", color: "#ef4444" }}>{error}</p>
          )}

          <button
            onClick={tab === "signin" ? handleSignIn : handleSignUp}
            className="w-full py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 mt-2"
            style={{ background: primary, color: "#ffffff" }}
          >
            {tab === "signin" ? "Sign In" : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
