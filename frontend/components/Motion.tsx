"use client";
import { MotionConfig } from "motion/react";
export function Motion({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 260, damping: 28 }}>{children}</MotionConfig>;
}
