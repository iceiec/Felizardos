import { useState, useEffect } from "react";
import { Bell, Menu, Sun, Moon } from "lucide-react";

import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { AuthScreen } from "@/components/auth/AuthScreen";

import { DashboardPage }   from "@/pages/DashboardPage";
import { PavilionPage }    from "@/pages/PavilionPage";
import { PoolPage }        from "@/pages/PoolPage";
import { CourtsPage }      from "@/pages/CourtsPage";
import { MaintenancePage } from "@/pages/MaintenancePage";
import { SettingsPage }    from "@/pages/SettingsPage";

import type { Page } from "@/types";

// ─── DASHBOARD SHELL ─────────────────────────────────────────────────────────
function DashboardShell() {
  const [page, setPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const titles: Record<Page, string> = {
    dashboard:   "Dashboard",
    pavilion:    "Pavilion",
    pool:        "Pool",
    courts:      "Courts",
    maintenance: "Maintenance",
    settings:    "Settings",
  };

  const renderPage = () => {
    switch (page) {
      case "dashboard":   return <DashboardPage />;
      case "pavilion":    return <PavilionPage />;
      case "pool":        return <PoolPage />;
      case "courts":      return <CourtsPage />;
      case "maintenance": return <MaintenancePage />;
      case "settings":    return <SettingsPage />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex fixed left-0 top-0 h-screen w-56 z-40 flex-col">
        <Sidebar page={page} setPage={setPage} />
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 flex flex-col h-full w-56 shadow-2xl">
            <Sidebar page={page} setPage={setPage} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-56 min-h-screen flex flex-col">
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 flex-shrink-0 bg-background/90 border-b border-border"
          style={{ backdropFilter: "blur(12px)" }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
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
              {new Date().toLocaleDateString("en-US", {
                weekday: "short", month: "short", day: "numeric", year: "numeric",
              })}
            </span>
            <button
              onClick={toggle}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative">
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
            </button>
          </div>
        </header>

        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-5 lg:py-6">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

// ─── INNER APP (reads context) ────────────────────────────────────────────────
function AppInner() {
  const { user } = useAuth();
  return user ? <DashboardShell /> : <AuthScreen />;
}

// ─── ROOT — default export consumed by the entrypoint ────────────────────────
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </ThemeProvider>
  );
}
