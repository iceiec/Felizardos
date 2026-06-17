import { LayoutDashboard, Tent, Waves, Trophy, Wrench, Settings, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ls } from "@/lib/storage";
import type { Page } from "@/types";

const NAV: { id: Page; label: string; icon: React.ElementType }[] = [
  { id: "dashboard",   label: "Dashboard",           icon: LayoutDashboard },
  { id: "pavilion",    label: "Pavilion Management",  icon: Tent            },
  { id: "pool",        label: "Pool Management",      icon: Waves           },
  { id: "courts",      label: "Court Schedules",      icon: Trophy          },
];

const NAV_BOTTOM: { id: Page; label: string; icon: React.ElementType }[] = [
  { id: "maintenance", label: "Maintenance", icon: Wrench   },
  { id: "settings",   label: "Settings",    icon: Settings },
];

interface SidebarProps {
  page: Page;
  setPage: (p: Page) => void;
  onClose?: () => void;
}

export function Sidebar({ page, setPage, onClose }: SidebarProps) {
  const { user, logout } = useAuth();

  const navigate = (p: Page) => { setPage(p); onClose?.(); };

  const navBtn = (item: { id: Page; label: string; icon: React.ElementType }) => (
    <button
      key={item.id}
      onClick={() => navigate(item.id)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${
        page === item.id
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
    >
      <item.icon size={15} className="flex-shrink-0" />
      <span className="leading-tight">{item.label}</span>
    </button>
  );

  return (
    <aside className="h-full w-56 flex flex-col bg-card border-r border-border">
      {/* Brand */}
      <div className="px-5 py-5 flex items-center gap-3 border-b border-border flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-primary-foreground text-xs font-bold" style={{ fontFamily: "Epilogue, sans-serif" }}>V</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground leading-tight" style={{ fontFamily: "Epilogue, sans-serif" }}>
            Felizardos
          </p>
          <p className="text-[10px] text-muted-foreground">Management Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map(navBtn)}
        <div className="border-t border-border my-2" />
        {NAV_BOTTOM.map(navBtn)}
      </nav>

      {/* User + sign out */}
      <div className="px-2 py-3 border-t border-border space-y-1 flex-shrink-0">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <User size={12} className="text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-foreground truncate">{user}</p>
            <p className="text-[10px] text-muted-foreground">Admin</p>
          </div>
        </div>
        <button
          onClick={() => { ls.clearSession(); logout(); }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <LogOut size={14} />
          <span className="text-xs">Sign out</span>
        </button>
      </div>
    </aside>
  );
}
