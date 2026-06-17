import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import { RepairModal } from "@/components/modals/RepairModal";
import { REPAIR_DATA } from "@/data/dummy";
import { STATUS_STYLE, PRIORITY_STYLE } from "@/lib/constants";
import { fmt } from "@/lib/utils";
import type { Repair, RepairStatus, RepairPriority } from "@/types";

export function MaintenancePage() {
  const [repairs, setRepairs] = useState<Repair[]>(REPAIR_DATA);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RepairStatus | "">("");
  const [priorityFilter, setPriorityFilter] = useState<RepairPriority | "">("");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(
    () =>
      repairs.filter((r) => {
        const q = search.toLowerCase();
        return (
          (r.description.toLowerCase().includes(q) ||
            r.area.toLowerCase().includes(q) ||
            r.id.toLowerCase().includes(q)) &&
          (!statusFilter || r.status === statusFilter) &&
          (!priorityFilter || r.priority === priorityFilter)
        );
      }),
    [repairs, search, statusFilter, priorityFilter]
  );

  const summary = useMemo(
    () => ({
      total: repairs.length,
      pending: repairs.filter((r) => r.status === "Pending").length,
      inProgress: repairs.filter((r) => r.status === "In Progress").length,
      completed: repairs.filter((r) => r.status === "Completed").length,
      totalCost: repairs.reduce((s, r) => s + r.cost, 0),
    }),
    [repairs]
  );

  const summaryCards = [
    { label: "Total",       value: String(summary.total),       color: "var(--foreground)" },
    { label: "Pending",     value: String(summary.pending),     color: "#f97316" },
    { label: "In Progress", value: String(summary.inProgress),  color: "#38bdf8" },
    { label: "Completed",   value: String(summary.completed),   color: "#10b981" },
    { label: "Est. Cost",   value: fmt(summary.totalCost),      color: "#a78bfa" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>
            Maintenance
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track and manage venue repairs</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          <Plus size={14} />
          <span className="hidden sm:inline">Log Repair</span>
          <span className="sm:hidden">Log</span>
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {summaryCards.map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border px-4 py-3">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-semibold mt-0.5" style={{ fontFamily: "Epilogue, sans-serif", color: s.color }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by area, description, or ID…"
            className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as RepairStatus | "")}
            className="flex-1 sm:flex-none bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as RepairPriority | "")}
            className="flex-1 sm:flex-none bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {/* Table */}
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
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-sm text-muted-foreground">No repairs found.</td>
                </tr>
              ) : filtered.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors group">
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap" style={{ fontFamily: "DM Mono, monospace" }}>{r.id}</td>
                  <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{r.area}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">{r.description}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{r.reportedBy || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">
                    {r.date ? new Date(r.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={PRIORITY_STYLE[r.priority]}>
                      {r.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={STATUS_STYLE[r.status]}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground whitespace-nowrap text-xs" style={{ fontFamily: "DM Mono, monospace" }}>
                    {r.cost > 0 ? fmt(r.cost) : "—"}
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
      </div>

      <RepairModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={(r) => setRepairs((p) => [r, ...p])} />
    </div>
  );
}
