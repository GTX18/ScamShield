"use client";
import { motion } from "motion/react";
import { ShieldAlert, ShieldCheck, TriangleAlert } from "lucide-react";
import RiskMeter from "./RiskMeter";
import { CountUp } from "./fx";
import type { Verdict } from "@/lib/api";

export const VERDICT_UI = {
  SCAM: { Icon: ShieldAlert, label: "SCAM DETECTED", sub: "Do not act on this message.", level: "High risk", cls: "text-scam", bg: "bg-[var(--scam-bg)]", border: "border-[color-mix(in_srgb,var(--scam)_45%,transparent)]" },
  SUSPICIOUS: { Icon: TriangleAlert, label: "SUSPICIOUS", sub: "Be careful and verify first.", level: "Medium risk", cls: "text-warn", bg: "bg-[var(--warn-bg)]", border: "border-[color-mix(in_srgb,var(--warn)_45%,transparent)]" },
  SAFE: { Icon: ShieldCheck, label: "LOOKS SAFE", sub: "No strong scam signals found.", level: "Low risk", cls: "text-safe", bg: "bg-[var(--safe-bg)]", border: "border-[color-mix(in_srgb,var(--safe)_45%,transparent)]" },
} as const;

export default function VerdictCard({ verdict, score, mlScore }: { verdict: Verdict; score: number; mlScore: number }) {
  const u = VERDICT_UI[verdict]; const Icon = u.Icon;
  return (
    <motion.section aria-label="Verdict" initial={{ opacity: 0, scale: .97, filter: "blur(10px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} transition={{ duration: .6 }}
      className={`glass-strong relative overflow-hidden rounded-3xl border-2 p-6 sm:p-8 ${u.border}`}>
      <div aria-hidden className={`absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-60 blur-3xl ${u.bg}`} />
      <div className="relative grid items-center gap-6 sm:grid-cols-[1fr_auto]">
        <div>
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[.14em] ${u.bg} ${u.cls}`}>{u.level}</span>
          <div className={`mt-4 flex items-center gap-3 ${u.cls}`}>
            <motion.span initial={{ rotate: -20, scale: .5 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 14, delay: .15 }}><Icon size={44} strokeWidth={1.8} aria-hidden /></motion.span>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{u.label}</h2>
          </div>
          <p className="mt-2 text-muted">{u.sub}</p>
          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <div><dt className="text-muted">ML confidence</dt><dd className="text-lg font-semibold tabular-nums"><CountUp to={Math.round(mlScore * 100)} /></dd></div>
            <div><dt className="text-muted">Combined risk</dt><dd className="text-lg font-semibold tabular-nums">{Math.round(score * 100)}%</dd></div>
          </dl>
        </div>
        <RiskMeter score={score} verdict={verdict} />
      </div>
    </motion.section>
  );
}
