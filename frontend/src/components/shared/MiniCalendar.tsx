import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MONTHS_LONG, DAYS_MIN } from "@/lib/utils";

interface MiniCalendarProps {
  eventDates?: string[];
}

export function MiniCalendar({ eventDates = [] }: MiniCalendarProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const isToday = (d: number) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const hasEvent = (d: number) =>
    eventDates.some((ds) => {
      const [y, m, day] = ds.split("-").map(Number);
      return y === year && m - 1 === month && day === d;
    });

  const prev = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const next = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-foreground" style={{ fontFamily: "Epilogue, sans-serif" }}>
          {MONTHS_LONG[month]} {year}
        </span>
        <div className="flex gap-1">
          <button onClick={prev} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={14} />
          </button>
          <button onClick={next} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DAYS_MIN.map((d) => (
          <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => (
          <div
            key={i}
            className={`relative flex flex-col items-center justify-center rounded h-7 text-xs transition-colors ${
              day === null ? "" :
              isToday(day) ? "bg-primary text-primary-foreground font-semibold" :
              "text-foreground hover:bg-muted cursor-default"
            }`}
          >
            {day}
            {day !== null && !isToday(day) && hasEvent(day) && (
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
