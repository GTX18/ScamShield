"use client";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

/** Ambient floating light, scroll parallax and a cursor-following spotlight. Pure transform/opacity. */
export default function Background() {
  const x = useMotionValue(-400), y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 120, damping: 24 }), sy = useSpring(y, { stiffness: 120, damping: 24 });
  const tx = useTransform(sx, (v) => v - 250), ty = useTransform(sy, (v) => v - 250);
  const { scrollY } = useScroll();
  const p1 = useTransform(scrollY, [0, 2000], [0, -260]);
  const p2 = useTransform(scrollY, [0, 2000], [0, -130]);
  const p3 = useTransform(scrollY, [0, 2000], [0, 180]);
  const gridY = useTransform(scrollY, [0, 2000], [0, -60]);
  useEffect(() => {
    const m = (e: PointerEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("pointermove", m, { passive: true });
    return () => window.removeEventListener("pointermove", m);
  }, [x, y]);
  const blob = "rounded-full blur-[90px] will-change-transform [animation:float_18s_ease-in-out_infinite]";
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden" style={{ background: "linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%)" }}>
      <motion.div className="absolute" style={{ left: "-8%", top: "-10%", y: p1 }}><div className={blob} style={{ width: 560, height: 560, background: "var(--blob1)" }} /></motion.div>
      <motion.div className="absolute" style={{ right: "-6%", top: "18%", y: p2 }}><div className={blob} style={{ width: 480, height: 480, background: "var(--blob2)", animationDelay: "-6s" }} /></motion.div>
      <motion.div className="absolute" style={{ left: "30%", bottom: "-14%", y: p3 }}><div className={blob} style={{ width: 420, height: 420, background: "var(--blob3)", animationDelay: "-11s" }} /></motion.div>
      <motion.div className="absolute inset-[-80px] opacity-[.35]" style={{ y: gridY, backgroundImage: "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)", backgroundSize: "64px 64px", maskImage: "radial-gradient(ellipse at 50% 25%, #000 10%, transparent 70%)", WebkitMaskImage: "radial-gradient(ellipse at 50% 25%, #000 10%, transparent 70%)" }} />
      <motion.div className="absolute left-0 top-0 hidden h-[500px] w-[500px] rounded-full opacity-60 md:block" style={{ x: tx, y: ty, background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 22%, transparent), transparent 65%)" }} />
    </div>
  );
}
