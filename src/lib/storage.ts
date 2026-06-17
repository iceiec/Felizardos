import type { StoredUser } from "@/types";

export const ls = {
  getUsers: (): StoredUser[] => {
    try {
      return JSON.parse(localStorage.getItem("va_users") ?? "[]");
    } catch {
      return [];
    }
  },
  saveUsers: (u: StoredUser[]) =>
    localStorage.setItem("va_users", JSON.stringify(u)),
  getSession: () => localStorage.getItem("va_session"),
  setSession: (u: string) => localStorage.setItem("va_session", u),
  clearSession: () => localStorage.removeItem("va_session"),
  getTheme: (): "dark" | "light" =>
    (localStorage.getItem("va_theme") as "dark" | "light") ?? "dark",
  setTheme: (t: "dark" | "light") => localStorage.setItem("va_theme", t),
};
