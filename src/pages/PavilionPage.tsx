import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { EventTable } from "@/components/shared/EventTable";
import { MiniCalendar } from "@/components/shared/MiniCalendar";
import { FilterBar } from "@/components/shared/FilterBar";
import { EventModal } from "@/components/modals/EventModal";
import { PAVILION_EVENTS } from "@/data/dummy";
import type { VenueEvent } from "@/types";

export function PavilionPage() {
  const [events, setEvents] = useState<VenueEvent[]>(PAVILION_EVENTS);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const eventTypes = useMemo(
    () => [...new Set(events.map((e) => e.eventType).filter(Boolean))],
    [events]
  );

  const filtered = useMemo(
    () =>
      events.filter((e) => {
        const q = search.toLowerCase();
        return (
          (e.clientName.toLowerCase().includes(q) || e.id.toLowerCase().includes(q)) &&
          (!typeFilter || e.eventType === typeFilter)
        );
      }),
    [events, search, typeFilter]
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>
            Pavilion Management
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{events.length} events scheduled</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          <Plus size={14} />
          <span className="hidden sm:inline">Add Event</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Table */}
        <div className="lg:col-span-2 space-y-3">
          <FilterBar
            search={search}
            onSearch={setSearch}
            placeholder="Search by name or ID…"
            filterEl={
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">All Types</option>
                {eventTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            }
          />
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <EventTable events={filtered} accentColor="#10b981" />
          </div>
        </div>

        {/* Calendar */}
        <div className="space-y-3">
          <MiniCalendar eventDates={events.map((e) => e.date)} />
          <div className="bg-card rounded-xl border border-border p-4 text-xs text-muted-foreground space-y-2">
            <p className="font-semibold uppercase tracking-wider text-[10px]">Legend</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Event scheduled
            </div>
          </div>
        </div>
      </div>

      <EventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Pavilion Event"
        idPrefix="PAV"
        onAdd={(e) => setEvents((p) => [e, ...p])}
      />
    </div>
  );
}
