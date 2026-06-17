export const fmt = (n: number) => `₱${n.toLocaleString()}`;

export const MONTHS_LONG = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
export const MONTHS_SHORT = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];
export const DAYS_MIN = ["Su","Mo","Tu","We","Th","Fr","Sa"];

let _idCounter = 200;
export const nextId = () => String(++_idCounter);

export const inputCls =
  "w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary transition-colors";
export const labelCls = "block text-xs font-medium text-muted-foreground mb-1.5";
