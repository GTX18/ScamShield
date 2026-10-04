"use client";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

const STAGES = ["Reading message…", "Checking language patterns…", "Scanning for red flags…", "Calculating risk…", "Generating explanation…"];

/** Pulsing glass layers with particles orbiting a core. Transform/opacity only. */
function Orbit() {
  return (
    <div aria-hidden className="relative mx-auto h-28 w-28 sm:h-36 sm:w-36">
      {[0, 1, 2].map((i) => (
        <motion.span key={i} className="glass absolute inset-0 rounded-full" initial={{ scale: .45, opacity: 0 }}
          animate={{ scale: [.45 + i * .1, 1 + i * .08], opacity: [.7, 0] }} transition={{ duration: 2.4, repeat: Infinity, delay: i * .8, ease: "easeOut" }} />
      ))}
      {[0, 1, 2].map((i) => (
        <motion.span key={i} className="absolute inset-0" animate={{ rotate: i % 2 ? -360 : 360 }} transition={{ duration: 5 + i * 2.5, repeat: Infinity, ease: "linear" }}>
          <span className="absolute left-1/2 top-0 block rounded-full bg-accent shadow-[0_0_12px_var(--accent)]" style={{ width: 6 + i * 2, height: 6 + i * 2, marginLeft: -3, transform: `translateY(${i * 14}px)`, opacity: 1 - i * .2 }} />
        </motion.span>
      ))}
      <motion.span className="glass-strong absolute inset-[34%] grid place-items-center rounded-full text-accent" animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 1.6, repeat: Infinity }}>
        <ShieldCheck size={22} />
      </motion.span>
    </div>
  );
}

export default function LoadingState({ message }: { message: string }) {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((n) => Math.min(n + 1, STAGES.length - 1)), 420); return () => clearInterval(t); }, []);
  return (
    <div role="status" aria-live="polite" className="relative overflow-hidden p-5 sm:p-8">
      <div className="relative mx-auto max-w-xl">
        <Orbit />
        <div className="surface relative mt-6 overflow-hidden rounded-3xl p-5 text-[15px] leading-relaxed">
          <p className="line-clamp-4 text-muted [mask-image:linear-gradient(#000_55%,transparent)]">{message}</p>
          <motion.div aria-hidden className="absolute inset-x-0 h-14 will-change-transform" style={{ background: "linear-gradient(180deg, transparent, color-mix(in srgb, var(--accent) 35%, transparent), transparent)" }}
            initial={{ y: -56 }} animate={{ y: 150 }} transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }} />
          <motion.div aria-hidden className="absolute inset-x-0 h-px bg-accent shadow-[0_0_14px_var(--accent)]" initial={{ y: 0 }} animate={{ y: 150 }} transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }} />
        </div>
        <div className="mt-7 flex flex-col items-center gap-4">
          <div className="h-7 overflow-hidden text-center text-lg font-medium">
            <AnimatePresence mode="wait">
              <motion.p key={i} initial={{ opacity: 0, y: 12, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -12, filter: "blur(6px)" }} transition={{ duration: .25 }}>{STAGES[i]}</motion.p>
            </AnimatePresence>
          </div>
          <div className="h-1 w-56 overflow-hidden rounded-full bg-[var(--line)]">
            <motion.div className="h-full origin-left rounded-full bg-gradient-to-r from-accent to-accent2" initial={{ scaleX: .05 }} animate={{ scaleX: (i + 1) / STAGES.length }} transition={{ duration: .4 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
