"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { useAuth } from "./AuthProvider";

export function initialsOf(name: string) { return name.split(" ").filter(Boolean).map((s) => s[0]).slice(0, 2).join("").toUpperCase() || "?"; }

export default function UserMenu() {
  const { user, signOut } = useAuth(); const router = useRouter();
  const [open, setOpen] = useState(false); const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const click = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", click); document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", click); document.removeEventListener("keydown", key); };
  }, [open]);
  if (!user) return null;
  const item = "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm hover:bg-[var(--line)]";
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open} aria-label="Account menu"
        className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-accent to-accent2 text-sm font-semibold text-[var(--on-accent)] transition-transform hover:scale-105 active:scale-95">{initialsOf(user.name)}</button>
      <AnimatePresence>
        {open && (
          <motion.div role="menu" initial={{ opacity: 0, y: -8, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: .97 }}
            className="glass-strong absolute right-0 top-12 w-64 rounded-2xl p-2">
            <div className="px-3 py-2"><p className="truncate font-semibold">{user.name}</p><p className="truncate text-xs text-muted">{user.email}</p></div>
            <div className="my-1 border-t border-line" />
            <Link role="menuitem" href="/dashboard" className={item} onClick={() => setOpen(false)}><LayoutDashboard size={16} />Dashboard</Link>
            <Link role="menuitem" href="/profile" className={item} onClick={() => setOpen(false)}><UserRound size={16} />Profile &amp; settings</Link>
            <button role="menuitem" className={`${item} text-scam`} onClick={() => { setOpen(false); signOut(); router.replace("/"); }}><LogOut size={16} />Log out</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
