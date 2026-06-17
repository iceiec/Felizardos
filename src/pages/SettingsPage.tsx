import { useState } from "react";
import { User, Eye, EyeOff, Sun, Moon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { ls } from "@/lib/storage";
import { inputCls, labelCls } from "@/lib/utils";

export function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();

  const storedUser = ls.getUsers().find((u) => u.username === user);
  const [profileForm, setProfileForm] = useState({
    username: storedUser?.username ?? "",
    email: storedUser?.email ?? "",
  });
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [pwMsg, setPwMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const setP = (k: keyof typeof profileForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setProfileForm((f) => ({ ...f, [k]: e.target.value }));
  const setPw = (k: keyof typeof pwForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setPwForm((f) => ({ ...f, [k]: e.target.value }));

  const saveProfile = () => {
    if (!profileForm.username.trim()) { setProfileMsg({ type: "err", text: "Username cannot be empty." }); return; }
    const users = ls.getUsers();
    if (users.find((u) => u.username.toLowerCase() === profileForm.username.toLowerCase() && u.username !== user)) {
      setProfileMsg({ type: "err", text: "That username is already taken." }); return;
    }
    ls.saveUsers(users.map((u) => u.username === user ? { ...u, username: profileForm.username.trim(), email: profileForm.email } : u));
    ls.setSession(profileForm.username.trim());
    setProfileMsg({ type: "ok", text: "Profile updated successfully." });
    setTimeout(() => setProfileMsg(null), 3000);
  };

  const savePassword = () => {
    const users = ls.getUsers();
    const current = users.find((u) => u.username === user);
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
  const head = (t: string, danger = false) => (
    <div className="pb-4 border-b border-border">
      <h2
        className="text-base font-semibold"
        style={{ fontFamily: "Epilogue, sans-serif", color: danger ? "var(--destructive)" : "var(--foreground)" }}
      >
        {t}
      </h2>
    </div>
  );
  const msg = (m: { type: "ok" | "err"; text: string }) => (
    <p className={`text-xs rounded-lg px-3 py-2 ${m.type === "ok" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
      {m.text}
    </p>
  );

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <div className={card}>
        {head("Profile")}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <User size={20} className="text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">{profileForm.username || user}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{profileForm.email || "No email set"}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Username</label>
            <input type="text" value={profileForm.username} onChange={setP("username")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Email <span className="text-muted-foreground font-normal">(optional)</span></label>
            <input type="email" value={profileForm.email} onChange={setP("email")} placeholder="you@example.com" className={inputCls} />
          </div>
          {profileMsg && msg(profileMsg)}
          <div className="flex justify-end">
            <button onClick={saveProfile} className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              Save Profile
            </button>
          </div>
        </div>
      </div>

      {/* Change password */}
      <div className={card}>
        {head("Change Password")}
        <div className="space-y-3">
          {([
            ["Current Password", "current", "Enter current password"],
            ["New Password",     "next",    "At least 6 characters"],
            ["Confirm Password", "confirm", "Repeat new password"],
          ] as const).map(([label, key, placeholder]) => (
            <div key={key}>
              <label className={labelCls}>{label}</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={pwForm[key]}
                  onChange={setPw(key)}
                  placeholder={placeholder}
                  className={`${inputCls} pr-10`}
                />
                {key === "current" && (
                  <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                )}
              </div>
            </div>
          ))}
          {pwMsg && msg(pwMsg)}
          <div className="flex justify-end">
            <button onClick={savePassword} className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              Update Password
            </button>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className={card}>
        {head("Appearance")}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Theme</p>
            <p className="text-xs text-muted-foreground mt-0.5">Switch between dark and light mode</p>
          </div>
          <button
            onClick={toggle}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            {theme === "dark" ? <><Sun size={14} /> Light</> : <><Moon size={14} /> Dark</>}
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-card rounded-xl border border-destructive/30 p-5 sm:p-6 space-y-4">
        {head("Danger Zone", true)}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">Delete Account</p>
            <p className="text-xs text-muted-foreground mt-0.5">Permanently remove this account from the system.</p>
          </div>
          <button
            onClick={() => {
              if (window.confirm("Are you sure? This cannot be undone.")) {
                ls.saveUsers(ls.getUsers().filter((u) => u.username !== user));
                ls.clearSession();
                window.location.reload();
              }
            }}
            className="px-4 py-2 rounded-lg border border-destructive/40 text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors whitespace-nowrap"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
