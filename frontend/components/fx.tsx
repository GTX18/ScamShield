"use client";
import { animate, motion, useInView, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function Reveal({ children, delay = 0, y = 24, className = "" }: { children: React.ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y, filter: "blur(8px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }} transition={{ duration: .7, delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>
  );
}

/** Word-by-word headline reveal. */
export function TextReveal({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[.12em] align-bottom">
          <motion.span className="inline-block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: .8, delay: .08 * i, ease: [.22, 1, .36, 1] }}>{w}&nbsp;</motion.span>
        </span>
      ))}
    </span>
  );
}

export function CountUp({ to, duration = 1.2, suffix = "%" }: { to: number; duration?: number; suffix?: string }) {
  const [v, setV] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) { setV(to); return; }
    const c = animate(0, to, { duration, ease: "easeOut", onUpdate: (n) => setV(Math.round(n)) });
    return () => c.stop();
  }, [to, duration, reduce]);
  return <>{v}{suffix}</>;
}

/** Button/link wrapper that gently follows the pointer. */
export function Magnetic({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16 }), sy = useSpring(y, { stiffness: 220, damping: 16 });
  const reduce = useReducedMotion();
  return (
    <motion.div ref={ref} className={`inline-block ${className}`} style={{ x: sx, y: sy }} whileTap={{ scale: .96 }}
      onPointerMove={(e) => { if (reduce || e.pointerType !== "mouse") return; const r = ref.current!.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * .22); y.set((e.clientY - r.top - r.height / 2) * .3); }}
      onPointerLeave={() => { x.set(0); y.set(0); }}>{children}</motion.div>
  );
}

/** Glass card with a cursor-following highlight. */
export function SpotCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <motion.div ref={ref} whileHover={{ y: -4 }} className={`glass group relative overflow-hidden rounded-3xl ${className}`}
      onPointerMove={(e) => { const r = ref.current!.getBoundingClientRect(); ref.current!.style.setProperty("--mx", `${e.clientX - r.left}px`); ref.current!.style.setProperty("--my", `${e.clientY - r.top}px`); }}>
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(320px circle at var(--mx) var(--my), color-mix(in srgb, var(--accent) 16%, transparent), transparent 70%)" }} />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

export function useOnceInView<T extends Element>() { const ref = useRef<T>(null); const inView = useInView(ref, { once: true, margin: "-80px" }); return { ref, inView }; }
