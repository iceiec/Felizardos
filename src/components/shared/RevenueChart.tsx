import { useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/context/ThemeContext";
import { chartData, CHART_TRENDS } from "@/lib/constants";
import { fmt } from "@/lib/utils";
import type { Period } from "@/types";

type ChartKey = "pavilion" | "pool" | "courts";

interface RevenueChartProps {
  title: string;
  dataKey: ChartKey;
  color: string;
}

export function RevenueChart({ title, dataKey, color }: RevenueChartProps) {
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
          <p className="text-xl font-semibold text-foreground mt-0.5" style={{ fontFamily: "Epilogue, sans-serif" }}>
            {fmt(total)}
          </p>
        </div>
        <div className="flex gap-0.5 bg-muted rounded-lg p-0.5 flex-shrink-0">
          {(["day", "month", "year"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="px-2 py-1 rounded-md text-xs font-medium transition-colors capitalize"
              style={{
                background: period === p ? "var(--card)" : "transparent",
                color: period === p ? "var(--foreground)" : "var(--muted-foreground)",
                boxShadow: period === p ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
              }}
            >
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
          <CartesianGrid
            key={`grid-${dataKey}`}
            strokeDasharray="3 3"
            stroke={isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)"}
            vertical={false}
          />
          <XAxis
            key={`x-${dataKey}`}
            dataKey="label"
            tick={{ fill: "#64748b", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            key={`y-${dataKey}`}
            tick={{ fill: "#64748b", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) =>
              v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` :
              v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
            }
          />
          <Tooltip
            key={`tooltip-${dataKey}`}
            contentStyle={{
              background: isDark ? "#1a2540" : "#ffffff",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)"}`,
              borderRadius: "8px",
              color: isDark ? "#e2e8f0" : "#0f172a",
              fontSize: "12px",
            }}
            formatter={(v: number) => [fmt(v), "Revenue"]}
            cursor={{ fill: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }}
          />
          <Bar key={`bar-${dataKey}`} dataKey="value" fill={color} radius={[3, 3, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
