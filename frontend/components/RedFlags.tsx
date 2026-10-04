"use client";
import { motion } from "motion/react";
import { Flag, CircleCheck } from "lucide-react";
import { FLAG_HELP } from "@/lib/api";

export default function RedFlags({ flags }: { flags: string[] }) {
  return (
    <section aria-labelledby="flags-h" className="glass rounded-3xl p-6 sm:p-7">
      <h3 id="flags-h" className="text-lg font-semibold tracking-tight">{flags.length ? "Why this looks dangerous" : "Red flags"}</h3>
      {flags.length === 0 ? (
        <p className="mt-3 flex items-center gap-2 text-muted"><CircleCheck size={18} className="text-safe" aria-hidden />No obvious red flags were detected.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {flags.map((f, i) => (
            <motion.li key={f} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .25 + i * .08 }} className="flex gap-3 rounded-2xl border border-line p-3.5">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[var(--warn-bg)] text-warn"><Flag size={16} aria-hidden /></span>
              <div><p className="font-medium">{f}</p>{FLAG_HELP[f] && <p className="text-sm text-muted">{FLAG_HELP[f]}</p>}</div>
            </motion.li>
          ))}
        </ul>
      )}
    </section>
  );
}
