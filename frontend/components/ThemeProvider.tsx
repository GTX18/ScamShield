"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
const Ctx = createContext<{ theme: Theme; toggle: () => void }>({ theme: "dark", toggle: () => {} });
export const useTheme = () => useContext(Ctx);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => { setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light"); }, []);
  const toggle = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const el = document.documentElement;
    el.classList.add("theme-anim");
    el.classList.toggle("dark", next === "dark");
    try { localStorage.setItem("ss-theme", next); } catch {}
    setTheme(next);
    setTimeout(() => el.classList.remove("theme-anim"), 600);
  }, [theme]);
  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>;
}
