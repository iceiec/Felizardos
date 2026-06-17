import { MoreHorizontal } from "lucide-react";
import { fmt } from "@/lib/utils";
import type { CourtSchedule } from "@/types";

interface CourtTableProps {
  schedules: CourtSchedule[];
  accentColor: string;
}

export function CourtTable({ schedules, accentColor }: CourtTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[580px]">
        <thead>
          <tr className="border-b border-border">
            {["ID", "Client's Name", "Phone", "Court", "Schedule", "Deposit", "Balance", ""].map((h) => (
              <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {schedules.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-sm text-muted-foreground">
                No schedules found.
              </td>
            </tr>
          ) : schedules.map((s) => (
            <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors group">
              <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap" style={{ fontFamily: "DM Mono, monospace" }}>{s.id}</td>
              <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{s.clientName}</td>
              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs" style={{ fontFamily: "DM Mono, monospace" }}>{s.phone}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: `${accentColor}18`, color: accentColor }}>
                  {s.court}
                </span>
              </td>
              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">{s.schedule}</td>
              <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ fontFamily: "DM Mono, monospace", color: "var(--foreground)" }}>
                {fmt(s.deposit)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ fontFamily: "DM Mono, monospace" }}>
                {s.balance === 0
                  ? <span className="text-emerald-500 font-medium">Fully Paid</span>
                  : <span className="text-amber-500">{fmt(s.balance)}</span>}
              </td>
              <td className="px-4 py-3">
                <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100">
                  <MoreHorizontal size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
