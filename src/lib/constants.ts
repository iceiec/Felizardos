import type { RepairStatus, RepairPriority } from "@/types";

// ─── CHART DATA ───────────────────────────────────────────────────────────────
export const chartData = {
  day: {
    pavilion: [
      { label: "Mon", value: 12000 }, { label: "Tue", value: 8500 },
      { label: "Wed", value: 15000 }, { label: "Thu", value: 11000 },
      { label: "Fri", value: 18000 }, { label: "Sat", value: 22000 },
      { label: "Sun", value: 9000 },
    ],
    pool: [
      { label: "Mon", value: 2500 }, { label: "Tue", value: 3200 },
      { label: "Wed", value: 1800 }, { label: "Thu", value: 4100 },
      { label: "Fri", value: 5500 }, { label: "Sat", value: 8200 },
      { label: "Sun", value: 6000 },
    ],
    courts: [
      { label: "Mon", value: 1000 }, { label: "Tue", value: 1500 },
      { label: "Wed", value: 2000 }, { label: "Thu", value: 1000 },
      { label: "Fri", value: 2500 }, { label: "Sat", value: 3500 },
      { label: "Sun", value: 2000 },
    ],
  },
  month: {
    pavilion: [
      { label: "Jan", value: 120000 }, { label: "Feb", value: 85000 },
      { label: "Mar", value: 145000 }, { label: "Apr", value: 110000 },
      { label: "May", value: 165000 }, { label: "Jun", value: 135000 },
      { label: "Jul", value: 190000 }, { label: "Aug", value: 155000 },
      { label: "Sep", value: 140000 }, { label: "Oct", value: 175000 },
      { label: "Nov", value: 200000 }, { label: "Dec", value: 230000 },
    ],
    pool: [
      { label: "Jan", value: 25000 }, { label: "Feb", value: 30000 },
      { label: "Mar", value: 45000 }, { label: "Apr", value: 55000 },
      { label: "May", value: 70000 }, { label: "Jun", value: 80000 },
      { label: "Jul", value: 90000 }, { label: "Aug", value: 85000 },
      { label: "Sep", value: 60000 }, { label: "Oct", value: 40000 },
      { label: "Nov", value: 30000 }, { label: "Dec", value: 35000 },
    ],
    courts: [
      { label: "Jan", value: 18000 }, { label: "Feb", value: 22000 },
      { label: "Mar", value: 28000 }, { label: "Apr", value: 32000 },
      { label: "May", value: 38000 }, { label: "Jun", value: 42000 },
      { label: "Jul", value: 45000 }, { label: "Aug", value: 48000 },
      { label: "Sep", value: 35000 }, { label: "Oct", value: 30000 },
      { label: "Nov", value: 25000 }, { label: "Dec", value: 28000 },
    ],
  },
  year: {
    pavilion: [
      { label: "2023", value: 980000 }, { label: "2024", value: 1250000 },
      { label: "2025", value: 1580000 }, { label: "2026", value: 850000 },
    ],
    pool: [
      { label: "2023", value: 280000 }, { label: "2024", value: 420000 },
      { label: "2025", value: 590000 }, { label: "2026", value: 310000 },
    ],
    courts: [
      { label: "2023", value: 180000 }, { label: "2024", value: 250000 },
      { label: "2025", value: 320000 }, { label: "2026", value: 180000 },
    ],
  },
};

export const CHART_TRENDS: Record<"pavilion" | "pool" | "courts", number> = {
  pavilion: 12,
  pool: 8,
  courts: 5,
};

// ─── BADGE STYLES ─────────────────────────────────────────────────────────────
export const STATUS_STYLE: Record<RepairStatus, { background: string; color: string }> = {
  "Pending":     { background: "rgba(251,146,60,0.15)",  color: "#f97316" },
  "In Progress": { background: "rgba(56,189,248,0.15)",   color: "#38bdf8" },
  "Completed":   { background: "rgba(16,185,129,0.15)",   color: "#10b981" },
};

export const PRIORITY_STYLE: Record<RepairPriority, { background: string; color: string }> = {
  Low:    { background: "rgba(100,116,139,0.15)", color: "#64748b" },
  Medium: { background: "rgba(251,191,36,0.15)",  color: "#f59e0b" },
  High:   { background: "rgba(239,68,68,0.15)",   color: "#ef4444" },
};

// ─── OPTION LISTS ─────────────────────────────────────────────────────────────
export const VENUE_AREAS = [
  "Pavilion", "Pool", "Andoy Court", "Juliet Court",
  "Parking", "Entrance", "Restrooms", "Storage", "Other",
];

export const ANDOY_SLOTS = [
  "5:00–7:00 PM", "7:00–9:00 PM", "9:00–11:00 PM", "Custom",
];

export const JULIET_SLOTS = [
  "4:00–6:00 PM", "6:00–8:00 PM", "8:00–10:00 PM", "10:00 PM–12:00 AM", "Custom",
];
