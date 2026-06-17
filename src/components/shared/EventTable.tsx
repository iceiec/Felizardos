import { MoreHorizontal } from "lucide-react";
import { fmt } from "@/lib/utils";
import type { VenueEvent } from "@/types";

interface EventTableProps {
  events: VenueEvent[];
  accentColor: string;
}

export function EventTable({ events, accentColor }: EventTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="border-b border-border">
            {["ID", "Client's Name", "Phone", "Event Type", "Cap.", "Date", "Deposit", "Total", ""].map((h) => (
              <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {events.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-4 py-8 text-center text-sm text-muted-foreground">
                No events found.
              </td>
            </tr>
          ) : events.map((ev) => (
            <tr key={ev.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors group">
              <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap" style={{ fontFamily: "DM Mono, monospace" }}>{ev.id}</td>
              <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{ev.clientName}</td>
              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs" style={{ fontFamily: "DM Mono, monospace" }}>{ev.phone}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: `${accentColor}18`, color: accentColor }}>
                  {ev.eventType || "—"}
                </span>
              </td>
              <td className="px-4 py-3 text-muted-foreground text-center">{ev.capacity || "—"}</td>
              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">
                {ev.date ? new Date(ev.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ fontFamily: "DM Mono, monospace", color: "var(--foreground)" }}>
                {fmt(ev.deposit)}
              </td>
              <td className="px-4 py-3 font-medium whitespace-nowrap text-xs" style={{ fontFamily: "DM Mono, monospace", color: accentColor }}>
                {fmt(ev.total)}
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
