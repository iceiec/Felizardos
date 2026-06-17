import type { VenueEvent, CourtSchedule, Repair } from "@/types";

export const PAVILION_EVENTS: VenueEvent[] = [
  { id: "PAV-001", clientName: "Maria Santos",   phone: "0917-123-4567", eventType: "Wedding Reception", capacity: 200, date: "2026-06-20", deposit: 15000, total: 45000 },
  { id: "PAV-002", clientName: "Juan dela Cruz", phone: "0928-234-5678", eventType: "Birthday Party",    capacity: 80,  date: "2026-06-25", deposit: 5000,  total: 15000 },
  { id: "PAV-003", clientName: "Ana Reyes",       phone: "0935-345-6789", eventType: "Corporate Event",  capacity: 150, date: "2026-07-05", deposit: 20000, total: 60000 },
  { id: "PAV-004", clientName: "Carlos Bautista", phone: "0946-456-7890", eventType: "Debut",            capacity: 120, date: "2026-07-12", deposit: 10000, total: 35000 },
  { id: "PAV-005", clientName: "Sofia Lim",       phone: "0957-567-8901", eventType: "Wedding Reception",capacity: 250, date: "2026-07-18", deposit: 18000, total: 55000 },
  { id: "PAV-006", clientName: "Miguel Torres",   phone: "0968-678-9012", eventType: "Family Reunion",   capacity: 100, date: "2026-07-22", deposit: 8000,  total: 25000 },
  { id: "PAV-007", clientName: "Lovely Garcia",   phone: "0979-789-0123", eventType: "Christening",      capacity: 60,  date: "2026-08-03", deposit: 4000,  total: 12000 },
  { id: "PAV-008", clientName: "Roberto Mendoza", phone: "0982-890-1234", eventType: "Graduation Party", capacity: 90,  date: "2026-08-10", deposit: 6000,  total: 18000 },
];

export const POOL_BOOKINGS: VenueEvent[] = [
  { id: "POL-001", clientName: "Jasmine Cruz",       phone: "0917-111-2222", eventType: "Pool Party",          capacity: 50, date: "2026-06-21", deposit: 3000, total: 8000  },
  { id: "POL-002", clientName: "Rafael Santos",      phone: "0928-222-3333", eventType: "Kids Swimming Party", capacity: 30, date: "2026-06-28", deposit: 2000, total: 5500  },
  { id: "POL-003", clientName: "Kristine Aquino",    phone: "0939-333-4444", eventType: "Private Pool Party",  capacity: 70, date: "2026-07-04", deposit: 5000, total: 12000 },
  { id: "POL-004", clientName: "Dennis Villanueva",  phone: "0945-444-5555", eventType: "Team Building",       capacity: 40, date: "2026-07-10", deposit: 3500, total: 9000  },
  { id: "POL-005", clientName: "Grace Tan",          phone: "0956-555-6666", eventType: "Pool Party",          capacity: 60, date: "2026-07-15", deposit: 4000, total: 10000 },
  { id: "POL-006", clientName: "Patrick Ramos",      phone: "0967-666-7777", eventType: "Birthday Pool Party", capacity: 45, date: "2026-07-25", deposit: 3000, total: 7500  },
];

export const ANDOY_SCHEDULES: CourtSchedule[] = [
  { id: "AND-001", clientName: "Marco Rivera",      phone: "0917-123-1111", court: "Andoy Court", schedule: "Jun 17, 2026 | 5:00–7:00 PM",  deposit: 500, balance: 500 },
  { id: "AND-002", clientName: "Patricia Dela Rosa",phone: "0928-234-2222", court: "Andoy Court", schedule: "Jun 18, 2026 | 7:00–9:00 PM",  deposit: 500, balance: 0   },
  { id: "AND-003", clientName: "Bong Macaraeg",     phone: "0939-345-3333", court: "Andoy Court", schedule: "Jun 19, 2026 | 9:00–11:00 PM", deposit: 500, balance: 500 },
  { id: "AND-004", clientName: "Cynthia Park",      phone: "0950-456-4444", court: "Andoy Court", schedule: "Jun 20, 2026 | 5:00–7:00 PM",  deposit: 500, balance: 0   },
  { id: "AND-005", clientName: "Ernesto Flores",    phone: "0961-567-5555", court: "Andoy Court", schedule: "Jun 21, 2026 | 7:00–9:00 PM",  deposit: 500, balance: 500 },
];

export const JULIET_SCHEDULES: CourtSchedule[] = [
  { id: "JUL-001", clientName: "Diana Soriano",  phone: "0917-123-9999", court: "Juliet Court", schedule: "Jun 17, 2026 | 4:00–6:00 PM",      deposit: 500, balance: 0   },
  { id: "JUL-002", clientName: "Francis Navarro",phone: "0928-234-0000", court: "Juliet Court", schedule: "Jun 18, 2026 | 6:00–8:00 PM",      deposit: 500, balance: 500 },
  { id: "JUL-003", clientName: "Helena Abad",    phone: "0939-345-1111", court: "Juliet Court", schedule: "Jun 19, 2026 | 8:00–10:00 PM",     deposit: 500, balance: 0   },
  { id: "JUL-004", clientName: "Ivan Ocampo",    phone: "0950-456-2222", court: "Juliet Court", schedule: "Jun 20, 2026 | 10:00 PM–12:00 AM", deposit: 500, balance: 500 },
];

export const REPAIR_DATA: Repair[] = [
  { id: "REP-001", area: "Pavilion",     description: "Broken ceiling fan — Unit 3",        reportedBy: "Juan Reyes",      date: "2026-06-01", priority: "High",   status: "In Progress", cost: 2500  },
  { id: "REP-002", area: "Pool",         description: "Water pump leaking — Filter room",   reportedBy: "Ana Cruz",        date: "2026-06-03", priority: "High",   status: "Pending",     cost: 8000  },
  { id: "REP-003", area: "Andoy Court",  description: "Net post loose — North end",         reportedBy: "Marco Santos",    date: "2026-06-05", priority: "Medium", status: "Completed",   cost: 500   },
  { id: "REP-004", area: "Juliet Court", description: "Flood light flickering — East side", reportedBy: "Sofia Lim",       date: "2026-06-08", priority: "Medium", status: "In Progress", cost: 1800  },
  { id: "REP-005", area: "Pavilion",     description: "Restroom faucet not working",        reportedBy: "Carlos Bautista", date: "2026-06-10", priority: "Low",    status: "Pending",     cost: 700   },
  { id: "REP-006", area: "Pool",         description: "Pool tiles cracked — Shallow end",   reportedBy: "Grace Tan",       date: "2026-06-12", priority: "High",   status: "Pending",     cost: 15000 },
  { id: "REP-007", area: "Andoy Court",  description: "Paint recoating needed",             reportedBy: "Patrick Ramos",   date: "2026-06-14", priority: "Low",    status: "Completed",   cost: 3000  },
];
