import { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import { inputCls, labelCls, nextId } from "@/lib/utils";
import type { VenueEvent } from "@/types";

const EMPTY = { clientName: "", phone: "", eventType: "", capacity: "", date: "", deposit: "", total: "" };

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  idPrefix: string;
  onAdd: (e: VenueEvent) => void;
}

export function EventModal({ open, onClose, title, idPrefix, onAdd }: EventModalProps) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleClose = () => { setForm(EMPTY); setError(""); onClose(); };

  const handleSubmit = () => {
    if (!form.clientName.trim() || !form.date) {
      setError("Client name and date are required.");
      return;
    }
    onAdd({
      id: `${idPrefix}-${nextId()}`,
      clientName: form.clientName.trim(),
      phone: form.phone,
      eventType: form.eventType,
      capacity: Number(form.capacity) || 0,
      date: form.date,
      deposit: Number(form.deposit) || 0,
      total: Number(form.total) || 0,
    });
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title={title}>
      <div className="space-y-3">
        <div>
          <label className={labelCls}>Client's Name <span className="text-destructive">*</span></label>
          <input type="text" value={form.clientName} onChange={set("clientName")} placeholder="e.g. Maria Santos" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Phone Number</label>
          <input type="tel" value={form.phone} onChange={set("phone")} placeholder="e.g. 0917-123-4567" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Event Type / Name</label>
          <input type="text" value={form.eventType} onChange={set("eventType")} placeholder="e.g. Wedding Reception" className={inputCls} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Capacity</label>
            <input type="number" min="0" value={form.capacity} onChange={set("capacity")} placeholder="150" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Date <span className="text-destructive">*</span></label>
            <input type="date" value={form.date} onChange={set("date")} className={inputCls} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Deposit (₱)</label>
            <input type="number" min="0" value={form.deposit} onChange={set("deposit")} placeholder="0" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Total Amount (₱)</label>
            <input type="number" min="0" value={form.total} onChange={set("total")} placeholder="0" className={inputCls} />
          </div>
        </div>
        {error && <p className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>}
        <div className="flex gap-3 pt-1">
          <button onClick={handleClose} className="flex-1 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            Add Event
          </button>
        </div>
      </div>
    </Modal>
  );
}
