import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { CourtTable } from "@/components/shared/CourtTable";
import { FilterBar } from "@/components/shared/FilterBar";
import { CourtModal } from "@/components/modals/CourtModal";
import { ANDOY_SCHEDULES, JULIET_SCHEDULES } from "@/data/dummy";
import type { CourtSchedule } from "@/types";

export function CourtsPage() {
  const [andoy, setAndoy] = useState<CourtSchedule[]>(ANDOY_SCHEDULES);
  const [juliet, setJuliet] = useState<CourtSchedule[]>(JULIET_SCHEDULES);
  const [andoySearch, setAndoySearch] = useState("");
  const [julietSearch, setJulietSearch] = useState("");
  const [andoyModal, setAndoyModal] = useState(false);
  const [julietModal, setJulietModal] = useState(false);

  const filtAndoy = useMemo(
    () => andoy.filter((s) => s.clientName.toLowerCase().includes(andoySearch.toLowerCase())),
    [andoy, andoySearch]
  );
  const filtJuliet = useMemo(
    () => juliet.filter((s) => s.clientName.toLowerCase().includes(julietSearch.toLowerCase())),
    [juliet, julietSearch]
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>
          Court Schedules
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage Andoy and Juliet court bookings</p>
      </div>

      {/* Andoy Court */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
            <h2 className="text-base font-semibold text-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>
              Andoy Court
            </h2>
            <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted">
              {andoy.length} bookings
            </span>
          </div>
          <button
            onClick={() => setAndoyModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 transition-opacity"
          >
            <Plus size={13} />Add Schedule
          </button>
        </div>
        <FilterBar search={andoySearch} onSearch={setAndoySearch} placeholder="Search clients…" />
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <CourtTable schedules={filtAndoy} accentColor="#10b981" />
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Juliet Court */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#a78bfa" }} />
            <h2 className="text-base font-semibold text-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>
              Juliet Court
            </h2>
            <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted">
              {juliet.length} bookings
            </span>
          </div>
          <button
            onClick={() => setJulietModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-90 transition-opacity"
            style={{ background: "#a78bfa20", color: "#a78bfa" }}
          >
            <Plus size={13} />Add Schedule
          </button>
        </div>
        <FilterBar search={julietSearch} onSearch={setJulietSearch} placeholder="Search clients…" />
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <CourtTable schedules={filtJuliet} accentColor="#a78bfa" />
        </div>
      </div>

      <CourtModal open={andoyModal} onClose={() => setAndoyModal(false)} court="andoy" onAdd={(s) => setAndoy((p) => [s, ...p])} />
      <CourtModal open={julietModal} onClose={() => setJulietModal(false)} court="juliet" onAdd={(s) => setJuliet((p) => [s, ...p])} />
    </div>
  );
}
