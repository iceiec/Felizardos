import { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import { inputCls, labelCls, nextId } from "@/lib/utils";
import { VENUE_AREAS } from "@/lib/constants";
import type { Repair, RepairPriority, RepairStatus } from "@/types";

const EMPTY = {
  area: "",
  description: "",
  reportedBy: "",
  date: "",
  priority: "Medium" as RepairPriority,
  status: "Pending" as RepairStatus,
  cost: "",
};

interface RepairModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (r: Repair) => void;
}

export function RepairModal({ open, onClose, onAdd }: RepairModalProps) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");

  const setI = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));
  const setS = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleClose = () => { setForm(EMPTY); setError(""); onClose(); };

  const handleSubmit = () => {
    if (!form.area || !form.description.trim() || !form.date) {
      setError("Area, description, and date are required.");
      return;
    }
    onAdd({
      id: `REP-${nextId()}`,
      area: form.area,
      description: form.description.trim(),
      reportedBy: form.reportedBy,
      date: form.date,
      priority: form.priority,
      status: form.status,
      cost: Number(form.cost) || 0,
    });
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Log Repair">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Area <span className="text-destructive">*</span></label>
            <select value={form.area} onChange={setS("area")} className={inputCls}>
              <option value="">Select area</option>
              {VENUE_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Date Reported <span className="text-destructive">*</span></label>
            <input type="date" value={form.date} onChange={setI("date")} className={inputCls} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Description <span className="text-destructive">*</span></label>
          <textarea
            value={form.description}
            onChange={setI("description")}
            placeholder="Describe the issue…"
            rows={3}
            className={`${inputCls} resize-none`}
          />
        </div>
        <div>
          <label className={labelCls}>Reported By</label>
          <input type="text" value={form.reportedBy} onChange={setI("reportedBy")} placeholder="e.g. Juan Reyes" className={inputCls} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>Priority</label>
            <select value={form.priority} onChange={setS("priority")} className={inputCls}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Status</label>
            <select value={form.status} onChange={setS("status")} className={inputCls}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Cost (₱)</label>
            <input type="number" min="0" value={form.cost} onChange={setI("cost")} placeholder="0" className={inputCls} />
          </div>
        </div>
        {error && <p className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>}
        <div className="flex gap-3 pt-1">
          <button onClick={handleClose} className="flex-1 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            Log Repair
          </button>
        </div>
      </div>
    </Modal>
  );
}
