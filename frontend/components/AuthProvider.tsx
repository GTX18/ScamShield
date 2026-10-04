"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as api from "@/lib/api";
import { TOKEN_KEY, User } from "@/lib/api";

interface AuthCtx {
  user: User | null; token: string | null; ready: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void; setUser: (u: User) => void;
}
const Ctx = createContext<AuthCtx>(null as unknown as AuthCtx);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let t: string | null = null;
    try { t = localStorage.getItem(TOKEN_KEY); } catch {}
    if (!t) { setReady(true); return; }
    api.getMe(t).then((r) => { setUser(r.user); setToken(t); })
      .catch((e) => { if (e instanceof api.ApiError && e.kind === "auth") try { localStorage.removeItem(TOKEN_KEY); } catch {} })
      .finally(() => setReady(true));
  }, []);

  const accept = (r: { token: string; user: User }) => {
    try { localStorage.setItem(TOKEN_KEY, r.token); } catch {}
    setToken(r.token); setUser(r.user);
  };
  const signIn = useCallback(async (email: string, password: string) => accept(await api.login({ email, password })), []);
  const signUp = useCallback(async (name: string, email: string, password: string) => accept(await api.signup({ name, email, password })), []);
  const signOut = useCallback(() => { try { localStorage.removeItem(TOKEN_KEY); } catch {} setUser(null); setToken(null); }, []);

  return <Ctx.Provider value={{ user, token, ready, signIn, signUp, signOut, setUser }}>{children}</Ctx.Provider>;
}
