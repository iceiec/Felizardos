import { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import { inputCls, labelCls, nextId, MONTHS_SHORT } from "@/lib/utils";
import { ANDOY_SLOTS, JULIET_SLOTS } from "@/lib/constants";
import type { CourtSchedule } from "@/types";

const EMPTY = { clientName: "", phone: "", timeSlot: "", customTime: "", date: "", deposit: "", balance: "" };

interface CourtModalProps {
  open: boolean;
  onClose: () => void;
  court: "andoy" | "juliet";
  onAdd: (s: CourtSchedule) => void;
}

export function CourtModal({ open, onClose, court, onAdd }: CourtModalProps) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");

  const slots = court === "andoy" ? ANDOY_SLOTS : JULIET_SLOTS;
  const courtName = court === "andoy" ? "Andoy Court" : "Juliet Court";
  const prefix = court === "andoy" ? "AND" : "JUL";

  const setI = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));
  const setS = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleClose = () => { setForm(EMPTY); setError(""); onClose(); };

  const handleSubmit = () => {
    if (!form.clientName.trim() || !form.date) { setError("Client name and date are required."); return; }
    if (!form.timeSlot) { setError("Please select a time slot."); return; }
    if (form.timeSlot === "Custom" && !form.customTime.trim()) { setError("Please enter a custom time."); return; }

    const time = form.timeSlot === "Custom" ? form.customTime.trim() : form.timeSlot;
    const d = new Date(form.date + "T00:00:00");
    const dateStr = `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

    onAdd({
      id: `${prefix}-${nextId()}`,
      clientName: form.clientName.trim(),
      phone: form.phone,
      court: courtName,
      schedule: `${dateStr} | ${time}`,
      deposit: Number(form.deposit) || 0,
      balance: Number(form.balance) || 0,
    });
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title={`Add Schedule — ${courtName}`}>
      <div className="space-y-3">
        <div>
          <label className={labelCls}>Client's Name <span className="text-destructive">*</span></label>
          <input type="text" value={form.clientName} onChange={setI("clientName")} placeholder="e.g. Marco Rivera" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Phone Number</label>
          <input type="tel" value={form.phone} onChange={setI("phone")} placeholder="e.g. 0917-123-4567" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Time Slot <span className="text-destructive">*</span></label>
          <select value={form.timeSlot} onChange={setS("timeSlot")} className={inputCls}>
            <option value="">Select time slot</option>
            {slots.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {form.timeSlot === "Custom" && (
          <div>
            <label className={labelCls}>Custom Time</label>
            <input type="text" value={form.customTime} onChange={setI("customTime")} placeholder="e.g. 3:00–5:00 PM" className={inputCls} />
          </div>
        )}
        <div>
          <label className={labelCls}>Date <span className="text-destructive">*</span></label>
          <input type="date" value={form.date} onChange={setI("date")} className={inputCls} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Deposit (₱)</label>
            <input type="number" min="0" value={form.deposit} onChange={setI("deposit")} placeholder="0" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Balance (₱)</label>
            <input type="number" min="0" value={form.balance} onChange={setI("balance")} placeholder="0" className={inputCls} />
          </div>
        </div>
        {error && <p className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>}
        <div className="flex gap-3 pt-1">
          <button onClick={handleClose} className="flex-1 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            Add Schedule
          </button>
        </div>
      </div>
    </Modal>
  );
}
