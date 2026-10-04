"use client";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { ShieldAlert, KeyRound, X } from "lucide-react";

interface Props {
  open: boolean; variant: "danger" | "privacy"; onClose: () => void;
  onSecondary?: () => void; secondaryLabel?: string; primaryLabel?: string;
}
const COPY = {
  danger: {
    icon: ShieldAlert, title: "High-risk message — stop before you act",
    items: ["Don't click any link or call any number in it", "Never share your OTP, PIN or password", "Don't pay any \"fee\", \"tax\" or \"deposit\"", "Verify using the official app or website you already trust"],
    tone: "text-scam bg-[var(--scam-bg)]",
  },
  privacy: {
    icon: KeyRound, title: "This looks like it has private details",
    items: ["We spotted something that looks like an OTP, PIN, password or card number", "You don't need them for a scam check — remove them first", "Never share these with anyone, including us"],
    tone: "text-warn bg-[var(--warn-bg)]",
  },
};

export default function CautionModal({ open, variant, onClose, onSecondary, secondaryLabel, primaryLabel = "Got it" }: Props) {
  const btn = useRef<HTMLButtonElement>(null);
  const c = COPY[variant]; const Icon = c.icon;
  useEffect(() => {
    if (!open) return;
    btn.current?.focus();
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = prev; };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[80] grid place-items-center bg-[#02050f]/70 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div role="alertdialog" aria-modal="true" aria-labelledby="caution-title" onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 24, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .97 }}
            className="glass-strong gradient-border w-full max-w-md rounded-3xl p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <span className={`grid h-12 w-12 place-items-center rounded-2xl ${c.tone}`}><Icon size={24} /></span>
              <button onClick={onClose} aria-label="Close" className="rounded-full p-2 text-muted hover:text-fg"><X size={18} /></button>
            </div>
            <h2 id="caution-title" className="mt-4 text-xl font-semibold tracking-tight">{c.title}</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              {c.items.map((t) => (<li key={t} className="flex gap-2.5"><span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{t}</li>))}
            </ul>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              {onSecondary && <button className="btn btn-ghost" onClick={onSecondary}>{secondaryLabel}</button>}
              <button ref={btn} className="btn btn-primary" onClick={onClose}>{primaryLabel}</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
