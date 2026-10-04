"use client";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Link2, Clock, Ban } from "lucide-react";
import { Magnetic, TextReveal } from "./fx";

/** Decorative illustration only — it shows how a message gets scanned, not a real verdict. */
function HeroVisual() {
  const chip = "glass absolute flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium shadow-lg";
  return (
    <div aria-hidden className="relative mx-auto h-[400px] w-full max-w-[430px] sm:h-[460px]">
      <motion.div className="glass absolute inset-x-0 top-6 mx-auto h-[330px] w-[86%] rounded-[2rem] opacity-60" style={{ rotate: -6 }} animate={{ y: [0, -8, 0] }} transition={{ duration: 7, repeat: Infinity }} />
      <motion.div className="glass absolute inset-x-0 top-12 mx-auto h-[330px] w-[92%] rounded-[2rem] opacity-80" style={{ rotate: 3 }} animate={{ y: [0, 8, 0] }} transition={{ duration: 8, repeat: Infinity }} />
      <motion.div className="glass-strong absolute inset-x-0 top-16 mx-auto w-full overflow-hidden rounded-[2rem] p-6" animate={{ y: [0, -6, 0] }} transition={{ duration: 6, repeat: Infinity }}>
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--line)] font-semibold text-fg">VM</span>
          <div><p className="font-semibold text-fg">VM-BNKALRT</p><p>SMS · now</p></div>
        </div>
        <p className="mt-5 text-[17px] leading-relaxed">
          Dear customer, your bank KYC{" "}
          <mark className="rounded bg-[var(--warn-bg)] px-1 text-warn">expires today</mark>. Click{" "}
          <mark className="rounded bg-[var(--scam-bg)] px-1 text-scam">bit.ly/kyc-update</mark> or your account will be{" "}
          <mark className="rounded bg-[var(--warn-bg)] px-1 text-warn">blocked</mark>.
        </p>
        <div className="mt-6 h-1 overflow-hidden rounded-full bg-[var(--line)]"><motion.div className="h-full w-1/3 rounded-full bg-gradient-to-r from-accent to-accent2" animate={{ x: ["-100%", "300%"] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }} /></div>
        <p className="mt-2 text-[11px] uppercase tracking-[.14em] text-muted">Scanning · illustration</p>
        <motion.div className="absolute inset-x-0 h-14" style={{ background: "linear-gradient(180deg, transparent, color-mix(in srgb, var(--accent) 28%, transparent), transparent)" }} initial={{ top: -56 }} animate={{ top: [-56, 280] }} transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }} />
      </motion.div>
      <motion.span className={`${chip} -left-2 top-2 text-warn sm:-left-8`} animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity }}><Clock size={14} />Urgency</motion.span>
      <motion.span className={`${chip} -right-2 top-[44%] text-scam sm:-right-8`} animate={{ y: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity }}><Link2 size={14} />Suspicious link</motion.span>
      <motion.span className={`${chip} bottom-4 left-4 text-warn`} animate={{ y: [0, -8, 0] }} transition={{ duration: 5.5, repeat: Infinity, delay: .5 }}><Ban size={14} />Account threat</motion.span>
    </div>
  );
}

export default function Hero() {
  const { scrollY } = useScroll();
  const vy = useTransform(scrollY, [0, 700], [0, -70]);
  const ty = useTransform(scrollY, [0, 700], [0, 40]);
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-8 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:pt-16">
      <motion.div style={{ y: ty }}>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-safe shadow-[0_0_8px_var(--safe)]" />English · हिन्दी · कोंकणी
        </motion.p>
        <h1 className="text-[2.9rem] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-7xl">
          <TextReveal text="Before you click," /><br /><TextReveal text="check it." className="text-gradient" />
        </h1>
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .5 }} className="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
          ScamShield uses AI to analyze suspicious messages and explain the warning signs in plain language.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .65 }} className="mt-9 flex flex-wrap items-center gap-3">
          <Magnetic><Link href="/check" className="btn btn-primary !px-7 !py-3.5 text-base">Check a message<ArrowRight size={18} /></Link></Magnetic>
          <Magnetic><Link href="/#how-it-works" className="btn btn-ghost !px-7 !py-3.5 text-base">How it works</Link></Magnetic>
        </motion.div>
      </motion.div>
      <motion.div style={{ y: vy }} initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: .3 }}><HeroVisual /></motion.div>
    </section>
  );
}
