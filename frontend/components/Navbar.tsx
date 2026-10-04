"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, LayoutDashboard } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "./AuthProvider";

const LINKS = [
  { href: "/check", label: "Check Message" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/learn", label: "Safety Tips" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const { user, ready } = useAuth();
  useEffect(() => { const f = () => setScrolled(window.scrollY > 12); f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);
  useEffect(() => setOpen(false), [path]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <nav aria-label="Main" className={`mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-300 sm:px-5 ${scrolled ? "glass-strong" : "glass"}`}>
        <Logo />
        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}><Link href={l.href} aria-current={path === l.href ? "page" : undefined}
              className={`rounded-full px-3.5 py-2 text-sm transition-colors hover:text-fg ${path === l.href ? "bg-[var(--line)] text-fg" : "text-muted"}`}>{l.label}</Link></li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden items-center gap-2 md:flex">
            {ready && (user ? (
              <Link href="/dashboard" className="btn btn-primary !py-2 text-sm"><LayoutDashboard size={16} />Dashboard</Link>
            ) : (<>
              <Link href="/login" className="rounded-full px-3.5 py-2 text-sm text-muted hover:text-fg">Log in</Link>
              <Link href="/signup" className="btn btn-primary !py-2 text-sm">Sign up</Link>
            </>))}
          </div>
          <button className="glass grid h-10 w-10 place-items-center rounded-full md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div id="mobile-menu" initial={{ opacity: 0, y: -12, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -12 }}
            className="glass-strong mx-auto mt-2 max-w-6xl rounded-3xl p-3 md:hidden">
            <ul className="flex flex-col">
              {LINKS.map((l, i) => (
                <motion.li key={l.href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .04 }}>
                  <Link href={l.href} className="block rounded-2xl px-4 py-3 text-base font-medium hover:bg-[var(--line)]">{l.label}</Link>
                </motion.li>
              ))}
            </ul>
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-line pt-3">
              {user ? <Link href="/dashboard" className="btn btn-primary col-span-2">Dashboard</Link> : (<>
                <Link href="/login" className="btn btn-ghost">Log in</Link>
                <Link href="/signup" className="btn btn-primary">Sign up</Link></>)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
