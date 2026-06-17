import { Tent, Waves, Trophy, CalendarDays } from "lucide-react";
import { MiniCalendar } from "@/components/shared/MiniCalendar";
import { RevenueChart } from "@/components/shared/RevenueChart";
import { PAVILION_EVENTS, POOL_BOOKINGS } from "@/data/dummy";
import { fmt } from "@/lib/utils";

export function DashboardPage() {
  const allDates = [...PAVILION_EVENTS, ...POOL_BOOKINGS].map((e) => e.date);
  const upcoming = [...PAVILION_EVENTS, ...POOL_BOOKINGS]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6);

  const stats = [
    { label: "Pavilion Revenue (Jun)", value: "₱135,000", sub: "+12% vs May", icon: Tent,        hex: "#10b981" },
    { label: "Pool Revenue (Jun)",     value: "₱80,000",  sub: "+8% vs May",  icon: Waves,       hex: "#38bdf8" },
    { label: "Courts Revenue (Jun)",   value: "₱42,000",  sub: "+5% vs May",  icon: Trophy,      hex: "#a78bfa" },
    { label: "Total Events",           value: "14",        sub: "this month",  icon: CalendarDays, hex: "#fb923c" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">Overview of your venue performance</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-3 sm:p-4 flex items-start gap-3">
            <div className="p-2 rounded-lg flex-shrink-0" style={{ background: `${s.hex}20` }}>
              <s.icon size={14} style={{ color: s.hex }} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground leading-tight">{s.label}</p>
              <p className="text-base sm:text-lg font-semibold text-foreground mt-0.5" style={{ fontFamily: "Epilogue, sans-serif" }}>
                {s.value}
              </p>
              <p className="text-xs mt-0.5" style={{ color: s.hex }}>{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RevenueChart title="Pavilion Revenue" dataKey="pavilion" color="#10b981" />
        <RevenueChart title="Pool Revenue"     dataKey="pool"     color="#38bdf8" />
        <RevenueChart title="Courts Revenue"   dataKey="courts"   color="#a78bfa" />
      </div>

      {/* Calendar + upcoming events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <MiniCalendar eventDates={allDates} />
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4" style={{ fontFamily: "Epilogue, sans-serif" }}>
            Upcoming Events
          </h3>
          <div>
            {upcoming.map((ev, i) => (
              <div
                key={ev.id}
                className={`flex items-center justify-between py-2.5 ${i < upcoming.length - 1 ? "border-b border-border" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: ev.id.startsWith("PAV") ? "#10b981" : "#38bdf8" }}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{ev.clientName}</p>
                    <p className="text-xs text-muted-foreground">{ev.eventType}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-xs font-medium text-foreground">
                    {new Date(ev.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                  <p className="text-xs text-muted-foreground" style={{ fontFamily: "DM Mono, monospace" }}>
                    {fmt(ev.total)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
