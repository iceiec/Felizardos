import { createContext, useContext, useState } from "react";
import { ls } from "@/lib/storage";

interface AuthContextValue {
  user: string | null;
  login: (username: string) => void;
  logout: () => void;
}

const AuthCtx = createContext<AuthContextValue>({ user: null, login: () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(() => ls.getSession());

  const login = (username: string) => setUser(username);
  const logout = () => setUser(null);

  return <AuthCtx.Provider value={{ user, login, logout }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
