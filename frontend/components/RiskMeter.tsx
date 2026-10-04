"use client";
import { motion } from "motion/react";
import { CountUp } from "./fx";
import type { Verdict } from "@/lib/api";

const COLOR: Record<Verdict, string> = { SCAM: "var(--scam)", SUSPICIOUS: "var(--warn)", SAFE: "var(--safe)" };

export default function RiskMeter({ score, verdict }: { score: number; verdict: Verdict }) {
  const pct = Math.round(score * 100); const r = 54, c = color(verdict);
  return (
    <div className="flex flex-col items-center" role="img" aria-label={`Risk score ${pct} percent`}>
      <div className="relative h-40 w-40">
        <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
          <circle cx="64" cy="64" r={r} fill="none" stroke="var(--line)" strokeWidth="10" />
          <motion.circle cx="64" cy="64" r={r} fill="none" stroke={c} strokeWidth="10" strokeLinecap="round" pathLength={1}
            strokeDasharray="1" initial={{ strokeDashoffset: 1 }} animate={{ strokeDashoffset: 1 - score }} transition={{ duration: 1.3, ease: [.22, 1, .36, 1], delay: .2 }}
            style={{ filter: `drop-shadow(0 0 8px ${c})` }} />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div><div className="text-4xl font-semibold tabular-nums tracking-tight"><CountUp to={pct} duration={1.3} /></div>
            <div className="text-[11px] font-medium uppercase tracking-[.14em] text-muted">Risk score</div></div>
        </div>
      </div>
    </div>
  );
}
function color(v: Verdict) { return COLOR[v]; }
