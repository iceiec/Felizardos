export type Page =
  | "dashboard"
  | "pavilion"
  | "pool"
  | "courts"
  | "maintenance"
  | "settings";

export type Period = "day" | "month" | "year";
export type RepairStatus = "Pending" | "In Progress" | "Completed";
export type RepairPriority = "Low" | "Medium" | "High";

export interface VenueEvent {
  id: string;
  clientName: string;
  phone: string;
  eventType: string;
  capacity: number;
  date: string;
  deposit: number;
  total: number;
}

export interface CourtSchedule {
  id: string;
  clientName: string;
  phone: string;
  court: string;
  schedule: string;
  deposit: number;
  balance: number;
}

export interface Repair {
  id: string;
  area: string;
  description: string;
  reportedBy: string;
  date: string;
  priority: RepairPriority;
  status: RepairStatus;
  cost: number;
}

export interface StoredUser {
  username: string;
  email: string;
  password: string;
}
